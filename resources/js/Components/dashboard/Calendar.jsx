import React, { useState } from "react";

// Helper function to get number of days in a given month
const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
};

// Helper function to get the last day of the previous month
const getDaysInPreviousMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
};

// Helper function to get the number of days in the next month
const getDaysInNextMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
};

export default function Calendar() {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [appointments, setAppointments] = useState({
        15: 20,
        19: 3,
        22: 1,
    });

    // Get the current month's details
    const daysInMonth = getDaysInMonth(currentMonth + 1, currentYear);
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    // Get the number of days in the previous month
    const daysInPreviousMonth = getDaysInPreviousMonth(
        currentMonth,
        currentYear,
    );

    // Get the number of days in the next month (used for ghost days after the current month)
    const daysInNextMonth = getDaysInNextMonth(currentMonth, currentYear);

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const renderCalendarDays = () => {
        let days = [];

        // Add "ghost days" from the previous month (before the first of the current month)
        const prevMonthDaysToShow = daysInPreviousMonth - firstDayOfMonth;
        for (let i = prevMonthDaysToShow + 1; i <= daysInPreviousMonth; i++) {
            days.push(
                <div
                    key={`ghost-${i}`}
                    className="flex items-center justify-center"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#babbc2]/20 text-[#b1b1b1]">
                        {i}
                    </span>
                </div>,
            );
        }

        // Add days for the current month
        for (let i = 1; i <= daysInMonth; i++) {
            const appointmentsForDay = appointments[i] || 0;
            const isToday =
                i === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();
            days.push(
                <div
                    key={i}
                    className={`group relative flex cursor-pointer items-center justify-center rounded-lg bg-white p-2 duration-200 hover:bg-accent-200`}
                >
                    {(appointmentsForDay > 0 || isToday) && (
                        <div className="invisible absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-[50%] whitespace-nowrap rounded bg-black/90 p-2 text-xs text-white opacity-0 duration-300 group-hover:visible group-hover:-translate-y-[60%] group-hover:opacity-100">
                            {isToday && (
                                <div className="flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-[#48BBD4]" />
                                    Today's Date
                                </div>
                            )}
                            {appointmentsForDay > 0 && (
                                <div className="flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-accent-orange" />
                                    Appointments: {appointmentsForDay}
                                </div>
                            )}
                        </div>
                    )}

                    <span
                        className={`${isToday ? "bg-gradient-to-b from-[#48BBD4] to-[#25616E] text-white" : appointmentsForDay > 0 ? "bg-accent-orange text-white" : "bg-accent-200"} flex h-8 w-8 items-center justify-center rounded-full`}
                    >
                        {i}
                    </span>
                    {/* {appointmentsForDay > 0 && (
                        <div className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                            {appointmentsForDay}
                        </div>
                    )} */}
                </div>,
            );
        }

        // Add "ghost days" from the next month (after the last day of the current month)
        const remainingDaysInRow = 7 - ((firstDayOfMonth + daysInMonth) % 7);
        if (remainingDaysInRow !== 7) {
            for (let i = 1; i <= remainingDaysInRow; i++) {
                days.push(
                    <div
                        key={`ghost-next-${i}`}
                        className="flex items-center justify-center"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#babbc2]/20 text-[#b1b1b1]">
                            {i}
                        </span>
                    </div>,
                );
            }
        }

        return days;
    };

    return (
        <div className="mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="flex items-center justify-between p-4 pb-0">
                <button onClick={handlePrevMonth} className="p-2 text-xl">
                    <img
                        src="/assets/icons/arrow-left-icon.svg"
                        alt="Arrow Left Icon"
                    />
                </button>
                <span className="font-bold">
                    {new Date(currentYear, currentMonth).toLocaleString(
                        "default",
                        { month: "long" },
                    )}{" "}
                    {/* {currentYear} */}
                </span>
                <button onClick={handleNextMonth} className="p-2 text-xl">
                    <img
                        src="/assets/icons/arrow-right-icon.svg"
                        alt="Arrow Right Icon"
                    />
                </button>
            </div>
            <div className="flex h-full flex-1 flex-col p-4">
                <div className="mb-2 grid grid-cols-7 text-center font-bold">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>
                <div className="grid flex-1 grid-cols-7 grid-rows-5 gap-2 text-sm">
                    {renderCalendarDays()}
                </div>
            </div>
        </div>
    );
}
