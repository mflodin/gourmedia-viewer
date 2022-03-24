import * as React from "react";
import clsx from "clsx";
import styles from "./Divider.module.scss";
import { useWindowSize } from "../../hooks/useWindowResize";

type Item = {
  id: string;
  style: {
    [key: string]: string;
  };
};

const RUNING_ITEMS = [
  {
    id: "sushi",
    style: {
      top: "-9px",
      backgroundImage: "url(/images/sushi.gif)",
      height: "46px",
    },
  },
  {
    id: "pizza",
    style: {
      top: "3px",
      backgroundImage: "url(/images/pizza.gif)",
      height: "40px",
    },
  },
  {
    id: "cake",
    style: {
      top: "-9px",
      backgroundImage: "url(/images/cake.gif)",
      height: "40px",
    },
  },
  {
    id: "noodles",
    style: {
      top: "-13px",
      backgroundImage: "url(/images/noodles.gif)",
      height: "50px",
    },
  },
  {
    id: "burger-bounce",
    style: {
      top: "-30px",
      backgroundImage: "url(/images/burger-bounce.gif)",
      height: "60px",
    },
  },
  {
    id: "pusheen2",
    style: {
      top: "-24px",
      backgroundImage: "url(/images/pusheen.gif)",
      height: "60px",
    },
  },
] as Item[];

interface DividerProps {
  direction?: "left" | "right";
}
const Divider = ({ direction = "right" }: DividerProps) => {
  const [items, setItems] = React.useState<Item[]>([RUNING_ITEMS[0]]);

  const windowSize = useWindowSize();

  React.useEffect(() => {
    if (windowSize.width) {
      const speed = Math.max(Math.floor((windowSize.width / 120)), 6);
      console.log(speed);
      document.documentElement.style.setProperty(
        "--divider-anim-speed",
        `${15}s`
      );

      document.documentElement.style.setProperty(
        "--divider-food-anim-speed",
        `${speed/2}s`
      );

      
    }
  }, [windowSize]);

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
          style={{ ...item.style }}
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
