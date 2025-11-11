import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useClickOutside from "@/hooks/useClickOutside";

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export default function DatePicker({
    selectedDate,
    setSelectedDate,
    className = "",
    calendarClassName = "",
    placeholder,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [calendarRef] = useClickOutside(() => setIsOpen(false));

    const toggleOpen = () => setIsOpen(!isOpen);

    const getMonth = () =>
        selectedDate ? selectedDate.getMonth() : new Date().getMonth();
    const getYear = () =>
        selectedDate ? selectedDate.getFullYear() : new Date().getFullYear();

    const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
    const firstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

    const onSelectDate = (day) => {
        if (!day) return;
        setSelectedDate(new Date(getYear(), getMonth(), day));
        setIsOpen(false);
    };

    const month = getMonth();
    const year = getYear();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const days = [
        ...Array(startDay).fill(null),
        ...Array.from({ length: totalDays }, (_, i) => i + 1),
    ];

    return (
        <div ref={calendarRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={toggleOpen}
                className="flex w-full items-center justify-between gap-2 rounded-md border border-[#DFDFDF] bg-white p-2 text-xs sm:text-[13px]"
            >
                <span className="hidden sm:inline">
                    {selectedDate
                        ? selectedDate.toLocaleDateString("us-en", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                          })
                        : placeholder || "Select Date"}
                </span>
                <span className="sm:hidden">
                    {selectedDate
                        ? selectedDate.toLocaleDateString("us-en", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                          })
                        : placeholder || "Select Date"}
                </span>

                <img
                    src="/assets/icons/calendar-icon-2.svg"
                    alt=""
                    width={18}
                    height={18}
                />
            </button>

            {isOpen && (
                <div
                    className={`absolute top-full z-20 min-w-full rounded-lg border border-neutral-200 bg-white p-4 text-neutral-800 shadow-lg ${calendarClassName}`}
                >
                    {/* Header */}
                    <div className="mb-3 flex items-center justify-between gap-4 text-sm">
                        <select
                            value={month}
                            onChange={(e) =>
                                setSelectedDate(
                                    new Date(
                                        year,
                                        Number(e.target.value),
                                        selectedDate?.getDate() || 1,
                                    ),
                                )
                            }
                            className="flex-1 rounded-md border px-2 py-1.5 text-sm"
                        >
                            {monthNames.map((m, i) => (
                                <option key={m} value={i}>
                                    {m}
                                </option>
                            ))}
                        </select>

                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedDate(
                                        new Date(
                                            year - 1,
                                            month,
                                            selectedDate?.getDate() || 1,
                                        ),
                                    )
                                }
                                className="rounded-full p-1.5 hover:bg-neutral-100"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <span className="p-2">{year}</span>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedDate(
                                        new Date(
                                            year + 1,
                                            month,
                                            selectedDate?.getDate() || 1,
                                        ),
                                    )
                                }
                                className="rounded-full p-1.5 hover:bg-neutral-100"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Days of week */}
                    <div className="mb-2 grid grid-cols-7 text-sm font-medium text-accent">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                            (d) => (
                                <div key={d} className="text-center">
                                    {d}
                                </div>
                            ),
                        )}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {days.map((day, i) => {
                            const isSelected =
                                selectedDate &&
                                selectedDate.getDate() === day &&
                                selectedDate.getMonth() === month &&
                                selectedDate.getFullYear() === year;

                            if (!day) return <span key={i}></span>;

                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => onSelectDate(day)}
                                    className={`flex h-9 items-center justify-center rounded-full text-sm ${
                                        isSelected
                                            ? "bg-[#089BAB] text-white"
                                            : "hover:bg-accent-200"
                                    }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
