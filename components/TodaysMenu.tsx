import { FoodData } from "../pages/api/snusket/today";

interface TodaysMenuProps {
  menu: string | null;
}
const TodaysMenu = ({ menu }: TodaysMenuProps) => {
  if (!menu) {
    return null;
  }
  const courses = menu?.split("\n\n");

  return (
    <div>
      {courses.map((course) => {
        const [header, description] = course.split("\n");
        return (
          <div key={header}>
            <h3>{header.trim()}</h3>
            <p>{description.trim()}</p>
          </div>
        );
      })}
    </div>
  );
};

export default TodaysMenu;
