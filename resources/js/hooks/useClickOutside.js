import { useEffect, useRef } from "react";

export default function useClickOutside(cb) {
    const elementRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(ev) {
            if (elementRef.current && !elementRef.current.contains(ev.target)) {
                cb?.();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [cb]);
    return [elementRef];
}
