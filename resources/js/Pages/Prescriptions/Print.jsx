import React, { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import "../../../css/prescription-print.css";

export default function Print({ prescription }) {
    const [imagesLoaded, setImagesLoaded] = useState({
        logo: false,
        rx: false,
    });

    useEffect(() => {
        if (imagesLoaded.logo && imagesLoaded.rx) {
            window.print();
        }
    }, [imagesLoaded]);

    const medications = prescription?.medications || [];
    const pages = [];

    const MEDICATIONS_PER_PAGE = 6;

    // Split medications into chunks of 3 per page
    for (let i = 0; i < medications.length; i += MEDICATIONS_PER_PAGE) {
        pages.push(medications.slice(i, i + MEDICATIONS_PER_PAGE));
    }

    return (
        <>
            <Head title="Print Prescription" />

            {pages.map((pageMeds, pageIndex) => (
                <div className="page" key={pageIndex}>
                    {/* Header */}
                    <div className="header">
                        {/* <img src="/images/garcia-logo.png" alt="Logo" className="logo" /> */}
                        <img
                            src="/images/garcia-logo.png"
                            alt="Logo"
                            className="logo"
                            onLoad={() =>
                                setImagesLoaded((prev) => ({
                                    ...prev,
                                    logo: true,
                                }))
                            }
                        />

                        <div className="patient-row">
                            <div className="patient-info">
                                <div>
                                    <strong>Patient Name:</strong>
                                    <span className="text-[13px]">
                                        {" "}
                                        {prescription?.patient_name}{" "}
                                    </span>
                                </div>
                                <div>
                                    <strong>Address:</strong>{" "}
                                    {prescription?.address}
                                </div>
                            </div>
                            <div className="patient-meta">
                                <div>
                                    <strong>Date:</strong> {prescription?.date}
                                </div>
                                <div>
                                    <strong>Age/Sex:</strong>{" "}
                                    {prescription?.age}/{prescription?.sex}
                                </div>
                            </div>
                        </div>

                        <hr className="divider" />

                        {/* <img src="/images/rx.png" alt="Rx" className="rx-icon" /> */}
                        <img
                            src="/images/rx.png"
                            alt="Rx"
                            className="rx-icon"
                            onLoad={() =>
                                setImagesLoaded((prev) => ({
                                    ...prev,
                                    rx: true,
                                }))
                            }
                        />
                    </div>

                    {/* Content */}
                    {pageMeds.map((med, index) => {
                        const globalIndex =
                            pageIndex * MEDICATIONS_PER_PAGE + index + 1;
                        return (
                            <div className="medication-item" key={index}>
                                <div className="med-line">
                                    <span>
                                        {globalIndex}. {med.name.name}
                                    </span>
                                    <span className="tab-count">
                                        #{med.amount}
                                    </span>
                                </div>
                                <div className="sig-line">
                                    Sig: {med.quantity} {med.sig.name}
                                </div>
                            </div>
                        );
                    })}

                    {/* Doctor signature */}
                    <div className="doctor-signature">
                        <hr />
                        <p className="text-[13px]">
                            {prescription?.doctor_name}
                        </p>
                        <div>
                            <strong>License No.:</strong>
                            <span className="text-[13px]">
                                {" "}
                                {prescription?.license_no}{" "}
                            </span>
                        </div>
                        <div>
                            <strong>PTR No.:</strong>{" "}
                            <span className="text-[13px]">
                                {prescription?.ptr_no}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
