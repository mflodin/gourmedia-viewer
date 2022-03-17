import * as React from "react";
import clsx from "clsx";
import styles from "./Divider.module.scss";

type Item = {
  id: string;
  image: string;
  top: string;
};

const RUNING_ITEMS = [
  {
    id: "nyancat",
    top: "-24px",
    image: "/images/nyancat.svg",
  },
  {
    id: "nyancat2",
    top: "-24px",
    image: "/images/nyancat.svg",
  },
  {
    id: "nyancat3",
    top: "-24px",
    image: "/images/nyancat.svg",
  },
] as Item[];

interface DividerProps {
  direction?: "left" | "right";
}
const Divider = ({ direction = "right" }: DividerProps) => {
  const [items, setItems] = React.useState<Item[]>([RUNING_ITEMS[0]]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setItems((items) => {
        let newItems = items;
        if (newItems.length === RUNING_ITEMS.length) {
          newItems = [...newItems.slice(1), newItems[0]];
        } else {
          newItems.push(RUNING_ITEMS[newItems.length]);
        }

        return [...newItems];
      });
    }, 20000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className={styles.container}>
      {items.map((item) => (
        <span
          key={item.id}
          className={clsx(styles.item, {
            [styles.itemReversed]: direction === "left",
          })}
          style={{
            top: item.top,
            backgroundImage: `url("${item.image}")`,
          }}
        />
      ))}
      {/* <span
        className={clsx(styles.item, {
          [styles.itemReversed]: direction === "left",
        })}
      /> */}
      <span
        className={clsx(styles.hr, styles.hrAnimate, {
          [styles.hrAnimateReverse]: direction === "left",
        })}
      />
    </div>
  );
};

export default Divider;
