import { marked } from 'marked';

// Create a custom renderer
const renderer = new marked.Renderer();

// Override the link method to add target="_blank" attribute
renderer.link = function(href, title, text) {
  return `<a href="${href}" title="${title || ''}" target="_blank">${text}</a>`;
};

// Set the custom renderer in the marked options
const options = {
  renderer: renderer,
};

type ChatMessageContentProps = Readonly<{
  content: string;
}>;

export function ChatMessageContent({ content }: ChatMessageContentProps) {
  return (
    <span
      className="prose prose-sm prose-ul:pl-[1rem] prose-li:pl-0"
      dangerouslySetInnerHTML={{
        __html: marked.parse(content, options),
      }}
    />
  );
}
