import React, { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";

const FlashMessage = () => {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
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
