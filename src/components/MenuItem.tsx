import styles from "./styles/menuItem.module.css";

export default function MenuItem({
    value,
    handleClick,
    disabled = false,
    children,
}: {
    value: string;
    handleClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}) {
    return (
        <button
            disabled={disabled}
            className={styles.btn}
            onClick={handleClick}
        >
            {children}
            <span className={styles.tooltip}>{value}</span>
        </button>
    );
}
