import { LuSave } from "react-icons/lu";
import MenuItem from "./MenuItem";

export default function SaveBtn() {
    return (
        <MenuItem value="Save" handleClick={() => console.log("Save clicked")}>
            <LuSave />
        </MenuItem>
    );
}
