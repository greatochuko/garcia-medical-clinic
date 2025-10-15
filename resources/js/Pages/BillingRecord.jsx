import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Input from "@/Components/layout/Input";
import Paginator from "@/Components/layout/Paginator";
import BillingModal from "@/Components/modals/BillingModal";

function formatPHP(amount) {
    return `PHP ${Number(amount).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Billingrecord({ billingData }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [billingModalOpen, setBillingModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    async function handleShowBilling(record) {
        setSelectedRecord(record);
        setBillingModalOpen(true);
    }

    return (
        <AuthenticatedLayout pageTitle="Billing Records">
            <div className="max-w-full flex-1 pt-6">
                <div className="mx-auto flex h-full w-[95%] max-w-screen-2xl flex-col gap-4 bg-white text-accent">
                    <div className="relative mb-2 flex flex-col items-center gap-1 border-b-2 border-accent-200 p-4 px-4 pb-6 text-center">
                        <h1 className="text-center text-sm font-bold">
                            BILLING RECORDS
                        </h1>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                            }}
                            className="relative my-2 flex w-[90%] max-w-60 md:absolute md:left-4 md:top-full md:m-0 md:-translate-y-1/2 lg:max-w-xs"
                        >
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-0 flex-1 pr-10"
                                placeholder="Type here to search"
                            />
                            <img
                                src="/assets/icons/search-icon.svg"
                                alt="Search Icon"
                                width={18}
                                height={18}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            />
                        </form>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="whitespace-nowrap">
                                    <th className="p-4">Invoice</th>
                                    <th className="min-w-44 p-4 text-left">
                                        Patient Information
                                    </th>
                                    <th className="min-w-40 p-4">Date</th>
                                    <th className="min-w-40 p-4">Services</th>
                                    <th className="p-4">Total Amount Paid</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billingData.data.map((record) => (
                                    <BillingRow
                                        key={record.id}
                                        record={record}
                                        onShowBilling={handleShowBilling}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Paginator
                        currentPage={billingData.current_page}
                        per_page={billingData.per_page}
                        totalPages={billingData.last_page}
                        totalList={billingData.total}
                        routeName="billingrecord"
                    />

                    {/* Shared Modal */}
                    {selectedRecord && (
                        <BillingModal
                            open={billingModalOpen}
                            appointment={selectedRecord.appointment}
                            patient={
                                selectedRecord.patient.id
                                    ? selectedRecord.patient
                                    : { ...selectedRecord.patient }
                            }
                            closeModal={() => setBillingModalOpen(false)}
                            prescriptions={selectedRecord.prescriptions}
                            invoiceNumber={selectedRecord.id}
                            readOnly
                            service={selectedRecord.service}
                        />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function BillingRow({ record, onShowBilling }) {
    const patient = record.patient;
    const patientFullName = patient?.id
        ? `${patient.first_name}, ${patient.middle_initial} ${patient.last_name}`
        : "Walk-In Patient";

    return (
        <tr
            onClick={() => onShowBilling(record)}
            className="cursor-pointer duration-100 hover:bg-[#F4F4F4]"
        >
            <td className="p-4 text-center">#{record.id}</td>
            <td className="p-4">
                <p className="font-bold">{patientFullName}</p>
                <span className="text-xs text-[#666666]">
                    {patient?.id
                        ? `${patient.age}, ${patient.gender}`
                        : "No data found"}
                </span>
            </td>
            <td className="p-4 text-center">
                {new Date(record.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </td>
            <td className="p-4 text-center">
                {record.service.name || "Walk In"}
            </td>
            <td className="p-4 text-center">{formatPHP(record.final_total)}</td>
            <td className="p-4 text-center">
                <span
                    className={`w-full rounded px-4 py-1 text-xs ${record.paid ? "bg-[#6ECC62] text-white" : "border border-dashed border-accent"}`}
                >
                    {record.paid ? "Paid" : "Unpaid"}
                </span>
            </td>
        </tr>
    );
}
