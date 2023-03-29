import openAI from "./chatgpt";

const query = async (
  prompt: string,
  chatId: string,
  model: string,
  messages: { role: string; content: string }[]
) => {
  if (!prompt || !messages) return;
  // const res = await openAI
  //   .createCompletion({
  //     model,
  //     prompt,
  //     /* 決定回傳的答案要偏向 創意性還是邏輯性*/
  //     temperature: 0.6,
  //     top_p: 1,
  //     /* ------------------------------*/
  //     max_tokens: 1000,
  //     frequency_penalty: 0,
  //     presence_penalty: 0,
  //   })
  //   .then((res) => {
  //     res.data.choices[0].text;
  //     // console.log("res in queryApi.ts: ", res.data.choices[0].text);
  //     return res.data.choices[0].text;
  //   })
  //   .catch((err) => `出事了 => ${err.message}`);

  const res2 = await openAI
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      // temperature: 0.6,
    })
    .then((res) => {
      console.log("res2: ", res.data.choices[0].message);
      return res.data.choices[0].message;
    })
    .catch((err) => `出事了2 => ${err.message}`);

  return res2;
};

export default query;
