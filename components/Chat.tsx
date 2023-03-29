"use client";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import { collection, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import Message from "./Message";

type Props = {
  chatId: string;
};

function Chat({ chatId }: Props) {
  const { data: session } = useSession();
  const goToBottomDiv = useRef<null | HTMLDivElement>(null);
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

  const scrollToBottom = () => {
    goToBottomDiv.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      {/* if no message,  show hint  */}
      {messages?.empty && (
        <>
          <p className="mt-10 text-center text-white">在下方輸入問題</p>
          <ArrowDownCircleIcon className="h-10 w-10 mx-auto mt-5 text-white animate-bounce" />
        </>
      )}
      {/* map through all messages in chat */}
      {messages?.docs.map((message) => (
        <Message key={message.id} message={message.data()} />
      ))}

      <div style={{ float: "left", clear: "both" }} ref={goToBottomDiv}></div>
    </div>
  );
}

export default Chat;
