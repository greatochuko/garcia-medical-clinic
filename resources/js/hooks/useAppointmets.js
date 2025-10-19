import pusher from "@/lib/pusherClient";
import { useEffect } from "react";

export default function useAppointments(cb) {
    useEffect(() => {
        const channel = pusher.subscribe("appointments");

        channel.bind("appointment.created", (data) =>
            cb?.({ type: "created", appointment: data.appointment }),
        );
        channel.bind("appointment.updated", (data) =>
            cb?.({ type: "updated", appointment: data.appointment }),
        );

        return () => {
            channel.unbind_all();
            pusher.unsubscribe("appointments");
        };
    }, [cb]);
}
