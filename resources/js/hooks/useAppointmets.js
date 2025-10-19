import { useEffect } from "react";
import Pusher from "pusher-js";

export default function useAppointments(cb) {
    useEffect(() => {
        // Initialize Pusher client
        const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            forceTLS: true,
        });

        // Subscribe to the "appointments" channel
        const channel = pusher.subscribe("appointments");

        // Listen for the "appointment.created" event
        channel.bind("appointment.created", (data) => {
            cb?.(data.appointment);
        });

        // Cleanup on unmount
        return () => {
            pusher.unsubscribe("appointments");
            pusher.disconnect();
        };
    }, [cb]);
}
