import { LuSave } from "react-icons/lu";
import MenuItem from "./MenuItem";
import { useLocalStorageState } from "../hook/useLocalStorageState";
import { useEntries } from "../context/entriesContext";
import Swal from "sweetalert2";

type SavedEntry = { title: string; entries: string[]; colors: string[] };
export default function SaveBtn() {
    const [savedEntries, setSavedEntries] = useLocalStorageState<SavedEntry[]>(
        [],
        "savedEntries"
    );
    const { value } = useEntries();
    async function handleSave() {
        const { value: title } = await Swal.fire({
            title: "Enter a title for your entries",
            input: "text",
            inputLabel: "Your title",
            showCancelButton: true,
            confirmButtonText: "Save",
            cancelButtonText: "Cancel",
            confirmButtonColor: "var(--color-violet)",
            background: "var(--color-bkg)",
            color: "var(--color-body)",
            inputValidator: (value) => {
                if (!value) {
                    return "You need to write something!";
                }
                if (savedEntries.some((entry) => entry.title === value)) {
                    return "This title already exists!";
                }
            },
        });
        if (title) {
            setSavedEntries([...savedEntries, { title, ...value }]);
            Swal.fire({
                title: "Saved!",
                text: "Your data has been saved.",
                icon: "success",
            });
        }
    }
    return (
        <MenuItem value="Save" handleClick={handleSave}>
            <LuSave />
        </MenuItem>
    );
}
