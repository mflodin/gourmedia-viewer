import Heart from "../Heart";
import styles from "./Footer.module.scss";
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>
        made with <Heart width={30} height={20} /> by r0ss & mflodin
      </p>
      <p>
        data hämtat från{" "}
        <a
          href="https://www.iss-menyer.se/restaurants/restaurang-gourmedia"
          target="_blank"
          rel="noreferrer"
        >
          Gourmedia
        </a>
      </p>
    </footer>
  );
};

export default Footer;
