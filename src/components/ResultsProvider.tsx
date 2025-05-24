import { useReducer } from "react";
import { ResultsContext } from "../context/resultsContext";

type Winners = {
    winner: string;
    winNumber: number;
};

type ResultsState = Winners[];

type Action =
    | { type: "results/added"; payload: string }
    | { type: "results/deleted"; payload: number }
    | { type: "results/set"; payload: ResultsState }
    | { type: "results/increment"; payload: number };

export type ResultsContextType = {
    results: ResultsState;
    dispatch: React.Dispatch<Action>;
};

const resultsReducer = (state: ResultsState, action: Action): ResultsState => {
    switch (action.type) {
        case "results/added":
            return [...state, { winner: action.payload, winNumber: 1 }];
        case "results/deleted":
            return state.filter((_, i) => i !== action.payload);
        case "results/set":
            return action.payload;
        case "results/increment":
            return state.map((result, index) => {
                if (action.payload === index) {
                    return { ...result, winNumber: result.winNumber + 1 };
                }
                return result;
            });
        default:
            return state;
    }
};

// --- Provider ---
export const ResultsProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [state, dispatch] = useReducer(resultsReducer, [
        { winner: "chelsea", winNumber: 1 },
        { winner: "arsenal", winNumber: 2 },
    ]);

    return (
        <ResultsContext.Provider value={{ results: state, dispatch }}>
            {children}
        </ResultsContext.Provider>
    );
};
