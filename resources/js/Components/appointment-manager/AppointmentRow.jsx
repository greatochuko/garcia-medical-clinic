import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import ReorderIcon from "../icons/ReorderIcon";
import DeleteAppointmentModal from "../modals/DeleteAppointmentModal";
import VitalsModal from "../modals/VitalsModal";
import useClickOutside from "@/hooks/useClickOutside";
import { route } from "ziggy-js";
import { toast } from "react-hot-toast";
import { Link, router, useForm } from "@inertiajs/react";
import LoadingIndicator from "../layout/LoadingIndicator";
import BillingModal from "../modals/BillingModal";
import useAppointments from "@/hooks/useAppointmets";
import useVitals from "@/hooks/useVitals";
import { generateVitalsData } from "@/utils/generateVitalsData";

function formatStatus(status) {
    return status
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export function AppointmentRow({
    appointment: originalAppointment,
    setAppointments,
    index,
    isLast,
    userRole,
    removeAppointmentFromList,
}) {
    const [appointment, setAppointment] = useState(originalAppointment);
    const [checkOutLoading, setCheckOutLoading] = useState(false);
    const [checkInLoading, setCheckInLoading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [vitalSignsModalOpen, setVitalSignsModalOpen] = useState(false);
    const [billingModalOpen, setBillingModalOpen] = useState(false);
    const [prescriptions, setPrescriptions] = useState([]);

    const { post, put, processing, data, setData } = useForm({
        patient_id: appointment.patient.patient_id,
        blood_diastolic_pressure:
            appointment.patient.vitals?.blood_diastolic_pressure || "",
        blood_systolic_pressure:
            appointment.patient.vitals?.blood_systolic_pressure || "",
        heart_rate: appointment.patient.vitals?.heart_rate || "",
        o2saturation: appointment.patient.vitals?.o2saturation || "",
        temperature: parseInt(appointment.patient.vitals?.temperature) || "",
        height_ft: appointment.patient.vitals?.height_ft || "",
        height_in: appointment.patient.vitals?.height_in || "",
        weight: parseInt(appointment.patient.vitals?.weight) || "",
    });

    useVitals(({ vitals: updatedVitals }) => {
        if (
            String(updatedVitals.patient_id) ===
            String(appointment?.patient?.patient_id)
        ) {
            setAppointment((prev) => ({
                ...prev,
                patient: { ...prev.patient, vitals: updatedVitals },
            }));
        }
    });

    useAppointments(({ type, appointment: updatedAppointment }) => {
        if (type === "updated" && appointment.id === updatedAppointment.id) {
            setAppointment(updatedAppointment);
        }
    });

    function handleSaveVitalSigns(e) {
        e.preventDefault();

        if (appointment.patient.vitals) {
            put(
                route("vitalsignsmodal.update", {
                    id: appointment.patient.vitals.id,
                }),
                {
                    onSuccess: () => {
                        // updateVitals?.(data);
                        setVitalSignsModalOpen(false);
                    },
                    onError: (err) => {
                        console.error(err);
                        toast.error("An unexpected error occurred");
                    },
                    preserveScroll: true,
                },
            );
        } else {
            post(route("vitalsignsmodal.add"), {
                onSuccess: () => {
                    // updateVitals?.(data);
                    setVitalSignsModalOpen(false);
                },
                onError: (err) => {
                    console.error(err);
                    toast.error("An unexpected error occurred");
                },
                preserveScroll: true,
            });
        }
    }

    const patientFullName = `${appointment.patient.first_name}, ${appointment.patient.middle_initial || ""} ${appointment.patient.last_name}`;

    let statusClassName = "";

    switch (appointment.status) {
        case "waiting":
            statusClassName = "border-dashed border-accent";
            break;

        case "for_billing":
            statusClassName = "border-[#8D2310] bg-[#8D2310] text-white";
            break;

        case "checked_in":
            statusClassName = "border-accent bg-accent text-white";
            break;

        case "checked_out":
            statusClassName = "border-dashed border-[#8D2310] text-[#8D2310]";
            break;

        default:
            statusClassName = "border-dashed border-[#EAEAEA] bg-[#EAEAEA]";
            break;
    }

    async function handleCheckOut() {
        try {
            setCheckOutLoading(true);
            const res = await fetch(
                route("patientvisitform.patientprescriptionget", {
                    id: appointment.patient.patient_id,
                    app_id: appointment.id,
                }),
            );
            const data = await res.json();
            setPrescriptions(data.data);
            setBillingModalOpen(true);
        } catch (error) {
            toast.error("An error occurred fetching prescriptions");
            console.error(error);
        }
        setCheckOutLoading(false);
    }

    async function changeStatus(newStatus, setLoading) {
        router.put(
            route("appointments.update-status", { id: appointment.id }),
            { status: newStatus },
            {
                preserveScroll: true,
                preserveState: true,
                onStart: () => {
                    setLoading?.(true);
                },
                onSuccess: () => {
                    setAppointment((prev) => ({
                        ...prev,
                        status: newStatus,
                    }));
                    setLoading?.(false);
                },
                onError: (errors) => {
                    console.error(errors);
                    toast.error("An error occurred changing status");
                    setLoading?.(false);
                },
            },
        );
    }

    return (
        <Draggable draggableId={`appointment-${appointment.id}`} index={index}>
            {(provided, snapshot) => (
                <>
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex hover:bg-gray-50 ${snapshot.isDragging ? "bg-gray-100" : ""}`}
                    >
                        <div
                            className={`flex min-w-40 flex-[2] items-center gap-2 p-4 text-2xl font-bold ${appointment.queue_type.toLowerCase() === "s" ? "text-accent-orange" : ""}`}
                        >
                            <span {...provided.dragHandleProps}>
                                <ReorderIcon />
                            </span>
                            {appointment.queue_type + appointment.queue_number}
                        </div>
                        <div className="min-w-60 flex-[4] p-4">
                            <h4 className="font-semibold">{patientFullName}</h4>
                            <p className="text-xs text-gray-500">
                                {appointment.patient.age},{" "}
                                {appointment.patient.gender}
                            </p>
                            <p className="text-xs text-gray-500">
                                {appointment.service_charge.name}
                            </p>
                        </div>
                        <div className="flex min-w-40 flex-[2] items-center justify-center p-4">
                            <span
                                className={
                                    "block w-fit rounded-md border px-3 py-1 text-xs " +
                                    statusClassName
                                }
                            >
                                {formatStatus(appointment.status)}
                            </span>
                        </div>
                        <div className="flex min-w-80 flex-[4] items-center justify-center space-x-2 p-4">
                            <div className="flex items-center gap-1 rounded-md bg-[#EAEAEA] p-1 text-xs">
                                <button
                                    onClick={() =>
                                        changeStatus(
                                            "checked_in",
                                            setCheckInLoading,
                                        )
                                    }
                                    disabled={
                                        checkInLoading ||
                                        appointment.status !== "waiting"
                                    }
                                    className={`flex items-center gap-1.5 rounded-md border border-dashed border-accent bg-white px-2 py-1.5 duration-200 hover:bg-accent-200 ${checkInLoading ? "pointer-events-none" : "disabled:border-none disabled:bg-transparent disabled:text-[#B4BBC2]"}`}
                                >
                                    {checkInLoading ? (
                                        <>
                                            <LoadingIndicator color="#15475B" />{" "}
                                            Checking In
                                        </>
                                    ) : (
                                        "Check In"
                                    )}
                                </button>
                                <button
                                    onClick={handleCheckOut}
                                    disabled={
                                        appointment.status !== "for_billing" ||
                                        checkOutLoading ||
                                        userRole === "doctor"
                                    }
                                    className={`flex items-center gap-1.5 rounded-md border border-dashed border-[#8D2310] bg-white px-2 py-1.5 text-[#8D2310] duration-200 hover:bg-[#8D2310]/5 ${checkOutLoading ? "pointer-events-none" : "disabled:border-none disabled:bg-transparent disabled:text-[#B4BBC2]"}`}
                                >
                                    {checkOutLoading ? (
                                        <>
                                            <LoadingIndicator color="#8D2310" />{" "}
                                            Checking Out
                                        </>
                                    ) : (
                                        "Check Out"
                                    )}
                                </button>
                                {userRole === "secretary" ? (
                                    <button
                                        onClick={() => {
                                            setVitalSignsModalOpen(true);
                                            setData(
                                                generateVitalsData(
                                                    appointment.patient,
                                                ),
                                            );
                                        }}
                                        disabled={
                                            !["waiting", "checked_in"].includes(
                                                appointment.status,
                                            )
                                        }
                                        className="rounded-md border border-dashed border-accent bg-white px-2 py-1.5 duration-200 hover:bg-accent-200 disabled:border-none disabled:bg-transparent disabled:text-[#B4BBC2]"
                                    >
                                        VS / Measurements
                                    </button>
                                ) : (
                                    <Link
                                        href={route("patientvisitform.index", {
                                            patient_id:
                                                appointment.patient.patient_id,
                                            appointment_id: appointment.id,
                                        })}
                                        aria-disabled={
                                            appointment.status !== "checked_in"
                                        }
                                        className="rounded-md border border-dashed border-accent bg-white px-2 py-1.5 duration-200 hover:bg-accent-200 aria-disabled:border-none aria-disabled:bg-transparent aria-disabled:text-[#B4BBC2]"
                                    >
                                        Add Record
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="flex min-w-28 flex-[2] items-center justify-center space-x-2 p-4">
                            <div className="flex gap-2">
                                <EditButton
                                    currentStatus={appointment.status}
                                    changeStatus={(newStatus, setLoading) =>
                                        changeStatus(newStatus, setLoading)
                                    }
                                    isLast={!!isLast}
                                />
                                <button
                                    hidden={
                                        appointment.status === "for_billing" ||
                                        appointment.status === "checked_out"
                                    }
                                    onClick={() => setDeleteModalOpen(true)}
                                    className="rounded-md border border-transparent p-2 duration-100 hover:border-accent-400 hover:bg-accent-300"
                                >
                                    <img
                                        src="/assets/icons/delete-icon.svg"
                                        alt="Edit Icon"
                                        width={16}
                                        height={16}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    <DeleteAppointmentModal
                        open={deleteModalOpen}
                        closeModal={() => {
                            setDeleteModalOpen(false);
                        }}
                        appointmentId={appointment.id}
                        setAppointments={setAppointments}
                    />
                    <VitalsModal
                        open={vitalSignsModalOpen}
                        closeModal={() => {
                            setVitalSignsModalOpen(false);
                        }}
                        data={data}
                        handleSaveVitalSigns={handleSaveVitalSigns}
                        patient={appointment.patient}
                        processing={processing}
                        setData={setData}
                    />

                    <BillingModal
                        open={billingModalOpen}
                        closeModal={() => setBillingModalOpen(false)}
                        appointment={appointment}
                        patient={appointment.patient}
                        prescriptions={prescriptions}
                        removeAppointmentFromList={removeAppointmentFromList}
                        service={appointment.service_charge}
                    />
                </>
            )}
        </Draggable>
    );
}

const dropdownActions = [
    { text: "Waiting", id: "waiting" },
    { text: "On Hold", id: "on_hold" },
];

function EditButton({ changeStatus, currentStatus, isLast }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [dropdownRef] = useClickOutside(() => setDropdownOpen(false));

    const canChangeStatus =
        currentStatus === "waiting" || currentStatus === "on_hold";

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="rounded-md border border-transparent p-2 duration-100 hover:border-accent-400 hover:bg-accent-300"
            >
                <img
                    src="/assets/icons/edit-icon.svg"
                    alt="Edit Icon"
                    width={16}
                    height={16}
                />
            </button>
            <div
                className={`absolute right-0 z-10 flex w-28 flex-col divide-y divide-accent-200 overflow-hidden rounded-md border border-accent-200 bg-white text-xs shadow-md duration-200 ${dropdownOpen ? "" : `${isLast ? "translate-y-2" : "-translate-y-2"} invisible opacity-0`} ${isLast ? "bottom-[calc(100%+.5rem)]" : "top-[calc(100%+.5rem)]"}`}
            >
                {dropdownActions.map((action) => (
                    <button
                        onClick={() => changeStatus(action.id, setLoading)}
                        disabled={
                            loading ||
                            !canChangeStatus ||
                            currentStatus === action.id
                        }
                        key={action.id}
                        className={`p-3 text-left duration-200 hover:bg-accent-200 disabled:pointer-events-none disabled:bg-[#EAEAEA] disabled:text-[#B4BBC2]`}
                    >
                        {action.text}
                    </button>
                ))}
            </div>
        </div>
    );
}
