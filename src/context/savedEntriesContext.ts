import { createContext, useContext } from "react";
import { SavedEntriesContextType } from "../components/SavedEntriesProvider";

export const SavedEntriesContext = createContext<
    SavedEntriesContextType | undefined
>(undefined);

export function useSavedEntries() {
    const context = useContext(SavedEntriesContext);
    if (context === undefined) {
        throw new Error(
            "useSavedEntries must be used within an SavedEntriesProvider"
        );
    }
    return context;
}
