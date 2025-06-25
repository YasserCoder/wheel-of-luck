import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi, describe } from "vitest";
import NewBtn from "../NewBtn";
import { EntriesProvider } from "../EntriesProvider";
import { useEntries } from "../../context/entriesContext";

vi.mock("../../data/colors.json", () => ({
    default: {
        Default: ["red", "green", "blue"],
        Secondary: ["yellow", "cyan", "magenta"],
        Seasonal: ["orange", "purple", "pink", "brown", "gray"],
    },
}));
vi.mock("../../data/entries.json", () => ({
    default: [
        [
            "chelsea",
            "real madrid",
            "barcelona",
            "arsenal",
            "manchester city",
            "manchester united",
        ],
        ["luffy", "zoro", "nami", "usopp", "sanji", "robin"],
    ],
}));

vi.mock("../../context/entriesContext");
const mockedUseEntries = vi.mocked(useEntries);

mockedUseEntries.mockReturnValue({
    value: {
        entries: [],
        colors: [],
    },
    dispatch: vi.fn(),
});

const newState = {
    entries: [
        "chelsea",
        "real madrid",
        "barcelona",
        "arsenal",
        "manchester city",
        "manchester united",
    ],
    colors: ["red", "green", "blue"],
};
describe("NewBtn", () => {
    it("should reset the entries when clicked", () => {
        render(
            <EntriesProvider>
                <NewBtn />
            </EntriesProvider>
        );
        const button = screen.getByRole("button", { name: /new/i });
        fireEvent.click(button);
        expect(mockedUseEntries().dispatch).toHaveBeenCalledWith({
            type: "config/set",
            payload: newState,
        });
    });
});
