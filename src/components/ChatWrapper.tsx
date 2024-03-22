'use client';

import { type ReactNode } from 'react';

type ChatWrapperProps = Readonly<{
  children: ReactNode;
}>;

export default function ChatWrapper({ children }: ChatWrapperProps) {
  const handleClick = () => {
    // URL of the parent window embedding the iframe
    window.parent.postMessage('closeChatAEM', 'http://localhost:1234');
  };

  return (
    <div
      className="absolute bg-white p-6 top-0 right-0 bottom-0 left-0"
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <button
        onClick={handleClick}
        type="button"
        className="fixed top-[0.5rem] right-[0.5rem] bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      >
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {children}
    </div>
  );
}
