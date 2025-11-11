import DatePicker from "@/Components/ui/DatePicker";
import React from "react";

export default function Filters({
    doctors,
    services,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
}) {
    return (
        <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex items-center gap-2 sm:min-w-[380px]">
                <DatePicker
                    selectedDate={startDate}
                    setSelectedDate={setStartDate}
                    className="flex-1"
                    placeholder="Start Date"
                    calendarClassName=""
                />
                <span>-</span>
                <DatePicker
                    selectedDate={endDate}
                    setSelectedDate={setEndDate}
                    className="flex-1"
                    placeholder="End Date"
                    calendarClassName="right-0"
                />
            </div>

            <div className="flex flex-1 gap-4">
                <select
                    name="doctor"
                    id="doctor"
                    className="w-0 flex-1 rounded-md border border-[#DFDFDF] bg-white px-4 py-1.5 text-[13px]"
                >
                    <option value="">All Doctors</option>
                    {doctors.map((doctor) => (
                        <option
                            key={doctor.id}
                            value={doctors.id}
                        >{`${doctor.first_name} ${doctor.last_name}`}</option>
                    ))}
                </select>

                <select
                    name="service"
                    id="service"
                    className="w-0 flex-1 rounded-md border border-[#DFDFDF] bg-white px-4 py-1.5 text-[13px]"
                >
                    <option value="">All Services</option>
                    {services.map((service) => (
                        <option key={service.id} value={doctors.id}>
                            {service.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
