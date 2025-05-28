import { useEffect, useRef } from "react";
import Sortable, { SortableEvent } from "sortablejs";

export function useSortable({
    entries,
    setEntries,
}: {
    entries: string[];
    setEntries: (entries: string[]) => void;
}) {
    const ref = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
        if (!ref.current) return;
        const sortable = new Sortable(ref.current, {
            animation: 150,
            onEnd: (evt: SortableEvent) => {
                if (evt.oldIndex === undefined || evt.newIndex === undefined)
                    return;
                const newItems = [...entries];
                const [movedItem] = newItems.splice(evt.oldIndex, 1);
                newItems.splice(evt.newIndex, 0, movedItem);
                setEntries(newItems);
            },
        });

        return () => {
            sortable.destroy();
        };
    }, [entries, setEntries]);

    return ref;
}
