import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React from "react";

export default function InventoryMedicationDetails({ medication }) {
    return (
        <AuthenticatedLayout pageTitle="Inventory">
            <div className="max-w-full flex-1 pt-6">
                <div className="mx-auto h-full w-[95%] max-w-screen-2xl rounded-lg bg-white text-accent">
                    <div className="flex flex-col items-center gap-1 border-b-2 border-accent-200 p-4 text-center">
                        <h1 className="text-center text-sm font-bold">
                            {medication.name}
                        </h1>
                    </div>
                    <div className="flex flex-wrap justify-between p-4 sm:gap-8">
                        <div className="flex flex-col gap-1 text-sm">
                            <h2 className="text-lg font-bold sm:text-xl">
                                {medication.name}
                            </h2>
                            <p className="font-semibold text-[#47778B]">
                                Price: {medication.price} PHP
                            </p>
                            <p className="font-semibold text-[#47778B]">
                                Actual Quantity: {medication.quantity}
                            </p>
                        </div>
                        <div className="flex max-w-60 flex-col gap-1 text-sm sm:flex-1">
                            <p className="font-semibold text-[#47778B]">
                                Total Sales: {medication.price} PHP
                            </p>
                            <p className="font-semibold text-[#47778B]">
                                Total Stocked: {medication.price} PHP
                            </p>
                            <p className="font-semibold text-[#47778B]">
                                Total Released: {medication.quantity}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
