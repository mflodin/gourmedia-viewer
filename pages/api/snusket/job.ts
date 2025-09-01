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
    let menuItems: any[] = [];

    // Create a Promise to wait for the menu data
    const menuDataPromise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout waiting for menu data"));
      }, 30000); // 30 second timeout

      page.on("response", async (res: Response) => {
        try {
          if (res.url().includes("_api") && res.url().includes("query")) {
            try {
              const body = await res.json();
              const dataItems = body.dataItems;

              if (dataItems && Array.isArray(dataItems)) {
                dataItems.forEach((item: any) => {
                  if (
                    item?.dataCollectionId === "Meny" &&
                    item?.data?.restrauntId === "Restaurang Gourmedia" &&
                    item?.data?.year === year &&
                    item?.data?.weekNumber === weekNumber
                  ) {
                    menuItems = item.data.menuSwedish;
                    // Clear timeout and resolve when we get the data
                    clearTimeout(timeout);
                    resolve();
                  }
                });
              }
            } catch (jsonError) {
              console.error("Error parsing JSON from API response:", jsonError);
            }
          }
        } catch (responseError) {
          console.error("Error in response listener:", responseError);
        }
      });
    });

    // Navigate to the page
    await page.goto(menuUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Wait for the menu data to be captured
    await menuDataPromise;
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
