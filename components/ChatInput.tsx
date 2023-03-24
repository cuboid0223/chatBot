"use client";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { db } from "../firebase";
import ModelSelection from "./ModelSelection";
import useSWR from "swr";

import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import { getTokenOrRefresh } from "../lib/getTokenOrRefresh";
import { useStateValue } from "./StateProvider";

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
  const { data: session } = useSession();
  const [{ isRecordingOn }, dispatch] = useStateValue();

  // useSWR to get model
  const { data: model, mutate: setModel } = useSWR("model", {
    fallbackData: "text-davinci-003",
  });

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    // if (!prompt) return;
    if (!prompt) {
      console.log("no prompt");
      return;
    }
    e.preventDefault();
    const input = prompt.trim();
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

    // toast notification to Loading
    const notification = toast.loading("我想想");
    await fetch("/api/askQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
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

    // toast notification to Loading
    const notification = toast.loading("我想想");
    await fetch("/api/askQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
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
      console.log("stop ");
      recognizer.stopContinuousRecognitionAsync();
    }
  };

  useEffect(() => {
    sttFromMic();
  }, [isRecordingOn]);

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
