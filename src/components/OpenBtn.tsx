import { useState } from "react";
import Swal from "sweetalert2";

import Modal from "./Modal";
import MenuItem from "./MenuItem";
import { useOutsideClick } from "../hook/useOutsideClick";
import { useEntries } from "../context/entriesContext";
import { useSavedEntries } from "../context/savedEntriesContext";

import { LuFolderOpen, LuX } from "react-icons/lu";
import styles from "./styles/openBtn.module.css";

export default function OpenBtn() {
    return (
        <Modal>
            <Modal.Open opens="saved-entries">
                <MenuItem value="Open">
                    <LuFolderOpen />
                </MenuItem>
            </Modal.Open>
            <Modal.Window name="saved-entries">
                <SavedEntries />
            </Modal.Window>
        </Modal>
    );
}

function SavedEntries({ onClose }: { onClose?: () => void }) {
    const { savedEntries, setSavedEntries } = useSavedEntries();
    const { dispatch } = useEntries();
    const [isSelected, setIsSelected] = useState("");

    function openSaved() {
        if (!isSelected) return;
        const value = savedEntries.find((entry) => entry.title === isSelected);
        if (value) {
            dispatch({
                type: "config/set",
                payload: { entries: value.entries, colors: value.colors },
            });
            onClose?.();
            Swal.fire({
                title: "Uploaded!",
                text: "Your entries has been uploaded.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }
    const ref = useOutsideClick(() => {
        setIsSelected("");
    });
    function handleDelete(index: number) {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--color-violet)",
            background: "var(--color-bkg)",
            color: "var(--color-body)",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                if (isSelected === savedEntries[index].title) {
                    setIsSelected("");
                }
                const newEntries = [...savedEntries];
                newEntries.splice(index, 1);
                setSavedEntries(newEntries);
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        });
    }
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>saved Entries</h2>
            {savedEntries.length === 0 ? (
                <div className={styles.empty}>
                    <p>No saved entries found.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {savedEntries.map((entry, index) => (
                        <div
                            ref={ref}
                            key={index}
                            style={
                                isSelected === entry.title
                                    ? {
                                          borderColor: "var(--color-violet)",
                                          cursor: "auto",
                                          outline: "var(--color-violet)",
                                      }
                                    : {}
                            }
                            className={styles.entryBox}
                            onClick={() => {
                                if (isSelected !== entry.title)
                                    setIsSelected(entry.title);
                            }}
                        >
                            <div className={styles.options}>
                                <div
                                    style={
                                        isSelected === entry.title
                                            ? {
                                                  backgroundColor:
                                                      "var(--color-violet)",
                                                  border: "none",
                                              }
                                            : {}
                                    }
                                    className={styles.selected}
                                >
                                    <span />
                                </div>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => handleDelete(index)}
                                >
                                    <LuX />
                                </button>
                            </div>
                            <h3
                                className={styles.entryTitle}
                                title={entry.title}
                            >
                                {entry.title}
                            </h3>
                            <p className={styles.entries}>
                                {entry.entries
                                    .map((e) =>
                                        e.startsWith("data:image") ? "Image" : e
                                    )
                                    .join("- ")}
                            </p>
                        </div>
                    ))}
                </div>
            )}
            <div className={styles.footer}>
                <button
                    className={`${styles.btn} ${styles.openBtn}`}
                    disabled={savedEntries.length === 0 || !isSelected}
                    onClick={openSaved}
                >
                    Open
                </button>
                <button
                    className={`${styles.btn} ${styles.closeBtn}`}
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}
