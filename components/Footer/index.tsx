import styles from "./Footer.module.scss";
const Footer = () => {
  return (
    <footer className={styles.footer}>
      made with{" "}
      <span
        style={{
          margin: "0 10px 0 5px",
        }}
      >
        💖
      </span>
      by r0ss
    </footer>
  );
};

export default Footer;
