import { AppointmentDateSection } from "@/Components/appointmentManager/AppointmentDateSection";
import AppointmentsHeader from "@/Components/appointmentManager/AppointmentsHeader";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useCallback, useMemo, useState } from "react";

export default function AppointmentManager({ appointments }) {
    const [currentTab, setCurrentTab] = useState("active");
    const [appointmentList, setAppointmentList] = useState(appointments.data);

    const uniqueDates = useMemo(
        () => [
            ...new Set(
                appointmentList.map((a) => a.appointment_date.split("T")[0]),
            ),
        ],
        [],
    );

    const getAppointmentsByDate = useCallback(
        (date) => {
            const targetDate =
                typeof date === "string"
                    ? date
                    : date.toISOString().split("T")[0];

            return appointmentList.filter(
                (appointment) =>
                    appointment.appointment_date &&
                    appointment.appointment_date.split("T")[0] === targetDate,
            );
        },
        [appointmentList],
    );

    return (
        <AuthenticatedLayout pageTitle="Appointments">
            <div className="max-w-full flex-1 pt-6">
                <div className="mx-auto flex h-full w-[95%] max-w-screen-2xl flex-col gap-4 bg-white text-accent">
                    <AppointmentsHeader
                        currentTab={currentTab}
                        setCurrentTab={setCurrentTab}
                    />
                    <div className="text-sm">
                        {appointmentList.length > 0 ? (
                            <div className="flex flex-col gap-6 overflow-x-auto">
                                {uniqueDates.map((date) => (
                                    <AppointmentDateSection
                                        key={date}
                                        date={date}
                                        appointments={getAppointmentsByDate(
                                            date,
                                        )}
                                        setAppointments={setAppointmentList}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="p-4 text-center text-accent-500">
                                There are no appointments right now
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
