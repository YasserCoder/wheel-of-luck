import { useEntries } from "../context/entriesContext";
import MenuItem from "./MenuItem";
import entries from "../data/entries.json";
import colors from "../data/colors.json";
import { LuBadgePlus } from "react-icons/lu";

export default function NewBtn() {
    const { dispatch } = useEntries();
    function handleNewClick() {
        const newState = {
            entries: entries[0],
            colors: colors[0],
        };
        dispatch({ type: "config/set", payload: newState });
    }

    return (
        <MenuItem value="New" handleClick={handleNewClick}>
            <LuBadgePlus />
        </MenuItem>
    );
}
