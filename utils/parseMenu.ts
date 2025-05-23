import { getDay } from "date-fns";
import { RedisWeekMenu, WeekMenu } from "../types/Menu";

function fixPunctuation(str: string): string {
  return str?.replaceAll(",", ", ").replaceAll(/(".*?")/g, " $1 ");
}

export default function parseMenu(weekMenu: RedisWeekMenu): WeekMenu {
  const today = getDay(new Date()) - 1;

  return {
    week: weekMenu.week,
    year: weekMenu.year,
    dayMenus: weekMenu.menuItems.map((dayMenu, idx) => {
      const courses = dayMenu.menu
        ?.split(/\n(.*)\t|\n/)
        .filter((arr) => arr.trim());
      return {
        day: dayMenu.day,
        isPast: idx < today,
        isToday: today === idx,
        courses: courses.map((course, courseIdx) => {
          let [header, description] = course.trim().split(/\t|\n|\s{3,}/);
          if (!description) {
            description = header;
            header = `Maträtt ${courseIdx + 1}`;
          }
          return {
            type: header ?? "",
            dish: fixPunctuation(description) ?? "",
          };
        }),
      };
    }),
  };
}
