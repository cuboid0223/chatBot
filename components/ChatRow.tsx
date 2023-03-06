import { ChatBubbleLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import { collection, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";

type Props = {
  id: string;
};

function ChatRow({ id }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  //   判斷 chats btn 的顏色變化
  const [active, setActive] = useState(false);

  // 取得 某 chat id 內的所有 messages (依照時間升序即 越晚發得留言越後面)
  const [messages] = useCollection(
    query(
      collection(db, "users", session?.user?.email!, "chats", id, "messages"),
      orderBy("createAt", "asc")
    )
  );

  return (
    <Link href={`/chat/${id}`} className={`charRow justify-center`}>
      <ChatBubbleLeftIcon className="h-5 w-5" />
      <p className="flex-1 hidden md:inline-flex truncate">{
        
      }</p>
      <TrashIcon className="h-5 w-5 text-gray-700 hover:text-red-700" />
    </Link>
  );
}

export default ChatRow;
