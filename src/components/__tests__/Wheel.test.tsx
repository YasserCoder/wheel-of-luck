vi.mock("canvas-confetti", () => {
    return {
        default: vi.fn(() => Promise.resolve()),
    };
});
vi.mock("../../utils/constants", async () => {
    const actual = await vi.importActual<
        typeof import("../../utils/constants")
    >("../../utils/constants");
    return {
        ...actual,
        SPINNNG_DURATION: 200,
    };
});
import { fireEvent, render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useEntries } from "../../context/entriesContext";
import { useResults } from "../../context/resultsContext";
import { EntriesProvider } from "../EntriesProvider";
import { ResultsProvider } from "../ResultsProvider";
import Wheel from "../Wheel";
import { SPINNNG_DURATION } from "../../utils/constants";

vi.mock("../../context/entriesContext");
vi.mock("../../context/resultsContext");
const mockedUseEntries = vi.mocked(useEntries);
const mockedUseResults = vi.mocked(useResults);

beforeEach(() => {
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

    mockedUseResults.mockReturnValue({
        results: [
            { winner: "chelsea", winNumber: 3 },
            { winner: "real madrid", winNumber: 5 },
            { winner: "barcelona", winNumber: 2 },
        ],
        dispatch: vi.fn(),
    });
});

describe("Wheel", () => {
    it("should render without crashing", () => {
        render(
            <EntriesProvider>
                <ResultsProvider>
                    <Wheel />
                </ResultsProvider>
            </EntriesProvider>
        );
        expect(screen.getByTestId("wheel")).toBeInTheDocument();
    });

    it("should render correct number of slices", () => {
        render(
            <EntriesProvider>
                <ResultsProvider>
                    <Wheel />
                </ResultsProvider>
            </EntriesProvider>
        );

        const svg = screen.getByTestId("wheel").querySelector("svg");
        expect(svg?.querySelectorAll("path").length).toBe(6);
    });

    it("should not spin if less than 2 entries", () => {
        mockedUseEntries.mockReturnValueOnce({
            value: {
                entries: ["chelsea"],
                colors: ["red"],
            },
            dispatch: vi.fn(),
        });
        render(
            <EntriesProvider>
                <ResultsProvider>
                    <Wheel />
                </ResultsProvider>
            </EntriesProvider>
        );
        const wheel = screen.getByTestId("wheel");
        fireEvent.click(wheel);

        expect(screen.queryByText(/we have a winner/i)).not.toBeInTheDocument();
    });

    it("should call spinWheel when wheel is clicked", async () => {
        render(
            <EntriesProvider>
                <ResultsProvider>
                    <Wheel />
                </ResultsProvider>
            </EntriesProvider>
        );
        const wheel = screen.getByTestId("wheel");

        fireEvent.click(wheel);
        const dialog = await screen.findByText(
            /we have a winner/i,
            {},
            { timeout: SPINNNG_DURATION + 600 }
        );

        expect(dialog).toBeInTheDocument();
        expect(mockedUseResults().dispatch).toHaveBeenCalled();
    });

    it("should update radius on window resize", () => {
        render(
            <EntriesProvider>
                <ResultsProvider>
                    <Wheel />
                </ResultsProvider>
            </EntriesProvider>
        );

        act(() => {
            window.innerWidth = 350;
            window.dispatchEvent(new Event("resize"));
        });

        const svg = screen.getByTestId("wheel").querySelector("svg");
        expect(svg).toHaveAttribute("width", "200"); // 100*2
        expect(svg).toHaveAttribute("height", "200");
    });

    it("should remove winner entry when remove button is clicked", async () => {
        render(
            <EntriesProvider>
                <ResultsProvider>
                    <Wheel />
                </ResultsProvider>
            </EntriesProvider>
        );
        const wheel = screen.getByTestId("wheel");

        fireEvent.click(wheel);

        const removeBtn = await screen.findByRole(
            "button",
            { name: /remove/i },
            { timeout: SPINNNG_DURATION + 600 }
        );
        fireEvent.click(removeBtn);
        expect(mockedUseEntries().dispatch).toHaveBeenCalledWith({
            type: "entries/deleted",
            payload: expect.any(Number),
        });
    });

    it("should close winner dialog when close button is clicked", async () => {
        render(
            <EntriesProvider>
                <ResultsProvider>
                    <Wheel />
                </ResultsProvider>
            </EntriesProvider>
        );
        const wheel = screen.getByTestId("wheel");
        fireEvent.click(wheel);
        const closeBtn = await screen.findByRole(
            "button",
            { name: /close/i },
            { timeout: SPINNNG_DURATION + 600 }
        );
        fireEvent.click(closeBtn);
        expect(screen.queryByText(/we have a winner/i)).not.toBeInTheDocument();
    });
});
