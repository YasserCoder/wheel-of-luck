import { useState } from "react";
import styles from "./styles/ioSection.module.css";
import { LuEye, LuEyeOff } from "react-icons/lu";
import Entries from "./Entries";

export default function IOSection() {
    const [activeTab, setActiveTab] = useState("entries");
    const [isOpen, setIsOpen] = useState(true);
    return (
        <section className={styles.section}>
            <button className={styles.view} onClick={() => setIsOpen(!isOpen)}>
                <span className={styles.eyeIcon}>
                    {isOpen ? <LuEyeOff /> : <LuEye />}
                </span>
            </button>
            {isOpen && (
                <>
                    <TabsHeader
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                    <div className={styles.box}>
                        <Entries />
                    </div>
                </>
            )}
        </section>
    );
}

function TabsHeader({
    activeTab,
    setActiveTab,
}: {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}) {
    return (
        <div className={styles.header}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${
                        activeTab === "entries" && styles.active
                    }`}
                    disabled={activeTab === "entries"}
                    onClick={() => {
                        setActiveTab("entries");
                    }}
                >
                    Entries
                </button>
                <button
                    className={`${styles.tab} ${
                        activeTab === "results" && styles.active
                    }`}
                    disabled={activeTab === "results"}
                    onClick={() => {
                        setActiveTab("results");
                    }}
                >
                    Results
                </button>
            </div>
            <div style={{ borderBottom: "1px solid #b1b1b1", flex: "1" }}></div>
        </div>
    );
}
