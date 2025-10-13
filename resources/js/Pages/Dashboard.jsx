import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState } from "react";
import VitalSignsModal from "@/Components/VitalSignsModal";
import ReminderModal from "@/Components/ReminderModal";
import LeftDashboard from "@/Components/dashboard/LeftDashboard";
import RightDashboard from "@/Components/dashboard/RightDashboard";
import MiddleDashboard from "@/Components/dashboard/MiddleDashboard";
import PropTypes from "prop-types";
import { usePage } from "@inertiajs/react";

export default function Dashboard() {
    const { auth } = usePage().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

    return (
        <AuthenticatedLayout pageTitle={"Dashboard"}>
            <VitalSignsModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                // patient={patient}
            />
            <ReminderModal
                isOpen={isReminderModalOpen}
                onClose={() => setIsReminderModalOpen(false)}
                onSubmit={() => {}}
            />

            <div className="mx-auto flex w-[95%] max-w-screen-2xl flex-col gap-4 bg-accent-100 px-4 py-6 text-accent md:px-6">
                <h1 className="text-center text-sm font-bold">
                    CLINIC DASHBOARD
                </h1>

                <div className="grid h-full items-stretch gap-6 md:grid-cols-2 xl:grid-cols-[1fr_1.5fr_1fr]">
                    <MiddleDashboard className="md:col-span-2 xl:order-2 xl:col-span-1" />
                    <LeftDashboard
                        className="xl:order-1"
                        userRole={auth.user.role}
                    />
                    <RightDashboard
                        className="xl:order-3"
                        userRole={auth.user.role}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

Dashboard.propTypes = {
    auth: PropTypes.shape({
        user: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
};
