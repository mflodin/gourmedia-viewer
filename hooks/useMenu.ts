import { useQuery } from "react-query";
import { FoodData } from "../pages/api/snusket/today";
import { fetchMenu } from "../services/fetchMenu";
import { useCurrentDay } from "./useCurrentDay";

export const useMenu = (initialData?: FoodData[]) => {
  const { weekStartDate } = useCurrentDay();
  return useQuery<FoodData[], Error>(["menu", weekStartDate], fetchMenu, {
    initialData,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};
