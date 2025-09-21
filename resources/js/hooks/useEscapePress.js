import { useEffect } from "react";

export function useEscPress(action) {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                action();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [action]);
}
