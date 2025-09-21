import React from "react";
import { usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

    return <ToastContainer position="top-right" autoClose={3000} />;
};

export default FlashMessage;
