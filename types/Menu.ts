export interface Course {
  type: string;
  dish: string;
}

export interface WeekMenu {
  week: number;
  year: number;
  dayMenus: DayMenu[];
}

type DayMenu = {
  isPast: boolean;
  isToday: boolean;
  day: string;
  formattedDate: string;
  courses: Course[];
};

export type FoodData = {
  formattedDate: string;
  day: string;
  menu: string;
};

export type RedisWeekMenu = {
  week: number;
  year: number;
  menuItems: FoodData[];
};
