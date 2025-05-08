import styles from "./styles/header.module.css";
import ToggleSwitch from "./ToggleSwitch";

export default function Header() {
    return (
        <header className={`${styles.header}`}>
            <div className={`container ${styles.wrapper}`}>
                <h1 className={styles.title}>wheel of luck</h1>
                <ToggleSwitch />
            </div>
        </header>
    );
}
