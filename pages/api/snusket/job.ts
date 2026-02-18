import { Redis } from "@upstash/redis";
import type { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";

import {
  addDays,
  format,
  getISOWeek,
  getISOWeekYear,
  startOfISOWeek,
} from "date-fns";
import { sv } from "date-fns/locale";
import { Course, WeekMenu } from "../../../types/Menu";

export const config = {
  maxDuration: 60,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>,
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

    const menuItems: Course[][] = [];

    const menuUrl = "https://www.nordrest.se/restaurang/gourmedia/";

    const menuHtml = await fetch(menuUrl).then((res) => res.text());
    const $ = cheerio.load(menuHtml);

    const weekNumberText = $("#dynamic-week-number").text().trim();
    $(".ratter-list").each((index, element) => {
      const courses: Course[] = [];
      $(element)
        .find(".ratter")
        .each((i, el) => {
          const $allergens = $(el).find(".allergener");
          const allergens = $allergens.text().trim();
          $allergens.remove();
          $(el).find("img").remove();
          $(el).find("noscript").remove();
          $(el).find(".co2-value").remove();

          const fullCourse = $(el).text().trim();
          const indexOfMed = fullCourse.toLowerCase().indexOf(" med ");
          const dish =
            indexOfMed !== -1
              ? fullCourse.substring(0, indexOfMed).trim()
              : fullCourse;
          const condiments =
            indexOfMed !== -1 ? fullCourse.substring(indexOfMed).trim() : "";
          const co2 = $(el).data("co2") as number;

          courses.push({ dish, condiments, allergens, co2 });
        });
      menuItems.push(courses);
    });

    if (!weekNumberText.includes(`${weekNumber}`)) {
      throw new Error(
        `Week number on page (${weekNumberText}) does not match expected week number (${weekNumber})`,
      );
    }

    if (!menuItems || menuItems.length === 0) {
      throw new Error("No menu items found");
    }

    if (!menuItems.some((courses) => courses.some(({ dish }) => dish !== ""))) {
      throw new Error("No dish has content");
    }

    const DAYS = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"];

    const weekMenu: WeekMenu = {
      week: weekNumber,
      year,
      dayMenus: menuItems.slice(0, DAYS.length).map((courses, idx: number) => ({
        courses,
        day: DAYS[idx],
        formattedDate: format(addDays(startOfWeek, idx), "EEEE d MMM", {
          locale: sv,
        }),
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
