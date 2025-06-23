import {
    cloneElement,
    createContext,
    PropsWithChildren,
    useContext,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { useOutsideClick } from "../hook/useOutsideClick";

import styles from "./styles/modal.module.css";
import { HiXMark } from "react-icons/hi2";

type ModalContext = {
    openName: string;
    close: () => void;
    open: (name: string) => void;
};

const ModalContext = createContext<undefined | ModalContext>(undefined);

function useModalContext() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModalContext must be used within a Modal");
    }
    return context;
}

export default function Modal({ children }: PropsWithChildren) {
    const [openName, setOpenName] = useState("");

    const close = () => setOpenName("");
    const open = setOpenName;

    return (
        <ModalContext.Provider value={{ openName, close, open }}>
            {children}
        </ModalContext.Provider>
    );
}

function Open({
    children,
    opens: opensWindowName,
}: {
    children: React.ReactElement;
    opens: string;
}) {
    const { open } = useModalContext();

    return cloneElement(children, {
        handleClick: (e: Event) => {
            e.stopPropagation();
            open(opensWindowName);
        },
    } as Partial<React.HTMLAttributes<HTMLElement>>);
}

function Window({
    children,
    name,
}: {
    children: React.ReactElement;
    name: string;
}) {
    const { openName, close } = useModalContext();
    const ref = useOutsideClick(close);

    if (name !== openName) return null;

    return createPortal(
        <div className={styles.overlay}>
            <div className={styles.modal} ref={ref} data-testid="modal">
                <div className={styles.btnContainer}>
                    <button className={styles.closeBtn} onClick={close}>
                        <HiXMark />
                    </button>
                </div>

                {cloneElement(children, { onClose: close } as Partial<
                    React.HTMLAttributes<HTMLElement>
                >)}
            </div>
        </div>,
        document.body
    );
}

Modal.Open = Open;
Modal.Window = Window;
