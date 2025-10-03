import { Link, router } from "@inertiajs/react";
import React, { useState } from "react";
import { route } from "ziggy-js";
import Input from "../layout/Input";

export default function MedicalRecordsHeader({
    currentTab,
    perPage,
    page,
    setCurrentTab,
}) {
    const params = new URLSearchParams(window.location.search);
    const search = params.get("search");
    const [searchQuery, setSearchQuery] = useState(search || "");

    function handleSearch(e) {
        e.preventDefault();
        router.visit(route("medicalrecords.index"), {
            data: {
                perPage: perPage === 10 ? undefined : perPage,
                page: page > 1 || undefined,
                search: searchQuery || undefined,
            },
            // preserveState: true,
        });
    }

    return (
        <div className="relative mb-2 flex flex-col items-center gap-1 border-b-2 border-accent-200 p-4 px-4 pb-6 text-center">
            <h1 className="text-center text-sm font-bold">MEDICAL RECORDS</h1>
            <div className="absolute left-1/2 top-full flex -translate-x-1/2 -translate-y-1/2 gap-2 rounded-lg bg-accent-200 p-1 text-xs">
                {["all", "unfinished"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setCurrentTab(tab)}
                        className={`rounded-md px-4 py-1.5 font-medium duration-100 ${
                            currentTab === tab
                                ? "bg-accent text-white"
                                : "text-accent-500"
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="flex w-full items-center justify-center gap-4 md:absolute md:left-4 md:right-4 md:top-full md:m-0 md:w-auto md:-translate-y-1/2 md:justify-between">
                <form
                    onSubmit={handleSearch}
                    className="relative my-2 flex w-[90%] max-w-52 sm:max-w-60 lg:max-w-xs"
                >
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-0 flex-1 pr-10"
                        placeholder="Type here to search"
                    />
                    <img
                        src="/assets/icons/search-icon.svg"
                        alt="Search Icon"
                        width={18}
                        height={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    />
                </form>

                <Link
                    href="/patients/add?redirect_to=medical-records"
                    className="flex w-fit items-center gap-2 rounded-md border-2 border-dashed border-accent bg-accent-200 p-2 text-xs text-accent duration-200 hover:bg-accent-300 md:rounded-lg"
                >
                    <img
                        src="/assets/icons/plus-icon.svg"
                        alt="plus icon"
                        width={14}
                        height={14}
                        className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                    />
                    <span className="hidden sm:inline">Register Patient</span>
                    <span className="sm:hidden">New</span>
                </Link>
            </div>
        </div>
    );
}
