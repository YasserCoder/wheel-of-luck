import MenuItem from "./MenuItem";
import { LuBadgePlus, LuFolderOpen, LuSave } from "react-icons/lu";
import { MdOutlineColorLens } from "react-icons/md";

export default function Menu() {
    return (
        <aside
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
            }}
        >
            <MenuItem
                value="New"
                handleClick={() => console.log("New clicked")}
            >
                <LuBadgePlus />
            </MenuItem>
            <MenuItem
                value="Save"
                handleClick={() => console.log("Save clicked")}
            >
                <LuSave />
            </MenuItem>
            <MenuItem
                value="Open"
                handleClick={() => console.log("Open clicked")}
            >
                <LuFolderOpen />
            </MenuItem>
            <MenuItem
                value="Customize"
                handleClick={() => console.log("Customize clicked")}
            >
                <MdOutlineColorLens />
            </MenuItem>
        </aside>
    );
}
