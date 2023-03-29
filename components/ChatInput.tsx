"use client";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import {
  addDoc,
  collection,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { db } from "../firebase";
import ModelSelection from "./ModelSelection";
import useSWR from "swr";
import { getTokenOrRefresh } from "../lib/getTokenOrRefresh";
import { useStateValue } from "./StateProvider";
import speak from "../lib/speak";
import { useCollection } from "react-firebase-hooks/firestore";
const speechsdk = require("microsoft-cognitiveservices-speech-sdk");

type Props = {
  chatId: string;
};

type Data = {
  e: FormEvent<HTMLFormElement>;
  promptFromMic: string;
};

function ChatInput({ chatId }: Props) {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const { data: session } = useSession();
  const [{ isRecordingOn }, dispatch] = useStateValue();
  const [messages] = useCollection(
    session &&
      query(
        collection(
          db,
          "users",
          session?.user?.email!,
          "chats",
          chatId,
          "messages"
        ),
        orderBy("createdAt", "asc")
      )
  );
  // console.log(messages);
  // useSWR to get model
  const { data: model, mutate: setModel } = useSWR("model", {
    fallbackData: "gpt-3.5-turbo",
  });

  const modifyMessageAttr = (message) => {
    // 將fetch 回來的資料 修改成  messages: { role: string; content: string }[]
    const newFormatMsg = {
      role: message.user?._id === "ChatGPT" ? "assistant" : "user",
      content: message.text,
    };

    return newFormatMsg;
  };

  const fetchAllChatMessages = (messages) => {
    // fetch all chats messages
    if (!messages) return;
    let temp = [];
    messages?.map((message) => {
      temp.push(modifyMessageAttr(message.data()));
    });

    return temp;
  };

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    // if (!prompt) return;
    if (!prompt) {
      console.log("no prompt");
      return;
    }
    e.preventDefault();
    const input = prompt.trim();
    window.scrollTo(0, document.body.scrollHeight);
    setPrompt("");
    const message: Message = {
      text: input,
      createdAt: serverTimestamp(),
      user: {
        _id: session?.user?.email!,
        name: session?.user?.name!,
        avatar:
          session?.user?.image! ||
          `https://ui-avatars.com/api/?name=${session?.user?.name}`,
      },
    };

    await addDoc(
      collection(
        db,
        "users",
        session?.user?.email!,
        "chats",
        chatId,
        "messages"
      ),
      message
    );

    let msgs = fetchAllChatMessages(messages?.docs);
    msgs?.push({ role: "user", content: input });
    // console.log("msg: ", msgs);
    // toast notification to Loading
    const notification = toast.loading("我想想");
    await fetch("/api/askQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
        messages: msgs,
        chatId,
        model,
        session,
      }),
    }).then(() => {
      // toast notification successful
      toast.success("想好了", {
        id: notification,
      });
    });
  };

  const sendMessageFromMic = async (promptFromMic: string) => {
    if (!promptFromMic) {
      return;
    }
    if (answer === promptFromMic) {
      console.log("表示該聲音是AI 的聲音");
      return;
    }
    const input = promptFromMic.trim();
    setPrompt("");
    const message: Message = {
      text: input,
      createdAt: serverTimestamp(),
      user: {
        _id: session?.user?.email!,
        name: session?.user?.name!,
        avatar:
          session?.user?.image! ||
          `https://ui-avatars.com/api/?name=${session?.user?.name}`,
      },
    };

    console.log(message);
    await addDoc(
      collection(
        db,
        "users",
        session?.user?.email!,
        "chats",
        chatId,
        "messages"
      ),
      message
    );

    let msgs = fetchAllChatMessages(messages?.docs);
    msgs?.push({ role: "user", content: input });

    // toast notification to Loading
    const notification = toast.loading("我想想");

    await fetch("/api/askQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
        messages: msgs,
        chatId,
        model,
        session,
      }),
    })
      .then((res) => {
        // toast notification successful
        toast.success("想好了", {
          id: notification,
        });
        return res.json();
      })
      .then((res) => {
        console.log(res.answer);
        setAnswer(res.answer);
        speak(res.answer);
        return res.answer;
      });
  };

  const setUpRecognizer = async () => {
    const tokenObj = await getTokenOrRefresh();
    const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(
      tokenObj.authToken,
      tokenObj.region
    );
    speechConfig.speechRecognitionLanguage = "zh-TW";

    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new speechsdk.SpeechRecognizer(
      speechConfig,
      audioConfig
    );
    return recognizer;
  };

  // 麥克風語音辨識
  const sttFromMic = async () => {
    const recognizer = await setUpRecognizer();
    if (isRecordingOn) {
      recognizer.startContinuousRecognitionAsync();
      recognizer.recognized = async function (script, e) {
        console.log("recognized text", e.result.text);
        const recognizedText = e.result.text;
        setPrompt(recognizedText);
        await sendMessageFromMic(recognizedText);
      };
    } else {
      // console.log("stop ");
      recognizer.stopContinuousRecognitionAsync();
    }
  };

  useEffect(() => {
    sttFromMic();
  }, [isRecordingOn]);

  useEffect(() => {
    fetchAllChatMessages(messages?.docs);
  }, [messages]);

  return (
    <div className="bg-gray-700/50 text-gray-400 rounded-lg text-sm ">
      <form onSubmit={sendMessage} className="p-5 space-x-5 flex">
        <input
          className="bg-transparent focus:outline-none flex-1 disabled:cursor-not-allowed disabled:text-gray-300"
          disabled={!session}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          type="text"
          placeholder="輸入問題"
        />
        <button
          type="submit"
          disabled={!prompt || !session}
          className="bg-[#11A37F] hover:opacity-50 font-bold px-4 py-2 rounded disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <PaperAirplaneIcon className="h-6 w-6 -rotate-45" />
        </button>
      </form>

      <div className="md:hidden">
        {/*show ModelSelection  on ipad or hand phone*/}
        <ModelSelection />
      </div>
    </div>
  );
}

export default ChatInput;
