import React from "react";

export function TableHeader() {
    return (
        <div className="flex font-bold">
            <div className="min-w-40 flex-[2] p-4 text-left">Queue Number</div>
            <div className="min-w-60 flex-[4] p-4 text-left">
                Patient Information
            </div>
            <div className="min-w-40 flex-[2] p-4 text-center">Status</div>
            <div className="min-w-[300px] flex-[4] p-4 text-center">
                Actions
            </div>
            <div className="min-w-28 flex-[2] p-4 text-center">Edit/Delete</div>
        </div>
    );
}
