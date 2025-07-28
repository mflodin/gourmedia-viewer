import { WeekMenu } from "../types/Menu";
import { useCurrentDay } from "./useCurrentDay";
import { useMenu } from "./useMenu";

export const useTodaysMenu = (initialData?: WeekMenu) => {
  const { dayIndex } = useCurrentDay();
  const { data, isLoading } = useMenu(initialData);

  return {
    isLoading,
    todaysMenu: data?.dayMenus[dayIndex] ?? null,
  };
};
