import { ChatOpenAI, OpenAI } from "@langchain/openai";

import * as dotenv from "dotenv";
dotenv.config();

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
  maxTokens: 500,
});

const chat = async () => {
  const response = await model.invoke("Qual maior estado do Brasil?");

  console.log(response.content);
};

console.log(
  "\n-------------------------------------------------------------CHAT model-------------------------------------------------------------\n"
);

await chat();

// Completion model

const modelCompletation = new OpenAI({
  model: "gpt-3.5-turbo-instruct",
  temperature: 0.7,
  maxTokens: 500,
  // seed: 123,
  // frequencyPenalty: 1,
  // presencePenalty: 1,
  // n: 1,
});

const completion = async () => {
  const response = await modelCompletation.invoke(
    "Qual maior estado do Brasil? E qual é o menor?"
  );

  console.log(response);
};

console.log(
  "\n-------------------------------------------------------------Completion model-------------------------------------------------------------"
);
await completion();

console.log(
  "\n-------------------------------------------------------------End of the script-------------------------------------------------------------"
);
