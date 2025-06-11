import { useEffect, useRef } from "react";

export function useOutsideClick(
    handler: () => void,
    listenCapturing: boolean = true
) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            const isSweetAlertOpen = document.querySelector(".swal2-container"); // adjust for your SweetAlert
            if (isSweetAlertOpen) return;

            const target = e.target as HTMLElement;
            if (target.closest("button")) return;

            if (ref.current && !ref.current.contains(e.target as Node)) {
                handler();
            }
        }

        document.addEventListener("click", handleClick, listenCapturing);

        return () =>
            document.removeEventListener("click", handleClick, listenCapturing);
    }, [handler, listenCapturing]);

    return ref;
}
