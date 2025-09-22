import React from "react";
import { usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";

import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const FlashMessage = () => {
    const { flash } = usePage().props;
    const shown = useRef(false);

    useEffect(() => {
        if (!shown.current) {
            if (flash?.success) {
                toast.success(flash.success);
                shown.current = true;
            }
            if (flash?.error) {
                toast.error(flash.error);
                shown.current = true;
            }
        }
    }, [flash]);

    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3000,
                style: { fontSize: 14, maxWidth: "100%" },
            }}
        />
    );
};

export default FlashMessage;
