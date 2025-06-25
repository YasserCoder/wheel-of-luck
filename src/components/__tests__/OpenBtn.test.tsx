import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EntriesProvider } from "../EntriesProvider";
import { useEntries } from "../../context/entriesContext";
import { SavedEntriesProvider } from "../SavedEntriesProvider";
import OpenBtn from "../OpenBtn";
import { useSavedEntries } from "../../context/savedEntriesContext";

vi.mock("../../context/entriesContext");
vi.mock("../../context/savedEntriesContext");

const mockedUseEntries = vi.mocked(useEntries);
const mockedUseSavedEntries = vi.mocked(useSavedEntries);

mockedUseEntries.mockReturnValue({
    value: {
        entries: [],
        colors: [],
    },
    dispatch: vi.fn(),
});
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

describe("Modal", () => {
    it("should render the modal when the button clicked", () => {
        render(
            <EntriesProvider>
                <SavedEntriesProvider>
                    <OpenBtn />
                </SavedEntriesProvider>
            </EntriesProvider>
        );
        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        const modal = screen.getByTestId("modal");
        expect(modal).toBeInTheDocument();

        const openButton = within(modal).getByRole("button", { name: /Open/i });
        expect(openButton).toBeInTheDocument();
        const closeButton = screen.getByRole("button", { name: /close/i });
        expect(closeButton).toBeInTheDocument();

        fireEvent.click(window.document.body);
        expect(modal).not.toBeInTheDocument();
    });
});

describe("Saved Entries", () => {
    it("should display the saved entries", () => {
        render(
            <EntriesProvider>
                <SavedEntriesProvider>
                    <OpenBtn />
                </SavedEntriesProvider>
            </EntriesProvider>
        );
        fireEvent.click(screen.getByRole("button"));
        const savedEntriesList = screen.getByTestId(/saved-entries/i);
        expect(savedEntriesList).toBeInTheDocument();
        expect(savedEntriesList.childNodes).toHaveLength(3);

        expect(screen.getByText("Avengers")).toBeInTheDocument();
        expect(screen.getByText("Mugiwara Crew")).toBeInTheDocument();
        expect(screen.getByText("Justice League")).toBeInTheDocument();
    });
    it("should select and unselect saved entries", () => {
        render(
            <EntriesProvider>
                <SavedEntriesProvider>
                    <OpenBtn />
                </SavedEntriesProvider>
            </EntriesProvider>
        );
        fireEvent.click(screen.getByRole("button"));

        const modal = screen.getByTestId("modal");
        const openButton = within(modal).getByRole("button", { name: /Open/i });
        const avengersEntry = screen.getByTestId("Avengers");
        const mugiwaraEntry = screen.getByTestId("Mugiwara Crew");

        expect(openButton).toBeDisabled();
        fireEvent.click(avengersEntry);
        expect(openButton).toBeEnabled();

        fireEvent.click(modal);
        expect(openButton).toBeDisabled();

        fireEvent.click(mugiwaraEntry);
        expect(openButton).toBeEnabled();
    });
    it("should delete a saved entry", async () => {
        render(
            <EntriesProvider>
                <SavedEntriesProvider>
                    <OpenBtn />
                </SavedEntriesProvider>
            </EntriesProvider>
        );
        fireEvent.click(screen.getByRole("button"));

        const avengersEntry = screen.getByTestId("Avengers");
        const deleteButton = within(avengersEntry).getByRole("button");

        fireEvent.click(deleteButton);
        const confirmDelete = await screen.findByRole("button", {
            name: /Yes, delete it/i,
        });
        fireEvent.click(confirmDelete);

        expect(
            await mockedUseSavedEntries().setSavedEntries
        ).toHaveBeenCalledWith([
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
        ]);
    });
    it("should open a saved entry", () => {
        render(
            <EntriesProvider>
                <SavedEntriesProvider>
                    <OpenBtn />
                </SavedEntriesProvider>
            </EntriesProvider>
        );
        fireEvent.click(screen.getByRole("button"));

        const modal = screen.getByTestId("modal");
        const openButton = within(modal).getByRole("button", { name: /Open/i });
        const avengersEntry = screen.getByTestId("Avengers");

        fireEvent.click(avengersEntry);
        expect(openButton).toBeEnabled();

        fireEvent.click(openButton);

        expect(mockedUseEntries().dispatch).toHaveBeenCalledWith({
            type: "config/set",
            payload: {
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
            },
        });

        expect(mockedUseEntries().dispatch).toHaveBeenCalledWith({
            type: "config/set",
            payload: {
                entries: [
                    "iron man",
                    "thor",
                    "hulk",
                    "captain america",
                    "hawkeye",
                    "black widow",
                    "spiderman",
                ],
                colors: ["red", "black", "#900C3F", "#581845"],
            },
        });
        expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
        expect(screen.queryByText("Uploaded!")).toBeInTheDocument();
    });
});
