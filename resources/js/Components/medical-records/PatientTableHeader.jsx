import React from "react";

export default function PatientTableHeader() {
    return (
        <div className="flex font-bold">
            <div className="min-w-52 flex-[3.5] p-4 text-left">
                Patient Information
            </div>
            <div className="min-w-40 flex-[2] p-4 text-center">
                Last Visit Date
            </div>
            <div className="min-w-[25rem] flex-[3] p-4 text-center">
                Actions
            </div>
            <div className="min-w-24 flex-[1] p-4 text-center">Delete</div>
        </div>
    );
}
