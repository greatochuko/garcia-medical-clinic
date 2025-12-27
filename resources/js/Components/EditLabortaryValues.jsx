import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";

export default function EditLabortaryValues({
    isOpen,
    onClose,
    onUpdate,
    patient,
    labvalues,
}) {
    if (!isOpen) return;

    const [test_name, settestname] = useState("");
    const [test_results, settestresult] = useState({});
    const wrapperRef = useRef(null);

    // 🔁 Reset state when labvalues change
    useEffect(() => {
        if (labvalues && typeof labvalues.values === "object") {
            settestname(labvalues.test_name || "");
            settestresult(labvalues.values);
        } else {
            console.warn("Invalid labvalues:", labvalues);
            settestname("");
            settestresult({});
        }
    }, [labvalues]);

    // ✅ Handle changing individual result values
    const handleResultChange = (date, newValue) => {
        settestresult((prev) => ({
            ...prev,
            [date]: newValue,
        }));
    };

    const handleSubmit = async () => {
        try {
            const formattedResults = {};

            Object.entries(test_results).forEach(([rawDate, value]) => {
                const d = new Date(rawDate);
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
                const dd = String(d.getDate()).padStart(2, "0");
                const formattedDate = `${yyyy}-${mm}-${dd}`;

                formattedResults[formattedDate] = value;
            });

            const data = {
                patient_id: patient.patient_id,
                test_name: test_name,
                result_values: formattedResults,
            };

            await axios.put(
                `/laboratory-tests/${labvalues.test_name}/${patient.patient_id}`,
                data,
            );

            settestname("");
            settestresult({});
            onClose(true);
            onUpdate(true);
        } catch (error) {
            console.error("Error updating lab test:", error);
            onClose(true);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={() => onClose(false)}
            className="relative z-50"
        >
            <div
                className="fixed inset-0 bg-black bg-opacity-20"
                aria-hidden="true"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-xl">
                    <Dialog.Title className="mb-6 text-xl font-bold text-[#429ABF]">
                        Edit Lab
                    </Dialog.Title>

                    <div className="grid grid-cols-3 gap-8">
                        {/* Patient Info */}
                        <div className="border-black-500 col-span-1 border-r text-sm text-gray-700">
                            <p className="text-[#A1A1A1]">
                                <span className="font-semibold text-[#429ABF]">
                                    Patient Name
                                </span>
                                <br />
                                {patient.first_name}, {patient.last_name}
                                <br />
                                {patient.age}, {patient.gender}
                            </p>
                            <p className="mt-4 text-[#A1A1A1]">
                                <span className="font-semibold text-[#429ABF]">
                                    Patient ID
                                </span>
                                <br />
                                {patient.patient_id}
                            </p>
                            <p className="mt-4 text-[#A1A1A1]">
                                <span className="font-semibold text-[#429ABF]">
                                    Blood Pressure
                                </span>
                                <br />
                                {patient?.vitals[0]?.blood_systolic_pressure}/
                                {patient?.vitals[0]?.blood_diastolic_pressure}
                            </p>
                            <p className="mt-4 text-[#A1A1A1]">
                                <span className="font-semibold text-[#429ABF]">
                                    Weight
                                </span>
                                <br />
                                {patient?.vitals[0]?.weight} Kg
                            </p>
                        </div>

                        {/* Test Inputs */}
                        <div className="col-span-2 space-y-4">
                            <div className="relative w-full max-w-md">
                                <label className="mb-1 block text-sm font-medium text-[#429ABF]">
                                    Laboratory Test Name{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-md border border-gray-300 p-2"
                                    value={test_name}
                                    onChange={(e) =>
                                        settestname(e.target.value)
                                    }
                                    placeholder="Set Lab Test"
                                />
                            </div>

                            <div className="space-y-4">
                                {Object.entries(test_results).map(
                                    ([date, value]) => (
                                        <div key={date}>
                                            <label className="block text-sm font-medium text-[#429ABF]">
                                                Result for {date}
                                            </label>
                                            <input
                                                type="text"
                                                className="mt-1 block w-1/2 rounded-md border border-gray-300 p-2"
                                                value={value}
                                                onChange={(e) =>
                                                    handleResultChange(
                                                        date,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    ),
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    className="cancel-button rounded-md bg-white px-4 py-2 text-[#429ABF]"
                                    onClick={handleSubmit}
                                >
                                    Update
                                </button>
                                <button
                                    className="save-button rounded-md px-4 py-2 text-white"
                                    onClick={() => onClose(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
