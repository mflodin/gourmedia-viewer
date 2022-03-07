import type { NextApiRequest, NextApiResponse } from "next";

type FoodData = {
  day: string;
  menu: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FoodData[]>
) {
  res.status(200).json([
      {
          day: "Måndag",
          menu: "Hej hej"
      }
  ])
}
