import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

import Modal from "./Modal";
import MenuItem from "./MenuItem";
import ModalWrapper from "./ModalWrapper";
import { useEntries } from "../context/entriesContext";
import { getRandomColor } from "../utils/helpers";

import { MdOutlineColorLens } from "react-icons/md";
import styles from "./styles/customizeBtn.module.css";

export default function CustomizeBtn() {
    return (
        <Modal>
            <Modal.Open opens="customize-settings">
                <MenuItem value="Customize">
                    <MdOutlineColorLens />
                </MenuItem>
            </Modal.Open>
            <Modal.Window name="customize-settings">
                <Settings />
            </Modal.Window>
        </Modal>
    );
}

function Settings({ onClose }: { onClose?: () => void }) {
    const {
        value: { colors },
        dispatch,
    } = useEntries();
    const [clrs, setClrs] = useState<string[]>(colors);
    const [clrsNbr, setClrsNbr] = useState(clrs.length);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const val = +e.target.value;
        if (val > 1 && val <= 40) {
            if (val < clrsNbr) {
                const diff = clrsNbr - val;
                const newArr = clrs.slice(0, -diff);
                setClrsNbr(val);
                setClrs(newArr);
            } else {
                setClrsNbr(val);
            }
        }
    }
    function saveChanges() {
        dispatch({ type: "colors/set", payload: clrs });
        onClose?.();
        Swal.fire({
            title: "Saved!",
            text: "Your changes has been applied.",
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
        });
    }
    return (
        <ModalWrapper
            title="Appearance"
            confirmBtn="Save"
            confirmDisabled={clrs === colors}
            handleConfirm={saveChanges}
            onClose={onClose}
        >
            <div className={styles.customizeClrs}>
                <h3>customize colors </h3>
                <div className={styles.displayClrs}>
                    <div className={styles.clrsNbr}>
                        <p>number of colors :</p>
                        <input
                            min={2}
                            max={40}
                            value={clrsNbr}
                            onChange={handleChange}
                            type="number"
                            className={styles.inputNbr}
                        />
                    </div>
                    <div className={styles.clrs}>
                        {Array.from({ length: clrsNbr }).map((_, i) => (
                            <ColorPicker
                                key={i}
                                index={i}
                                clrs={clrs}
                                setClrs={setClrs}
                                initialColor={clrs[i] || getRandomColor()}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
}

type CPProps = {
    initialColor: string;
    index: number;
    clrs: string[];
    setClrs: (color: string[]) => void;
};

function ColorPicker({ initialColor, clrs, setClrs, index }: CPProps) {
    const [color, setColor] = useState(initialColor);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setColor(newColor);
        const newArr = clrs.map((clr, i) => (i === index ? newColor : clr));
        setClrs(newArr);
    };

    const handleClick = () => {
        inputRef.current?.click();
    };
    useEffect(() => {
        if (index >= clrs.length) {
            setClrs([...clrs, initialColor]);
        }
    }, [clrs, setClrs, initialColor, index]);

    return (
        <div className={styles.clrPicker}>
            <button
                onClick={handleClick}
                style={{ backgroundColor: color }}
                title="Pick a color"
            >
                <MdOutlineColorLens />
            </button>
            <input
                type="color"
                ref={inputRef}
                value={color}
                onChange={handleColorChange}
            />
        </div>
    );
}
