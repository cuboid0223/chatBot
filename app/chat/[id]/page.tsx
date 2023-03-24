import Chat from "../../../components/Chat";
import ChatInput from "../../../components/ChatInput";


type Props = {
  params: {
    id: string;
  };
};

function ChatPage({ params: { id } }: Props) {
  // console.log(id);

  return (
    <div className="flex  flex-col h-screen overflow-hidden">
      {/* chat window */}
      <Chat chatId={id} />
      {/* chat input */}
      <ChatInput chatId={id} />
    </div>
  );
}

export default ChatPage;
