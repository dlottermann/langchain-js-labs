import { ChatOpenAI } from "@langchain/openai";

import * as dotenv from "dotenv";
dotenv.config();

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0.7,
  maxTokens: 1000,
});

const chat = async () => {
  const response = await model.invoke("Qual maior estado do Brasil?");

  console.log(response.content);
};

chat();
