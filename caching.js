import { ChatOpenAI } from "@langchain/openai";

import { RedisCache } from "@langchain/community/caches/ioredis";
import { Redis } from "ioredis";

import * as dotenv from "dotenv";
dotenv.config();

console.log(
  "\n-------------------------------------------------------------CHAT with Memory cache-------------------------------------------------------------\n"
);

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
  maxTokens: 500,
});

console.time();
// The first time, it is not yet in cache, so it should take longer
const res_one = await model.invoke("Me conte uma piada longa");

console.log(res_one.content);
console.timeEnd();

console.log(
  "-------------------------------------------------------------CHAT with Memory cache second call-------------------------------------------------------------\n"
);

console.time();
// The second time it is, so it goes faster
const res_two = await model.invoke("Me conte uma piada longa");
console.log(res_two.content);
console.timeEnd();

console.log(
  "\n-------------------------------------------------------------CHAT with Redis-------------------------------------------------------------"
);

const client = new Redis({});
const cache = new RedisCache(client);

const redisModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
  maxTokens: 500,
  cache,
});

console.time();
const redis_one = await redisModel.invoke("Me conte uma piada longa");

console.log(redis_one.content);
console.timeEnd();

console.log(
  "-------------------------------------------------------------CHAT with Redis second call-------------------------------------------------------------\n"
);

console.time();
const redis_two = await redisModel.invoke("Me conte uma piada longa");
console.log(redis_two.content);
console.timeEnd();

console.log(
  "\n-------------------------------------------------------------End of the script-------------------------------------------------------------"
);
