import React from "react";
import ModalContainer from "../layout/ModalContainer";
import XIcon from "../icons/XIcon";
import LoadingIndicator from "../layout/LoadingIndicator";
import { useForm } from "@inertiajs/react";
import Input from "../layout/Input";
import { route } from "ziggy-js";

const labRequestOptions = [
    {
        category: "Hematology",
        tests: [
            "CBC",
            "Protime (PT)",
            "PTT",
            "Clotting Time",
            "Bleeding Time",
            "CBC with Platelet Count",
            "Reticulocyte Count",
            "ESR",
            "Peripheral Blood Smear",
            "ABO with RH Typing",
        ],
    },
    {
        category: "Serology",
        tests: [
            "Dengue NS1",
            "Dengue IgG / IgM",
            "HBsAg Screening",
            "Hepatitis Profiling",
            "TSH",
            "FT3 / T3",
            "FT4 / T4",
            "Serum B-HCG",
        ],
    },
    {
        category: "Clinical Chemistry",
        tests: [
            "Fasting Blood Sugar",
            "Random Blood Sugar",
            "OGTT 50mg",
            "OGTT 75mg",
            "OGTT 100mg",
            "HbA1c",
            "2 HR PPBG",
            "Serum Uric Acid",
            "BUN",
            "Creatinine",
            "Serum Sodium (Na)",
            "Serum Potassium (K)",
            "Serum Magnesium (Mg)",
            "Serum Calcium (Ca)",
            "Serum Chloride (Cl)",
            "Complete Lipid Profile",
            "SGPT",
            "SGOT",
            "Total Bilirubin, B1, B2",
            "Serum Amylase",
            "Serum Lipase",
        ],
    },
    {
        category: "Clinical Microscopy",
        tests: [
            "Urinalysis",
            "Urine Albumin",
            "Urine Culture",
            "Fecalysis",
            "FOBT",
            "Pregnancy Test (Urine)",
        ],
    },
    {
        category: "Radiology",
        tests: [
            "Chest X-Ray PA View",
            "Chest X-Ray AP View",
            "Whole Abdominal Ultrasound (WAUTZ)",
            "ECG 12-Leads",
        ],
    },
    {
        category: "Other Tests",
        tests: [
            // this one is free text input, not radio
            { type: "input", placeholder: "Enter other tests" },
        ],
    },
];

export default function AddLabRequestModal({
    open,
    closeModal: closeLabRequestModal,
    patientId,
    appointmentId,
    laboratoryRequest,
}) {
    const initialData = {
        patient_id: patientId,
        appointment_id: appointmentId.toString(),
        test_names: laboratoryRequest.map((lr) => lr.test_name) || [],
        others: "",
    };
    const { processing, data, setData, post } = useForm(initialData);

    function closeModal() {
        setTimeout(() => {
            setData(initialData);
        }, 200);
        closeLabRequestModal();
    }

    function handleCreateLabRequest(e) {
        e.preventDefault();
        post(route("laboratory.store"), {
            onSuccess: () => {
                closeLabRequestModal();
            },
            onError: (errors) => {
                console.error(errors);
            },
            preserveScroll: true,
            preserveState: true,
        });
    }

    return (
        <ModalContainer closeModal={closeModal} open={open}>
            <form
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleCreateLabRequest}
                className={`flex max-h-[80%] w-[90%] max-w-6xl flex-col divide-y-2 divide-accent-200 overflow-y-auto rounded-lg bg-white text-sm duration-200 ${open ? "" : "translate-y-2"}`}
            >
                <div className="relative flex items-center justify-between px-4 py-2.5 pr-3">
                    <h5 className="font-semibold">Add Laboratory Requests</h5>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="rounded-md border border-transparent p-1 duration-200 hover:border-accent-400 hover:bg-accent-200"
                    >
                        <XIcon strokeWidth={4} size={16} />
                    </button>
                </div>

                <div className="grid flex-1 gap-4 overflow-y-auto py-4 sm:grid-cols-2">
                    {labRequestOptions.map((section) => (
                        <div
                            key={section.category}
                            className={`flex flex-col gap-2 ${section.category === "Clinical Chemistry" ? "sm:col-span-2" : ""}`}
                        >
                            <h3 className="bg-gradient-to-r from-accent-200 to-white px-4 py-1 font-bold uppercase">
                                {section.category}
                            </h3>
                            <div
                                className={`grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-2 px-4 ${section.category === "Clinical Chemistry" ? "" : ""}`}
                            >
                                {section.tests.map((test, i) =>
                                    section.category === "Other Tests" ? (
                                        <Input
                                            key={i}
                                            type="text"
                                            className="col-span-2"
                                        />
                                    ) : (
                                        <label
                                            key={i}
                                            className="flex cursor-pointer items-center gap-2"
                                        >
                                            <CustomCheckBox
                                                name={section.category}
                                                value={test}
                                                checked={data.test_names.includes(
                                                    test,
                                                )}
                                                onChange={() => {
                                                    setData((prev) => ({
                                                        ...prev,
                                                        test_names:
                                                            prev.test_names.includes(
                                                                test,
                                                            )
                                                                ? prev.test_names.filter(
                                                                      (t) =>
                                                                          t !==
                                                                          test,
                                                                  )
                                                                : [
                                                                      ...prev.test_names,
                                                                      test,
                                                                  ],
                                                    }));
                                                }}
                                            />
                                            <span className="flex-1">
                                                {test}
                                            </span>
                                        </label>
                                    ),
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-end gap-4 p-4 text-xs">
                    <button
                        type="button"
                        onClick={closeModal}
                        disabled={processing}
                        className="btn rounded-md border border-accent px-4 py-2 duration-200 hover:bg-accent-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
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

function CustomCheckBox({ name, value, checked, onChange }) {
    return (
        <>
            <div
                onKeyDown={(e) => {
                    if (e.code === "Space") {
                        e.preventDefault();
                        onChange();
                    }
                }}
                className="relative h-4 w-4 rounded-full border border-accent outline-none focus-visible:ring-2 focus-visible:ring-[#089bab]"
                tabIndex={0}
            >
                {checked && (
                    <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
                )}
            </div>
            <input
                type="radio"
                name={name}
                value={value}
                defaultChecked={checked}
                // onChange={onChange}
                onClick={onChange}
                className="hidden"
            />
        </>
    );
}
