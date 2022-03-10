import { getDay } from "date-fns";
import { FoodData } from "../pages/api/snusket/today";
import { useCurrentDay } from "./useCurrentDay";
import { useMenu } from "./useMenu";

export const useTodaysMenu = (initialData?: FoodData[]) => {
  const { isWeekend, date } = useCurrentDay();
  const { data, isLoading } = useMenu(initialData);

  return {
    isLoading,
    menu: data && !isWeekend ? data[getDay(date) - 1].menu : null,
  };
};
