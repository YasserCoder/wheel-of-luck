import styles from "./styles/menuItem.module.css";

export default function MenuItem({
    value,
    handleClick,
    children,
}: {
    value: string;
    handleClick?: () => void;
    children: React.ReactNode;
}) {
    return (
        <button className={styles.btn} onClick={handleClick}>
            {children}
            <span className={styles.tooltip}>{value}</span>
        </button>
    );
}
