import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPEN_API_SECRET,
});

const openAI = new OpenAIApi(configuration);

export default openAI;
