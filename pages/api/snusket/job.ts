import { Redis } from "@upstash/redis";
import type { NextApiRequest, NextApiResponse } from "next";
import { CookieJar } from "tough-cookie";
import { getISOWeek, getISOWeekYear, getDay } from "date-fns";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const redisClient = new Redis({
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN,
    });

    const now = new Date();
    const weekNumber = getISOWeek(now);
    const year = getISOWeekYear(now);

    const payload = {
      dataCollectionId: "Meny",
      query: {
        // Yes, restrauntId is spelled wrong in the API
        filter: { restrauntId: "Restaurang Gourmedia", weekNumber, year },
        paging: { offset: 0, limit: 1 },
      },
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    );
    const apiUrl = new URL(
      "https://www.iss-menyer.se/_api/cloud-data/v2/items/query"
    );
    apiUrl.searchParams.set(".r", base64Payload);

    const menuUrl =
      "https://www.iss-menyer.se/restaurants/restaurang-gourmedia";

    const websiteResponse = await fetch(menuUrl);

    const cookies = websiteResponse.headers.getSetCookie();

    const cookieJar = new CookieJar();

    for (const cookie of cookies) {
      try {
        cookieJar.setCookieSync(cookie, menuUrl);
      } catch (err) {
        // Gourmedia is trying to set a cookie with a domain other than "www.iss-menyer.se" which is not allowed
        // Just ignore it
      }
    }

    const cookieHeader = cookieJar.getCookieStringSync(apiUrl.toString());

    const apiResponse = await (
      await fetch(apiUrl.toString(), {
        headers: {
          cookie: cookieHeader,
        },
      })
    ).json();

    const menuItems = apiResponse.dataItems?.[0]?.data?.menuSwedish;

    if (!menuItems) {
      throw new Error("No menu items found");
    }

    if (!menuItems.some(({ menu }: { menu: string }) => menu !== "")) {
      throw new Error("No menu has content");
    }

    const DAYS = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"];

    const weekMenu = menuItems
      .slice(0, DAYS.length)
      .map(({ menu = "" }: { menu: string }, idx: number) => ({
        day: DAYS[idx],
        menu,
      }));

    redisClient.set("week_menu", weekMenu);
    res.status(200).send("OK!");
  } catch (err: any) {
    console.log("err", err);
    res.status(500).send(err.message);
  }
}
