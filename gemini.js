import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import fs from "fs";
dotenv.config();

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = `You have to identify different types of food in images. 
The system should accurately detect and label various foods displayed in the image, providing the name 
of the food and its location within the image (e.g., bottom left, right corner, etc.). Additionally, 
the system should extract nutritional information and categorize the type of food (e.g., fruits, vegetables, grains, etc.) 
based on the detected items. The output should include a comprehensive report or display showing the
identified foods, their positions, names, and corresponding nutritional details.
`;
const image = {
  inlineData: {
    data: Buffer.from(fs.readFileSync("all.jpg")).toString("base64"),
    mimeType: "image/jpg",
  },
};

const result = await model.generateContent([prompt, image]);
console.log(result.response.text());
