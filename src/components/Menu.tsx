import NewBtn from "./NewBtn";
import SaveBtn from "./SaveBtn";
import OpenBtn from "./OpenBtn";
import CustomizeBtn from "./CustomizeBtn";
import { SavedEntriesProvider } from "./SavedEntriesProvider";

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
            <NewBtn />
            <SavedEntriesProvider>
                <SaveBtn />
                <OpenBtn />
            </SavedEntriesProvider>
            <CustomizeBtn />
        </aside>
    );
}
