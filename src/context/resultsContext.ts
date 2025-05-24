import { createContext, useContext } from "react";
import { ResultsContextType } from "../components/ResultsProvider";

export const ResultsContext = createContext<ResultsContextType | undefined>(
    undefined
);

export function useResults() {
    const context = useContext(ResultsContext);
    if (context === undefined) {
        throw new Error("useResults must be used within an ResultsProvider");
    }
    return context;
}
