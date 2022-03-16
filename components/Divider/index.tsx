import clsx from "clsx";
import styles from "./Divider.module.scss";

interface DividerProps {
  direction?: "left" | "right";
}
const Divider = ({ direction = "right" }: DividerProps) => {
  return (
    <div className={styles.container}>
      <span
        className={clsx(styles.item, {
          [styles.itemReversed]: direction === "left",
        })}
      />
      <span
        className={clsx(styles.hr, styles.hrAnimate, {
          [styles.hrAnimateReverse]: direction === "left",
        })}
      />
    </div>
  );
};

export default Divider;
