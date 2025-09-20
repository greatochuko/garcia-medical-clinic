import React from "react";
import { PatientQuickView } from "./PatientQuickView";
import { AppointmentsView } from "./AppointmentsView";
import PropTypes from "prop-types";

export default function LeftDashboard({ className }) {
    return (
        <div className={`flex flex-1 flex-col gap-6 ${className}`}>
            <PatientQuickView />
            <AppointmentsView />
        </div>
    );
}

LeftDashboard.propTypes = {
    className: PropTypes.string,
};
