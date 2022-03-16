export interface DayMenu {
  type: string;
  dish: string;
}

export interface Menu {
  isPast: boolean;
  isToday: boolean;
  day: string;
  menu: DayMenu[];
}
