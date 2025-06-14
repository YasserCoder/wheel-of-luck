export function sortArray(array: string[]): string[] {
    const normalStrings: string[] = [];
    const imageStrings: string[] = [];

    for (const item of array) {
        if (item.startsWith("data:image")) {
            imageStrings.push(item);
        } else {
            normalStrings.push(item);
        }
    }

    normalStrings.sort((a, b) => a.localeCompare(b));
    return [...normalStrings, ...imageStrings];
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

export function convertToBase64(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
}

export function sortWinners(
    array: { winner: string; winNumber: number }[]
): { winner: string; winNumber: number }[] {
    const normal = array.filter(
        (item) => !item.winner.startsWith("data:image")
    );
    const images = array.filter((item) => item.winner.startsWith("data:image"));
    normal.sort((a, b) => a.winner.localeCompare(b.winner));
    return [...normal, ...images];
}

export function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}
