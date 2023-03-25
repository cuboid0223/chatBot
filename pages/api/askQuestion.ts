// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "../../firebaseAdmin";
import admin from "firebase-admin";
import query from "../../lib/queryApi";
import queryImage from "../../lib/queryImageApi";
import speak from "../../lib/speak";

type Data = {
  answer: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { prompt, chatId, model, session } = req.body;

  if (!prompt) {
    res.status(400).json({ answer: "請輸入文字" });
    return;
  }
  if (!chatId) {
    res.status(400).json({ answer: "請提供正確的聊天室 Id" });
    return;
  }

  //   chatGPt prompt completion
  const response = await query(prompt, chatId, model).then((response) => {
    return response;
  });

  // chatGPt prompt image generation
  // const resImage = await queryImage(prompt).then((resImage) => {
  //   return resImage;
  // });

  const message: Message = {
    text: response || "找不到答案ㄋㄟ ",
    createdAt: admin.firestore.Timestamp.now(),
    user: {
      _id: "ChatGPT",
      name: "ChatGPT",
      avatar: "https://links.papareact.com/89k",
    },
  };

  //console.log("resImage", resImage);
  // speak(message?.text);

  // 將 chatGPT 回答寫入資料庫
  await adminDb
    .collection("users")
    .doc(session?.user?.email)
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .add(message);

  res.status(200).json({ answer: message.text });
}
