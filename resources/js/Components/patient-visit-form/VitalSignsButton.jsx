import React, { useState } from "react";
import VitalsModal from "../modals/VitalsModal";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";

function generateVitalsData(patient) {
    return {
        patient_id: patient.patient_id,
        blood_diastolic_pressure:
            patient.vitals?.blood_diastolic_pressure || "",
        blood_systolic_pressure: patient.vitals?.blood_systolic_pressure || "",
        heart_rate: patient.vitals?.heart_rate || "",
        o2saturation: patient.vitals?.o2saturation || "",
        temperature: parseInt(patient.vitals?.temperature) || "",
        height_ft: patient.vitals?.height_ft || "",
        height_in: patient.vitals?.height_in || "",
        weight: parseInt(patient.vitals?.weight) || "",
    };
}

export default function VitalSignsButton({ patient, setPatient }) {
    const { post, put, processing, data, setData } = useForm(
        generateVitalsData(patient),
    );

    const [vitalSignsModalOpen, setVitalSignsModalOpen] = useState(false);

    function updateVitals(newVitals) {
        setPatient((prev) => ({
            ...prev,
            vitals: { ...prev.vitals, ...newVitals },
        }));
    }

    function handleSaveVitalSigns(e) {
        e.preventDefault();

        if (patient.vitals) {
            put(
                route("vitalsignsmodal.update", {
                    id: patient.vitals.id,
                }),
                {
                    onSuccess: () => {
                        updateVitals(data);
                        setVitalSignsModalOpen(false);
                    },
                    preserveScroll: true,
                },
            );
        } else {
            post(route("vitalsignsmodal.add"), {
                onSuccess: () => {
                    updateVitals(data);
                    setVitalSignsModalOpen(false);
                },

                preserveScroll: true,
            });
        }
    }

    return (
        <>
            <button
                onClick={() => setVitalSignsModalOpen(true)}
                className="p-1 duration-100 active:scale-90"
            >
                <img
                    src="/assets/icons/add-one-icon.svg"
                    alt="add one icon "
                    width={18}
                    height={18}
                />
            </button>

            <VitalsModal
                open={vitalSignsModalOpen}
                closeModal={() => setVitalSignsModalOpen(false)}
                patient={patient}
                data={data}
                handleSaveVitalSigns={handleSaveVitalSigns}
                processing={processing}
                setData={setData}
            />
        </>
    );
}
