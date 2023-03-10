import openAI from "./chatgpt";

const query = async (prompt: string, chatId: string, model: string) => {
  const res = await openAI
    .createCompletion({
      model,
      prompt,
      /* 決定回傳的答案要偏向 創意性還是邏輯性*/
      temperature: 0.6,
      top_p: 1,
      /* ------------------------------*/
      max_tokens: 1000,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    .then((res) => {
      res.data.choices[0].text;
      // console.log("res in queryApi.ts: ", res.data.choices[0].text);
      return res.data.choices[0].text;
    })
    .catch((err) => `出事了 => ${err.message}`);

  return res;
};

export default query;
