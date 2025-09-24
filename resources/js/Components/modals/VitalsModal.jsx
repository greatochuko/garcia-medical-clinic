import React from "react";
import ModalContainer from "../layout/ModalContainer";
import XIcon from "../icons/XIcon";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { toast } from "react-hot-toast";
import LoadingIndicator from "../layout/LoadingIndicator";

const viatlSignsFields = [
    {
        id: "blood_pressure",
        label: "Blood Pressure (mmHg)",
        fields: [
            {
                type: "number",
                id: "blood_diastolic_pressure",
            },
            {
                type: "number",
                id: "blood_systolic_pressure",
            },
        ],
    },
    {
        id: "heart_rate",
        label: `Heart Rate (bpm)`,
        type: "number",
    },
    {
        id: "o2saturation",
        label: `Oxygen Saturation (%)`,
        type: "number",
    },
    {
        id: "temperature",
        label: `Temperature (°C)`,
        type: "number",
    },
];

const measurementFields = [
    {
        id: "height",
        label: `Height (ft' in")`,
        fields: [
            {
                type: "number",
                id: "height_ft",
            },
            {
                type: "number",
                id: "height_in",
            },
        ],
    },
    {
        id: "weight",
        label: `Weight (kg)`,
        type: "number",
    },
];

export default function VitalsModal({
    open,
    closeModal,
    patient,
    updateVitals,
}) {
    const { post, put, processing, data, setData } = useForm({
        patient_id: patient.patient_id,
        blood_diastolic_pressure:
            patient.vitals?.blood_diastolic_pressure || "",
        blood_systolic_pressure: patient.vitals?.blood_systolic_pressure || "",
        heart_rate: patient.vitals?.heart_rate || "",
        o2saturation: patient.vitals?.o2saturation || "",
        temperature: parseInt(patient.vitals?.temperature) || "",
        height_ft: patient.vitals?.height_ft || "",
        height_in: patient.vitals?.height_in || "",
        weight: patient.vitals?.weight || "",
    });

    console.log(patient);

    function handleSaveVitalSigns(e) {
        e.preventDefault();
        if (patient.vitals) {
            put(route("vitalsignsmodal.update", { id: patient.vitals.id }), {
                onSuccess: () => {
                    updateVitals?.(data);
                    closeModal();
                },
                onError: (err) => {
                    console.error(err);
                    toast.error("An unexpected error occured");
                },
            });
        } else {
            console.log("Post");
            post(route("vitalsignsmodal.add"), {
                onSuccess: () => {
                    updateVitals?.(data);
                    closeModal();
                },
                onError: (err) => {
                    console.error(err);
                    toast.error("An unexpected error occured");
                },
            });
        }
    }

    function handleChange(field, value) {
        if (isNaN(parseFloat(value))) return;

        setData((prev) => ({ ...prev, [field]: value }));
    }

    function closeVitalsModal() {
        if (processing) return;
        closeModal();
    }

    return (
        <ModalContainer closeModal={closeVitalsModal} open={open}>
            <form
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSaveVitalSigns}
                className={`w-[90%] max-w-xl divide-y-2 divide-accent-200 rounded-lg bg-white text-sm duration-200 ${open ? "" : "translate-y-2"}`}
            >
                <div className="flex items-center justify-between p-2 px-4 pr-2">
                    <h5 className="font-semibold">
                        Vital Signs and Measurements
                    </h5>
                    <button
                        type="button"
                        onClick={closeVitalsModal}
                        className="rounded-full p-2 duration-200 hover:bg-accent-200"
                    >
                        <XIcon size={20} />
                    </button>
                </div>
                <div className="flex items-center gap-4 p-4 px-6">
                    <img
                        src="/images/patient.png"
                        alt={"Profile Picture"}
                        width={56}
                        height={56}
                        className="rounded-full shadow-md"
                    />
                    <div className="flex flex-col">
                        <h5>{patient.name}</h5>
                        <p className="text-xs text-[#47778B]">
                            {patient.age}, {patient.gender}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-6 p-4 px-6 text-[13px] sm:flex-row">
                    <div className="flex flex-1 flex-col gap-4">
                        {viatlSignsFields.map((field) => (
                            <div
                                key={field.id}
                                className="flex items-center justify-between gap-4"
                            >
                                {field.fields ? (
                                    <h4>{field.label}</h4>
                                ) : (
                                    <label htmlFor={field.id}>
                                        {field.label}
                                    </label>
                                )}
                                <div className="flex w-20 gap-2">
                                    {field.fields ? (
                                        field.fields.map((inputField) => (
                                            <input
                                                key={inputField.id}
                                                type="text"
                                                name={inputField.id}
                                                id={inputField.id}
                                                className="w-0 flex-1 rounded border border-[#B4BBC2] p-1 text-center text-[13px]"
                                                value={data[inputField.id]}
                                                onChange={(e) =>
                                                    handleChange(
                                                        inputField.id,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        ))
                                    ) : (
                                        <input
                                            type="text"
                                            name={field.id}
                                            id={field.id}
                                            className="w-0 flex-1 rounded border border-[#B4BBC2] p-1 text-center text-[13px]"
                                            value={data[field.id]}
                                            onChange={(e) =>
                                                handleChange(
                                                    field.id,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-1 flex-col gap-4">
                        {measurementFields.map((field) => (
                            <div
                                key={field.id}
                                className="flex items-center justify-between gap-4"
                            >
                                {field.fields ? (
                                    <h4>{field.label}</h4>
                                ) : (
                                    <label htmlFor={field.id}>
                                        {field.label}
                                    </label>
                                )}
                                <div className="flex w-20 gap-2">
                                    {field.fields ? (
                                        field.fields.map((inputField) => (
                                            <input
                                                key={inputField.id}
                                                type="text"
                                                name={inputField.id}
                                                id={inputField.id}
                                                className="w-0 flex-1 rounded border border-[#B4BBC2] p-1 text-center text-[13px]"
                                                value={data[inputField.id]}
                                                onChange={(e) =>
                                                    handleChange(
                                                        inputField.id,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        ))
                                    ) : (
                                        <input
                                            type="text"
                                            name={field.id}
                                            id={field.id}
                                            className="w-0 flex-1 rounded border border-[#B4BBC2] p-1 text-center text-[13px]"
                                            value={data[field.id]}
                                            onChange={(e) =>
                                                handleChange(
                                                    field.id,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-end gap-4 p-4 text-xs">
                    <button
                        type="button"
                        onClick={closeVitalsModal}
                        disabled={processing}
                        className="btn rounded-md border border-accent px-4 py-2 duration-200 hover:bg-accent-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        onClick={handleSaveVitalSigns}
                        className="btn flex items-center gap-2 rounded-md border border-accent bg-accent px-4 py-2 text-white duration-200 hover:bg-accent/90 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {processing ? (
                            <>
                                <LoadingIndicator /> Saving...
                            </>
                        ) : (
                            "Save"
                        )}
                    </button>
                </div>
            </form>
        </ModalContainer>
    );
}
