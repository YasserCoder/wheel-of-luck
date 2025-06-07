import { useRef, useState } from "react";
import confetti from "canvas-confetti";
import { useResults } from "../context/resultsContext";
import { useEntries } from "../context/entriesContext";
import { EXTRA_SPINS, SPINNNG_DURATION } from "../utils/constants";

import spiningSound from "../assets/spining sound.mp3";
import winnerRevealSound from "../assets/result-ding.mp3";

export function useSpin(
    angle: number,
    setResultVisible: (visible: boolean) => void
) {
    const { results, dispatch } = useResults();
    const {
        value: { entries },
    } = useEntries();
    const [spinning, setSpinning] = useState(false);
    const wheelRef = useRef<SVGSVGElement>(null);
    const [currentRotation, setCurrentRotation] = useState(0);
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
    return {
        wheelRef,
        spinWheel,
        winnerIndex,
    };
}
