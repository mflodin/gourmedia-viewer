import clsx from "clsx";
import styles from "./Divider.module.scss";

interface DividerProps {
  direction?: "left" | "right";
}
const Divider = ({ direction = "right" }: DividerProps) => {
  return (
    <span
      className={clsx(styles.hr, styles.hrAnimate, {
        [styles.hrAnimateReverse]: direction === "left",
      })}
    />
  );
};

export default Divider;
