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

type SliceSizes = {
    imageHeight: number;
    textSize: number;
    maxTextLength: number;
};

export function getSliceSizes(slices: number, screenWidth: number): SliceSizes {
    const isSmall = screenWidth < 400;
    const isMedium = screenWidth < 640;

    let imageHeight = 20;
    let textSize = 14;
    let maxTextLength = 20;

    if (slices <= 2) {
        imageHeight = isSmall ? 35 : isMedium ? 52 : 85;
        textSize = isSmall ? 14 : isMedium ? 17 : 22;
        maxTextLength = isSmall ? 10 : isMedium ? 13 : 20;
    } else if (slices <= 10) {
        imageHeight = isSmall ? 25 : isMedium ? 37 : 65;
        textSize = isSmall ? 13 : isMedium ? 16 : 19;
        maxTextLength = isSmall ? 10 : isMedium ? 13 : 17;
    } else if (slices <= 20) {
        imageHeight = isSmall ? 15 : isMedium ? 23 : 35;
        textSize = isSmall ? 12 : isMedium ? 14 : 16;
        maxTextLength = isSmall ? 9 : isMedium ? 12 : 17;
    } else if (slices <= 30) {
        imageHeight = isSmall ? 13 : isMedium ? 17 : 30;
        textSize = isSmall ? 10 : isMedium ? 12 : 14;
        maxTextLength = isSmall ? 9 : isMedium ? 12 : 17;
    } else if (slices <= 40) {
        imageHeight = isSmall ? 10 : isMedium ? 14 : 20;
        textSize = isSmall ? 9 : isMedium ? 10 : 12;
        maxTextLength = isSmall ? 9 : isMedium ? 12 : 17;
    }

    return { imageHeight, textSize, maxTextLength };
}
