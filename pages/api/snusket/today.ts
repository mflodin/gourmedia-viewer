import type { NextApiRequest, NextApiResponse } from "next";
import { FoodData } from "../../../types/Menu";
import { Redis } from "@upstash/redis";

const CACHE_TIME = 60 * 10; // 10 minutes

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FoodData[]>
) {
  try {
    const redisClient = new Redis({
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN,
    });

    const menu = (await redisClient.get("week_menu")) as FoodData[];

    if (!menu) {
      throw new Error("No menu found");
    }

    res.setHeader("Cache-Control", `s-maxage=${CACHE_TIME}`);
    res.status(200).json(menu);
  } catch (err: any) {
    console.log("err", err);
    res.status(500).send(err.message);
  }
}
