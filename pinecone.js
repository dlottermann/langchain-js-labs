import { Pinecone } from '@pinecone-database/pinecone';

import * as dotenv from "dotenv";
dotenv.config();

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pc.index('nlp');

const stats = await index.describeIndexStats();

console.log(stats)