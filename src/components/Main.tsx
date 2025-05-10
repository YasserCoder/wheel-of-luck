import Menu from "./Menu";
import ToggleSwitch from "./ToggleSwitch";

export default function Main() {
    return (
        <main style={{ height: "80vh", position: "relative" }}>
            <Menu />
            <ToggleSwitch />
        </main>
    );
}
