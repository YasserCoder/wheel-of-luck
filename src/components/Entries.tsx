import { useState } from "react";

import OperationBtns from "./OperationBtns";
import DisplayIO from "./DisplayIO";
import { shuffleArray, sortArray } from "../utils/helpers";

import { LuImagePlus, LuPlus, LuShuffle } from "react-icons/lu";
import styles from "./styles/entries.module.css";

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
            <OperationBtns
                handleClick={() => {
                    setEntries((prev) => {
                        return shuffleArray([...prev]);
                    });
                }}
                handleSort={() => {
                    setEntries((prev) => {
                        return sortArray([...prev]);
                    });
                }}
            >
                <LuShuffle />
                <span>Shuffle</span>
            </OperationBtns>
            <div className={styles.entries}>
                {entries.map((entry, i) => (
                    <DisplayIO
                        key={i}
                        io={entry}
                        handleDelete={() => deleteEntry(i)}
                    >
                        <span
                            style={{
                                backgroundColor: "var(--color-violet)",
                            }}
                            className={styles.entryColor}
                        />
                    </DisplayIO>
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
