import { LuX } from "react-icons/lu";
import styles from "./styles/displayIO.module.css";

export default function DisplayIO({
    io,
    handleDelete,
    children,
}: {
    io: string | File;
    handleDelete: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className={styles.io}>
            {children}
            <div className={styles.ioText}>
                {typeof io === "string" ? (
                    <span>{io}</span>
                ) : (
                    <img
                        src={URL.createObjectURL(io)}
                        alt="entry"
                        className={styles.entryImg}
                    />
                )}
            </div>
            <button onClick={handleDelete} className={styles.deleteBtn}>
                <LuX />
            </button>
        </div>
    );
}
