import puppeteer from "puppeteer";
import Redis from "ioredis";
import type { NextApiRequest, NextApiResponse } from "next";

let redisClient = new Redis(
    process.env.REDIS_URL
);

const DAYS = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"];
const SECRET_KEY = "NONONO";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const auth = req.headers.authorization;

//   if (process.env.NODE_ENV === "development" || auth === SECRET_KEY) {
    try {
      console.log("Fetching...");
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      const navigationPromise = page.waitForNavigation();

      await page.goto(
        "https://www.iss-menyer.se/restaurants/restaurang-gourmedia"
      );
      await page.setViewport({ width: 1440, height: 744 });
      await navigationPromise;

      await page.waitForFunction(
        () =>
          (
            document
              .querySelector(
                "div[data-mesh-id=comp-ko47p7a8inlineContent-gridContainer]"
              )
              ?.querySelector("textarea")?.value || ""
          ).length > 0
      );

      console.log("Parsing...");
      let menus = await page.$$eval(
        "div[data-mesh-id=comp-ko47p7a8inlineContent-gridContainer] div[class=_1ncY2]",
        (divs) => divs.map((day) => day.querySelector("textarea")?.value)
      );
      console.log("DONE!");
      await browser.close();

      redisClient.set(
        "week_menu",
        JSON.stringify(
          menus.map((menu, idx) => ({
            day: DAYS[Math.min(idx, DAYS.length - 1)],
            menu: menu || "",
          }))
        )
      );
      res.status(200).send("OK!")
      //   res.status(200).json(
    //   menus.map((menu, idx) => ({
    //     day: DAYS[Math.min(idx, DAYS.length - 1)],
    //     menu: menu || "",
    //   }));
      //   );
    } catch (err: any) {
      console.log("Error", err);
      res.status(500).send(err.message);
    }
//   } else {
//     return res.status(401).end();
//   }
}
