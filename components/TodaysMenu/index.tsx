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
