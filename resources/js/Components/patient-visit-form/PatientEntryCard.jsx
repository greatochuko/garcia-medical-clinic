import React, { useState } from "react";
import PatientEntryModal from "@/Components/modals/PatientEntryModal";
import { PlusIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import SearchInput from "../ui/SearchInput";
import CreateMedicalCertificateModal from "../modals/CreateMedicalCertificateModal";
import AddLabRequestModal from "../modals/AddLabRequestModal";
import { route } from "ziggy-js";
import { Link } from "@inertiajs/react";

export default function PatientEntryCard({
    entry,
    index,
    patientId,
    appointmentId,
    inputOptions = [],
    medicalCertificate,
    laboratoryRequest,
    appointmentIsClosed,
    saving,
    medicalRecords = [],
    entryList,
    setEntryList,
    patientVisitRecordId,
}) {
    const [labRequestModalOpen, setLabRequestModalOpen] = useState(false);
    const [medicalCertificateModalOpen, setMedicalCertificateModalOpen] =
        useState(false);
    const [modifyEntryModalOpen, setModifyEntryModalOpen] = useState(false);
    const [entryInput, setEntryInput] = useState("");

    function handleAddEntry(e) {
        e.preventDefault();
        setEntryList([...entryList, entryInput]);
        setEntryInput("");
    }

    function openPatientEntryModal() {
        setModifyEntryModalOpen(true);
    }

    function handleUpdateEntry(newEntryList) {
        setEntryList(newEntryList);
        setModifyEntryModalOpen(false);
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
                            saving ||
                            entry.id === "medical_records"
                        }
                        onClick={openPatientEntryModal}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-transparent p-1.5 duration-200 hover:border-accent-400 hover:bg-accent-200 disabled:pointer-events-none disabled:opacity-50"
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

                    {entry.id === "plans" && (
                        <div className="absolute left-1/2 top-full flex min-w-max -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-lg bg-accent-200 p-1">
                            <button
                                disabled={appointmentIsClosed || saving}
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
                                disabled={appointmentIsClosed || saving}
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
                    className={`flex min-h-60 flex-1 flex-col gap-2 overflow-y-auto break-words p-4 ${entry.id === "plans" ? "pt-6" : ""}`}
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
                                      <Link
                                          href={route(
                                              "patientVisitRecords.show",
                                              {
                                                  id: record.id,
                                              },
                                          )}
                                          className="text-sm font-semibold hover:underline"
                                      >
                                          {
                                              record.medical_certificate
                                                  ?.diagnosis
                                          }
                                      </Link>
                                      <p className="text-[#5E8696]">
                                          {record.doctor.first_name},{" "}
                                          {record.doctor.middle_initial}{" "}
                                          {record.doctor.last_name} MD
                                      </p>
                                  </div>
                              </div>
                          ))
                        : entryList.map((datum, i) => (
                              <li key={i}>
                                  <span className="mr-2 font-bold">&gt;</span>
                                  {datum}
                              </li>
                          ))}
                    {entry.id === "plans" && (
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
                                onChange={(value) => setEntryInput(value)}
                                onSelect={(value) => setEntryInput(value)}
                                className="w-full rounded-xl p-3 pr-16"
                                options={inputOptions.map((opt) => ({
                                    label: opt,
                                    value: opt,
                                }))}
                                value={entryInput}
                                disabled={appointmentIsClosed || saving}
                            />
                            <button
                                type="submit"
                                disabled={
                                    appointmentIsClosed || saving || !entryInput
                                }
                                className="absolute right-0 top-1/2 flex h-full -translate-y-1/2 items-center justify-center rounded-xl rounded-bl-none bg-accent px-4 disabled:opacity-50"
                            >
                                <PlusIcon
                                    size={20}
                                    strokeWidth={5}
                                    color="#fff"
                                />
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <PatientEntryModal
                closeModal={() => setModifyEntryModalOpen(false)}
                open={modifyEntryModalOpen}
                entryList={entryList}
                entryId={entry.id}
                onSaveEntry={handleUpdateEntry}
            />

            {entry.id === "plans" && (
                <>
                    <CreateMedicalCertificateModal
                        open={medicalCertificateModalOpen}
                        closeModal={() => setMedicalCertificateModalOpen(false)}
                        appointmentId={appointmentId}
                        patientId={patientId}
                        medicalCertificate={medicalCertificate}
                        patientVisitRecordId={patientVisitRecordId}
                    />
                    <AddLabRequestModal
                        open={labRequestModalOpen}
                        closeModal={() => setLabRequestModalOpen(false)}
                        appointmentId={appointmentId}
                        patientVisitRecordId={patientVisitRecordId}
                        patientId={patientId}
                        laboratoryRequest={laboratoryRequest}
                    />
                </>
            )}
        </>
    );
}
