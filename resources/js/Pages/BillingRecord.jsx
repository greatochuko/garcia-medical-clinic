import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Input from "@/Components/layout/Input";
import Paginator from "@/Components/layout/Paginator";
import BillingModal from "@/Components/modals/BillingModal";
import { route } from "ziggy-js";
import toast from "react-hot-toast";

function formatPHP(amount) {
    return `PHP ${Number(amount).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Billingrecord({ auth, billingData }) {
    const [user, setUser] = useState(auth.user);
    const [searchQuery, setSearchQuery] = useState("");

    // Shared modal state
    const [billingModalOpen, setBillingModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);

    async function handleShowBilling(record) {
        try {
            const res = await fetch(
                route("patientvisitform.patientprescriptionget", {
                    id: record.patient.patient_id,
                    app_id: record.appointment.id,
                }),
            );
            const data = await res.json();
            setPrescriptions(data.data);
            setSelectedRecord(record);
            setBillingModalOpen(true);
        } catch (error) {
            toast.error("An error occurred fetching prescriptions");
            console.error(error);
        }
    }

    return (
        <AuthenticatedLayout
            pageTitle="Billing Records"
            user={user}
            setUser={setUser}
        >
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

                    <table className="text-sm">
                        <thead>
                            <tr>
                                <th className="p-4">Invoice</th>
                                <th className="p-4 text-left">
                                    Patient Information
                                </th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Services</th>
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
                            patient={selectedRecord.patient}
                            closeModal={() => setBillingModalOpen(false)}
                            prescriptions={prescriptions}
                            invoiceNumber={selectedRecord.id}
                            readOnly
                        />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function BillingRow({ record, onShowBilling }) {
    return (
        <tr
            onClick={() => onShowBilling(record)}
            className="cursor-pointer duration-100 hover:bg-[#F4F4F4]"
        >
            <td className="p-4 text-center">#{record.id}</td>
            <td className="p-4">
                <p className="font-bold">
                    {record.patient.first_name}
                    {", "}
                    {record.patient.middle_initial} {record.patient.last_name}
                </p>
                <span className="text-xs text-[#666666]">
                    {record.patient.age}, {record.patient.gender}
                </span>
            </td>
            <td className="p-4 text-center">
                {new Date(record.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </td>
            <td className="p-4 text-center">{record.services}</td>
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
