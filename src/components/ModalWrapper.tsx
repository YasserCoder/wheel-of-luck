import styles from "./styles/modalWrapper.module.css";

type ModalWrapperProps = {
    title: string;
    confirmBtn: string;
    confirmDisabled: boolean;
    handleConfirm: () => void;
    onClose?: () => void;
    children: React.ReactNode;
};

export default function ModalWrapper({
    title,
    confirmBtn,
    confirmDisabled,
    handleConfirm,
    onClose,
    children,
}: ModalWrapperProps) {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{title}</h2>
            {children}
            <div className={styles.footer}>
                <button
                    className={`${styles.btn} ${styles.openBtn}`}
                    disabled={confirmDisabled}
                    onClick={handleConfirm}
                >
                    {confirmBtn}
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
