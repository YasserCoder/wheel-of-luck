import styles from "./styles/header.module.css";
import Img from "../assets/wheelImg.png";

export default function Header() {
    return (
        <header className={`${styles.header}`}>
            <div className={`container ${styles.wrapper}`}>
                <img src={Img} alt="wheel" className={styles.img} />
                <h1 className={styles.title}>wheel of luck</h1>
            </div>
        </header>
    );
}
