import * as React from "react";
import clsx from "clsx";
import styles from "./WeekMenu.module.scss";
import { useCurrentDay } from "../../hooks/useCurrentDay";
import type { WeekMenu as WeekMenuType } from "../../types/Menu";

interface WeekMenuProps {
  menu?: WeekMenuType;
  className?: string;
  showAllWeek?: boolean;
}
const WeekMenu: React.FC<WeekMenuProps> = ({
  menu,
  className,
  showAllWeek = false,
}) => {
  const currentDay = useCurrentDay();

  return (
    <div className={className}>
      {menu?.dayMenus?.map((dayMenu, idx) => {
        const isPast = idx < currentDay.dayIndex;
        const isToday = idx === currentDay.dayIndex;
        return (
          <div
            key={dayMenu.day}
            className={clsx(styles.card, {
              [styles.pastCard]: isPast,
              [styles.todayCard]: isToday,
              [styles.showInMobile]: showAllWeek,
            })}
          >
            <h2>{dayMenu.day}</h2>
            {dayMenu.courses?.map((course) => (
              <React.Fragment key={course.dish}>
                <h4>{course.dish}</h4>
                <p>{course.condiments}</p>
                <p className={styles.allergens}>{course.allergens}</p>
                {/* <p>{course.co2}</p> */}
              </React.Fragment>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default WeekMenu;
