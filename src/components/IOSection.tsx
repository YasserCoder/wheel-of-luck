import styles from "./styles/ioSection.module.css";

export default function IOSection() {
    return (
        <section className={styles.section}>
            <span className={styles.view}>Eye</span>
            <div className={styles.header}>
                <div className={styles.tabs}>
                    <span className={`${styles.tab}`}>Entries</span>
                    <span className={`${styles.tab} ${styles.active}`}>
                        Results
                    </span>
                </div>
                <div
                    style={{ borderBottom: "1px solid #b1b1b1", flex: "1" }}
                ></div>
            </div>
            <div className={styles.box}></div>
        </section>
    );
}
