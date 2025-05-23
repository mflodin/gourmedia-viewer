import type { NextApiRequest, NextApiResponse } from "next";
import { WeekMenu } from "../../../types/Menu";
import { Redis } from "@upstash/redis";
import { getISOWeek, getISOWeekYear } from "date-fns";

const CACHE_TIME = 60 * 10; // 10 minutes

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WeekMenu>
) {
  const now = new Date();
  const weekNumber = getISOWeek(now);
  const year = getISOWeekYear(now);

  try {
    const redisClient = new Redis({
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN,
    });

    const menu = (await redisClient.get(
      `week_menu:${year}-${weekNumber}`
    )) as WeekMenu;

    if (!menu) {
      throw new Error("No menu found");
    }

    res.setHeader("Cache-Control", `s-maxage=${CACHE_TIME}`);
    res.status(200).json(menu);
  } catch (err: any) {
    console.error("err", err);
    res.status(500).send(err.message);
  }
}
