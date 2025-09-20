import React from "react";
import { PatientQuickView } from "./PatientQuickView";
import { AppointmentsView } from "./AppointmentsView";
import PropTypes from "prop-types";

export default function LeftDashboard({ className, userRole }) {
    return (
        <div className={`flex flex-1 flex-col gap-6 ${className}`}>
            <PatientQuickView userRole={userRole} />
            <AppointmentsView />
        </div>
    );
}

LeftDashboard.propTypes = {
    className: PropTypes.string,
    userRole: PropTypes.string,
};
