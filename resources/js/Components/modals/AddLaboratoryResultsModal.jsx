import React, { useState } from "react";
import ModalContainer from "../layout/ModalContainer";
import { XIcon } from "lucide-react";
import Input from "../layout/Input";
import { twMerge } from "tailwind-merge";
import LoadingIndicator from "../layout/LoadingIndicator";
import { useForm } from "@inertiajs/react";

export default function AddLaboratoryResultsModal({
    closeModal: closeLaboratoryResultsModal,
    open,
    diagnosticResults,
    setDiagnosticResults,
}) {
    const [currentTab, setCurrentTab] = useState(diagnosticResults[0].id);
    const { processing } = useForm();

    function closeModal() {
        closeLaboratoryResultsModal();
    }

    function handleSaveResults(e) {
        e.preventDefault();
        setDiagnosticResults((prev) =>
            prev.map((res) => ({
                ...res,
                panels: res.panels.map((pan) => ({
                    ...pan,
                    tests: pan.tests.map((test) => ({
                        ...test,
                        today: test.todayInput,
                    })),
                })),
            })),
        );
        closeModal();
    }

    function handleInputChange(panelCategory, fieldName, newValue) {
        setDiagnosticResults((prev) =>
            prev.map((res) =>
                res.id === currentTab
                    ? {
                          ...res,
                          panels: res.panels.map((pan) =>
                              pan.category === panelCategory
                                  ? {
                                        ...pan,
                                        tests: pan.tests.map((test) =>
                                            test.name === fieldName
                                                ? {
                                                      ...test,
                                                      todayInput: newValue,
                                                  }
                                                : test,
                                        ),
                                    }
                                  : pan,
                          ),
                      }
                    : res,
            ),
        );
    }

    const activeResult = diagnosticResults.find((res) => res.id === currentTab);

    return (
        <ModalContainer closeModal={closeModal} open={open}>
            <form
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSaveResults}
                className={`flex max-h-[80%] w-[90%] max-w-6xl flex-col divide-y-2 divide-accent-200 overflow-y-auto rounded-lg bg-white text-sm duration-200 ${open ? "" : "translate-y-2"}`}
            >
                <div className="relative flex items-center justify-between px-4 py-2.5 pb-6 pr-3">
                    <h5 className="font-semibold">Add Laboratory Results</h5>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="rounded-md border border-transparent p-1 duration-200 hover:border-accent-400 hover:bg-accent-200"
                    >
                        <XIcon strokeWidth={4} size={16} />
                    </button>

                    <div className="absolute left-1/2 top-full z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 bg-accent-200 p-1">
                        {diagnosticResults.map((result) => (
                            <button
                                type="button"
                                onClick={() => setCurrentTab(result.id)}
                                key={result.id}
                                className={`whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium ${
                                    currentTab === result.id
                                        ? "bg-accent text-white"
                                        : ""
                                }`}
                            >
                                {result.name}
                            </button>
                        ))}
                    </div>
                </div>

                {activeResult && (
                    <div
                        className={`grid gap-6 overflow-y-auto p-4 pt-8 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 ${
                            currentTab === "serology_radiology_others"
                                ? "grid-cols-3"
                                : ""
                        }`}
                    >
                        {activeResult.panels.map((panel, i) => (
                            <LaboratoryResultInputSection
                                key={panel.category}
                                inputFields={panel.tests}
                                onInputChange={(fieldName, newValue) =>
                                    handleInputChange(
                                        panel.category,
                                        fieldName,
                                        newValue,
                                    )
                                }
                                title={panel.category}
                                className={
                                    currentTab === "hematology" ||
                                    currentTab === "clinical_microscopy"
                                        ? `lg:h-fit ${i === 0 ? "row-span-2 lg:row-span-1" : ""}`
                                        : currentTab ===
                                            "serology_radiology_others"
                                          ? i === 0
                                              ? "row-span-2"
                                              : "col-span-2"
                                          : ""
                                }
                            />
                        ))}
                    </div>
                )}

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

function LaboratoryResultInputSection({
    inputFields,
    onInputChange,
    title,
    className,
}) {
    return (
        <div
            className={twMerge(
                "relative flex min-w-64 flex-col gap-2 rounded-md border-4 border-accent-200 p-4 pt-4",
                className,
            )}
        >
            <h4 className="absolute left-4 top-0 -translate-y-1/2 whitespace-nowrap bg-white p-1 text-sm font-bold">
                {title}
            </h4>
            {inputFields.map((field, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between gap-4"
                >
                    <label htmlFor={field.name}>{field.name}</label>
                    <Input
                        id={field.name}
                        name={field.name}
                        value={field.todayInput}
                        onChange={(e) =>
                            onInputChange(field.name, e.target.value)
                        }
                        className="max-w-20"
                    />
                </div>
            ))}
        </div>
    );
}
