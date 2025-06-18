import IOSection from "./IOSection";
import Menu from "./Menu";
import { ResultsProvider } from "./ResultsProvider";
import ToggleSwitch from "./ToggleSwitch";
import Wheel from "./Wheel";

import styles from "./styles/main.module.css";

export default function Main() {
    return (
        <main className={styles.main}>
            <Menu />
            <ToggleSwitch />
            <div className={`container ${styles.section}`}>
                <ResultsProvider>
                    <div className={styles.wheelContainer}>
                        <Wheel />
                    </div>
                    <IOSection />
                </ResultsProvider>
            </div>
        </main>
    );
}
