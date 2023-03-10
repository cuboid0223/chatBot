import type { NextApiRequest, NextApiResponse } from "next";
import openAI from "../../lib/chatgpt";

type Option = {
  value: string;
  label: string;
};

type Data = {
  modelOption: Option[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const models = await openAI.listModels().then((res) => res.data.data);

  const modelOptions = models.map((model) => ({
    value: model.id,
    label: model.id,
  }));

  res.status(200).json({
    modelOptions,
  });
}
