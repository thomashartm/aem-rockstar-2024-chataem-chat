'use server'
import {NextRequest, NextResponse} from 'next/server';
import {StreamingTextResponse} from 'ai';
import {ChatOpenAI} from 'langchain/chat_models/openai';
import {initMemoryStore, initVectorStore} from '@/app/api/aemchat/vectorstore';
import ChatHandler from '@/app/api/aemchat/ChatHandler';
import {
  createOpenAIConfiguration,
} from '@/app/api/aemchat/configuration';
import {v4 as uuidv4} from 'uuid';
import {ChatMessage} from '@langchain/core/messages';

/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
  console.log(`Starting with env vars: ${JSON.stringify(process.env)}`)

  const modelConfiguration = await createOpenAIConfiguration();
  const chatModel = new ChatOpenAI(modelConfiguration)
  const vectorStore = await initVectorStore(chatModel)
  const memoryStore = initMemoryStore(vectorStore);

  const chatHandler = new ChatHandler(vectorStore, memoryStore, chatModel);
  try {
    const body = await req.json();
    const messages: any[] = body.messages ?? [];
    const chatMessages = messages.map((message: any) => new ChatMessage(message.content, message.role));
    const sessionId = body.sessionId ?? uuidv4();

    console.log(`Conversational Chat Message for session ${sessionId} asking: ${messages}`);
    const response = await chatHandler.streamConversationWithMemoryChain(chatMessages, sessionId)
      .then((response) => {
        console.log(`Conversation Chain Done for ${sessionId} ${JSON.stringify(response)}`);
        return response;
      })
      .finally(() => {
      console.log(`Conversation Chain Done for ${sessionId}`);
    });

    return new StreamingTextResponse(response);
  } catch (e: any) {
    return NextResponse.json({error: e.message}, {status: 500});
  } finally {
  }
}
