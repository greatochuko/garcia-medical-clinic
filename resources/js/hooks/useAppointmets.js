import pusherClient from "@/lib/pusherClient";
import { useEffect } from "react";

export default function useAppointments(cb) {
    useEffect(() => {
        const channel = pusherClient.subscribe("appointments");

        channel.bind("appointment.created", (data) =>
            cb?.({ type: "created", appointment: data.appointment }),
        );
        channel.bind("appointment.updated", (data) =>
            cb?.({ type: "updated", appointment: data.appointment }),
        );

        return () => {
            channel.unbind_all();
            pusherClient.unsubscribe("appointments");
        };
    }, [cb]);
}
