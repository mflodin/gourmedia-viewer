import styles from "./Heart.module.scss";

interface HeartProps {
    width?: number;
    height?: number;
}
const Heart = ({width, height}: HeartProps) => {
    return <div className={styles.heart} style={{
        width: width,
        height: height
    }} />
}
export default Heart;