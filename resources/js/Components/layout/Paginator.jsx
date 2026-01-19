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
    routeName,
}) {
    const [perPage, setPerPage] = useState(per_page);
    const [pageInput, setPageInput] = useState(currentPage);

    function resolvePage(newPerPage, totalList, currentPage) {
        const totalPages = Math.ceil(totalList / newPerPage);

        if (newPerPage >= totalList) return 1;
        if (currentPage > totalPages) return totalPages;
        if (currentPage === 1) return undefined;

        return currentPage;
    }

    function handleChangePerPage(e) {
        const newPerPage = parseInt(e.target.value);

        const page = resolvePage(newPerPage, totalList, currentPage);
        router.visit(route(routeName), {
            data: {
                ...route().params, // keep existing parameters
                perPage: newPerPage === 10 ? undefined : newPerPage,
                page,
            },
        });
        setPerPage(newPerPage);
    }

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    function gotoPage(page) {
        router.visit(route(routeName), {
            data: {
                ...route().params, // keep existing parameters
                page: page === 1 ? undefined : page,
                perPage: perPage === 10 ? undefined : perPage,
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
        <div className="mt-auto grid grid-cols-2 gap-4 p-4 text-sm md:grid-cols-[128px_1fr_152px] md:flex-row md:items-center">
            <div className="col-span-2 flex items-center justify-center md:order-2 md:col-span-1">
                <div className="flex divide-accent-300 rounded-md border text-accent">
                    <button
                        onClick={gotoPreviousPage}
                        disabled={currentPage < 2}
                        className="rounded-l-md p-1.5 font-medium outline-none ring-accent/50 duration-200 hover:bg-[#089bab] hover:text-white focus-visible:z-10 focus-visible:ring-4 active:ring-4 disabled:cursor-not-allowed disabled:bg-[#EAEAEA] disabled:text-accent md:px-3"
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
                        className="rounded-r-md p-1.5 font-medium outline-none ring-accent/50 duration-200 hover:bg-[#089bab] hover:text-white focus-visible:z-10 focus-visible:ring-4 active:ring-4 disabled:cursor-not-allowed disabled:bg-[#EAEAEA] disabled:text-accent md:px-3"
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
                className="w-32 cursor-pointer rounded-md px-3 py-1.5 text-sm focus-visible:border-inherit focus-visible:ring-accent"
            >
                {[10, 15, 20, 25, 30].map((num) => (
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
                    className={`h-8 w-10 duration-200 hover:bg-[#089bab] hover:text-white ${
                        isCurrent
                            ? "z-20 border border-[#089bab] font-bold ring-4 ring-[#089bab]/50"
                            : ""
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
