import { createContext, useContext, useReducer } from "react";
import { useLocalStorageState } from "../hook/useLocalStorageState";
import entries from "../data/entries.json";
import colors from "../data/colors.json";

export type Entry = string | File;

type EntriesState = {
    entries: Entry[];
    colors: string[];
};

type Action =
    | { type: "entries/added"; payload: Entry }
    | { type: "entries/deleted"; payload: number }
    | { type: "entries/set"; payload: Entry[] }
    | { type: "colors/set"; payload: string[] };

type EntriesContextType = {
    value: EntriesState;
    dispatch: React.Dispatch<Action>;
};

const EntriesContext = createContext<EntriesContextType | undefined>(undefined);

const entriesReducer = (state: EntriesState, action: Action): EntriesState => {
    switch (action.type) {
        case "entries/added":
            return { ...state, entries: [...state.entries, action.payload] };
        case "entries/deleted":
            return {
                ...state,
                entries: state.entries.filter((_, i) => i !== action.payload),
            };
        case "entries/set":
            return { ...state, entries: action.payload };
        case "colors/set":
            return { ...state, colors: action.payload };
        default:
            return state;
    }
};

// --- Provider ---
export const EntriesProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [storedEntries, setStoredEntries] =
        useLocalStorageState<EntriesState>(
            { entries: entries[0], colors: colors[0] },
            "entries"
        );
    const [state, dispatchBase] = useReducer(entriesReducer, storedEntries);

    // Sync reducer changes to localStorage
    const dispatch: typeof dispatchBase = (action) => {
        const newState = entriesReducer(state, action);
        setStoredEntries(newState);
        dispatchBase(action);
    };

    return (
        <EntriesContext.Provider value={{ value: state, dispatch }}>
            {children}
        </EntriesContext.Provider>
    );
};

// --- Hook ---
export function useEntries() {
    const context = useContext(EntriesContext);
    if (context === undefined) {
        throw new Error("useEntries must be used within an EntriesProvider");
    }
    return context;
}
