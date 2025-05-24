import { createContext, useContext } from "react";
import { EntriesContextType } from "../components/EntriesProvider";

export const EntriesContext = createContext<EntriesContextType | undefined>(
    undefined
);

export function useEntries() {
    const context = useContext(EntriesContext);
    if (context === undefined) {
        throw new Error("useEntries must be used within an EntriesProvider");
    }
    return context;
}
