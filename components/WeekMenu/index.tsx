import clsx from "clsx";
import * as React from "react";
import { WeekMenu as WeekMenuType } from "../../types/Menu";
import styles from "./WeekMenu.module.scss";

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
  return (
    <div className={className}>
      {menu?.dayMenus?.map((dayMenu) => {
        return (
          <div
            key={dayMenu.day}
            className={clsx(styles.card, {
              [styles.pastCard]: dayMenu.isPast,
              [styles.todayCard]: dayMenu.isToday,
              [styles.showInMobile]: showAllWeek,
            })}
          >
            <h2>{dayMenu.day}</h2>
            {dayMenu.courses?.map((course) => (
              <React.Fragment key={course.type}>
                <h4>{course.type}</h4>
                <p>{course.dish}</p>
              </React.Fragment>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default WeekMenu;
