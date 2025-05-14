import { useState } from "react";

import styles from "./styles/entries.module.css";
import { FaSortAlphaDown } from "react-icons/fa";
import { LuImagePlus, LuPlus, LuShuffle, LuX } from "react-icons/lu";

const ENTRIES: (string | File)[] = ["Entry 1", "Entry 2", "Entry 3"];
export default function Entries() {
    const [entry, setEntry] = useState("");
    function addEntry(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log(entry);
        ENTRIES.push(entry);
        console.log(ENTRIES);
        setEntry("");
    }
    function addImg(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            console.log(file);
            ENTRIES.push(file);
            console.log(ENTRIES);
        }
    }
    return (
        <>
            <div className={styles.operations}>
                <button className={styles.opBtn}>
                    <LuShuffle />
                    <span>Shuffle</span>
                </button>
                <button className={styles.opBtn}>
                    <FaSortAlphaDown /> <span>Sort</span>
                </button>
            </div>
            <div className={styles.entries}>
                {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className={styles.entry}>
                        <span
                            style={{
                                backgroundColor: "var(--color-violet)",
                            }}
                            className={styles.entryColor}
                        />
                        <span className={styles.entryText}>Entry {i + 1}</span>
                        <button className={styles.deleteBtn}>
                            <LuX />
                        </button>
                    </div>
                ))}
            </div>
            <div className={styles.addEntrySec}>
                <form className={styles.addEntryForm} onSubmit={addEntry}>
                    <input
                        className={styles.addEntryInput}
                        placeholder="Add Entry"
                        value={entry}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                        ) => setEntry(event.target.value)}
                    />
                    <button type="submit" className={styles.addBtn}>
                        <LuPlus />
                    </button>
                </form>
                <span className={styles.or}>OR</span>
                <input
                    id="img-upload"
                    type="file"
                    accept="image/*"
                    onChange={addImg}
                    style={{ display: "none" }}
                />
                <label htmlFor="img-upload" className={styles.addImgBtn}>
                    <LuImagePlus />
                </label>
            </div>
        </>
    );
}
