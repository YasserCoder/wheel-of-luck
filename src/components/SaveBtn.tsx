import Swal from "sweetalert2";
import MenuItem from "./MenuItem";
import { useEntries } from "../context/entriesContext";
import { useSavedEntries } from "../context/savedEntriesContext";

import { LuSave } from "react-icons/lu";

export default function SaveBtn() {
    const { savedEntries, setSavedEntries } = useSavedEntries();
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
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }
    return (
        <MenuItem
            disabled={value.entries.length < 2}
            value="Save"
            handleClick={handleSave}
        >
            <LuSave />
        </MenuItem>
    );
}
