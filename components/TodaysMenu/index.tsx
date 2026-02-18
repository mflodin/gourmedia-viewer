import { Course } from "../../types/Menu";
import styles from "./TodaysMenu.module.scss";

interface TodaysMenuProps {
  courses?: Course[] | null;
}
const TodaysMenu = ({ courses = [] }: TodaysMenuProps) => {
  if (!courses || courses.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {courses.map((course) => {
        return (
          <div key={course.dish} className={styles.course}>
            <h3>{course.dish}</h3>
            <p>{course.condiments}</p>
            <p className={styles.allergens}>{course.allergens}</p>
            {/* <p>{course.co2}</p> */}
          </div>
        );
      })}
    </div>
  );
};

export default TodaysMenu;
