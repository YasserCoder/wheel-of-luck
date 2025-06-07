import { createContext, PropsWithChildren, useContext } from "react";
import { LuX } from "react-icons/lu";
import styles from "./styles/displayIO.module.css";

type IO = {
    io: string;
    handleDelete: () => void;
    winTimes?: number;
    color?: string;
};
const DisplayIOContext = createContext<IO | undefined>(undefined);

function useDisplayIOContext() {
    const context = useContext(DisplayIOContext);
    if (!context) {
        throw new Error(
            "useDisplayIOContext must be used within a DisplayIOProvider"
        );
    }
    return context;
}

type DisplayIOProps = PropsWithChildren & IO;

export default function DisplayIO({
    io,
    handleDelete,
    winTimes,
    color,
    children,
}: DisplayIOProps) {
    return (
        <DisplayIOContext.Provider
            value={{ io, handleDelete, winTimes, color }}
        >
            <li className={`${color ? styles.entries : ""} ${styles.io}`}>
                {children}
            </li>
        </DisplayIOContext.Provider>
    );
}

function Color() {
    const { color } = useDisplayIOContext();
    return (
        <span
            style={{
                backgroundColor: color,
            }}
            className={styles.color}
        />
    );
}

function Content() {
    const { io } = useDisplayIOContext();
    return (
        <div className={styles.ioText}>
            {!io.startsWith("data:image") ? (
                <span>{io}</span>
            ) : (
                <img src={io} alt="entry" className={styles.ioImg} />
            )}
        </div>
    );
}
function DeleteBtn() {
    const { handleDelete } = useDisplayIOContext();
    return (
        <button onClick={handleDelete} className={styles.deleteBtn}>
            <LuX />
        </button>
    );
}
function WinTimes() {
    const { winTimes } = useDisplayIOContext();
    return <span className={styles.winTimes}>( {winTimes} )</span>;
}

DisplayIO.Color = Color;
DisplayIO.Content = Content;
DisplayIO.DeleteBtn = DeleteBtn;
DisplayIO.WinTimes = WinTimes;
