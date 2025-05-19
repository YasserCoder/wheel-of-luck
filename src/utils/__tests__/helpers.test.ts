import { describe, it, expect } from "vitest";
import { sortArray, shuffleArray } from "../helpers";

describe("sortArray", () => {
    it("should sort strings alphabetically", () => {
        const arr = ["banana", "apple", "cherry"];
        const sorted = sortArray(arr);
        expect(sorted).toEqual(["apple", "banana", "cherry"]);
    });

    it("should handle empty array", () => {
        const arr: string[] = [];
        const sorted = sortArray(arr);
        expect(sorted).toEqual([]);
    });

    it("should handle array with one element", () => {
        const arr = ["only"];
        const sorted = sortArray(arr);
        expect(sorted).toEqual(["only"]);
    });

    it("should sort strings at the top and files at the bottom", () => {
        const file1 = new File([""], "fileA.png", { type: "image/png" });
        const file2 = new File([""], "fileB.png", { type: "image/png" });
        const arr = ["banana", file2, "apple", file1, "cherry"];
        const sorted = sortArray(arr);
        // Strings sorted alphabetically, files in original order after
        expect(sorted).toEqual(["apple", "banana", "cherry", file2, file1]);
        // expect(sorted[3]).toBe(file2);
        // expect(sorted[4]).toBe(file1);
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
