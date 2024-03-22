import {PromptTemplate} from '@langchain/core/prompts';

export const QUESTION_PROMPT = PromptTemplate.fromTemplate(`
Use the following pieces of context to answer the question at the end. 
Using the provided context, answer the user's question to the best of your ability using the resources provided.
If the provided context does not provide any hint to the answer, just say "I would prefer not to answer this question." Don't try to make up an answer.
Generate a comprehensive and informative answer (but no more than 80 words) for a given question based solely on the provided search results (URL and content).
If you don't know the answer, just say that you don't know, don't try to make up an answer.
You must only use information from the provided search results.
----------
CONTEXT: {context}
----------
CHAT HISTORY: {chatHistory}
----------
QUESTION: {question}
----------
Helpful Answer:`
);

export const FOLLOW_UP_QUESTION_PROMPT = PromptTemplate.fromTemplate(
  `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
----------
CHAT HISTORY: {chatHistory}
----------
FOLLOWUP QUESTION: {question}
----------
Standalone question:`
);

export const RESPONSE_TEMPLATE = `You are an aem support expert and problem-solver, tasked to answer any question about Adobe Experience Manager, also named AEM, a software used to create websites, also called sites.
Using the provided context, answer the user's question to the best of your ability using the resources provided.
If your context does not provide any hint to the answer, just say "I would prefer not to answer this question." Don't try to make up an answer.
Generate a comprehensive and informative answer (but no more than 200 words) for a given question based solely on the provided search results (URL and content).
Use an unbiased and friendly tone. You can include motivational sentences to sound more engaging.
Summarize search results together into a coherent answer.
Do not repeat text.
If the information provided includes different steps or actions, use bullet-points to separate them
Do not add the provided URL from your search results to the citation if there is one.
Only cite the most relevant results that answer the question accurately.
Do not make up citations and rather avoid them instead.
If different results refer to different entities within the same name, write separate answers for each entity.
If there is nothing in the context relevant to the question at hand, just say "I would prefer not to answer this question." Don't try to make up an answer.
You should use bullet points in your answer for readability and add a \n linebreak element before each bullet point.
Anything between the following \`context\`  html blocks is retrieved from a knowledge bank, not part of the conversation with the user.

----------
<context>
{context}
</context>
----------
CHAT HISTORY: {chatHistory}
----------
QUESTION: {question}
----------
Helpful Answer:

REMEMBER: If there is no relevant information within the context, just say "I would prefer not to answer this question." Don't try to make up an answer.
Anything between the preceding 'context' html blocks is retrieved from a knowledge bank, not part of the conversation with the user.
Answer any salutation like hello or good day politely and then proceed to answer the question.`;


const REPHRASE_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone Question:`;

type RetrievalChainInput = {
  chat_history: string;
  question: string;
};


export const responseTemplate = PromptTemplate.fromTemplate(RESPONSE_TEMPLATE);
export const rephraseTemplate = PromptTemplate.fromTemplate(REPHRASE_TEMPLATE);
