import type { Message } from 'ai/react';

import UserAvatar from './UserAvatar';
import BotAvatar from './BotAvatar';
import { ChatMessageContent } from './ChatMessageContent';

type ChatMessageBubbleProps = Readonly<{
  botName: string;
  icon: string;
  message: Message;
}>;

export function ChatMessageBubble({ botName, icon, message }: ChatMessageBubbleProps) {
  return (
    <div className="flex flex-col gap-3 my-4 text-gray-600 text-sm">
      <div className="flex flex-row space-x-2 items-center">
        <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
          {message.role === 'user' ?
            <UserAvatar />
            :
            <BotAvatar botName={botName} icon={icon}/>
          }
        </span>
        <span className="block font-bold text-gray-700">
          {message.role === 'user' ? 'You' : botName}
        </span>
      </div>
      <ChatMessageContent content={message.content} />
    </div>
  );
}
