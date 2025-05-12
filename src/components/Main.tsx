import IOSection from "./IOSection";
import Menu from "./Menu";
import ToggleSwitch from "./ToggleSwitch";

import styles from "./styles/main.module.css";

export default function Main() {
    return (
        <main className={styles.main}>
            <Menu />
            <ToggleSwitch />
            <div className={`container ${styles.section}`}>
                <IOSection />
            </div>
        </main>
    );
}
