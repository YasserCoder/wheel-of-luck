import { describe, it, expect } from "vitest";
import {
    sortArray,
    shuffleArray,
    convertToBase64,
    sortWinners,
    getRandomColor,
} from "../helpers";

describe("sortArray", () => {
    it("should sort strings alphabetically", () => {
        const arr = ["banana", "apple", "cherry"];
        const sorted = sortArray(arr);
        expect(sorted).toEqual(["apple", "banana", "cherry"]);
    });

    it("should keep data:image strings at the end in original order", () => {
        const arr = [
            "banana",
            "data:image/png;base64,AAA",
            "apple",
            "data:image/jpeg;base64,BBB",
            "cherry",
        ];
        const sorted = sortArray(arr);
        expect(sorted).toEqual([
            "apple",
            "banana",
            "cherry",
            "data:image/png;base64,AAA",
            "data:image/jpeg;base64,BBB",
        ]);
    });

    it("should handle all data:image strings", () => {
        const arr = ["data:image/png;base64,AAA", "data:image/jpeg;base64,BBB"];
        const sorted = sortArray(arr);
        expect(sorted).toEqual([
            "data:image/png;base64,AAA",
            "data:image/jpeg;base64,BBB",
        ]);
    });

    it("should handle no data:image strings", () => {
        const arr = ["zebra", "apple", "mango"];
        const sorted = sortArray(arr);
        expect(sorted).toEqual(["apple", "mango", "zebra"]);
    });

    it("should handle empty array", () => {
        const arr: string[] = [];
        const sorted = sortArray(arr);
        expect(sorted).toEqual([]);
    });

    it("should handle array with one element", () => {
        const arr = ["single"];
        const sorted = sortArray(arr);
        expect(sorted).toEqual(["single"]);
    });
});

describe("shuffleArray", () => {
    it("should return an array with the same elements", () => {
        const arr = [1, 2, 3, 4, 5];
        const shuffled = shuffleArray(arr);
        expect(shuffled.sort()).toEqual(arr.sort());
        // original array should not be mutated
        expect(arr).toEqual([1, 2, 3, 4, 5]);
    });

    it("should handle empty array", () => {
        const arr: number[] = [];
        const shuffled = shuffleArray(arr);
        expect(shuffled).toEqual([]);
    });

    it("should handle array with one element", () => {
        const arr = [99];
        const shuffled = shuffleArray(arr);
        expect(shuffled).toEqual([99]);
    });

    it("should produce a different order sometimes", () => {
        const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let different = false;
        for (let i = 0; i < 10; i++) {
            const shuffled = shuffleArray(arr);
            if (shuffled.join(",") !== arr.join(",")) {
                different = true;
                break;
            }
        }
        expect(different).toBe(true);
    });
});

describe("convertToBase64", () => {
    it("should convert an image file to base64", async () => {
        // Create a small PNG file (1x1 transparent pixel)
        const base64Data =
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAgMBAp2FZp8AAAAASUVORK5CYII=";
        const binary = Uint8Array.from(atob(base64Data), (c) =>
            c.charCodeAt(0)
        );
        const file = new File([binary], "pixel.png", { type: "image/png" });
        const result = await convertToBase64(file);
        // The result should be a data URL for image/png
        expect(typeof result).toBe("string");
        expect((result as string).startsWith("data:image/png;base64,")).toBe(
            true
        );
        // The base64 part should match the original base64 data
        const resultBase64 = (result as string).split(",")[1];
        expect(resultBase64).toBe(base64Data);
    });
});
describe("sortWinners", () => {
    it("should sort winners alphabetically and keep images at the end", () => {
        const arr = [
            { winner: "banana", winNumber: 2 },
            { winner: "data:image/png;base64,AAA", winNumber: 1 },
            { winner: "apple", winNumber: 3 },
            { winner: "data:image/jpeg;base64,BBB", winNumber: 4 },
            { winner: "cherry", winNumber: 5 },
        ];
        const sorted = sortWinners(arr);
        expect(sorted).toEqual([
            { winner: "apple", winNumber: 3 },
            { winner: "banana", winNumber: 2 },
            { winner: "cherry", winNumber: 5 },
            { winner: "data:image/png;base64,AAA", winNumber: 1 },
            { winner: "data:image/jpeg;base64,BBB", winNumber: 4 },
        ]);
    });

    it("should handle all image winners", () => {
        const arr = [
            { winner: "data:image/png;base64,AAA", winNumber: 1 },
            { winner: "data:image/jpeg;base64,BBB", winNumber: 2 },
        ];
        const sorted = sortWinners(arr);
        expect(sorted).toEqual([
            { winner: "data:image/png;base64,AAA", winNumber: 1 },
            { winner: "data:image/jpeg;base64,BBB", winNumber: 2 },
        ]);
    });

    it("should handle no image winners", () => {
        const arr = [
            { winner: "zebra", winNumber: 1 },
            { winner: "apple", winNumber: 2 },
            { winner: "mango", winNumber: 3 },
        ];
        const sorted = sortWinners(arr);
        expect(sorted).toEqual([
            { winner: "apple", winNumber: 2 },
            { winner: "mango", winNumber: 3 },
            { winner: "zebra", winNumber: 1 },
        ]);
    });

    it("should handle empty array", () => {
        const arr: { winner: string; winNumber: number }[] = [];
        const sorted = sortWinners(arr);
        expect(sorted).toEqual([]);
    });

    it("should handle array with one element", () => {
        const arr = [{ winner: "single", winNumber: 1 }];
        const sorted = sortWinners(arr);
        expect(sorted).toEqual([{ winner: "single", winNumber: 1 }]);
    });

    it("should preserve order of image winners", () => {
        const arr = [
            { winner: "data:image/png;base64,AAA", winNumber: 1 },
            { winner: "data:image/png;base64,BBB", winNumber: 2 },
            { winner: "data:image/png;base64,CCC", winNumber: 3 },
        ];
        const sorted = sortWinners(arr);
        expect(sorted).toEqual(arr);
    });
});

describe("get random color", () => {
    it("should return a valid hex color", () => {
        const color = getRandomColor();
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });
    it("should return different colors on multiple calls", () => {
        const colors = new Set();
        for (let i = 0; i < 20; i++) {
            colors.add(getRandomColor());
        }
        expect(colors.size).toBeGreaterThan(1);
    });
});
