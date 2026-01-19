import React, { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import "../../../css/print-preview.css";

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
    const MEDICATIONS_PER_PAGE = 3;
    const pages = [];

    // Split medications into chunks
    for (let i = 0; i < medications.length; i += MEDICATIONS_PER_PAGE) {
        pages.push(medications.slice(i, i + MEDICATIONS_PER_PAGE));
    }

    return (
        <>
            <Head title="Print Prescription" />

            {pages.map((pageMeds, pageIndex) => (
                <div
                    key={pageIndex}
                    // className="relative mx-auto box-border break-after-page p-[10mm]"
                    className="page"
                >
                    {/* Header */}
                    <div className="mb-2 text-center">
                        <img
                            src="/images/garcia-logo.png"
                            alt="Logo"
                            className="mx-auto mb-2 block w-[60mm]"
                            onLoad={() =>
                                setImagesLoaded((prev) => ({
                                    ...prev,
                                    logo: true,
                                }))
                            }
                        />

                        <div className="mb-1 flex justify-between text-[10px]">
                            <div className="flex-1 text-left">
                                <div>
                                    <strong>Name:</strong>{" "}
                                    {prescription?.patient_name || "N/A"}
                                </div>
                                <div>
                                    <strong>Address:</strong>{" "}
                                    {prescription?.address || "N/A"}
                                </div>
                            </div>

                            <div className="ml-[10mm] flex-shrink-0 text-right">
                                <div>
                                    <strong>Date:</strong>{" "}
                                    {prescription?.date || "N/A"}
                                </div>
                                <div>
                                    <strong>Age/Sex:</strong>{" "}
                                    {prescription?.age || "N/A"}/
                                    {prescription?.sex || "N/A"}
                                </div>
                            </div>
                        </div>

                        <hr className="my-[2mm] border-t border-black" />

                        <img
                            src="/images/rx.png"
                            alt="Rx"
                            className="mx-0 mb-2 block h-auto w-[15mm]"
                            onLoad={() =>
                                setImagesLoaded((prev) => ({
                                    ...prev,
                                    rx: true,
                                }))
                            }
                        />
                    </div>

                    {/* Medications */}
                    <div className="mb-[25mm]">
                        {pageMeds.map((med, index) => {
                            const globalIndex =
                                pageIndex * MEDICATIONS_PER_PAGE + index + 1;
                            return (
                                <div key={index} className="mb-3 text-sm">
                                    <div className="flex justify-between font-semibold">
                                        <span>
                                            {globalIndex}. {med.name.name}
                                        </span>
                                        <span className="ml-1 whitespace-nowrap">
                                            #{med.amount}
                                        </span>
                                    </div>
                                    <div className="ml-1">
                                        Sig: {med.quantity} {med.sig.name}{" "}
                                        {med.duration
                                            ? `for ${med.duration}`
                                            : ""}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Doctor Signature */}
                    <div className="fixed bottom-[10mm] right-[10mm] box-border w-[55mm] bg-white p-[2mm] text-right text-[9px]">
                        <hr className="mb-2 border-t border-black" />
                        <p className="font-bold">
                            {prescription?.doctor_name}{" "}
                            {prescription?.license_no ? " MD" : ""}
                        </p>
                        <div className="mt-2">
                            <strong>License No.:</strong>{" "}
                            <span className="">{prescription?.license_no}</span>
                        </div>
                        <div>
                            <strong>PTR No.:</strong>{" "}
                            <span className="">{prescription?.ptr_no}</span>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
