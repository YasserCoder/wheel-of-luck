import { useLocalStorageState } from "../hook/useLocalStorageState";
import { SavedEntriesContext } from "../context/savedEntriesContext";

type SavedEntries = {
    title: string;
    entries: string[];
    colors: string[];
};
export type SavedEntriesContextType = {
    savedEntries: SavedEntries[];
    setSavedEntries: (value: SavedEntries[]) => void;
};

export const SavedEntriesProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [savedEntries, setSavedEntries] = useLocalStorageState<
        SavedEntries[]
    >([], "savedEntries");

    return (
        <SavedEntriesContext.Provider value={{ savedEntries, setSavedEntries }}>
            {children}
        </SavedEntriesContext.Provider>
    );
};
