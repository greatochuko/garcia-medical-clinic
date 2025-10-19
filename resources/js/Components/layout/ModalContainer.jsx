import { useEscPress } from "@/hooks/useEscapePress";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function ModalContainer({
    open,
    closeModal,
    children,
    className = "",
}) {
    // useEffect(() => {
    //     if (open) {
    //         document.body.style.overflow = "hidden";
    //     } else {
    //         document.body.style.overflow = "auto";
    //     }
    // }, [open]);

    useEscPress(closeModal);

    return (
        <div
            className={twMerge(
                `fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black/50 backdrop-blur-sm duration-200 ${
                    open ? "visible opacity-100" : "invisible opacity-0"
                }`,
                className,
            )}
            onClick={closeModal}
        >
            {children}
        </div>
    );
}
