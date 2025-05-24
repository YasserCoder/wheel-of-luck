import OperationBtns from "./OperationBtns";
import DisplayIO from "./DisplayIO";
import { useResults } from "../context/resultsContext";
import { sortWinners } from "../utils/helpers";

import { FaX } from "react-icons/fa6";
import styles from "./styles/results.module.css";

export default function Results() {
    const { results, dispatch } = useResults();
    function deleteWinner(id: number) {
        dispatch({ type: "results/deleted", payload: id });
    }
    return (
        <>
            <OperationBtns
                handleClick={() => {
                    dispatch({ type: "results/set", payload: [] });
                }}
                handleSort={() => {
                    dispatch({
                        type: "results/set",
                        payload: sortWinners([...results]),
                    });
                }}
            >
                <FaX />
                <span>Clear the list</span>
            </OperationBtns>
            <div className={styles.results}>
                {results.map((result, i) => (
                    <DisplayIO
                        key={i}
                        io={result.winner}
                        handleDelete={() => deleteWinner(i)}
                    >
                        <span className={styles.winnerTimes}>
                            ( {result.winNumber} )
                        </span>
                    </DisplayIO>
                ))}
            </div>
        </>
    );
}
