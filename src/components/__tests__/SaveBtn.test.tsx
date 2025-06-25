import { vi, it, describe, expect, afterEach, beforeEach } from "vitest";
import { useEntries } from "../../context/entriesContext";
import { useSavedEntries } from "../../context/savedEntriesContext";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { EntriesProvider } from "../EntriesProvider";
import { SavedEntriesProvider } from "../SavedEntriesProvider";
import SaveBtn from "../SaveBtn";
import Swal from "sweetalert2";

vi.mock("../../context/entriesContext");
vi.mock("../../context/savedEntriesContext");

const mockedUseEntries = vi.mocked(useEntries);
const mockedUseSavedEntries = vi.mocked(useSavedEntries);

afterEach(() => {
    cleanup();
    Swal.close();
    vi.clearAllMocks();
});
beforeEach(() => {
    mockedUseSavedEntries.mockReturnValue({
        savedEntries: [
            {
                colors: ["red", "black", "#900C3F", "#581845"],
                entries: [
                    "iron man",
                    "thor",
                    "hulk",
                    "captain america",
                    "hawkeye",
                    "black widow",
                    "spiderman",
                ],
                title: "Avengers",
            },
            {
                colors: ["yellow", "orange", "pink", "purple"],
                entries: [
                    "luffy",
                    "zoro",
                    "sanji",
                    "jinbe",
                    "nami",
                    "chopper",
                    "ussop",
                    "robin",
                    "franky",
                    "brook",
                ],
                title: "Mugiwara Crew",
            },
            {
                colors: ["#FF5733", "#C70039", "#900C3F", "#581845"],
                entries: [
                    "batman",
                    "superman",
                    "wonder woman",
                    "flash",
                    "green lantern",
                ],
                title: "Justice League",
            },
        ],
        setSavedEntries: vi.fn(),
    });
    mockedUseEntries.mockReturnValue({
        value: {
            entries: [
                "chelsea",
                "spurs",
                "liverpool",
                "arsenal",
                "manchester city",
                "manchester united",
            ],
            colors: ["blue", "red", "green", "yellow", "purple", "orange"],
        },
        dispatch: vi.fn(),
    });
});

describe("SaveBtn", () => {
    it("should disable the save btn if the number of entries <2", () => {
        mockedUseEntries.mockReturnValue({
            value: {
                entries: ["chelsea"],
                colors: ["blue", "red", "green"],
            },
            dispatch: vi.fn(),
        });
        render(
            <EntriesProvider>
                <SavedEntriesProvider>
                    <SaveBtn />
                </SavedEntriesProvider>
            </EntriesProvider>
        );
        const saveBtn = screen.getByRole("button");
        expect(saveBtn).toBeDisabled();
        expect(
            screen.queryByText("Enter a title for your entries")
        ).not.toBeInTheDocument();
    });
    it("should display the enter title popup", async () => {
        render(
            <EntriesProvider>
                <SavedEntriesProvider>
                    <SaveBtn />
                </SavedEntriesProvider>
            </EntriesProvider>
        );
        expect(
            screen.queryByText("Enter a title for your entries")
        ).not.toBeInTheDocument();
        const saveBtn = screen.getByRole("button");
        expect(saveBtn).toBeInTheDocument();

        fireEvent.click(saveBtn);

        const titleInput = await screen.findByRole("textbox");
        expect(titleInput).toBeInTheDocument();
        expect(
            await screen.findByText("Enter a title for your entries")
        ).toBeInTheDocument();
    });
});

describe("Save Entries", () => {
    it("should save the entries with a title", async () => {
        render(
            <EntriesProvider>
                <SavedEntriesProvider>
                    <SaveBtn />
                </SavedEntriesProvider>
            </EntriesProvider>
        );
        const saveBtn = screen.getByRole("button");
        fireEvent.click(saveBtn);

        const titleInput = await screen.findByRole("textbox");
        fireEvent.change(titleInput, { target: { value: "PL TOP 6 CLUBS" } });

        const confirmButtons = await screen.findByRole("button", {
            name: "Save",
        });

        fireEvent.click(confirmButtons);

        expect(await screen.findByText("Saved!")).toBeInTheDocument();
        expect(mockedUseSavedEntries().setSavedEntries).toHaveBeenCalledWith([
            ...mockedUseSavedEntries().savedEntries,
            {
                title: "PL TOP 6 CLUBS",
                entries: mockedUseEntries().value.entries,
                colors: mockedUseEntries().value.colors,
            },
        ]);
    });

    it("should show an error if the title already exists", async () => {
        render(
            <EntriesProvider>
                <SavedEntriesProvider>
                    <SaveBtn />
                </SavedEntriesProvider>
            </EntriesProvider>
        );
        const saveBtn = screen.getByRole("button");
        fireEvent.click(saveBtn);

        const titleInput = screen.getByRole("textbox");
        fireEvent.change(titleInput, { target: { value: "Avengers" } });

        const confirmButton = screen.getByRole("button", { name: "Save" });
        fireEvent.click(confirmButton);

        expect(
            await screen.findByText("This title already exists!")
        ).toBeInTheDocument();
    });
    it("should show an error if the title is empty", async () => {
        render(
            <EntriesProvider>
                <SavedEntriesProvider>
                    <SaveBtn />
                </SavedEntriesProvider>
            </EntriesProvider>
        );
        const saveBtn = screen.getByRole("button");
        fireEvent.click(saveBtn);

        const titleInput = screen.getByRole("textbox");
        fireEvent.change(titleInput, { target: { value: "" } });

        const confirmButton = screen.getByRole("button", { name: "Save" });
        fireEvent.click(confirmButton);

        expect(
            await screen.findByText("You need to write something!")
        ).toBeInTheDocument();
    });
});
