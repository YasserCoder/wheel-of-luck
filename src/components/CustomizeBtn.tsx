import MenuItem from "./MenuItem";
import { MdOutlineColorLens } from "react-icons/md";

export default function CustomizeBtn() {
    return (
        <MenuItem
            value="Customize"
            handleClick={() => console.log("Customize clicked")}
        >
            <MdOutlineColorLens />
        </MenuItem>
    );
}
