import { useState } from "react";

import styles from "./styles/entries.module.css";
import { FaSortAlphaDown } from "react-icons/fa";
import { LuImagePlus, LuPlus, LuShuffle, LuX } from "react-icons/lu";

const ENTRIES: (string | File)[] = ["Entry 1", "Entry 2", "Entry 3"];
export default function Entries() {
    const [entry, setEntry] = useState("");
    const [entries, setEntries] = useState(ENTRIES);

    function addEntry(
        event:
            | React.FormEvent<HTMLFormElement>
            | React.ChangeEvent<HTMLInputElement>
    ) {
        event.preventDefault?.();

        if ((event as React.ChangeEvent<HTMLInputElement>).target?.files) {
            const file = (event as React.ChangeEvent<HTMLInputElement>).target
                .files?.[0];
            if (file) {
                if (!file.type.startsWith("image/")) {
                    return;
                }
                console.log(file);
                setEntries((prev) => [...prev, file]);
            }
        } else {
            if (entry === "") return;
            console.log(entry);
            setEntries((prev) => [...prev, entry]);
            setEntry("");
        }
    }
    function deleteEntry(id: number) {
        const newEntries = [...entries];
        newEntries.splice(id, 1);
        setEntries(newEntries);
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
                {entries.map((entry, i) => (
                    <div key={i} className={styles.entry}>
                        <span
                            style={{
                                backgroundColor: "var(--color-violet)",
                            }}
                            className={styles.entryColor}
                        />
                        <div className={styles.entryText}>
                            {typeof entry === "string" ? (
                                <span>{entry}</span>
                            ) : (
                                <img
                                    src={URL.createObjectURL(entry)}
                                    alt="entry"
                                    className={styles.entryImg}
                                />
                            )}
                        </div>
                        <button
                            onClick={() => {
                                deleteEntry(i);
                            }}
                            className={styles.deleteBtn}
                        >
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
                    onChange={addEntry}
                    style={{ display: "none" }}
                />
                <label htmlFor="img-upload" className={styles.addImgBtn}>
                    <LuImagePlus />
                </label>
            </div>
        </>
    );
}
