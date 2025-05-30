import { useState } from "react";

import Results from "./Results";
import Entries from "./Entries";
import { useLocalStorageState } from "../hook/useLocalStorageState";
import { useEntries } from "../context/entriesContext";
import { useResults } from "../context/resultsContext";

import { LuEye, LuEyeOff } from "react-icons/lu";
import styles from "./styles/ioSection.module.css";

export default function IOSection() {
    const [activeTab, setActiveTab] = useState("entries");
    const [value, setValue] = useLocalStorageState(
        { appTheme: "", isVisible: true },
        "preferences"
    );
    return (
        <section className={styles.section}>
            <button
                className={styles.view}
                onClick={() =>
                    setValue({ ...value, isVisible: !value.isVisible })
                }
            >
                <span className={styles.eyeIcon}>
                    {value.isVisible ? <LuEyeOff /> : <LuEye />}
                </span>
            </button>
            {value.isVisible && (
                <>
                    <TabsHeader
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                    <div className={styles.box}>
                        {activeTab === "entries" ? <Entries /> : <Results />}
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
    const {
        value: { entries },
    } = useEntries();
    const { results } = useResults();
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
                    Entries ({entries.length})
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
                    Results ({results.length})
                </button>
            </div>
            <span className={styles.bordered} />
        </div>
    );
}
