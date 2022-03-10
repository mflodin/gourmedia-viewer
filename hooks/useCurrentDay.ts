import { format, isWeekend, startOfWeek } from "date-fns";
import { sv } from "date-fns/locale";

export const useCurrentDay = () => {
  const today = new Date();

  return {
    date: today,
    day: format(today, "EEEE", {
      locale: sv,
    }),
    isWeekend: isWeekend(today),
    weekStartDate: format(startOfWeek(today), "yyyy-MM-dd", {
      locale: sv,
    }),
  };
};
