import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ResultsProvider } from "../ResultsProvider";
import { useResults } from "../../context/resultsContext";
import Results from "../Results";

vi.mock("../../context/resultsContext");
const mockedUseResults = vi.mocked(useResults);

mockedUseResults.mockReturnValue({
    results: [
        { winner: "chelsea", winNumber: 3 },
        { winner: "real madrid", winNumber: 5 },
        { winner: "barcelona", winNumber: 2 },
    ],
    dispatch: vi.fn(),
});

describe("Results", () => {
    it("should render without crashing", () => {
        render(
            <ResultsProvider>
                <Results />
            </ResultsProvider>
        );
        const clearBtn = screen.getByRole("button", { name: /clear/i });
        expect(clearBtn).toBeInTheDocument();
        const sortBtn = screen.getByRole("button", { name: /sort/i });
        expect(sortBtn).toBeInTheDocument();

        const ioList = screen.getByRole("list");
        expect(ioList).toBeInTheDocument();
        expect(ioList.childNodes).toHaveLength(3);

        expect(screen.getByText("chelsea")).toBeInTheDocument();
        expect(screen.getByText("( 3 )")).toBeInTheDocument();
        expect(screen.getByText("real madrid")).toBeInTheDocument();
        expect(screen.getByText("( 5 )")).toBeInTheDocument();
        expect(screen.getByText("barcelona")).toBeInTheDocument();
        expect(screen.getByText("( 2 )")).toBeInTheDocument();
    });
    it("should call dispatch with 'results/deleted' when delete button is clicked", () => {
        render(
            <ResultsProvider>
                <Results />
            </ResultsProvider>
        );
        const deleteBtn = within(screen.getByTestId("entry-chelsea")).getByRole(
            "button"
        );

        fireEvent.click(deleteBtn);
        expect(mockedUseResults().dispatch).toHaveBeenCalledWith({
            type: "results/deleted",
            payload: 0,
        });
    });
});

describe("OperationBtns", () => {
    it("should sort results when sort button is clicked", () => {
        render(
            <ResultsProvider>
                <Results />
            </ResultsProvider>
        );
        const sortBtn = screen.getByRole("button", { name: /sort/i });

        fireEvent.click(sortBtn);
        expect(mockedUseResults().dispatch).toHaveBeenCalledWith({
            type: "results/set",
            payload: [
                { winner: "barcelona", winNumber: 2 },
                { winner: "chelsea", winNumber: 3 },
                { winner: "real madrid", winNumber: 5 },
            ],
        });
    });
    it("should clear results when clear button is clicked", () => {
        render(
            <ResultsProvider>
                <Results />
            </ResultsProvider>
        );
        const clearBtn = screen.getByRole("button", { name: /clear/i });

        fireEvent.click(clearBtn);
        expect(mockedUseResults().dispatch).toHaveBeenCalledWith({
            type: "results/set",
            payload: [],
        });
    });
});
