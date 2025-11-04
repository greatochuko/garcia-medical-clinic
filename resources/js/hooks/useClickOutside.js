import { useEffect, useRef } from "react";

export default function useClickOutside(handler, exceptionRef = null) {
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                ref.current &&
                !ref.current.contains(event.target) &&
                (!exceptionRef || !exceptionRef.current.contains(event.target))
            ) {
                handler();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [handler, exceptionRef]);

    return [ref];
}
