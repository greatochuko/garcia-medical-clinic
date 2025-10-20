import pusherClient from "@/lib/pusherClient";
import { useEffect } from "react";

export default function useVitals(cb) {
    useEffect(() => {
        const channel = pusherClient.subscribe("vitals");

        channel.bind("vitals.changed", (data) => {
            cb?.(data);
        });

        return () => {
            channel.unbind_all();
            pusherClient.unsubscribe("appointments");
        };
    }, [cb]);
}
