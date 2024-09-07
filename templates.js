import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from "@langchain/openai";

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
