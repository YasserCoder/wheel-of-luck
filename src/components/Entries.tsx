import { useState } from "react";

import OperationBtns from "./OperationBtns";
import DisplayIO from "./DisplayIO";
import { useSortable } from "../hook/useSortable";
import { useEntries } from "../context/entriesContext";
import { convertToBase64, shuffleArray, sortArray } from "../utils/helpers";

import { LuImagePlus, LuPlus, LuShuffle } from "react-icons/lu";
import styles from "./styles/entries.module.css";

export default function Entries() {
    const [entry, setEntry] = useState("");
    const {
        value: { entries, colors },
        dispatch,
    } = useEntries();
    const listRef = useSortable({ entries, setEntries });

    function setEntries(entries: string[]) {
        dispatch({ type: "entries/set", payload: entries });
    }

    async function addEntry(
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
                const base64 = (await convertToBase64(file)) as string;
                if (entries.includes(base64)) {
                    alert(
                        "the entry already exists \nThe entry must be unique"
                    );
                    return;
                }
                dispatch({
                    type: "entries/added",
                    payload: base64,
                });
            }
        } else {
            if (entry === "") return;
            if (entries.includes(entry)) {
                alert("The entry already exists \nThe entry must be unique");
                setEntry("");
                return;
            }
            dispatch({
                type: "entries/added",
                payload: entry,
            });
            setEntry("");
        }
    }
    function deleteEntry(id: number) {
        dispatch({ type: "entries/deleted", payload: id });
    }
    return (
        <>
            <OperationBtns
                handleClick={() => {
                    dispatch({
                        type: "entries/set",
                        payload: shuffleArray([...entries]),
                    });
                }}
                handleSort={() => {
                    dispatch({
                        type: "entries/set",
                        payload: sortArray([...entries]),
                    });
                }}
            >
                <LuShuffle />
                <span>Shuffle</span>
            </OperationBtns>
            <ul ref={listRef} className={styles.entries}>
                {entries.map((entry, i) => (
                    <DisplayIO
                        key={entry + i}
                        io={entry}
                        source={"entries"}
                        handleDelete={() => deleteEntry(i)}
                    >
                        <span
                            style={{
                                backgroundColor: colors[i % colors.length],
                            }}
                            className={styles.entryColor}
                        />
                    </DisplayIO>
                ))}
            </ul>
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
