import { fireEvent, render, screen, within } from "@testing-library/react";
import { vi, describe, expect, it } from "vitest";
import { useEntries } from "../../context/entriesContext";
import { EntriesProvider } from "../EntriesProvider";
import Entries from "../Entries";

vi.mock("../../context/entriesContext");
const mockedUseEntries = vi.mocked(useEntries);

mockedUseEntries.mockReturnValue({
    value: {
        entries: [
            "chelsea",
            "real madrid",
            "barcelona",
            "arsenal",
            "manchester city",
            "manchester united",
        ],
        colors: ["red", "green", "blue"],
    },
    dispatch: vi.fn(),
});

describe("Entries", () => {
    it("should render correctly", () => {
        render(
            <EntriesProvider>
                <Entries />
            </EntriesProvider>
        );
        const shuffleBtn = screen.getByRole("button", { name: /shuffle/i });
        expect(shuffleBtn).toBeInTheDocument();
        const sortBtn = screen.getByRole("button", { name: /sort/i });
        expect(sortBtn).toBeInTheDocument();

        const ioList = screen.getByRole("list");
        expect(ioList).toBeInTheDocument();
        expect(ioList.childNodes).toHaveLength(6);

        expect(screen.getByText("chelsea")).toBeInTheDocument();
        expect(screen.getByText("real madrid")).toBeInTheDocument();
        expect(screen.getByText("barcelona")).toBeInTheDocument();

        expect(screen.getByPlaceholderText(/add entry/i)).toBeInTheDocument();
        expect(screen.getByTestId("add-btn")).toBeInTheDocument();
        expect(screen.getByTestId("img-upload")).toBeInTheDocument();
    });
    it("should delete an entry when delete button is clicked", () => {
        render(
            <EntriesProvider>
                <Entries />
            </EntriesProvider>
        );
        const deleteBtn = within(screen.getByTestId("entry-arsenal")).getByRole(
            "button"
        );

        fireEvent.click(deleteBtn);
        expect(mockedUseEntries().dispatch).toHaveBeenCalledWith({
            type: "entries/deleted",
            payload: 3,
        });
    });
});

describe("OperationBtns", () => {
    it("should sort entries when sort button is clicked", () => {
        render(
            <EntriesProvider>
                <Entries />
            </EntriesProvider>
        );
        const sortBtn = screen.getByRole("button", { name: /sort/i });

        fireEvent.click(sortBtn);
        expect(mockedUseEntries().dispatch).toHaveBeenCalledWith({
            type: "entries/set",
            payload: [
                "arsenal",
                "barcelona",
                "chelsea",
                "manchester city",
                "manchester united",
                "real madrid",
            ],
        });
    });
    it("should shuffle entries when shuffle button is clicked", () => {
        render(
            <EntriesProvider>
                <Entries />
            </EntriesProvider>
        );
        const shuffleBtn = screen.getByRole("button", { name: /shuffle/i });

        fireEvent.click(shuffleBtn);
        expect(mockedUseEntries().dispatch).toHaveBeenCalledWith({
            type: "entries/set",
            payload: expect.arrayContaining([
                "chelsea",
                "real madrid",
                "barcelona",
                "arsenal",
                "manchester city",
                "manchester united",
            ]),
        });
    });
});

describe("Add Entry", () => {
    it("should add a new entry when the add button is clicked", () => {
        render(
            <EntriesProvider>
                <Entries />
            </EntriesProvider>
        );
        const input = screen.getByPlaceholderText(/add entry/i);
        const addBtn = screen.getByTestId("add-btn");

        fireEvent.change(input, { target: { value: "new team" } });
        fireEvent.click(addBtn);

        expect(mockedUseEntries().dispatch).toHaveBeenCalledWith({
            type: "entries/added",
            payload: "new team",
        });
    });
    it("should not add an entry if the input is empty", () => {
        render(
            <EntriesProvider>
                <Entries />
            </EntriesProvider>
        );
        const addBtn = screen.getByTestId("add-btn");

        fireEvent.click(addBtn);
        expect(mockedUseEntries().dispatch).not.toHaveBeenCalled();
    });
    it("should trigger an alert if the entry is already present", () => {
        render(
            <EntriesProvider>
                <Entries />
            </EntriesProvider>
        );
        const input = screen.getByPlaceholderText(/add entry/i);
        const addBtn = screen.getByTestId("add-btn");

        fireEvent.change(input, { target: { value: "chelsea" } });
        fireEvent.click(addBtn);

        expect(mockedUseEntries().dispatch).not.toHaveBeenCalled();
        expect(
            screen.getByText(/The entry already exists/i)
        ).toBeInTheDocument();
    });
    it("should not allow adding more than the maximum number of entries", () => {
        const entries = Array.from({ length: 40 }, (_, i) => `team ${i}`);
        mockedUseEntries.mockReturnValue({
            value: {
                entries,
                colors: ["red", "green", "blue"],
            },
            dispatch: vi.fn(),
        });
        render(
            <EntriesProvider>
                <Entries />
            </EntriesProvider>
        );
        const input = screen.getByPlaceholderText(/add entry/i);
        const addBtn = screen.getByTestId("add-btn");
        const imgUpload = screen.getByTestId("img-upload");
        const maxEntriesAlert = screen.getByRole("paragraph");

        expect(maxEntriesAlert).toHaveTextContent(
            "**You have reached the maximum number of entries (40)"
        );
        expect(addBtn).toBeDisabled();
        expect(imgUpload).toBeDisabled();
        expect(input).toBeDisabled();
    });
});
