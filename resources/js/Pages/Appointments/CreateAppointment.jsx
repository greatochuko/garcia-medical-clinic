import LoadingIndicator from "@/Components/layout/LoadingIndicator";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { router, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { route } from "ziggy-js";

export default function CreateAppointment({ patientData, serviceTypes }) {
    const isOver60 = parseInt(patientData.age) > 59;

    const [validationErrors, setValidationErrors] = useState([]);
    const { data, setData, post, processing } = useForm({
        appointment_date: new Date().toISOString().split("T")[0],
        service_type: "",
        status: "waiting",
        patient_id: patientData.patient_id,
        queue_number: "",
    });

    const [queueNumbers, setQueueNumbers] = useState([]);

    useEffect(() => {
        fetch(route("api.queue-numbers", patientData.age))
            .then((res) => res.json())
            .then((data) => {
                if (data && data.length) {
                    setQueueNumbers(Object.values(data.map((d) => d.number)));
                    setData((prev) => ({
                        ...prev,
                        queue_number: data[0].number,
                    }));
                }
            })
            .catch((err) =>
                console.error("Error fetching queue numbers:", err),
            );
    }, []);

    function handleCreateAppointment(e) {
        e.preventDefault();

        post(route("appointments.create_new"), {
            onError: (serverErrors) => {
                setValidationErrors(Object.values(serverErrors));
            },
        });
    }

    return (
        <AuthenticatedLayout pageTitle={"Create Appointment"}>
            <div className="flex-1 pt-6">
                <form
                    onSubmit={handleCreateAppointment}
                    className="mx-auto flex h-full w-[90%] max-w-screen-2xl flex-col rounded-lg bg-white"
                >
                    <h1 className="border-b-2 border-accent-200 p-3 text-center text-sm font-bold">
                        CREATE APPOINTMENT (60 AND{" "}
                        {isOver60 ? "ABOVE" : "BELOW"})
                    </h1>
                    <div className="flex items-center justify-center gap-6 border-b-2 border-accent-200 p-6">
                        <img
                            src="/images/patient.png"
                            alt={patientData.first_name + " profile picture"}
                            width={100}
                            height={100}
                            className="rounded-full shadow-md"
                        />
                        <div className="flex flex-col gap-1">
                            <h4 className="text-lg font-bold">
                                {patientData.first_name} {patientData.last_name}
                            </h4>
                            <p className="text-sm">
                                {patientData.age}, {patientData.gender}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col items-center gap-6 border-b-2 border-accent-200 p-6 text-sm">
                        <p className="text-center">
                            Create appointment to proceed with doctor check up.
                        </p>
                        <div className="flex w-full max-w-3xl flex-col gap-6 sm:flex-row md:gap-10 lg:gap-16">
                            <div className="flex flex-1 flex-col gap-6">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="appointment_date">
                                        Appointment Date{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className={`relative flex`}>
                                        <input
                                            type="date"
                                            name={"appointment_date"}
                                            id={"appointment_date"}
                                            value={data["appointment_date"]}
                                            onChange={(e) =>
                                                setData((prev) => ({
                                                    ...prev,
                                                    ["appointment_date"]:
                                                        e.target.value,
                                                }))
                                            }
                                            className="w-0 flex-1 rounded-md border-[#dfdfdf] p-3 text-sm focus:border-inherit focus:ring-accent disabled:bg-[#E4E4E4]"
                                            required={true}
                                            disabled={processing}
                                        />
                                        <img
                                            src={
                                                "/assets/icons/calendar-icon-2.svg"
                                            }
                                            alt={"Date icon"}
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label htmlFor="service_type">
                                        Service Type{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="service_type"
                                        id="service_type"
                                        value={data["service_type"]}
                                        onChange={(e) =>
                                            setData((prev) => ({
                                                ...prev,
                                                ["service_type"]:
                                                    e.target.value,
                                            }))
                                        }
                                        className="cursor-pointer p-3 text-sm focus:border-inherit focus:ring-accent"
                                    >
                                        <option value="" hidden>
                                            Select Service Type
                                        </option>
                                        {serviceTypes.map((serviceType) => (
                                            <option
                                                key={serviceType.id}
                                                value={serviceType.id}
                                            >
                                                {serviceType.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label htmlFor="status">
                                        Status{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="status"
                                        id="status"
                                        value={data["status"]}
                                        onChange={(e) =>
                                            setData((prev) => ({
                                                ...prev,
                                                ["status"]: e.target.value,
                                            }))
                                        }
                                        className="cursor-pointer p-3 text-sm focus:border-inherit focus:ring-accent"
                                    >
                                        <option value="waiting">Waiting</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col gap-2">
                                <label htmlFor="queue_number">
                                    Assign Queue Number{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="grid flex-1 grid-cols-4 gap-4 rounded-2xl border border-[#dfdfdf] p-4">
                                    {queueNumbers.map((queue_number) => (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setData((prev) => ({
                                                    ...prev,
                                                    queue_number,
                                                }))
                                            }
                                            key={queue_number}
                                            className={`flex items-center justify-center rounded-lg border border-dashed p-2 duration-100 ${isOver60 ? `border-accent-orange ${queue_number === data["queue_number"] ? "bg-accent-orange text-white" : "bg-accent-200 text-accent-orange"}` : `border-accent ${queue_number === data["queue_number"] ? "bg-accent text-white" : "bg-accent-200"}`}`}
                                        >
                                            {queue_number}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <ul className="w-full max-w-3xl list-inside list-disc">
                            {validationErrors.map((error, i) => (
                                <li key={i} className="text-sm text-red-500">
                                    {error}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex items-center justify-end gap-4 p-6">
                        <button
                            type="button"
                            onClick={() => router.visit("/appointments")}
                            className="rounded-md border border-accent px-4 py-2 text-sm duration-200 hover:bg-accent-200"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-md border border-accent bg-accent px-4 py-2 text-sm text-white duration-200 hover:bg-accent/90"
                        >
                            {processing ? (
                                <>
                                    <LoadingIndicator /> Creating...
                                </>
                            ) : (
                                "Create"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
