import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import PatientEntryModal from "@/Components/modals/PatientEntryModal";
import { PlusIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Loader2Icon } from "lucide-react";
import SearchInput from "../ui/SearchInput";
import CreateMedicalCertificateModal from "../modals/CreateMedicalCertificateModal";
import AddLabRequestModal from "../modals/AddLabRequestModal";

export default function PatientEntryCard({
    entry,
    entryData,
    index,
    setPatientEntryData,
    patientId,
    appointmentId,
    patientEntryData,
    inputOptions = [],
    medicalCertificate,
    laboratoryRequest,
    appointmentIsClosed,
    medicalRecords = [],
}) {
    const [loading, setLoading] = useState(false);
    const [labRequestModalOpen, setLabRequestModalOpen] = useState(false);
    const [medicalCertificateModalOpen, setMedicalCertificateModalOpen] =
        useState(false);
    const [updating, setUpdating] = useState(false);
    const [modifyEntryModalOpen, setModifyEntryModalOpen] = useState(false);
    const [entryList, setEntryList] = useState(
        entryData.data.map((ent) => ({
            id: ent.id,
            value: ent[entry.id],
        })),
    );

    function handleAddEntry(e) {
        e.preventDefault();

        router.post(
            route(`patientvisitform.patientEntryAdd.${entry.id}`),
            {
                patient_id: patientId,
                appointment_id: appointmentId,
                [entry.id]: patientEntryData[entry.id].input,
            },
            {
                onSuccess: (res) => {
                    setPatientEntryData((prev) => ({
                        ...prev,
                        [entry.id]: {
                            data: res.props.patient[entry.id] || [],
                            input: "",
                        },
                    }));
                    setEntryList(
                        res.props.patient[entry.id].map((ent) => ({
                            id: ent.id,
                            value: ent[entry.id],
                        })) || [],
                    );
                },
                onError: (errors) => {
                    console.error(errors);
                },
                onStart: () => {
                    setLoading(true);
                },
                onFinish: () => {
                    setLoading(false);
                },
                preserveScroll: true,
                preserveState: true,
            },
        );
    }

    function openPatientEntryModal() {
        setModifyEntryModalOpen(true);
    }

    function handleUpdateEntry(newEntryList) {
        const entriesToDelete = entryData.data.filter(
            (en) => !newEntryList.some((newEnt) => newEnt.id === en.id),
        );

        const entriesToUpdate = newEntryList.map((en) => ({
            id: en.id,
            [entry.id]: en.value,
        }));

        router.put(
            route(`patientvisitform.patientEntryUpdate.${entry.id}`),
            {
                entriesToDelete,
                entriesToUpdate,
            },
            {
                onStart: () => {
                    setUpdating(true);
                },
                onFinish: () => {
                    setUpdating(false);
                },
                onSuccess: () => {
                    setPatientEntryData((prev) => ({
                        ...prev,
                        [entry.id]: {
                            data: newEntryList.map((newEntry) => ({
                                id: newEntry.id,
                                [entry.id]: newEntry.value,
                            })),
                            input: "",
                        },
                    }));
                    setModifyEntryModalOpen(false);
                },
                onError: (errors) => {
                    console.error(errors);
                },
                preserveScroll: true,
            },
        );
    }

    return (
        <>
            <div
                className={twMerge(
                    `flex flex-col divide-y-2 divide-accent-200 rounded-md bg-white text-sm shadow-md ${
                        index < 2
                            ? "sm:col-span-3"
                            : `lg:col-span-2 ${entry.id === "medical_records" ? "sm:col-span-6" : "sm:col-span-3"}`
                    }`,
                )}
            >
                <div className="relative p-4">
                    <h3 className="text-center font-semibold">{entry.title}</h3>
                    <button
                        disabled={
                            appointmentIsClosed ||
                            entry.id === "medical_records"
                        }
                        onClick={openPatientEntryModal}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-transparent p-1.5 duration-200 hover:border-accent-400 hover:bg-accent-200 disabled:pointer-events-none"
                    >
                        <img
                            src={
                                entry.id === "medical_records"
                                    ? "/assets/icons/profile-card-icon.svg"
                                    : "/assets/icons/edit-icon-2.svg"
                            }
                            alt="edit icon"
                            width={16}
                            height={16}
                        />
                    </button>

                    {entry.id === "plan" && (
                        <div className="absolute left-1/2 top-full flex min-w-max -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-md bg-accent-200 p-1">
                            <button
                                disabled={appointmentIsClosed}
                                onClick={() => setLabRequestModalOpen(true)}
                                className="flex items-center gap-2 rounded-md border border-dashed border-accent bg-white px-2 py-1 text-xs font-medium duration-200 hover:bg-accent-100"
                            >
                                <img
                                    src="/assets/icons/laboratory-icon.svg"
                                    alt="pills icon"
                                />
                                LAB REQUEST
                            </button>
                            <button
                                disabled={appointmentIsClosed}
                                onClick={() =>
                                    setMedicalCertificateModalOpen(true)
                                }
                                className="flex items-center gap-2 rounded-md border border-dashed border-accent bg-white px-2 py-1 text-xs font-medium duration-200 hover:bg-accent-100"
                            >
                                <img
                                    src="/assets/icons/med-certification-icon.svg"
                                    alt="pills icon"
                                />
                                MED CERTIFICATE
                            </button>
                        </div>
                    )}
                </div>
                <ul
                    className={`flex min-h-60 flex-1 flex-col gap-2 overflow-y-auto break-words p-4 ${entry.id === "plan" ? "pt-6" : ""}`}
                >
                    {entry.id === "medical_records"
                        ? medicalRecords.map((record) => (
                              <div
                                  key={record.id}
                                  className="-mt-1.5 flex items-stretch gap-2 first:mt-0"
                              >
                                  <div className="flex flex-col items-center gap-[2px]">
                                      <span className="block rounded-full bg-[#EAECF0] p-2">
                                          <img
                                              src="/assets/icons/file-icon.svg"
                                              alt="File icon"
                                              className="h-3 w-3"
                                          />
                                      </span>
                                      <div className="w-[2px] flex-1 bg-[#EAECF0]"></div>
                                  </div>
                                  <div className="flex flex-col gap-1 pb-2 pt-1.5 text-xs">
                                      <p className="text-[#666666]">
                                          {new Date(
                                              record.appointment.appointment_date,
                                          ).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                          })}
                                      </p>
                                      <h4 className="text-sm font-semibold">
                                          {record.diagnosis}
                                      </h4>
                                      <p className="text-[#5E8696]">
                                          {record.doctor.first_name},{" "}
                                          {record.doctor.middle_initial}{" "}
                                          {record.doctor.last_name} MD
                                      </p>
                                  </div>
                              </div>
                          ))
                        : patientEntryData[entry.id].data.map((datum) => (
                              <li key={datum.id}>
                                  <span className="mr-2 font-bold">&gt;</span>
                                  {datum[entry.id]}
                              </li>
                          ))}
                    {entry.id === "plan" && (
                        <>
                            {laboratoryRequest.length > 0 && (
                                <li className="text-[#429ABF]">
                                    <span className="mr-2 font-bold">&gt;</span>
                                    For{" "}
                                    {laboratoryRequest
                                        .map(
                                            (labReq) =>
                                                labReq.test_name ||
                                                labReq.others,
                                        )
                                        .join(", ")}
                                </li>
                            )}
                            {medicalCertificate && (
                                <li className="text-[#429ABF]">
                                    <span className="mr-2 font-bold">&gt;</span>
                                    Issued Medical Certificate
                                </li>
                            )}
                        </>
                    )}
                </ul>
                {!entry.hideInput && (
                    <div className="p-4">
                        <form onSubmit={handleAddEntry} className="relative">
                            <SearchInput
                                onChange={(value) =>
                                    setPatientEntryData((prev) => ({
                                        ...prev,
                                        [entry.id]: {
                                            ...prev[entry.id],
                                            input: value,
                                        },
                                    }))
                                }
                                onSelect={(value) =>
                                    setPatientEntryData((prev) => ({
                                        ...prev,
                                        [entry.id]: {
                                            ...prev[entry.id],
                                            input: value,
                                        },
                                    }))
                                }
                                className="w-full rounded-xl p-3 pr-16"
                                options={inputOptions.map((opt) => ({
                                    label: opt,
                                    value: opt,
                                }))}
                                value={entryData.input}
                                disabled={appointmentIsClosed}
                            />
                            <button
                                type="submit"
                                disabled={
                                    appointmentIsClosed ||
                                    !entryData.input ||
                                    loading
                                }
                                className="absolute right-0 top-1/2 flex h-full -translate-y-1/2 items-center justify-center rounded-xl rounded-bl-none bg-accent px-4 disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2Icon
                                        size={20}
                                        className="animate-spin text-white"
                                    />
                                ) : (
                                    <PlusIcon
                                        size={20}
                                        strokeWidth={5}
                                        color="#fff"
                                    />
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <PatientEntryModal
                closeModal={() => setModifyEntryModalOpen(false)}
                open={modifyEntryModalOpen}
                entryList={entryList}
                setEntryList={setEntryList}
                entryId={entry.id}
                updating={updating}
                onSaveEntry={handleUpdateEntry}
            />

            {entry.id === "plan" && (
                <>
                    <CreateMedicalCertificateModal
                        open={medicalCertificateModalOpen}
                        closeModal={() => setMedicalCertificateModalOpen(false)}
                        appointmentId={appointmentId}
                        patientId={patientId}
                        medicalCertificate={medicalCertificate}
                    />
                    <AddLabRequestModal
                        open={labRequestModalOpen}
                        closeModal={() => setLabRequestModalOpen(false)}
                        appointmentId={appointmentId}
                        patientId={patientId}
                        laboratoryRequest={laboratoryRequest}
                    />
                </>
            )}
        </>
    );
}
