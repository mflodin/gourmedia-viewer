import { Redis } from "@upstash/redis";
import type { NextApiRequest, NextApiResponse } from "next";
import { chromium } from "playwright";
import { getISOWeek, getISOWeekYear } from "date-fns";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const now = new Date();
  const weekNumber = getISOWeek(now);
  const year = getISOWeekYear(now);

  try {
    const redisClient = new Redis({
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN,
    });

    const menuUrl =
      "https://www.iss-menyer.se/restaurants/restaurang-gourmedia";

    const browser = await chromium.launch();
    const page = await browser.newPage();
    let menuItems: any[] = [];

    /* Same listener pattern for responses */
    page.on("response", async (res) => {
      if (res.url().includes("_api") && res.url().includes("query")) {
        const body = await res.json(); // or .json() / .buffer()
        const dataItems = body.dataItems;

        dataItems.forEach((item: any) => {
          if (
            item?.dataCollectionId === "Meny" &&
            item?.data?.restrauntId === "Restaurang Gourmedia" &&
            item?.data?.year === year &&
            item?.data?.weekNumber === weekNumber
          ) {
            menuItems = item.data.menuSwedish;
          }
        });
      }
    });

    try {
      await page.goto(menuUrl, {
        waitUntil: "networkidle",
      });
    } catch (error) {
      console.error("Error navigating to the page:", error);
    }

    await browser.close();

    if (!menuItems) {
      throw new Error("No menu items found");
    }

    if (!menuItems.some(({ menu }: { menu: string }) => menu !== "")) {
      throw new Error("No menu has content");
    }

    const DAYS = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"];

    const weekMenu = {
      week: weekNumber,
      year,
      menuItems: menuItems
        .slice(0, DAYS.length)
        .map(({ menu = "" }: { menu: string }, idx: number) => ({
          day: DAYS[idx],
          menu,
        })),
    };

    redisClient.set(`week_menu:${year}-${weekNumber}`, weekMenu);
    res.status(200).send("OK!");
  } catch (err: any) {
    console.log("err", err);
    res.status(500).send(err.message);
  }
}
