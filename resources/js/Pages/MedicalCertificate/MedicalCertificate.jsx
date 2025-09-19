
import React, { useEffect } from 'react';
import '../../../css/medicalcertificate-print.css';


export default function MedicalCertificate({ patient, diagnosis, comments, date, doctor }) {
    useEffect(() => {
            window.print();
    }, []);

    function formatAgeString(age) {
        if (!age) return '';
    
        const value = parseInt(age);
        const unit = age.slice(-1).toUpperCase();
    
        switch (unit) {
            case 'D':
                return `${value} day${value !== 1 ? 's' : ''} old`;
            case 'M':
                return `${value} month${value !== 1 ? 's' : ''} old`;
            case 'Y':
                return `${value} year${value !== 1 ? 's' : ''} old`;
            default:
                return `${value} year${value !== 1 ? 's' : ''} old`; // fallback
        }
    }
    
      
    return (
        <div className="bg-gray-100 page  ">
            <div className="bg-white px-6 w-full h-[100vh]">
                <div className="flex flex-col items-center mb-2">
                    <img 
                        src="/images/garcia-logo.png" 
                        alt="Garcia Medical Clinic Logo" 
                        className="w-[8rem] mb-1"
                    />
                </div>

                <div className="text-center">
                    <span className="font-fraunces font-bold text-xl">
                        MEDICAL CERTIFICATE
                    </span>
                </div>

                <div className="text-right mb-6 font-alice font-normal text-lg">
                    Date: <span className="underline">{date}</span>
                </div>

                <div className="mb-6 leading-relaxed font-alice font-normal text-14px">
                    This is to certify that I examined / treated <span className="underline">{patient.name}, {formatAgeString(patient.age)}, {patient.gender}, {patient.civilStatus}</span>, from <span className="underline">{patient.address}</span> on <span className="underline">{patient.visitDate}</span>.
                </div>

                <div className="mb-9 font-alice font-normal text-14px">
                    This certificate is issued to the above patient for whatever purpose it may serve him / her best.
                </div>

                <div className="mb-9">
                    <div className="mb-2 font-alice font-normal text-14px">
                        Diagnosis: <span className="underline">{diagnosis}</span>
                    </div>
                    <div className="font-alice font-normal text-14px">
                        Comments: <span className="underline">{comments}</span>
                    </div>
                </div>

                <div className=" flex justify-end">
                    <div className="text-center w-64 text-14px">
                        <div className="border-t border-gray-400 mb-2"></div>
                        <div className="font-montserrat font-bold text-base">{doctor.name}</div>
                        <div className="font-montserrat font-bold text-sm">
                            <div>LICENSE NO. {doctor.licenseNo}</div>
                            <div>PTR NO. {doctor.ptrNo}</div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-12px italic font-fraunces font-normal">
                    *Not valid for Medico-Legal purposes
                </div>
            </div>
        </div>
    );
} 