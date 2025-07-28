import {
  format,
  getISODay,
  getISOWeek,
  getISOWeekYear,
  isWeekend,
} from "date-fns";
import { sv } from "date-fns/locale";

export const useCurrentDay = () => {
  const today = new Date();

  return {
    date: today,
    formattedDate: format(today, "EEEE d MMM", {
      locale: sv,
    }),
    dayIndex: getISODay(today) - 1, // Adjusting so Monday is 0
    isWeekend: isWeekend(today),
    isoWeekKey: `${getISOWeek(today)}-${getISOWeekYear(today)}`,
  };
};
