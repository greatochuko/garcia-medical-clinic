import { Head } from "@inertiajs/react";
import React, { useEffect } from "react";
import "../../../css/laboratory-print.css";
import "../../../css/print-preview.css";

export default function Print({ laboratory }) {
    useEffect(() => {
        window.print();
    }, []);

    const medications = laboratory?.medications || [];

    const pageSize = 15; // ✅ Show 5 meds per page
    const pages = [];
    for (let i = 0; i < medications.length; i += pageSize) {
        pages.push(medications.slice(i, i + pageSize));
    }

    return (
        <>
            <Head title="Print Prescription" />

            {pages.map((pageMeds, pageIndex) => (
                <div className="page" key={pageIndex}>
                    {/* Header */}
                    <div className="header">
                        <img
                            src="/images/garcia-logo.png"
                            alt="Logo"
                            className="logo"
                        />

                        <div className="patient-row">
                            <div className="patient-info">
                                <div>
                                    <strong>Name:</strong>{" "}
                                    {laboratory?.patient_name}
                                </div>
                                <div>
                                    <strong>Address:</strong>{" "}
                                    {laboratory?.address}
                                </div>
                            </div>
                            <div className="patient-meta">
                                <div>
                                    <strong>Date:</strong> {laboratory?.date}
                                </div>
                                <div>
                                    <strong>Age/Sex:</strong> {laboratory?.age}/
                                    {laboratory?.sex}
                                </div>
                            </div>
                        </div>

                        <hr className="divider" />

                        {/* <img src="/images/rx.png" alt="Rx" className="rx-icon" /> */}
                        <div className="text-center">Laboratory Request</div>
                    </div>

                    {/* Content */}
                    <div className="content">
                        {pageMeds.map((med, index) => {
                            const globalIndex =
                                pageIndex * pageSize + index + 1;
                            return (
                                <div className="medication-item" key={index}>
                                    <div className="med-line">
                                        <span>
                                            {globalIndex}. {med.name}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Doctor signature */}
                    <div className="doctor-signature">
                        <hr />
                        <p className="doc-name">
                            {laboratory?.doctor_name}
                            {laboratory?.license_no ? " MD" : ""}
                        </p>
                        <div>
                            <strong>License No.:</strong>{" "}
                            {laboratory?.license_no}
                        </div>
                        <div>
                            <strong>PTR No.:</strong> {laboratory?.ptr_no}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
