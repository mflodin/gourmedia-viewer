import type { NextApiRequest, NextApiResponse } from "next";

type FoodData = {
  day: string;
  menu: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FoodData[]>
) {
  try {
    const response = await fetch(
      "https://eu1-easy-pug-35727.upstash.io/get/week_menu",
      {
        headers: {
          Authorization:
            "Bearer AouPASQgMzhhZGI1OWYtODAyZS00NTA2LWEwNzQtMjZiNWJkYjA5MzAxuVAD3CxKLXX580QQnED7hT9ed86kRv2KD1wlx1V3iBA=",
        },
      }
    );
    const data = await response.json();
    res.status(200).json(data.result);
  } catch (err: any) {
    console.log("err", err);
    res.status(500).send(err.message);
  }
}
