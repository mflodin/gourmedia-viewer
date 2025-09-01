import { Redis } from "@upstash/redis";
import type { NextApiRequest, NextApiResponse } from "next";
import { chromium, type Response } from "playwright-core";
import chromiumBinary from "@sparticuz/chromium";
import {
  addDays,
  format,
  getISOWeek,
  getISOWeekYear,
  startOfISOWeek,
} from "date-fns";
import { sv } from "date-fns/locale";
import { interceptMenuItems } from "../../../services/interceptMenuItems";

export const config = {
  maxDuration: 60,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const now = new Date();
  const weekNumber = getISOWeek(now);
  const year = getISOWeekYear(now);
  const startOfWeek = startOfISOWeek(now);

  let browser: any = null;

  try {
    const redisClient = new Redis({
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN,
    });

    const menuUrl =
      "https://www.iss-menyer.se/restaurants/restaurang-gourmedia";

    browser = await chromium.launch({
      args: [
        ...chromiumBinary.args,
        '--disable-gpu' // needed for some reason to make it actually wait for the API response
      ],
      executablePath:
        process.env.CHROMIUM_EXECUTABLE_PATH ??
        (await chromiumBinary.executablePath()),
      headless: true,
    });
    const page = await browser.newPage();

    // Navigate to the page
    await page.goto(menuUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Wait for the menu data to be captured
    const menuItems = await interceptMenuItems(page, year, weekNumber);
    console.log("Menu items found:", menuItems);

    if (!menuItems || menuItems.length === 0) {
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
          formattedDate: format(addDays(startOfWeek, idx), "EEEE d MMM", {
            locale: sv,
          }),
          menu,
        })),
    };

    redisClient.set(`week_menu:${year}-${weekNumber}`, weekMenu);
    res.status(200).send("OK!");
  } catch (err: any) {
    console.error("err", err);
    res.status(500).send(err.message);
  } finally {
    // Close browser here - after everything is done
    if (browser) {
      await browser.close();
    }
  }
}
