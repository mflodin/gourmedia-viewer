import { useQuery } from "react-query";
import { fetchMenu } from "../services/fetchMenu";
import { Menu } from "../types/Menu";
import parseMenu from "../utils/parseMenu";
import { useCurrentDay } from "./useCurrentDay";

export const useMenu = (initialData?: Menu[]) => {
  const { weekStartDate } = useCurrentDay();
  return useQuery<Menu[], Error>(
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
