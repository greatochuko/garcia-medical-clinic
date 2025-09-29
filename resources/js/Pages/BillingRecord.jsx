import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Input from "@/Components/layout/Input";
import Paginator from "@/Components/layout/Paginator";

export default function Billingrecord({ auth, billingData }) {
    const [user, setUser] = useState(auth.user);
    const [searchQuery, setSearchQuery] = useState("");

    console.log(billingData);

    function handleSearch() {}

    return (
        <AuthenticatedLayout
            pageTitle="Billing Records"
            user={user}
            setUser={setUser}
        >
            <div className="max-w-full flex-1 pt-6">
                <div className="mx-auto flex h-full w-[95%] max-w-screen-2xl flex-col gap-4 bg-white text-accent">
                    <div className="relative mb-2 flex flex-col items-center gap-1 border-b-2 border-accent-200 p-4 px-4 pb-6 text-center">
                        <h1 className="text-center text-sm font-bold">
                            BILLING RECORDS
                        </h1>

                        <form
                            onSubmit={handleSearch}
                            className="relative my-2 flex w-[90%] max-w-60 md:absolute md:left-4 md:top-full md:m-0 md:-translate-y-1/2 lg:max-w-xs"
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
                    </div>

                    <Paginator
                        currentPage={billingData.current_page}
                        per_page={billingData.per_page}
                        totalPages={billingData.last_page}
                        totalList={billingData.total}
                        routeName="billingrecord"
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
