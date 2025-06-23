import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EntriesProvider } from "../EntriesProvider";
import CustomizeBtn from "../CustomizeBtn";
import { useEntries } from "../../context/entriesContext";

vi.mock("../../data/colors.json", () => ({
    default: {
        Default: ["red", "green", "blue"],
        Secondary: ["yellow", "cyan", "magenta"],
        Seasonal: ["orange", "purple", "pink", "brown", "gray"],
    },
}));

vi.mock("../../context/entriesContext");
const mockedUseEntries = vi.mocked(useEntries);

mockedUseEntries.mockReturnValue({
    value: {
        entries: [],
        colors: ["red", "green", "blue"],
    },
    dispatch: vi.fn(),
});

describe("Modal", () => {
    it("should render the modal when the button clicked", () => {
        render(
            <EntriesProvider>
                <CustomizeBtn />
            </EntriesProvider>
        );
        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        const modal = screen.getByRole("heading", { name: /appearance/i });
        expect(modal).toBeInTheDocument();

        fireEvent.click(window.document.body);
        expect(modal).not.toBeInTheDocument();
    });
});

describe("Themes", () => {
    it("should display the correct themes", () => {
        render(
            <EntriesProvider>
                <CustomizeBtn />
            </EntriesProvider>
        );
        fireEvent.click(screen.getByRole("button"));
        const themeList = screen.getByTestId(/themes/i);
        expect(themeList).toBeInTheDocument();
        expect(themeList.childNodes).toHaveLength(3);

        const defaultTheme = screen.getByTestId("Default");
        expect(defaultTheme).toBeInTheDocument();

        const secondaryTheme = screen.getByTestId("Secondary");
        expect(secondaryTheme).toBeInTheDocument();
    });
    it("should select and unselect themes", () => {
        render(
            <EntriesProvider>
                <CustomizeBtn />
            </EntriesProvider>
        );
        fireEvent.click(screen.getByRole("button"));
        const defaultTheme = screen.getByTestId("Default");
        const secondaryTheme = screen.getByTestId("Secondary");
        const applyBtn = screen.getByRole("button", { name: /apply/i });
        expect(applyBtn).toBeDisabled();

        fireEvent.click(defaultTheme);
        expect(applyBtn).toBeEnabled();

        fireEvent.click(screen.getByTestId("modal"));
        expect(applyBtn).toBeDisabled();

        fireEvent.click(secondaryTheme);
        expect(applyBtn).toBeEnabled();
    });
});

describe("Colors", () => {
    it("should display the right colors", () => {
        render(
            <EntriesProvider>
                <CustomizeBtn />
            </EntriesProvider>
        );
        fireEvent.click(screen.getByRole("button"));
        const inputNumber = screen.getByRole("spinbutton");
        expect(inputNumber).toHaveValue(3);

        const colors = screen.getByRole("list");
        expect(colors.childNodes).toHaveLength(3);

        expect(
            within(colors.childNodes[0] as HTMLElement)
                .getByRole("button")
                .getAttribute("style")
        ).toContain("background-color: red;");
        expect(
            within(colors.childNodes[2] as HTMLElement)
                .getByRole("button")
                .getAttribute("style")
        ).toContain("background-color: blue;");
    });
    it("should add and remove colors", () => {
        render(
            <EntriesProvider>
                <CustomizeBtn />
            </EntriesProvider>
        );
        fireEvent.click(screen.getByRole("button"));
        const inputNumber = screen.getByRole("spinbutton");
        const colors = screen.getByRole("list");

        fireEvent.change(inputNumber, { target: { value: 4 } });
        expect(colors.childNodes).toHaveLength(4);

        fireEvent.change(inputNumber, { target: { value: 2 } });
        expect(colors.childNodes).toHaveLength(2);
    });
    it("should change the color when the color picker changes", () => {
        render(
            <EntriesProvider>
                <CustomizeBtn />
            </EntriesProvider>
        );
        fireEvent.click(screen.getByRole("button"));
        const colors = screen.getByRole("list");
        const button = within(colors.childNodes[0] as HTMLElement).getByRole(
            "button"
        );
        const input = within(colors.childNodes[0] as HTMLElement).getByTestId(
            "color-picker"
        );

        fireEvent.change(input, { target: { value: "#00ff00" } });
        expect(button.getAttribute("style")).toContain(
            "background-color: rgb(0, 255, 0);"
        );
    });
});

describe("Customize Colors", () => {
    it("should enable the save button the colors changes", () => {
        render(
            <EntriesProvider>
                <CustomizeBtn />
            </EntriesProvider>
        );
        fireEvent.click(screen.getByRole("button"));
        const button = screen.getByRole("button", { name: /save/i });
        expect(button).toBeDisabled();

        const spinBtn = screen.getByRole("spinbutton");

        fireEvent.change(spinBtn, { target: { value: 5 } });
        expect(button).toBeEnabled();
    });
    it("should apply the selected theme", () => {
        render(
            <EntriesProvider>
                <CustomizeBtn />
            </EntriesProvider>
        );
        fireEvent.click(screen.getByRole("button"));
        const seasonalTheme = screen.getByTestId("Seasonal");
        const spinBtn = screen.getByRole("spinbutton");
        const applyBtn = screen.getByRole("button", { name: /apply/i });

        expect(spinBtn).toHaveValue(3);

        fireEvent.click(seasonalTheme);
        fireEvent.click(applyBtn);

        expect(spinBtn).toHaveValue(5);
    });
    it("should call the dispatch function when saved", () => {
        const mockDispatch = vi.fn();
        mockedUseEntries.mockReturnValue({
            value: {
                entries: [],
                colors: ["red", "green", "blue"],
            },
            dispatch: mockDispatch,
        });
        render(
            <EntriesProvider>
                <CustomizeBtn />
            </EntriesProvider>
        );
        fireEvent.click(screen.getByRole("button"));
        const secondaryTheme = screen.getByTestId("Secondary");
        const saveBtn = screen.getByRole("button", { name: /save/i });
        const applyBtn = screen.getByRole("button", { name: /apply/i });

        fireEvent.click(secondaryTheme);
        fireEvent.click(applyBtn);
        fireEvent.click(saveBtn);

        expect(mockDispatch).toHaveBeenCalledWith({
            type: "colors/set",
            payload: ["yellow", "cyan", "magenta"],
        });
    });
});
