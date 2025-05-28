import { LuFolderOpen } from "react-icons/lu";
import MenuItem from "./MenuItem";

export default function OpenBtn() {
    return (
        <MenuItem value="Open" handleClick={() => console.log("Open clicked")}>
            <LuFolderOpen />
        </MenuItem>
    );
}
