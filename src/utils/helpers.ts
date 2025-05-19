export function sortArray(array: (string | File)[]): (string | File)[] {
    return [...array].sort((a, b) => {
        const isAString = typeof a === "string";
        const isBString = typeof b === "string";
        if (isAString && isBString) {
            return (a as string).localeCompare(b as string);
        }
        if (isAString) return -1; // string before File
        if (isBString) return 1; // File after string
        return 0; // both are Files, keep original order
    });
}

export function shuffleArray<T>(array: T[]): T[] {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [
            shuffledArray[j],
            shuffledArray[i],
        ];
    }
    return shuffledArray;
}
