import { describe, it, expect } from "vitest";
import { sortArray, shuffleArray, convertToBase64 } from "../helpers";

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
