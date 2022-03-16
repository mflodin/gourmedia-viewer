import { DayMenu } from "../../types/Menu";
import styles from "./TodaysMenu.module.scss";

interface TodaysMenuProps {
  dayMenu?: DayMenu[] | null;
}
const TodaysMenu = ({ dayMenu = []}: TodaysMenuProps) => {
  if (!dayMenu || dayMenu.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {dayMenu.map((course) => {
        return (
          <div key={course.type} className={styles.course}>
            <h3>{course.type}</h3>
            <p>{course.dish}</p>
          </div>
        );
      })}
    </div>
  );
};

export default TodaysMenu;
