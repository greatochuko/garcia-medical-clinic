import pusherClient from "@/lib/pusherClient";
import { useEffect } from "react";

export default function useMessages(cb, readCb) {
    useEffect(() => {
        const channel = pusherClient.subscribe("chat");

        channel.bind("message.sent", (data) => cb?.(data));

        channel.bind("message.read", (data) => readCb?.(data));

        return () => {
            channel.unbind_all();
            pusherClient.unsubscribe("chat");
        };
    }, [cb, readCb]);
}
