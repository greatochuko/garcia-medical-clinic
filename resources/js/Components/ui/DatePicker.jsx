import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useClickOutside from "@/hooks/useClickOutside";

export default function DatePicker({
    selectedDates = [],
    setSelectedDates,
    multiple = false,
}) {
    const [isOpen, setIsOpen] = useState(false);

    const [calendars, setCalendars] = useState(() =>
        Array.from({ length: multiple ? 2 : 1 }, () => ({
            month: 7,
            year: 2025,
            selected: null,
        })),
    );

    const [calendarRef] = useClickOutside(() => setIsOpen(false));

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

    const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
    const firstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

    const toggleOpen = () => setIsOpen(!isOpen);

    const updateCalendar = (idx, updates) => {
        setCalendars((prev) => {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], ...updates };
            return copy;
        });
    };

    const onSelectDate = (calendarIndex, day) => {
        if (!day) return;

        setCalendars((prev) => {
            const next = [...prev];
            next[calendarIndex].selected = day;

            // ✅ Update parent selectedDates correctly using NEXT state
            const all = next.map((c) => c.selected).filter(Boolean);
            setSelectedDates(all);

            return next;
        });

        if (!multiple) setIsOpen(false);
    };

    return (
        <div ref={calendarRef} className="relative">
            <button
                type="button"
                onClick={toggleOpen}
                className="flex w-full min-w-80 items-center justify-between gap-2 rounded-md border border-[#DFDFDF] bg-white px-4 py-2 text-[13px]"
            >
                <span>
                    {selectedDates.length === 0
                        ? "Select Date"
                        : multiple
                          ? `${monthNames[calendars[0].month]} ${selectedDates[0]}, ${calendars[0].year}${
                                multiple
                                    ? ` - ${monthNames[calendars[1].month]} ${selectedDates[selectedDates.length - 1]}, ${calendars[1].year}`
                                    : ""
                            }`
                          : `${monthNames[calendars[0].month]} ${selectedDates[0]}, ${calendars[0].year}`}
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
                    className={`absolute top-full z-20 min-w-full rounded-lg border border-neutral-200 bg-white p-4 text-neutral-800 shadow-lg ${multiple ? "w-[688px]" : ""}`}
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {calendars.map((cal, idx) => {
                            const totalDays = daysInMonth(cal.year, cal.month);
                            const startDay = firstDayOfMonth(
                                cal.year,
                                cal.month,
                            );

                            const days = [
                                ...Array(startDay).fill(null),
                                ...Array.from(
                                    { length: totalDays },
                                    (_, i) => i + 1,
                                ),
                            ];

                            return (
                                <div
                                    key={idx}
                                    className="min-w-80 rounded-md border p-3"
                                >
                                    {/* Header */}
                                    <div className="mb-3 flex items-center justify-between gap-4 text-sm">
                                        <select
                                            value={cal.month}
                                            onChange={(e) =>
                                                updateCalendar(idx, {
                                                    month: Number(
                                                        e.target.value,
                                                    ),
                                                })
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
                                                    updateCalendar(idx, {
                                                        year: cal.year - 1,
                                                    })
                                                }
                                                className="rounded-full p-1.5 hover:bg-neutral-100"
                                            >
                                                <ChevronLeft size={16} />
                                            </button>

                                            <span className="p-2">
                                                {cal.year}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateCalendar(idx, {
                                                        year: cal.year + 1,
                                                    })
                                                }
                                                className="rounded-full p-1.5 hover:bg-neutral-100"
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Days of week */}
                                    <div className="mb-2 grid grid-cols-7 text-sm font-medium text-accent">
                                        {[
                                            "Sun",
                                            "Mon",
                                            "Tue",
                                            "Wed",
                                            "Thu",
                                            "Fri",
                                            "Sat",
                                        ].map((d) => (
                                            <div
                                                key={d}
                                                className="text-center"
                                            >
                                                {d}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Calendar grid */}
                                    <div className="grid grid-cols-7 gap-1 text-center">
                                        {days.map((day, i) => {
                                            const isSelected =
                                                cal.selected === day;

                                            if (!day)
                                                return <span key={idx}></span>;

                                            return (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    disabled={!day}
                                                    onClick={() =>
                                                        onSelectDate(idx, day)
                                                    }
                                                    className={`flex h-9 items-center justify-center rounded-full text-sm ${!day ? "" : "cursor-pointer"} ${isSelected ? "bg-[#089BAB] text-white" : "hover:bg-accent-200"} `}
                                                >
                                                    {day || ""}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
