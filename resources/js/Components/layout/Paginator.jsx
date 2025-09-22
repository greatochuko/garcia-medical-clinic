import { router } from "@inertiajs/react";
import { ChevronLeftIcon } from "lucide-react";
import { ChevronRightIcon } from "lucide-react";
import React, { useState } from "react";
import { route } from "ziggy-js";

export default function Paginator({
    currentPage,
    totalPages,
    per_page,
    totalList,
}) {
    const [perPage, setPerPage] = useState(per_page);
    const [pageInput, setPageInput] = useState(currentPage);

    function handleChangePerPage(e) {
        const newPerPage = parseInt(e.target.value);
        router.visit(route("appointments.index"), {
            data: {
                perPage: newPerPage,
                page: newPerPage >= totalList ? 1 : currentPage,
            },
            preserveState: true,
        });
        setPerPage(newPerPage);
    }

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    function gotoPage(page) {
        router.visit(route("appointments.index"), {
            data: {
                page,
                perPage,
            },
        });
    }

    function gotoPreviousPage() {
        if (currentPage <= 1) return;
        gotoPage(currentPage - 1);
    }

    function gotoNextPage() {
        if (currentPage >= totalPages) return;
        gotoPage(currentPage + 1);
    }

    return (
        <div className="grid grid-cols-2 gap-4 p-4 text-sm md:grid-cols-[112px_1fr_144px] md:flex-row md:items-center">
            <div className="col-span-2 flex items-center justify-center md:order-2 md:col-span-1">
                <div className="flex divide-accent-300 rounded-md border text-[#089bab]">
                    <button
                        onClick={gotoPreviousPage}
                        disabled={currentPage < 2}
                        className="rounded-l-md p-1.5 font-medium outline-none ring-[#089bab]/50 duration-200 hover:bg-[#089bab] hover:text-white focus-visible:z-10 focus-visible:ring-4 active:ring-4 disabled:cursor-not-allowed disabled:bg-[#EAEAEA] disabled:text-[#089bab] md:px-3"
                    >
                        <ChevronLeftIcon
                            size={18}
                            strokeWidth={3}
                            className="md:hidden"
                        />
                        <span className="hidden md:inline">Previous</span>
                    </button>

                    <div className="flex items-center">
                        <PageNumbers
                            currentPage={currentPage}
                            pages={pages}
                            gotoPage={gotoPage}
                        />
                    </div>

                    <button
                        onClick={gotoNextPage}
                        disabled={currentPage >= totalPages}
                        className="rounded-r-md p-1.5 font-medium outline-none ring-[#089bab]/50 duration-200 hover:bg-[#089bab] hover:text-white focus-visible:z-10 focus-visible:ring-4 active:ring-4 disabled:cursor-not-allowed disabled:bg-[#EAEAEA] disabled:text-[#089bab] md:px-3"
                    >
                        <ChevronRightIcon
                            size={18}
                            strokeWidth={3}
                            className="md:hidden"
                        />
                        <span className="hidden md:inline">Next</span>
                    </button>
                </div>
            </div>

            <select
                name="per-page"
                id="per-page"
                value={perPage}
                onChange={handleChangePerPage}
                className="w-28 cursor-pointer rounded-md px-3 py-1.5 text-sm focus-visible:border-inherit focus-visible:ring-accent"
            >
                {[10, 15, 20, 30].map((num) => (
                    <option key={num} value={num}>
                        {num} Per Page
                    </option>
                ))}
            </select>

            <form
                onSubmit={(e) => {
                    e.preventDefault();

                    if (parseInt(pageInput) > totalPages) return;
                    gotoPage(pageInput || 1);
                }}
                className="flex items-center justify-end gap-2 md:order-3 md:justify-normal"
            >
                <input
                    type="text"
                    value={pageInput}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value !== "" && isNaN(parseInt(value))) return;
                        setPageInput(value);
                    }}
                    className={`max-w-14 flex-1 rounded-md px-3 py-1.5 text-center text-sm focus-visible:border-inherit ${parseInt(pageInput) > totalPages ? "border-[#8D2310] text-[#8D2310] focus-visible:ring-[#8D2310]" : "focus-visible:ring-accent"}`}
                    maxLength={3}
                />
                <button
                    disabled={parseInt(pageInput) > totalPages}
                    className="rounded-md p-1.5 font-medium disabled:opacity-50"
                >
                    Goto Page
                </button>
            </form>
        </div>
    );
}

function PageNumbers({ pages, currentPage, gotoPage }) {
    let lastWasEllipsis = false;

    return pages.map((page, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === pages.length - 1;
        const isCurrent = page === currentPage;
        const isNeighbor = page === currentPage - 1 || page === currentPage + 1;

        if (isFirst || isLast || isCurrent || isNeighbor) {
            lastWasEllipsis = false; // reset
            return (
                <button
                    onClick={() => gotoPage(page)}
                    key={page}
                    className={`h-8 w-10 outline-none ring-[#089bab]/50 duration-200 focus-visible:z-10 focus-visible:ring-4 active:ring-4 ${
                        isCurrent
                            ? "bg-[#089bab] font-bold text-white"
                            : "hover:bg-[#089bab] hover:text-white"
                    }`}
                >
                    {page}
                </button>
            );
        }

        if (!lastWasEllipsis) {
            lastWasEllipsis = true;
            return (
                <span key={`ellipsis-${idx}`} className="text-lg font-bold">
                    ...
                </span>
            );
        }

        return null;
    });
}
