'use server'
import {PoolConfig} from 'pg';
import fs from 'fs';
import path from 'path';
// sslPath is used to fix a path issue while executing the lambdaHandler locally
import {PGVectorStore} from '@langchain/community/vectorstores/pgvector';
import {Embeddings} from '@langchain/core/embeddings';
import {OpenAIEmbeddings} from '@langchain/openai';
import {embeddingsTable, getDBSecretValue, memoryKey} from '@/app/api/aemchat/configuration';
import {VectorStoreRetrieverMemory} from 'langchain/memory';
import {ChatOpenAI} from 'langchain/chat_models/openai';
import {ScoreThresholdRetriever} from 'langchain/retrievers/score_threshold';
import { EmbeddingsFilter } from 'langchain/retrievers/document_compressors/embeddings_filter';

const sslPath = process.env.SSL_PATH ?? 'resources/';

const readPemFile = () => {
  // Adjust the path according to where you store the PEM file
  const pemPath = path.join(process.cwd(), sslPath, 'global-bundle.pem');
  return fs.readFileSync(pemPath, 'utf8');
};

const initVectorStore = async (chatModel: ChatOpenAI) => {
  const db = await getDBSecretValue();
  const endpoint = db['host']
  const [host, port] = endpoint.split(':');
  const config = {
    postgresConnectionOptions: {
      type: 'postgres',
      user: db['username'],
      host: host,
      port: port,
      database: db['db_name'],
      password: db['password'],
      ssl: {
        ca: readPemFile(),
        rejectUnauthorized: false,
      },

      log: (...messages: any[]) => {
        console.log(messages);
      },
    } as PoolConfig,
    tableName: embeddingsTable,

    columns: {
      idColumnName: 'id',
      vectorColumnName: 'embeddings',
      contentColumnName: 'content',
      metadataColumnName: 'metadata',
    },
  };

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: chatModel.openAIApiKey,
  });

  return await PGVectorStore.initialize(
    embeddings as Embeddings,
    config);
}

const getScoreRetriever = (vectorStore: PGVectorStore) => {
  return ScoreThresholdRetriever.fromVectorStore(vectorStore, {
    minSimilarityScore: 0.3, // Finds results with at least this similarity score
    maxK: 100, // The maximum K value to use. Use it based to your chunk size to make sure you don't run out of tokens
    kIncrement: 2, // How much to increase K by each time. It'll fetch N results, then N + kIncrement, then N + kIncrement * 2, etc.
    verbose: true,
  });
  //return vectorStore.asRetriever({k: 3, verbose: true});
}

const getRetriever = (vectorStore: PGVectorStore) => {
  return vectorStore.asRetriever({k: 5, verbose: true });
}

const getPageCompressor = (chatModel: ChatOpenAI) => {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: chatModel.openAIApiKey,
  });

  return new EmbeddingsFilter({
    embeddings: embeddings,
    similarityThreshold: 0.8,
    k: 10,
  });
}

const initMemoryStore = (vectorStore: PGVectorStore) => {
  return new VectorStoreRetrieverMemory({
    vectorStoreRetriever: getRetriever(vectorStore),
    inputKey: 'question',
    outputKey: 'response',
    memoryKey: memoryKey,
  });
}

export {initVectorStore, getRetriever, initMemoryStore, getPageCompressor};
