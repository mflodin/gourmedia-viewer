export interface Course {
	dish: string;
	condiments: string;
	allergens: string;
	co2: number;
}

export interface WeekMenu {
	week: number;
	year: number;
	dayMenus: DayMenu[];
}

export type DayMenu = {
	day: string;
	formattedDate: string;
	courses: Course[];
};
