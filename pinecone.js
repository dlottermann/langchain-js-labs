import { Pinecone } from '@pinecone-database/pinecone';
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import * as dotenv from "dotenv";
dotenv.config();

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});


const loader = new DirectoryLoader("./documents", {
  ".txt": (path) => new TextLoader(path),
  ".pdf": (path) => new PDFLoader(path),
});
const docs = await loader.load();


const stats = await pc.listIndexes();

console.log(stats)