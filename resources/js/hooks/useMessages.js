import pusherClient from "@/lib/pusherClient";
import { useEffect } from "react";

export default function useMessages(cb) {
    useEffect(() => {
        const channel = pusherClient.subscribe("chat");

        channel.bind("message.sent", (data) => {
            cb?.(data);
        });

        return () => {
            channel.unbind_all();
            pusherClient.unsubscribe("chat");
        };
    }, [cb]);
}
