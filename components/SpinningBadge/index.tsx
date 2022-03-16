import * as React from "react";
import styles from "./SpinningBadge.module.css";

const TEXT_PHRASES = ["So nice!", "So fresh!", "So yummy!", "So wow!", "So great!", "So good!"];

const SpinningBadge = () => {
  const [starText, setStarText] = React.useState("");

  React.useEffect(() => {
    const nr = Math.floor(Math.random() * TEXT_PHRASES.length);
    setStarText(TEXT_PHRASES[nr]);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.badge} />
      <span className={styles.text}>{starText}</span>
    </div>
  );
};

export default SpinningBadge;
