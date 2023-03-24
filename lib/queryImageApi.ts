import openAI from "./chatgpt";

const queryImage = async (prompt: string) => {
  const res = await openAI
    .createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    })
    .then((res) => {
      res.data.data[0].url;
      // console.log("res in queryApi.ts: ", res.data.choices[0].text);
      return res.data.data[0].url;
    })
    .catch((err) => `出事了 => ${err.message}`);

  return res;
};

export default queryImage;
