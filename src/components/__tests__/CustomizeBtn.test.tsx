import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EntriesProvider } from "../EntriesProvider";
import CustomizeBtn from "../CustomizeBtn";

vi.mock("../../data/colors.json", async () => {
    const original = await vi.importActual("../../data/colors.json");
    return {
        ...original,
        themes: {
            Default: ["red", "green", "blue"],
            Secondary: ["yellow", "cyan", "magenta"],
        },
    };
});

describe("CustomizeBtn", () => {
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
