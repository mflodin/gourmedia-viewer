import clsx from "clsx";
import * as React from "react";
import { Menu } from "../../types/Menu";
import styles from "./WeekMenu.module.scss";

interface WeekMenuProps {
    menu?: Menu[]
    className?: string;
}
const WeekMenu:React.FC<WeekMenuProps> = ({ menu, className }) => {
  return (
    <div className={className}>
      {menu?.map((foodDay) => {
        return (
          <div
            key={foodDay.day}
            className={clsx(styles.card, {
              [styles.pastCard]: foodDay.isPast,
              [styles.todayCard]: foodDay.isToday,
            })}
          >
            <h2>{foodDay.day}</h2>
            {foodDay.menu.map((course) => (
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