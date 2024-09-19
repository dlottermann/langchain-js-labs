import { Pinecone } from "@pinecone-database/pinecone";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";

import * as dotenv from "dotenv";
dotenv.config();

const indexName = "llm";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const chat = new ChatOpenAI({ temperature: 0.2, model: "gpt-3.5-turbo" });

const index = pc.Index(indexName);

console.log(`Pinecone index retrieved: ${index}`);

const loader = new DirectoryLoader("./documents", {
  ".txt": (path) => new TextLoader(path),
  ".pdf": (path) => new PDFLoader(path),
});
const docs = await loader.load();

//create and upsert vectors

for (const doc of docs) {
  console.log(`Processing document: ${doc.metadata.source}`);
  const txtPath = doc.metadata.source;
  const text = doc.pageContent;
  // 6. Create RecursiveCharacterTextSplitter instance
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
    lengthFunction: (text) => text.length,
  });
  console.log("Splitting text into chunks...");

  const chunks = await textSplitter.createDocuments([text]);
  console.log(`Text split into ${chunks.length} chunks`);

  console.log(
    `Calling OpenAI's Embedding endpoint documents with ${chunks.length} text chunks ...`
  );
  // 8. Create OpenAI embeddings for documents
  const embeddingsArrays = await new OpenAIEmbeddings({
    model: "text-embedding-ada-002",
  }).embedDocuments(
    chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
  );
  console.log("Finished embedding documents");
  console.log(
    `Creating ${chunks.length} vectors array with id, values, and metadata...`
  );

  // 9. Create and upsert vectors in batches of 100
  const batchSize = 100;
  let batch = [];
  for (let idx = 0; idx < chunks.length; idx++) {
    const chunk = chunks[idx];
    const vector = {
      id: `$${idx}`,
      values: embeddingsArrays[idx],
      metadata: {
        ...chunk.metadata,
        loc: JSON.stringify(chunk.metadata.loc),
        pageContent: chunk.pageContent,
        txtPath: txtPath,
      },
    };
    batch.push(vector);
    // When batch is full or it's the last item, upsert the vectors
    if (batch.length === batchSize || idx === chunks.length - 1) {
      await index.namespace("ns1").upsert((batch = batch));
      // Empty the batch
      batch = [];
    }
  }
  // 10. Log the number of vectors updated
  console.log(`Pinecone index updated with ${chunks.length} vectors`);
}

const question =
  "Qual o número do processo que trata de Violação de normas ambientais pela Empresa de Construção?";

const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);
// 6. Query Pinecone index and return top 10 matches
let queryResponse = await index.namespace("ns1").query({
  topK: 10,
  vector: queryEmbedding,
  includeMetadata: true,
  includeValues: true,
});
// 7. Log the number of matches
console.log(`Found ${queryResponse.matches.length} matches...`);
// 8. Log the question being asked
console.log(`Asking question: ${question}...`);

if (queryResponse.matches.length) {
  // 9. Create an OpenAI instance and load the QAStuffChain
  const chain = loadQAStuffChain(chat);
  // 10. Extract and concatenate page content from matched documents
  const concatenatedPageContent = queryResponse.matches
    .map((match) => match.metadata.pageContent)
    .join(" ");

  console.log(concatenatedPageContent);
  // 11. Execute the chain with input documents and question
  const result = await chain.invoke({
    input_documents: [new Document({ pageContent: concatenatedPageContent })],
    question: question,
  });
  // 12. Log the answer
  console.log(`Answer: ${result.text}`);
}
