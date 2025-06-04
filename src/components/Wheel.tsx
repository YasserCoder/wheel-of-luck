import { useState, useRef } from "react";
import confetti from "canvas-confetti";

import { useResults } from "../context/resultsContext";
import { useEntries } from "../context/entriesContext";
import { EXTRA_SPINS, SPINNNG_DURATION } from "../utils/constants";

import spiningSound from "../assets/spining sound.mp3";
import winnerRevealSound from "../assets/result-ding.mp3";
import styles from "./styles/Wheel.module.css";
import { useOutsideClick } from "../hook/useOutsideClick";

export default function Wheel() {
    const {
        value: { entries, colors },
    } = useEntries();
    const { results, dispatch } = useResults();

    const radius = 230;
    const center = radius;
    const angle = 360 / entries.length;

    const [spinning, setSpinning] = useState(false);
    const wheelRef = useRef<SVGSVGElement>(null);
    const [currentRotation, setCurrentRotation] = useState(0);
    const [resultVisible, setResultVisible] = useState(false);
    const [winnerIndex, setWinnerIndex] = useState(-1);

    const spinWheel = () => {
        if (spinning) return;
        if (entries.length < 2) return;
        setSpinning(true);

        const randomAngle = Math.floor(Math.random() * 360);

        const finalRotation = currentRotation + 360 * EXTRA_SPINS + randomAngle;

        if (wheelRef.current) {
            wheelRef.current.style.transition = `transform ${SPINNNG_DURATION}ms ease-out`;
            wheelRef.current.style.transform = `rotate(${finalRotation}deg)`;
        }

        setCurrentRotation(finalRotation);

        const audio = new Audio(spiningSound);
        audio.play();
        setTimeout(() => {
            setSpinning(false);

            const normalizedRotation = ((finalRotation % 360) + 360) % 360;

            const pointerAngle = 0;

            const arrowAngle = (pointerAngle - normalizedRotation + 360) % 360;

            const winningIndex =
                Math.floor(arrowAngle / angle) % entries.length;

            const winner = entries[winningIndex];
            setWinnerIndex(winningIndex);
            console.log(`Winner: ${winner}`);
            const existingWinnerIndex = results.findIndex(
                (result) => result.winner === winner
            );
            if (existingWinnerIndex !== -1) {
                dispatch({
                    type: "results/increment",
                    payload: existingWinnerIndex,
                });
            } else {
                dispatch({
                    type: "results/added",
                    payload: winner,
                });
            }
            const winnerRevealAudio = new Audio(winnerRevealSound);
            winnerRevealAudio.play();
            confetti({
                particleCount: 300,
                spread: 150,
                origin: { y: 0.3 },
            });
            setResultVisible(true);
        }, SPINNNG_DURATION + 500);
    };
    return (
        <>
            <div className={styles.wheelContainer}>
                <div className={styles.arrow}></div>
                <div
                    style={{
                        cursor: entries.length < 2 ? "not-allowed" : "pointer",
                    }}
                    className={styles.wheel}
                    onClick={spinWheel}
                >
                    <svg
                        ref={wheelRef}
                        width={radius * 2}
                        height={radius * 2}
                        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
                    >
                        {entries.map((entry, i) => (
                            <Slice
                                key={i}
                                i={i}
                                angle={angle}
                                radius={radius}
                                center={center}
                                content={entry}
                                color={colors[i % colors.length] || "#000"}
                                slices={entries.length}
                            />
                        ))}
                    </svg>
                </div>
            </div>
            {resultVisible && (
                <Dialog index={winnerIndex} isVisible={setResultVisible} />
            )}
        </>
    );
}

type SliceProps = {
    i: number;
    angle: number;
    radius: number;
    center: number;
    content: string;
    color: string;
    slices: number;
};
function Slice({
    i,
    angle,
    radius,
    center,
    content,
    color,
    slices,
}: SliceProps) {
    const toRadians = (deg: number) => (deg * Math.PI) / 180;

    const startAngle = angle * i;
    const endAngle = startAngle + angle - 0.01;

    const x1 = center + radius * Math.cos(toRadians(startAngle));
    const y1 = center + radius * Math.sin(toRadians(startAngle));
    const x2 = center + radius * Math.cos(toRadians(endAngle));
    const y2 = center + radius * Math.sin(toRadians(endAngle));

    const largeArc = angle > 180 ? 1 : 0;
    const midAngle = toRadians(startAngle + angle / 2);

    const pathData = `
    M ${center},${center}
    L ${x1},${y1}
    A ${radius},${radius} 0 ${largeArc} 1 ${x2},${y2}
    Z
  `;

    const contentX = center + (radius / 1.7) * Math.cos(midAngle);
    const contentY = center + (radius / 1.7) * Math.sin(midAngle);

    let maxTextLength = 20;
    let imageHeight = 20;
    let textSize = 14;

    if (slices <= 2) {
        imageHeight = 85;
        textSize = 22;
        maxTextLength = 18;
    } else if (slices <= 10) {
        imageHeight = 70;
        textSize = 19;
        maxTextLength = 17;
    } else if (slices <= 20) {
        imageHeight = 42;
        textSize = 16;
    } else if (slices <= 30) {
        imageHeight = 30;
        textSize = 14;
    } else if (slices <= 40) {
        imageHeight = 20;
        textSize = 12;
        maxTextLength = 22;
    }

    return (
        <g>
            <path d={pathData} fill={color} />
            {!content.startsWith("data:image") ? (
                <text
                    x={contentX}
                    y={contentY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={textSize}
                    fill="white"
                    transform={`rotate(${
                        startAngle + angle / 2
                    }, ${contentX}, ${contentY})`}
                >
                    {content.length > maxTextLength
                        ? `${content.slice(0, maxTextLength)}...`
                        : content}
                </text>
            ) : (
                <image
                    href={content}
                    x={contentX - imageHeight / 2}
                    y={contentY - imageHeight / 2}
                    height={imageHeight}
                    preserveAspectRatio="xMidYMid meet"
                    transform={`rotate(${
                        startAngle + angle / 2
                    }, ${contentX}, ${contentY})`}
                />
            )}
        </g>
    );
}

function Dialog({
    index,
    isVisible,
}: {
    index: number;
    isVisible: (visible: boolean) => void;
}) {
    const {
        value: { entries, colors },
        dispatch,
    } = useEntries();

    const close = () => isVisible(false);

    const ref = useOutsideClick(close);

    const winner = entries[index];
    return (
        <div className={styles.overlay}>
            <div
                ref={ref}
                className={styles.dialog}
                style={{ border: `2px solid ${colors[index % colors.length]}` }}
            >
                <h2
                    style={{
                        color: colors[index % colors.length],
                    }}
                >
                    WE HAVE A WINNER!
                </h2>
                <div className={styles.winnerContainer}>
                    <span
                        className={styles.winnerColor}
                        style={{
                            backgroundColor: colors[index % colors.length],
                        }}
                    ></span>
                    {winner.startsWith("data:image") ? (
                        <img src={winner} alt="Winner" />
                    ) : (
                        <p>{winner}</p>
                    )}
                </div>
                <div className={styles.btnsContainer}>
                    <button className={styles.closeBtn} onClick={close}>
                        close
                    </button>
                    <button
                        className={styles.removeBtn}
                        onClick={() => {
                            dispatch({
                                type: "entries/deleted",
                                payload: index,
                            });
                            close();
                        }}
                    >
                        remove
                    </button>
                </div>
            </div>
        </div>
    );
}
