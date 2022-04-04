import Heart from "../Heart";
import styles from "./Footer.module.scss";
const Footer = () => {
  return (
    <footer className={styles.footer}>
      made with <Heart width={30} height={20} /> by r0ss
    </footer>
  );
};

export default Footer;
