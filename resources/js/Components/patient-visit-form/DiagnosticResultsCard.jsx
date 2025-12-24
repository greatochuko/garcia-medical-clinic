import { ExpandIcon } from "lucide-react";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import AddLaboratoryResultsModal from "../modals/AddLaboratoryResultsModal";

const initialDiagnosticResults = [
    {
        id: "hematology",
        name: "Hematology",
        panels: [
            {
                category: "Complete Blood Count",
                tests: [
                    { name: "Hemoglobin" },
                    { name: "Hematocrit" },
                    { name: "Red Blood Cell" },
                    { name: "White Blood Cell" },
                    { name: "Neutrophils" },
                    { name: "Lymphocytes" },
                    { name: "Monocytes" },
                    { name: "Eosinophils" },
                    { name: "Basophils" },
                    { name: "Platelet Count" },
                    { name: "MCV" },
                    { name: "MCH" },
                ],
            },
            {
                category: "Coagulation Panel",
                tests: [
                    { name: "Protime (PT)" },
                    { name: "Partial Thromboplastin Time (PTT)" },
                    { name: "Clotting Time" },
                    { name: "Bleeding Time" },
                ],
            },
            {
                category: "Others",
                tests: [
                    { name: "Reticulocyte Count" },
                    { name: "ESR" },
                    { name: "CRP" },
                    { name: "ANA" },
                ],
            },
        ],
    },
    {
        id: "clinical_chemistry",
        name: "Clinical Chemistry",
        panels: [
            {
                category: "Serum Electrolytes",
                tests: [
                    { name: "Sodium (Na)" },
                    { name: "Potassium (K)" },
                    { name: "Magnesium (Mg)" },
                    { name: "Calcium (Ca)" },
                    { name: "Chloride (Cl)" },
                ],
            },
            {
                category: "Kidney Panel",
                tests: [
                    { name: "Sodium (Na)" },
                    { name: "Potassium (K)" },
                    { name: "Magnesium (Mg)" },
                ],
            },
            {
                category: "Complete Lipid Profile",
                tests: [
                    { name: "Total Cholesterol" },
                    { name: "Triglycerides" },
                    { name: "HDL" },
                    { name: "LDL" },
                ],
            },
            {
                category: "Blood Sugar",
                tests: [
                    { name: "Fasting Blood Sugar" },
                    { name: "Random Blood Sugar" },
                    { name: "HbA1c" },
                    { name: "1 HR PPBG" },
                ],
            },
            {
                category: "Liver & Pancreatic Enzyme",
                tests: [
                    { name: "Serum Amylase" },
                    { name: "Serum Lipase" },
                    { name: "SGOT" },
                    { name: "SGPT" },
                    { name: "Total Bilirubin" },
                    { name: "B1 Bilirubin" },
                    { name: "B2 Bilirubin" },
                ],
            },
        ],
    },
    {
        id: "clinical_microscopy",
        name: "Clinical Microscopy",
        panels: [
            {
                category: "Urinalysis",
                tests: [
                    { name: "Color" },
                    { name: "Transparency" },
                    { name: "pH" },
                    { name: "Specific Gravity" },
                    { name: "Glucose" },
                    { name: "Protein" },
                    { name: "Pus Cells" },
                    { name: "Red Blood Cells" },
                    { name: "Epithelial Cells" },
                    { name: "Mucus Threads" },
                    { name: "Bacteria" },
                ],
            },
            {
                category: "Fecalysis",
                tests: [
                    { name: "Color" },
                    { name: "Consistency" },
                    { name: "Pus Cells" },
                    { name: "Yeast Cells" },
                    { name: "Entamoeba Histolytica" },
                    { name: "Trichuris Trichiura" },
                    { name: "Ascaris Lumbricoides" },
                ],
            },
            {
                category: "Other",
                tests: [
                    { name: "Urine Albumin" },
                    { name: "Urine Culture" },
                    { name: "Pregnancy Test (Urine)" },
                ],
            },
        ],
    },
    {
        id: "serology_radiology_others",
        name: "Serology, Radiology, Others",
        panels: [
            {
                category: "Serology",
                tests: [
                    { name: "HBsAg Screening" },
                    { name: "Hepatitis Profiling" },
                    { name: "TSH" },
                    { name: "FT3/T3" },
                    { name: "FT4/T4" },
                    { name: "Serum B-HCG" },
                    { name: "Dengue NS1" },
                    { name: "Dengue IgG / IgM" },
                ],
            },
            {
                category: "Radiology",
                tests: [
                    { name: "Chest Xray PA View" },
                    { name: "Chest Xray AP View" },
                    { name: "Whole Abdominal UTZ (WAUTZ)" },
                    { name: "ECG 12-Leads" },
                ],
            },
            {
                category: "Others",
                tests: [
                    { name: "Test 1" },
                    { name: "Test 2" },
                    { name: "Test 3" },
                    { name: "Test 4" },
                ],
            },
        ],
    },
];

export default function DiagnosticResultsCard({ appointmentIsClosed, saving }) {
    const [currentTab, setCurrentTab] = useState("hematology");
    const [addResultsModalOpen, setAddResultsModalOpen] = useState(false);
    const [diagnosticResults, setDiagnosticResults] = useState(
        initialDiagnosticResults.map((res) => ({
            ...res,
            panels: res.panels.map((pan) => ({
                ...pan,
                tests: pan.tests.map((test) => ({
                    ...test,
                    today: "",
                    todayInput: "",
                })),
            })),
        })),
    );

    const loading = appointmentIsClosed || saving;

    return (
        <>
            <div
                className={`divide-y-2 divide-accent-200 rounded-md bg-white shadow-md ${loading ? "grayscale" : ""}`}
            >
                <div className="relative p-2 pb-20 text-center md:pb-6">
                    <h2 className="text-sm font-bold">DIAGNOSTIC RESULTS</h2>
                    <button
                        onClick={() => {
                            if (loading) return;
                            setAddResultsModalOpen(true);
                        }}
                        disabled={loading}
                        className="absolute right-3 top-3 rounded-md border border-transparent p-1 duration-200 hover:border-accent-400 hover:bg-accent-200 disabled:pointer-events-none"
                    >
                        <ExpandIcon
                            className="h-3.5 w-3.5 text-accent"
                            strokeWidth={2.5}
                        />
                    </button>
                    <button
                        disabled={loading}
                        onClick={() => {
                            if (loading) return;
                            setAddResultsModalOpen(true);
                        }}
                        className="absolute left-1/2 top-12 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-md border border-dashed border-accent bg-white px-2 py-1.5 text-xs font-medium duration-200 hover:bg-accent-200 disabled:pointer-events-none md:left-4 md:top-full md:translate-x-0"
                    >
                        <PlusIcon size={12} />
                        ADD RESULTS
                    </button>
                    <div className="absolute left-1/2 top-full grid w-[90%] max-w-72 -translate-x-1/2 -translate-y-1/2 grid-cols-2 items-center gap-1 rounded-md bg-accent-200 p-1 md:flex md:max-w-fit">
                        {diagnosticResults.map((result) => (
                            <button
                                onClick={() => setCurrentTab(result.id)}
                                key={result.id}
                                className={`whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium duration-200 ${currentTab === result.id ? "bg-accent text-white" : "hover:bg-accent-300"}`}
                            >
                                {result.id === "serology_radiology_others" ? (
                                    <>
                                        <span className="hidden md:inline">
                                            {result.name}
                                        </span>
                                        <span className="md:hidden">
                                            Others
                                        </span>
                                    </>
                                ) : (
                                    result.name
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-4 pt-12 text-xs md:p-8">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-accent-200">
                                <th className="min-w-52 p-2 text-left">
                                    TEST NAME
                                </th>
                                <th className="p-2">TODAY</th>
                            </tr>
                        </thead>
                        {diagnosticResults.map((result) => (
                            <tbody
                                hidden={currentTab !== result.id}
                                key={result.id}
                            >
                                {result.panels.map((panel) => (
                                    <React.Fragment key={panel.category}>
                                        <tr className="even:bg-[#FAFAFA]">
                                            <td
                                                colSpan={2}
                                                className="p-1 font-bold"
                                            >
                                                {panel.category}
                                            </td>
                                        </tr>
                                        {panel.tests.map((test) => (
                                            <tr
                                                key={test.name}
                                                className="even:bg-[#FAFAFA] hover:bg-neutral-100"
                                            >
                                                <td className="p-1">
                                                    {test.name}
                                                </td>
                                                <td className="p-1 text-center">
                                                    {test.today || "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        ))}
                    </table>
                </div>
            </div>

            <AddLaboratoryResultsModal
                closeModal={() => setAddResultsModalOpen(false)}
                open={addResultsModalOpen}
                diagnosticResults={diagnosticResults}
                setDiagnosticResults={setDiagnosticResults}
            />
        </>
    );
}
