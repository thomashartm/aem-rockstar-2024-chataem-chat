'use server'
import {ChatOpenAI} from '@langchain/openai';
import {conversationChain, conversationChainWithHistory} from './ragchain';
import {StringOutputParser} from '@langchain/core/output_parsers';
import {responseTemplate} from './promptTemplates';
import {RunnableSequence} from '@langchain/core/runnables';
import {PGVectorStore} from '@langchain/community/vectorstores/pgvector';
import {getRetriever} from '@/app/api/aemchat/vectorstore';
import {BaseMemory} from '@langchain/core/memory';
import {BaseMessage} from '@langchain/core/messages';

class ChatHandler {
  readonly chatModel: ChatOpenAI;
  readonly vectorStore: PGVectorStore;
  readonly memoryStore: BaseMemory;

  constructor(vectorStore: PGVectorStore, memoryStore: BaseMemory, chatModel: ChatOpenAI) {
    this.chatModel = chatModel;
    this.vectorStore = vectorStore;
    this.memoryStore = memoryStore;
  }

  serializeChatHistory(chatHistory: Array<BaseMessage>): string {
    return chatHistory
      .map((chatMessage) => {
        if (chatMessage._getType() === 'human') {
          return `Human: ${chatMessage.content}`;
        } else if (chatMessage._getType() === 'ai') {
          return `Assistant: ${chatMessage.content}`;
        } else {
          return `${chatMessage.content}`;
        }
      })
      .join('\n');
  }

  async streamConversationWithMemoryChain(messages: any, sessionId: string) {
    await this.vectorStore.client?.query('BEGIN');
    const chain = await conversationChainWithHistory(this.chatModel, this.vectorStore, this.memoryStore);

    const currentMessage = messages[messages.length - 1];
    const history = messages.slice(0, messages.length - 1);

    const output = await chain.stream({
        question: currentMessage.content,
        chatHistory: this.serializeChatHistory(history),
      },

      {configurable: {sessionId: sessionId}}
    );

    /*await this.memoryStore.saveContext(
      {input: currentMessage.content}, {output: ''}
    );*/

    await this.vectorStore.client?.query('COMMIT');
    return output;
  }

  formatMessage(message: any) {
    console.log('formatting message : ' + message);
    return `${message}`;
  };

  getVectorStore() {
    return this.vectorStore;
  }

  async end() {
    if (this.vectorStore && this.vectorStore.pool) {
      await this.vectorStore.end();
    }
  }
}

export default ChatHandler;
