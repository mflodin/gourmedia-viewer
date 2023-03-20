import Redis from "ioredis";
import type { NextApiRequest, NextApiResponse } from "next";
import { Browser } from "puppeteer-core";

let redisClient = new Redis(process.env.REDIS_URL || "");

let chrome = {} as any;
let puppeteer: any;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  // running on the Vercel platform.
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  // running locally.
  puppeteer = require("puppeteer");
}

const DAYS = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const auth = req.headers.authorization;

  if (
    process.env.NODE_ENV === "development" ||
    (req.method === "POST" && auth === process.env.API_SECRET_KEY)
  ) {
    try {
      console.log("Fetching...");
      const browser = (await (process.env.AWS_LAMBDA_FUNCTION_VERSION
        ? puppeteer.launch({
            args: [
              ...chrome.args,
              "--hide-scrollbars",
              "--disable-web-security",
            ],
            defaultViewport: chrome.defaultViewport,
            executablePath: await chrome.executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
          })
        : puppeteer.launch())) as Browser;
      const page = await browser.newPage();
      const navigationPromise = page.waitForNavigation();

      await page.goto(
        "https://www.iss-menyer.se/restaurants/restaurang-gourmedia",
        {
          timeout: 0,
        }
      );
      await page.setViewport({ width: 1440, height: 744 });
      await navigationPromise;

      await page.waitForFunction(
        () =>
          (
            document
              .querySelector(
                "div[data-mesh-id=comp-l930fnzz5inlineContent-gridContainer]"
              )
              ?.querySelector("textarea")?.value || ""
          ).length > 0
      );

      console.log("Parsing...");
      let menus = await page.$$eval(
        "div[data-mesh-id=comp-l930fnzz5inlineContent-gridContainer] div[class='comp-l930fo034 YzqVVZ wixui-repeater__item']",
        (divs) => divs.map((day) => day.querySelector("textarea")?.value)
      );
      console.log("DONE!");
      await browser.close();

      redisClient.set(
        "week_menu",
        JSON.stringify(
          menus.slice(0, 5).map((menu, idx) => ({
            day: DAYS[Math.min(idx, DAYS.length - 1)],
            menu: menu || "",
          }))
        )
      );
      res.status(200).send("OK!");
    } catch (err: any) {
      console.log("Error", err);
      res.status(500).send(err.message);
    }
  } else {
    return res.status(401).end();
  }
}
