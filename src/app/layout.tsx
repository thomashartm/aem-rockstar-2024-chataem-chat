import './globals.css';
import { Public_Sans } from 'next/font/google';
import { type ReactNode } from 'react';

const publicSans = Public_Sans({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>NCBot</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <meta
          name="description"
          content="ChatAEM interface to test different scenarios with an interactive chat interface."
        />
        <meta property="og:title" content="LangChain + Next.js Template" />
        <meta
          property="og:description"
          content="ChatAEM interface to test different scenarios with an interactive chat interface."
        />
        <meta property="og:image" content="/images/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AEM Support Chat POC" />
        <meta
          name="twitter:description"
          content="Support AEM chat next.js starter to test different scenarios with an interactive chat interface."
        />
        <meta name="twitter:image" content="/images/og-image.png" />
      </head>
      <body className={publicSans.className}>
        {children}
      </body>
    </html>
  );
}
