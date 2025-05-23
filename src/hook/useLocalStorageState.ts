import { useState, useEffect } from "react";

// type LocalStorage = string | boolean | object;

export function useLocalStorageState<T>(
    initialState: T,
    key: string
): [T, (value: T) => void] {
    const [value, setValue] = useState(function () {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialState;
    });

    useEffect(
        function () {
            localStorage.setItem(key, JSON.stringify(value));
        },
        [value, key]
    );

    return [value, setValue];
}
