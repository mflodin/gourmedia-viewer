import { useQuery } from "react-query";
import { fetchMenu } from "../services/fetchMenu";
import { WeekMenu } from "../types/Menu";
import parseMenu from "../utils/parseMenu";
import { useCurrentDay } from "./useCurrentDay";

export const useMenu = (initialData?: WeekMenu) => {
  const { weekStartDate } = useCurrentDay();
  return useQuery<WeekMenu, Error>(
    ["menu", weekStartDate],
    async () => {
      const foodData = await fetchMenu();
      return parseMenu(foodData);
    },
    {
      initialData,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
};
