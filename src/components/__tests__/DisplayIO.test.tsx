import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { describe } from "vitest";
import DisplayIO from "../DisplayIO";

const props = {
    io: "test entry",
    handleDelete: vi.fn(),
    winTimes: 0,
    color: "blue",
};
describe("DisplayIO", () => {
    it("should render correctly", () => {
        render(
            <DisplayIO {...props}>
                <DisplayIO.Color />
                <DisplayIO.Content />
                <DisplayIO.DeleteBtn />
            </DisplayIO>
        );
        const entryElement = screen.getByTestId("entry-test entry");
        expect(entryElement).toBeInTheDocument();
        expect(entryElement.childNodes).toHaveLength(3);

        expect(
            (entryElement.childNodes[0] as HTMLElement).getAttribute("style")
        ).toContain("background-color: blue;");
        expect(entryElement.childNodes[1] as HTMLElement).toHaveTextContent(
            "test entry"
        );
        expect(entryElement.childNodes[2] as HTMLElement).toHaveRole("button");
    });
    it("should change the order of the children correctly", () => {
        render(
            <DisplayIO {...props}>
                <DisplayIO.DeleteBtn />
                <DisplayIO.WinTimes />
                <DisplayIO.Content />
                <DisplayIO.Color />
            </DisplayIO>
        );
        const entryElement = screen.getByTestId("entry-test entry");
        expect(entryElement).toBeInTheDocument();
        expect(entryElement.childNodes).toHaveLength(4);

        expect(
            (entryElement.childNodes[3] as HTMLElement).getAttribute("style")
        ).toContain("background-color: blue;");
        expect(entryElement.childNodes[2] as HTMLElement).toHaveTextContent(
            "test entry"
        );
        expect(entryElement.childNodes[1] as HTMLElement).toHaveTextContent(
            "( 0 )"
        );
        expect(entryElement.childNodes[0] as HTMLElement).toHaveRole("button");
    });
    it("should call handleDelete when delete button is clicked", () => {
        render(
            <DisplayIO {...props}>
                <DisplayIO.Color />
                <DisplayIO.Content />
                <DisplayIO.DeleteBtn />
            </DisplayIO>
        );
        const deleteButton = screen.getByRole("button");
        deleteButton.click();
        expect(props.handleDelete).toHaveBeenCalled();
    });
});
