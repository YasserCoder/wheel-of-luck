import { useState } from "react";
import Swal from "sweetalert2";

import OperationBtns from "./OperationBtns";
import DisplayIO from "./DisplayIO";
import { useSortable } from "../hook/useSortable";
import { useEntries } from "../context/entriesContext";
import { convertToBase64, shuffleArray, sortArray } from "../utils/helpers";
import { MAX_ENTRIES } from "../utils/constants";

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
    function triggerAlert() {
        Swal.fire({
            icon: "error",
            title: "The entry already exists",
            text: "The entry must be unique",
        });
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
                    triggerAlert();
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
                triggerAlert();
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
                        handleDelete={() => deleteEntry(i)}
                        color={colors[i % colors.length]}
                    >
                        <DisplayIO.Color />
                        <DisplayIO.Content />
                        <DisplayIO.DeleteBtn />
                    </DisplayIO>
                ))}
            </ul>
            <div className={styles.addEntrySec}>
                <form className={styles.addEntryForm} onSubmit={addEntry}>
                    <input
                        className={styles.addEntryInput}
                        placeholder="Add Entry"
                        value={entry}
                        disabled={entries.length >= MAX_ENTRIES}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                        ) => setEntry(event.target.value)}
                    />
                    <button
                        data-testid="add-btn"
                        disabled={entries.length >= MAX_ENTRIES}
                        type="submit"
                        className={`${styles.addBtn} ${
                            entries.length >= MAX_ENTRIES ? styles.disabled : ""
                        }`}
                    >
                        <LuPlus />
                    </button>
                </form>
                <span className={styles.or}>OR</span>
                <input
                    id="img-upload"
                    type="file"
                    data-testid="img-upload"
                    accept="image/*"
                    onChange={addEntry}
                    disabled={entries.length >= MAX_ENTRIES}
                    style={{ display: "none" }}
                />
                <label
                    htmlFor="img-upload"
                    className={`${styles.addImgBtn} ${
                        entries.length >= MAX_ENTRIES ? styles.disabled : ""
                    }`}
                >
                    <LuImagePlus />
                </label>
            </div>
            {entries.length >= MAX_ENTRIES && (
                <p className={styles.maxEntriesWarning}>
                    **You have reached the maximum number of entries (
                    {MAX_ENTRIES})
                </p>
            )}
        </>
    );
}
