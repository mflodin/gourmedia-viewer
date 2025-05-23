import { getDay } from "date-fns";
import { WeekMenu } from "../types/Menu";
import { useCurrentDay } from "./useCurrentDay";
import { useMenu } from "./useMenu";

export const useTodaysMenu = (initialData?: WeekMenu) => {
  const { isWeekend, date } = useCurrentDay();
  const { data, isLoading } = useMenu(initialData);

  return {
    isLoading,
    todaysMenu: data && !isWeekend ? data.dayMenus[getDay(date) - 1] : null,
  };
};
