import { useQuery } from "@tanstack/react-query";
import { fetchMenu } from "../services/fetchMenu";
import { WeekMenu } from "../types/Menu";
import { useCurrentDay } from "./useCurrentDay";

export const useMenu = (initialData?: WeekMenu) => {
	const { isoWeekKey } = useCurrentDay();
	return useQuery<WeekMenu, Error>({
		queryKey: ["menu", isoWeekKey],
		queryFn: async () => {
			const foodData = await fetchMenu();
			return foodData;
		},
		initialData,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});
};
