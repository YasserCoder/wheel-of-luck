import { FaSortAlphaDown } from "react-icons/fa";
import styles from "./styles/operationBtns.module.css";

export default function OperationBtns({
    handleClick,
    handleSort,
    children,
}: {
    handleClick: () => void;
    handleSort: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className={styles.operations}>
            <button className={styles.opBtn} onClick={handleClick}>
                {children}
            </button>
            <button className={styles.opBtn} onClick={handleSort}>
                <FaSortAlphaDown /> <span>Sort</span>
            </button>
        </div>
    );
}
