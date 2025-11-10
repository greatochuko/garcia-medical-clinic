import DatePicker from "@/Components/ui/DatePicker";
import React, { useState } from "react";

export default function Filters() {
    const [selectedDates, setSelectedDates] = useState([]);

    return (
        <div className="flex flex-col gap-4 md:flex-row">
            <DatePicker
                setSelectedDates={setSelectedDates}
                multiple
                selectedDates={selectedDates}
                maxSelectable={2}
            />

            <div className="flex flex-1 gap-4">
                <select
                    name="doctor"
                    id="doctor"
                    className="flex-1 rounded-md border border-[#DFDFDF] bg-white px-4 py-1.5 text-[13px]"
                >
                    <option value="">All Doctors</option>
                </select>

                <select
                    name="service"
                    id="service"
                    className="flex-1 rounded-md border border-[#DFDFDF] bg-white px-4 py-1.5 text-[13px]"
                >
                    <option value="">All Services</option>
                </select>
            </div>
        </div>
    );
}
