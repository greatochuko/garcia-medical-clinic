import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useState } from "react";
import VitalSignsModal from "@/Components/VitalSignsModal";
import ReminderModal from "@/Components/ReminderModal";
import FlashMessage from "@/Components/FlashMessage";
import LeftDashboard from "@/Components/dashboard/LeftDashboard";
import RightDashboard from "@/Components/dashboard/RightDashboard";
import MiddleDashboard from "@/Components/dashboard/MiddleDashboard";
import PropTypes from "prop-types";

const demoDoctorUser = {
    id: 2,
    first_name: "Royce",
    last_name: "Garcia",
    middle_initial: "A",
    email: "john.doe@example.com",
    login_id: "johndoe",
    role: "admin", // admin, doctor or secretary
    profile_picture: "/images/doctor-profile-picture.png",
    created_at: "2025-09-19T14:30:47.000000Z",
    updated_at: "2025-09-19T14:30:47.000000Z",
};

export default function Dashboard() {
    // const { auth } = usePage().props;

    const [user, setUser] = useState(demoDoctorUser);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

    return (
        <AuthenticatedLayout user={user} setUser={setUser}>
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
            <Head title="Dashboard" />

            <FlashMessage />
            <div className="max-w-8xl mx-auto flex w-[95%] flex-col gap-4 bg-accent-100 px-4 py-6 text-accent md:px-6">
                <h1 className="text-center text-sm font-bold">
                    CLINIC DASHBOARD
                </h1>

                <div className="grid h-full items-stretch gap-6 md:grid-cols-2 xl:grid-cols-[1fr_1.5fr_1fr]">
                    <MiddleDashboard className="md:col-span-2 xl:order-2 xl:col-span-1" />
                    <LeftDashboard
                        className="xl:order-1"
                        userRole={user.role}
                    />
                    <RightDashboard
                        className="xl:order-3"
                        userRole={user.role}
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
