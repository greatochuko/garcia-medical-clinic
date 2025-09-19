import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import VitalSignsModal from "@/Components/VitalSignsModal";
import dayjs from "dayjs";
import NavLink from "@/Components/NavLink";
import ReminderModal from "@/Components/ReminderModal";
import FlashMessage from "@/Components/FlashMessage";
export default function Dashboard({
    auth,
    summary,
    upcomingPatients,
    pendingProcedures,
    calendarData,
    billingItems,
    // queueData,
    reminders,
    todayActivities,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patient, setPatient] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(null);
    const [remindercurrents, setremindercurrents] = useState([]);
    const [waitingpatients, setwaitingpatients] = useState([]);
    const [billingpatients, setbillingpatients] = useState([]);
    const [pendingpatients, setpendingpatients] = useState([]);
    const [todayactivities, settodayactivities] = useState([]);
    const [todaysummary, settodaysummary] = useState([]);

    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
    // Remove the reminderText state from here
    const [localReminders, setLocalReminders] = useState(reminders || []);
    const openVitalForm = (patientdata) => {
        setPatient(patientdata);
        setIsModalOpen(true);
    };
    useEffect(() => {}, [upcomingPatients]);

    useEffect(() => {
        setremindercurrents(reminders);
        fetchreminders();
    }, []);
    const [queueData, setQueueData] = useState(null);

    const fetchreminders = async () => {
        try {
            const response = await axios.get("/reminders");
            if (Array.isArray(response.data)) {
                setremindercurrents(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch queue data:", error);
        }
    };

    const fetchupcomingpatients = async () => {
        try {
            const response = await axios.get("/upcomingpatients/dashboard");
            if (Array.isArray(response.data)) {
                console.log(response.data);
                setwaitingpatients(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch queue data:", error);
        }
    };

    const fetchbillingpatients = async () => {
        try {
            const response = await axios.get("/billing-patients/dashboard");
            if (Array.isArray(response.data)) {
                console.log(response.data);
                setbillingpatients(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch queue data:", error);
        }
    };

    const fetchpendingpatients = async () => {
        try {
            const response = await axios.get("/pending-patients/dashboard");
            if (Array.isArray(response.data)) {
                console.log(response.data);
                setpendingpatients(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch queue data:", error);
        }
    };

    const fetchtodayactivities = async () => {
        try {
            const response = await axios.get("/today-activities/dashboard");
            // if (Array.isArray(response.data)) {
            settodayactivities(response.data);
            // }
        } catch (error) {
            console.error("Failed to fetch queue data:", error);
        }
    };

    const fetchtodaysummary = async () => {
        try {
            const response = await axios.get("/summary/dashboard");
            // if (Array.isArray(response.data)) {
            settodaysummary(response.data);
            // }
        } catch (error) {
            console.error("Failed to fetch queue data:", error);
        }
    };

    useEffect(() => {
        fetchQueueData();
        fetchtodaysummary();
        fetchupcomingpatients();
        fetchbillingpatients();
        fetchpendingpatients();
        fetchtodayactivities();
        const interval = setInterval(() => {
            fetchQueueData();
            fetchtodayactivities();
            fetchtodaysummary();
            fetchpendingpatients();
            fetchbillingpatients();
            fetchupcomingpatients();
            fetchreminders();
        }, 10 * 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchQueueData = async () => {
        try {
            const response = await axios.get("/queue-user");
            setQueueData(response.data);
        } catch (error) {
            console.error("Failed to fetch queue data:", error);
        }
    };

    const calculateProgress = (count, total) => {
        if (total === 0) return 0;
        return (count / total) * 100;
    };

    useEffect(() => {
        setCurrentMonth(dayjs()); // ✅ initialize with today's date
    }, []);
    //calender

    const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

    const isToday = (day) => {
        const today = dayjs();
        return (
            today.date() === day &&
            today.month() === currentMonth.month() &&
            today.year() === currentMonth.year()
        );
    };
    const startOfMonth = currentMonth?.startOf("month");
    const daysInMonth = currentMonth?.daysInMonth();
    const startDay = (startOfMonth?.day() + 6) % 7;

    const daysArray = [];
    for (let i = 0; i < startDay; i++) {
        daysArray.push(null); // leading empty cells
    }
    for (let i = 1; i <= daysInMonth; i++) {
        daysArray.push(i);
    }

    const goToPreviousMonth = () => {
        setCurrentMonth(currentMonth.subtract(1, "month"));
    };
    const goToNextMonth = () => {
        setCurrentMonth(currentMonth.add(1, "month"));
    };

    const handleReminderSubmit = async (reminderText) => {
        try {
            const response = await axios.post("/reminders", {
                reminder_text: reminderText,
                status: null,
            });

            setLocalReminders((prev) => [response.data, ...prev]);
            setIsReminderModalOpen(false);
            fetchreminders();
            // No need to close modal or reset text here as it's handled in the component
        } catch (error) {
            console.error("Failed to save reminder:", error);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <VitalSignsModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                patient={patient}
            />
            <ReminderModal
                isOpen={isReminderModalOpen}
                onClose={() => setIsReminderModalOpen(false)}
                onSubmit={handleReminderSubmit}
            />
            <Head title="Dashboard" />

            <FlashMessage />
            <div
                className="mt-1 text-center"
                style={{ color: "#429ABF", fontWeight: 800 }}
            >
                Dashboard Overview
            </div>
        </AuthenticatedLayout>
    );
}
