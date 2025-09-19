import React from "react";
import { PatientQuickView } from "./PatientQuickView";
import { AppointmentsView } from "./AppointmentsView";

export default function LeftDashboard() {
    return (
        <div className="flex flex-1 flex-col gap-6">
            <PatientQuickView />
            <AppointmentsView />
        </div>
    );
}
