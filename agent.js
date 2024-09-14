import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

import * as dotenv from "dotenv";
dotenv.config();

// Define the tools for the agent to use
const agentTools = [new TavilySearchResults({ maxResults: 3 })];
const agentModel = new ChatOpenAI({ temperature: 0, model: "gpt-4o-mini" });

// Initialize memory to persist state between graph runs
const agentCheckpointer = new MemorySaver();

//Define the agent
const agent = createReactAgent({
  llm: agentModel,
  tools: agentTools,
  checkpointer: agentCheckpointer,
});

// Now it's time to use!
const agentFinalState = await agent.invoke(
  { messages: [new HumanMessage("Me indique alguns artigos sobre agentes IA")] },
  { configurable: { thread_id: "42" } }
);

console.log(
  agentFinalState.messages[agentFinalState.messages.length - 1].content
);

// const agentNextState = await agent.invoke(
//   { messages: [new HumanMessage("what about ny")] },
//   { configurable: { thread_id: "42" } }
// );

// console.log(
//   agentNextState.messages[agentNextState.messages.length - 1].content
// );
