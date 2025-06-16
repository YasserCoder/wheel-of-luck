import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

import Modal from "./Modal";
import MenuItem from "./MenuItem";
import ModalWrapper from "./ModalWrapper";
import { useEntries } from "../context/entriesContext";
import { useOutsideClick } from "../hook/useOutsideClick";
import { getRandomColor } from "../utils/helpers";

import { MdOutlineColorLens } from "react-icons/md";
import styles from "./styles/customizeBtn.module.css";
import themes from "../data/colors.json";

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
            <Themes setClrs={setClrs} setClrsNbr={setClrsNbr} />
            <div style={{ paddingBottom: "10px" }} className={styles.section}>
                <h3>customize colors </h3>
                <div className={styles.subSection}>
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
                            />
                        ))}
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
}

type ThemesProps = {
    setClrsNbr: (val: number) => void;
    setClrs: (color: string[]) => void;
};

function Themes({ setClrs, setClrsNbr }: ThemesProps) {
    const [selectedTheme, setSelectedTheme] = useState("");
    const ref = useOutsideClick(() => setSelectedTheme(""));

    function applyChanges() {
        const newTheme = themes[
            selectedTheme as keyof typeof themes
        ] as string[];
        setClrs(newTheme);
        setClrsNbr(newTheme.length);
        setSelectedTheme("");
    }
    return (
        <div style={{ paddingTop: "10px" }} className={styles.section}>
            <h3>themes</h3>
            <div className={styles.subSection}>
                <p style={{ textWrap: "nowrap" }}>select a theme :</p>
                <div className={styles.themes}>
                    {Object.keys(themes).map((key, i) => (
                        <div
                            key={i}
                            ref={ref}
                            className={styles.theme}
                            style={
                                selectedTheme === key
                                    ? {
                                          borderColor: "var(--color-violet)",
                                      }
                                    : {}
                            }
                            onClick={() => {
                                setSelectedTheme(key);
                            }}
                        >
                            <div className="">
                                {(
                                    themes[
                                        key as keyof typeof themes
                                    ] as string[]
                                ).map(
                                    (clr: string, j: number, arr: string[]) => (
                                        <span
                                            key={j}
                                            style={{
                                                backgroundColor: clr,
                                                height: "100%",
                                                width: `${100 / arr.length}%`,
                                            }}
                                        ></span>
                                    )
                                )}
                            </div>
                            <p>{key}</p>
                        </div>
                    ))}
                </div>
            </div>
            <button
                disabled={!selectedTheme}
                className={styles.btn}
                onClick={applyChanges}
            >
                Apply
            </button>
        </div>
    );
}

type CPProps = {
    index: number;
    clrs: string[];
    setClrs: (color: string[]) => void;
};

function ColorPicker({ clrs, setClrs, index }: CPProps) {
    const color = clrs[index] || getRandomColor();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        const newArr = clrs.map((clr, i) => (i === index ? newColor : clr));
        setClrs(newArr);
    };

    const handleClick = () => {
        inputRef.current?.click();
    };
    useEffect(() => {
        if (index >= clrs.length) {
            setClrs([...clrs, color]);
        }
    }, [clrs, setClrs, color, index]);

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
