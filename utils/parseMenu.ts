import { getDay } from "date-fns";
import { RedisWeekMenu, WeekMenu } from "../types/Menu";

function fixPunctuation(str: string): string {
  return str?.replaceAll(",", ", ").replaceAll(/(".*?")/g, " $1 ");
}

export default function parseMenu(weekMenu: RedisWeekMenu): WeekMenu {
  const today = getDay(new Date()) - 1;

  return {
    week: weekMenu.week ?? null,
    year: weekMenu.year ?? null,
    dayMenus:
      weekMenu?.menuItems?.map((dayMenu, idx) => {
        const courses = dayMenu.menu.match(/\bstängt\b/i)
          ? [dayMenu.menu]
          : dayMenu.menu?.split(/\n(.*)\t|\n/).filter((arr) => arr.trim());
        return {
          day: dayMenu.day,
          isPast: idx < today,
          isToday: today === idx,
          courses: courses.map((course, courseIdx) => {
            let [header, description] = course.trim().split(/\t|\n|\s{3,}/);
            if (!description && !header.match(/\bstängt\b/i)) {
              description = header;
              header = `Maträtt ${courseIdx + 1}`;
            }
            return {
              type: header ?? "",
              dish: fixPunctuation(description) ?? "",
            };
          }),
        };
      }) ?? [],
  };
}
