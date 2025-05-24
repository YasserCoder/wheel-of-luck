import { useState } from "react";

import OperationBtns from "./OperationBtns";
import DisplayIO from "./DisplayIO";

import { sortArray } from "../utils/helpers";
import { FaX } from "react-icons/fa6";
import styles from "./styles/results.module.css";

export default function Results() {
    const [results, setResults] = useState<string[]>([
        "result 2",
        "result 3",
        "result 4",
    ]);
    function deleteWinner(id: number) {
        const newResults = [...results];
        newResults.splice(id, 1);
        setResults(newResults);
    }
    return (
        <>
            <OperationBtns
                handleClick={() => {
                    setResults([]);
                }}
                handleSort={() => {
                    setResults((prev) => {
                        return sortArray([...prev]);
                    });
                }}
            >
                <FaX />
                <span>Clear the list</span>
            </OperationBtns>
            <div className={styles.results}>
                {results.map((winner, i) => (
                    <DisplayIO
                        key={i}
                        io={winner}
                        handleDelete={() => deleteWinner(i)}
                    >
                        <span className={styles.winnerTimes}>( 1 )</span>
                    </DisplayIO>
                ))}
            </div>
        </>
    );
}
