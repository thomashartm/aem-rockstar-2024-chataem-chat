'use server'
import {chatHistoryTable} from '@/app/api/aemchat/configuration';
import {ChatOpenAI} from '@langchain/openai';
import {Document} from '@langchain/core/documents';
import {PGVectorStore} from '@langchain/community/vectorstores/pgvector';
import {RunnableSequence, RunnableWithMessageHistory} from '@langchain/core/runnables';
import {PostgresChatMessageHistory} from '@langchain/community/stores/message/postgres';
import {QUESTION_PROMPT, responseTemplate} from './promptTemplates';
import {StringOutputParser} from '@langchain/core/output_parsers';
import {getPageCompressor, getRetriever} from '@/app/api/aemchat/vectorstore';
import {BaseMemory} from '@langchain/core/memory';
import { ContextualCompressionRetriever } from 'langchain/retrievers/contextual_compression';


const formatDocumentsAsString = (documents: Document[]): string =>
  documents.map((doc) => doc.pageContent).join('\n\n');


const formatDocumentsWithSources = (documents: Document[])  => {
  return documents.map((doc) => {
    const title = doc.metadata?.title ?? ''
    const source = doc.metadata?.source ?? ''
    let additionalInfo = `[title: ${title}]\n`
    additionalInfo += `[source: ${source}]\n`
    return `${doc.pageContent}`
  }).join('\n\n');
}

const conversationChain = async (model: ChatOpenAI, retriever: any) => {

  return RunnableSequence.from([
    {
      question: (input: { question: string; chatHistory?: string }) =>
        input.question,
      chatHistory: (input: { question: string; chatHistory?: string }) =>
        input.chatHistory ?? '',
      context: async (input: { question: string; chatHistory?: string }) => {
        const relevantDocs = await retriever.getRelevantDocuments(input.question);
        return formatDocumentsAsString(relevantDocs);
      },
    },
    QUESTION_PROMPT,
    model,
    new StringOutputParser(),
  ]);
}

const conversationChainWithHistory = async (model: ChatOpenAI, vectorStore: PGVectorStore, memoryStore: BaseMemory) => {
  //const retriever = getRetriever(vectorStore);
  const pageCompressor = getPageCompressor(model);
  const retriever = new ContextualCompressionRetriever({
    baseCompressor: pageCompressor,
    baseRetriever: vectorStore.asRetriever(),
  });
  const pool = vectorStore.pool;

  const chain = RunnableSequence.from([
    {
      question: (input: { question: string; chatHistory?: string }) =>
        input.question,
      chatHistory: (input: { question: string; chatHistory?: string }) =>
        input.chatHistory ?? '',
      context: async (input: { question: string; chatHistory?: string }) => {
        console.log(input.question);
        const vectorstoreResult = await vectorStore.similaritySearch(
          input.question
        );
        const relevantDocs = await retriever.getRelevantDocuments(input.question);
        console.log('relevantDocs', JSON.stringify(vectorstoreResult));

        return formatDocumentsAsString(vectorstoreResult);
      },
    },
    responseTemplate,
    model,
    new StringOutputParser(),
  ]);

  return new RunnableWithMessageHistory({
    runnable: chain,
    inputMessagesKey: 'question',
    historyMessagesKey: 'chatHistory',
    getMessageHistory: async (sessionId) => {
      return new PostgresChatMessageHistory({
        sessionId,
        pool,
        tableName: chatHistoryTable,
        // requires to call `vectorstore.end()` at the end once the conversation is finished.
      });
    },
  });
}

export {conversationChain, conversationChainWithHistory};
