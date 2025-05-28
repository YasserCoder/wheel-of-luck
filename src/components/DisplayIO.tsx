import { LuX } from "react-icons/lu";
import styles from "./styles/displayIO.module.css";

export default function DisplayIO({
    io,
    handleDelete,
    children,
    source = "results",
}: {
    io: string;
    handleDelete: () => void;
    children: React.ReactNode;
    source?: "entries" | "results";
}) {
    return (
        <li
            className={`${source === "entries" ? styles.entries : ""} ${
                styles.io
            }`}
        >
            {children}
            <div className={styles.ioText}>
                {!io.startsWith("data:image") ? (
                    <span>{io}</span>
                ) : (
                    <img src={io} alt="entry" className={styles.ioImg} />
                )}
            </div>
            <button onClick={handleDelete} className={styles.deleteBtn}>
                <LuX />
            </button>
        </li>
    );
}
