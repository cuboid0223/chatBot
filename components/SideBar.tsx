"use client";
import { useSession } from "next-auth/react";
import NewChat from "./NewChat";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import ChatRow from "./ChatRow";
import ModelSelection from "./ModelSelection";
import StartChatModalBtn from "./StartChatModalBtn";

function SideBar() {
  const { data: session } = useSession();

  // 利用 firebase-hook 取得使用者所有 chats
  const [chats, loading, error] = useCollection(
    session &&
      query(
        collection(db, "users", session.user?.email!, "chats"),
        orderBy("createdAt", "desc")
      )
  );

  return (
    <main className="p-2 flex flex-col h-screen bg-[#202123] max-w-xs overflow-y-auto md:min-w-[20rem]">
      <div className="flex-1">
        {/* new chat btn */}
        <NewChat />
        {/* models selection */}
        <section className="hidden sm:inline">
          <ModelSelection />
        </section>
        {/* map through the chats */}
        <section className="space-y-2 my-2">
          {loading && (
            <div className="animate-pulse text-white text-center">
              <p>載入中...</p>
            </div>
          )}
          {chats?.docs.map((chat) => (
            <ChatRow id={chat.id} key={chat.id} />
          ))}
        </section>
      </div>
      <div className="flex justify-end">
        {session && (
          <img
            src={session.user?.image!}
            className="h-12 w-12 rounded-full cursor-pointer mx-auto mb-2 hover:opacity-50"
            alt="Profile pic"
          />
        )}
        {/* 對話功能 modal 開啟按鈕 */}
        <StartChatModalBtn />
      </div>
    </main>
  );
}

export default SideBar;
