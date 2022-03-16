import { getDay } from "date-fns";
import { Menu } from "../types/Menu";
import { useCurrentDay } from "./useCurrentDay";
import { useMenu } from "./useMenu";

export const useTodaysMenu = (initialData?: Menu[]) => {
  const { isWeekend, date } = useCurrentDay();
  const { data, isLoading } = useMenu(initialData);

  return {
    isLoading,
    todayMenu: data && !isWeekend ? data[getDay(date) - 1] : null,
  };
};
