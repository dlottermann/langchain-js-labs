import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";
import { OpenAI, ChatOpenAI } from "@langchain/openai";

import * as dotenv from "dotenv";
dotenv.config();

const promptTemplate = PromptTemplate.fromTemplate(
  "Tell me a joke about {topic}"
);

const prompt = await promptTemplate.invoke({ topic: "dogs" });

const openai = new OpenAI({
  model: "gpt-3.5-turbo-instruct",
  maxtokens: 500,
});

const response = await openai.invoke(prompt);
console.log("Saída do LLM:\n", response);

console.log(
  "\n-------------------------------------------------------------CHAT model-------------------------------------------------------------\n"
);

const chatPromptTemplate = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant"],
  ["user", "Tell me a joke about {topic}"],
]);

const chatPrompt = await chatPromptTemplate.invoke({ topic: "cats" });

const openaiChat = new ChatOpenAI({
  model: "gpt-4o-mini",
  maxtokens: 500,
});

const chatResponse = await openaiChat.invoke(chatPrompt);
console.log("Saída do LLM:\n", chatResponse.content);

console.log(
  "\n-------------------------------------------------------------End Of Script -------------------------------------------------------------\n"
);
