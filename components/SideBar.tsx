"use client";
import { useSession } from "next-auth/react";
import NewChat from "./NewChat";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { db } from "../firebase";
import ChatRow from "./ChatRow";

function SideBar() {
  const { data: session } = useSession();

  // 利用 firebase-hook 取得使用者所有 chats
  const [chats, loading, error] = useCollection(
    session && collection(db, "users", session.user?.email!, "chats")
  );

  return (
    <div className="p-2 flex flex-col h-screen bg-[#202123] max-w-xs overflow-y-auto md:min-w-[20rem]">
      <div className="flex-1">
        {/* new chat btn */}
        <NewChat />
        <div>{/* model selection */}</div>

        {/* map through the chats */}
        {chats?.docs.map((chat) => (
          <ChatRow id={chat.id} />
        ))}
      </div>

      {session && (
        <img
          src={session.user?.image!}
          className="h-12 w-12 rounded-full cursor-pointer mx-auto mb-2 hover:opacity-50"
          alt="Profile pic"
        />
      )}
    </div>
  );
}

export default SideBar;
