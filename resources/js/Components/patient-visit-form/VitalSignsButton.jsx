import React, { useState } from "react";
import VitalsModal from "../modals/VitalsModal";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { generateVitalsData } from "@/utils/generateVitalsData";

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

    function openVitalsModal() {
        setVitalSignsModalOpen(true);
        setData(generateVitalsData(patient));
    }

    return (
        <>
            <button
                onClick={openVitalsModal}
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
