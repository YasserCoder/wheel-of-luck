import { useReducer } from "react";
import { useLocalStorageState } from "../hook/useLocalStorageState";
import { EntriesContext } from "../context/entriesContext";
import entries from "../data/entries.json";
import colors from "../data/colors.json";

type EntriesState = {
    entries: string[];
    colors: string[];
};

type Action =
    | { type: "entries/added"; payload: string }
    | { type: "entries/deleted"; payload: number }
    | { type: "entries/set"; payload: string[] }
    | { type: "colors/set"; payload: string[] }
    | { type: "config/set"; payload: EntriesState };

export type EntriesContextType = {
    value: EntriesState;
    dispatch: React.Dispatch<Action>;
};

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
        case "config/set":
            return action.payload;
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
            "configEntries"
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
