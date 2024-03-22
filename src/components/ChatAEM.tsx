import ChatWindow from './ChatWindow';
import ChatWrapper from './ChatWrapper';

type ChatAEMProps = Readonly<{
  botName: string;
  icon: string;
  endpoint: string;
}>;

export default function ChatAEM(props: ChatAEMProps) {
  return (
    <ChatWrapper>
      <ChatWindow {...props} />
    </ChatWrapper>
  );
}
