import getSecretValue from '@/app/api/aemchat/getSecretValue';

export const openAIChatModel = 'gpt-3.5-turbo-1106';
export const modelTemperature = 0.9;

export const createOpenAIConfiguration = async () => {
  const openApiKey = await getOpenApiKeySecretValue();
  const keyValue = openApiKey['OPENAI_API_KEY'];
  return {
    modelName: openAIChatModel,
    openAIApiKey: keyValue,
    temperature: modelTemperature,
    callbacks: [],
  }
}

export const chatHistoryTable = process.env.CHAT_HISTORY_TABLE ?? 'chat_history';

export const embeddingsTable = process.env.EMBEDDINGS_TABLE ?? 'doc_embeddings';

export const memoryKey = process.env.MEMORY_KEY ?? 'chatHistory';

export const getOpenApiKeySecretValue = async () => {
  return await getSecretValue(process.env.OPENAI_API_KEY as string, true);
}

export const getDBSecretValue = async () => {
  return await getSecretValue(process.env.DB_SECRET_NAME as string, true);
}
