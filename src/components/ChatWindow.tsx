'use client';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

import { ChatMessageBubble } from '@/components/ChatMessageBubble';
import CircularProgress from './CircularProgress';
import InfoCard from './InfoCard';
import { useSearchParams } from 'next/navigation';

type ChatWindowProps = Readonly<{
  botName: string;
  icon: string;
  endpoint: string;
}>;

export default function ChatWindow({ botName, icon, endpoint }: ChatWindowProps) {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const [sourcesForMessages, setSourcesForMessages] = useState<Record<string, any>>({});
  const [uuid, setUuid] = useState('');
  const searchParams = useSearchParams()

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: `${endpoint}?token=${searchParams.get('token')}`,
    headers: {
      'x-uuid': uuid,
    },
    onResponse(response) {
      console.log('Response');
      console.log(response);
      const sourcesHeader = response.headers.get('x-sources');
      const sources = sourcesHeader ? JSON.parse(atob(sourcesHeader)) : [];
      const messageIndexHeader = response.headers.get('x-message-index');
      /*if (sources.length && messageIndexHeader !== null) {
        setSourcesForMessages({...sourcesForMessages, [messageIndexHeader]: sources});
      }*/
    },
    onError: (e) => {
      toast(e.message, {
        theme: 'dark',
      });
    },
  });

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (messageContainerRef.current) {
      messageContainerRef.current.classList.add('grow');
    }

    if (!messages.length) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    if (isLoading) {
      return;
    }

    handleSubmit(e);
  }

  useEffect(() => {
    const uuid = window.localStorage.getItem('uuid')  ?? crypto.randomUUID();
    window.localStorage.setItem('uuid', uuid);
    setUuid(uuid);
  }, []);

  return (
    <>
      {messages.length === 0 &&
        <div className="flex flex-1 justify-end flex-col gap-4 mb-4">
          <InfoCard icon={icon} onSetInput={(input) => setInput(input)}/>
        </div>
      }

      <div
        className="flex flex-col-reverse overflow-auto transition-[flex-grow] ease-in-out"
        ref={messageContainerRef}
      >
        {messages.length > 0 &&
          [...messages]
            .reverse()
            .map((m, i) => {
              const sourceKey = (messages.length - 1 - i).toString();
              return <ChatMessageBubble botName={botName} icon={icon} key={m.id} message={m} />;
            })
        }
      </div>

      <div className="flex items-center pt-0">
        <form onSubmit={sendMessage} className="flex items-center justify-center w-full space-x-2">
          <input
            className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
            onChange={handleInputChange}
            placeholder="I'm an LLM pretending to be a Support Staff. Ask me anything."
            value={input}
          />
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2"
            type="submit"
          >
            <div role="status" className={`${(isLoading) ? '' : 'hidden'} flex justify-center`}>
              <CircularProgress />
              <span className="sr-only">Loading...</span>
            </div>
            <span className={(isLoading) ? 'hidden' : ''}>Send</span>
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
