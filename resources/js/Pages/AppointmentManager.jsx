import { AppointmentDateSection } from "@/Components/appointmentManager/AppointmentDateSection";
import AppointmentsHeader from "@/Components/appointmentManager/AppointmentsHeader";
import Paginator from "@/Components/layout/Paginator";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import React, { useCallback, useMemo, useState } from "react";
import { route } from "ziggy-js";

export default function AppointmentManager({ appointments }) {
    const { auth } = usePage().props;

    const [currentTab, setCurrentTab] = useState("active");
    const [appointmentList, setAppointmentList] = useState(appointments.data);
    const [user, setUser] = useState(auth.user);

    const uniqueDates = useMemo(
        () => [
            ...new Set(
                appointmentList
                    .map((a) => a.appointment_date.split("T")[0])
                    .sort(
                        (a, b) => new Date(b).getTime() - new Date(a).getTime(),
                    ),
            ),
        ],
        [appointmentList],
    );

    const getAppointmentsByDate = useCallback(
        (date) => {
            const targetDate = new Date(date).toISOString().split("T")[0];

            return appointmentList
                .filter(
                    (appointment) =>
                        appointment.appointment_date &&
                        appointment.appointment_date.split("T")[0] ===
                            targetDate,
                )
                .sort((a, b) => a.order_number - b.order_number);
        },
        [appointmentList],
    );

    async function reorderAppointment(
        draggedOrderNumber,
        replacedOrderNumber,
        direction,
    ) {
        try {
            await axios.post(route("appointments.reorder"), {
                reorderData: {
                    draggedOrderNumber,
                    replacedOrderNumber,
                    direction,
                },
            });
        } catch (error) {
            console.error("Error reordering appointment:", error);
        }
    }

    function handleReorder(draggedAppointment, replacedAppointment, direction) {
        const updatedList = Array.from(appointmentList);

        // Determine the range of affected appointments
        const draggedOrderNumber = draggedAppointment.order_number;
        const replacedOrderNumber = replacedAppointment.order_number;
        const min = Math.min(draggedOrderNumber, replacedOrderNumber);
        const max = Math.max(draggedOrderNumber, replacedOrderNumber);

        updatedList.forEach((appointment) => {
            if (
                appointment.order_number >= min &&
                appointment.order_number <= max
            ) {
                if (appointment.id === draggedAppointment.id) {
                    appointment.order_number = replacedOrderNumber;
                } else {
                    appointment.order_number += direction === "down" ? -1 : 1;
                }
            }
        });

        // Sort so getAppointmentsByDate still works correctly
        updatedList.sort((a, b) => a.order_number - b.order_number);

        setAppointmentList(updatedList);

        // Call backend
        reorderAppointment(draggedOrderNumber, replacedOrderNumber, direction);
    }

    return (
        <AuthenticatedLayout
            pageTitle="Appointments"
            user={user}
            setUser={setUser}
        >
            <div className="max-w-full flex-1 pt-6">
                <div className="mx-auto flex h-full w-[95%] max-w-screen-2xl flex-col gap-4 bg-white text-accent">
                    <AppointmentsHeader
                        currentTab={currentTab}
                        setCurrentTab={setCurrentTab}
                    />
                    {appointmentList.length > 0 ? (
                        <div>
                            <div className="flex flex-col gap-6 overflow-x-auto text-sm">
                                {uniqueDates.map((date, index) => (
                                    <AppointmentDateSection
                                        key={date}
                                        date={date}
                                        appointments={getAppointmentsByDate(
                                            date,
                                        )}
                                        setAppointments={setAppointmentList}
                                        isLastDate={
                                            index === uniqueDates.length - 1
                                        }
                                        userRole={user.role}
                                        handleReorder={handleReorder}
                                    />
                                ))}
                            </div>
                            <Paginator
                                currentPage={appointments.current_page}
                                per_page={appointments.per_page}
                                totalPages={appointments.last_page}
                                totalList={appointments.total}
                            />
                        </div>
                    ) : (
                        <p className="p-4 text-center text-accent-500">
                            There are no appointments right now
                        </p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
