import { useState, useEffect } from "react";

type LocalStorage = string | boolean | object;

export function useLocalStorageState(
    initialState: LocalStorage,
    key: string
): [LocalStorage, (value: LocalStorage) => void] {
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
