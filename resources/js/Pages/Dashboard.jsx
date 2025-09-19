import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import VitalSignsModal from '@/Components/VitalSignsModal';
import dayjs from "dayjs";
import NavLink from "@/Components/NavLink";
import ReminderModal from '@/Components/ReminderModal';
import FlashMessage from '@/Components/FlashMessage';
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
    const [isModalOpen, setIsModalOpen] = useState(false)
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
    useEffect(() => {
    }, [upcomingPatients]);

    useEffect(() => {
        setremindercurrents(reminders)
        fetchreminders();
    }, [])
    const [queueData, setQueueData] = useState(null);

    const fetchreminders = async () => {
        try {
            const response = await axios.get('/reminders');
            if (Array.isArray(response.data)) {
                setremindercurrents(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch queue data:', error);
        }
    };

     const fetchupcomingpatients = async () => {
        try {
            const response = await axios.get('/upcomingpatients/dashboard');
            if (Array.isArray(response.data)) {
                console.log(response.data)
                setwaitingpatients(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch queue data:', error);
        }
    };

    const fetchbillingpatients = async () => {
        try {
            const response = await axios.get('/billing-patients/dashboard');
            if (Array.isArray(response.data)) {
                console.log(response.data)
                setbillingpatients(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch queue data:', error);
        }
    };

    const fetchpendingpatients = async () => {
        try {
            const response = await axios.get('/pending-patients/dashboard');
            if (Array.isArray(response.data)) {
                console.log(response.data)
                setpendingpatients(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch queue data:', error);
        }
    };

     const fetchtodayactivities = async () => {
        try {
            const response = await axios.get('/today-activities/dashboard');
            // if (Array.isArray(response.data)) {
                settodayactivities(response.data);
            // }
        } catch (error) {
            console.error('Failed to fetch queue data:', error);
        }
    };

    const fetchtodaysummary = async () => {
        try {
            const response = await axios.get('/summary/dashboard');
            // if (Array.isArray(response.data)) {
                settodaysummary(response.data);
            // }
        } catch (error) {
            console.error('Failed to fetch queue data:', error);
        }
    };



    useEffect(() => {

        fetchQueueData();
        fetchtodaysummary();
        fetchupcomingpatients();
        fetchbillingpatients()
        fetchpendingpatients()
        fetchtodayactivities()
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
            const response = await axios.get('/queue-user');
            setQueueData(response.data);
        } catch (error) {
            console.error('Failed to fetch queue data:', error);
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

    const weekdays = ["MON","TUE", "WED", "THU", "FRI", "SAT", "SUN"];

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
            const response = await axios.post('/reminders', {
                reminder_text: reminderText,
                status: null
            });

            setLocalReminders(prev => [response.data, ...prev]);
            setIsReminderModalOpen(false);
            fetchreminders()
            // No need to close modal or reset text here as it's handled in the component
        } catch (error) {
            console.error('Failed to save reminder:', error);
        }
    };



    return (

        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <VitalSignsModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} patient={patient} />
            <ReminderModal
                isOpen={isReminderModalOpen}
                onClose={() => setIsReminderModalOpen(false)}
                onSubmit={handleReminderSubmit}
            />
            <Head title="Dashboard" />

            <FlashMessage />
            <div className="text-center mt-1" style={{ color: '#429ABF', fontWeight: 800 }}>Dashboard Overview</div>

            <div className="max-w-8xl py-3 mx-auto sm:px-6 lg:px-8">
                <div className="">
                    <div className="bg-blue overflow-hidden shadow-sm sm:rounded-lg p-0">
                        {/* Main 3-column layout */}
                        <div className="grid grid-cols-3 gap-6" style={{ minHeight: '650px' }}>
                            {/* Left Column */}
                            <div className="flex flex-col h-full">
                                {/* Top Row: Total Patients and Appointments as separate cards */}
                                <div className="flex gap-4 mb-6">
                                    <div className="flex-1 bg-[#6BC2E6] text-white p-6 rounded-lg shadow flex items-center justify-between">
                                        <div>
                                            <div className="text-3xl font-bold">{todaysummary.total_patients}</div>
                                            <div className="text-xs opacity-90 font-bold">TOTAL PATIENTS</div>
                                        </div>
                                        <svg width="36" height="34" viewBox="0 0 36 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_46_1918)">
                                                <path d="M11.925 19.8249C11.025 19.8249 9.9 19.3749 9.9 18.4749C9.9 17.5749 11.025 17.7999 11.925 16.2249C11.925 16.2249 15.975 5.1999 7.875 5.1999C-0.225 5.1999 3.825 16.2249 3.825 16.2249C4.725 17.7999 5.85 17.5749 5.85 18.4749C5.85 19.3749 4.725 19.8249 3.825 19.8249C2.475 20.0499 1.35 19.8249 0 21.1749V33.9999H11.25C11.7 30.1749 12.825 22.2999 13.725 20.2749L13.95 20.0499C13.5 19.8249 12.825 19.8249 11.925 19.8249ZM36 19.3749C34.425 17.5749 33.075 17.7999 31.5 17.5749C30.375 17.3499 29.025 17.1249 29.025 15.9999C29.025 14.8749 30.375 15.3249 31.5 13.2999C31.5 13.2999 36.225 0.0249023 26.55 0.0249023C16.65 0.249902 21.375 13.5249 21.375 13.5249C22.5 15.3249 23.85 15.0999 23.85 15.9999C23.85 17.1249 22.5 17.3499 21.375 17.5749C19.35 17.7999 17.55 17.5749 15.75 20.9499C14.85 22.9749 13.5 33.9999 13.5 33.9999H36V19.3749Z" fill="white" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_46_1918">
                                                    <rect width="36" height="34" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div className="flex-1 bg-[#6BC2E6] text-white p-4 rounded-lg shadow flex items-center justify-between">
                                        <div>
                                            <div className="text-3xl font-bold">{todaysummary.total_appointments}</div>
                                            <div className="text-xs opacity-90 font-bold">APPOINTMENTS</div>
                                        </div>
                                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M22.875 7.97412C22.875 8.58912 23.385 9.09912 24 9.09912C24.615 9.09912 25.125 8.58912 25.125 7.97412V7.17312C26.1465 7.38012 26.895 7.71912 27.45 8.27412C28.248 9.07362 28.599 10.2661 28.755 12.0991H4.245C4.401 10.2661 4.752 9.07362 5.55 8.27412C6.105 7.71912 6.8535 7.38012 7.875 7.17312V7.97412C7.875 8.58912 8.385 9.09912 9 9.09912C9.615 9.09912 10.125 8.58912 10.125 7.97412V6.91962C11.439 6.84912 13.041 6.84912 15 6.84912H18C19.959 6.84912 21.561 6.84912 22.875 6.91962V7.97412ZM4.1445 14.3491C4.125 15.3376 4.125 16.4551 4.125 17.7241V21.4756C4.125 26.8156 4.125 29.5006 5.55 30.9256C6.975 32.3506 9.66 32.3506 15 32.3506H17.25C17.865 32.3506 18.375 32.8606 18.375 33.4756C18.375 34.0906 17.865 34.6006 17.25 34.6006H15C9.03 34.6006 6.045 34.6006 3.96 32.5156C1.875 30.4306 1.875 27.4456 1.875 21.4756V17.7256C1.875 11.7556 1.875 8.77062 3.96 6.68562C4.9725 5.67162 6.198 5.15112 7.875 4.88262V3.47412C7.875 2.85912 8.385 2.34912 9 2.34912C9.615 2.34912 10.125 2.85912 10.125 3.47412V4.66812C11.49 4.59912 13.0935 4.59912 15 4.59912H18C19.9065 4.59912 21.51 4.59912 22.875 4.66812V3.47412C22.875 2.85912 23.385 2.34912 24 2.34912C24.615 2.34912 25.125 2.85912 25.125 3.47412V4.88412C26.802 5.15112 28.0275 5.67162 29.04 6.68412C31.125 8.76912 31.125 11.7541 31.125 17.7241V19.9741C31.125 20.5891 30.615 21.0991 30 21.0991C29.385 21.0991 28.875 20.5891 28.875 19.9741V17.7241C28.875 16.4551 28.875 15.3376 28.8555 14.3491H4.1445ZM24 34.5991H23.865C23.654 34.5711 23.4551 34.4846 23.2907 34.3494C23.1264 34.2142 23.0032 34.0357 22.935 33.8341C22.1775 31.5181 20.742 30.8431 20.604 30.7786L20.595 30.7756C20.321 30.6632 20.1017 30.4481 19.984 30.1763C19.8663 29.9045 19.8595 29.5974 19.965 29.3206C20.19 28.7506 20.835 28.4656 21.405 28.6756C21.492 28.7101 22.9995 29.3116 24.195 31.2106C25.92 28.8256 29.355 24.5806 32.625 23.4106C33.21 23.2006 33.855 23.5156 34.065 24.1006C34.275 24.6856 33.96 25.3306 33.375 25.5406C30.21 26.6656 26.22 32.0956 24.945 34.0906C24.8442 34.2504 24.7048 34.3823 24.5397 34.4741C24.3745 34.5658 24.1889 34.6145 24 34.6156V34.5991Z" fill="white" />
                                        </svg>
                                    </div>
                                </div>
                                {/* Combined Container for Upcoming Patients and Pending Procedures */}
                                <div className="bg-white p-4 rounded-lg flex-grow">
                                    {/* Upcoming Patients Section */}
                                    <div className="mb-6 pr-3">
                                        <h3 className="text-lg font-semibold mb-3 sticky top-0 bg-white z-10" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '24px', letterSpacing: 0, color: '#429ABF' }}>UPCOMING PATIENTS</h3>
                                        <div style={{ borderBottom: '1px solid #E6E8F0', marginBottom: '12px' }}></div>
                                        <div className="space-y-3 min-h-[200px] patient-template">
                                            {waitingpatients.map((patient, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center bg-blue-50 hover:bg-blue-50 transition shadow-sm border border-blue-200"
                                                    style={{
                                                        fontFamily: 'Poppins, sans-serif',
                                                        fontWeight: 400,
                                                        fontSize: '14px',
                                                        lineHeight: '24px',
                                                        letterSpacing: 0,
                                                        borderRadius: '15px',
                                                        borderWidth: '1px',
                                                        width: '100%',
                                                        height: '51px',
                                                        paddingLeft: '12px',
                                                        paddingRight: '12px',
                                                        paddingTop: '0',
                                                        paddingBottom: '0',
                                                        boxSizing: 'border-box',
                                                        background: '#DFF2FF',
                                                    }}
                                                >
                                                    {/* Smaller Tag */}
                                                    <div className="flex items-center justify-center pr-2">
                                                        <span
                                                            style={{
                                                                fontFamily: 'Poppins, sans-serif',
                                                                fontWeight: 700,
                                                                fontSize: '24px',
                                                                lineHeight: '36px',
                                                                letterSpacing: 0,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                color: patient.queue_type.startsWith('S') ? '#FF8000' : '#429ABF'
                                                            }}

                                                        >
                                                            {patient.queue_type}{patient.queue_number}
                                                        </span>
                                                    </div>
                                                    <div className="h-[34px] w-px mx-1" style={{ backgroundColor: '#D0D7DD' }} />
                                                    {/* Patient Info */}
                                                    <div className="flex-1 min-w-0 pl-2 leading-[18px]">
                                                        <span
                                                            style={{
                                                                fontFamily: 'Poppins, sans-serif',
                                                                fontWeight: 700,
                                                                fontSize: '14px',
                                                                lineHeight: '21px',
                                                                letterSpacing: 0,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                color: '#429ABF'
                                                            }}
                                                            className="text-gray-800 text-base truncate block"
                                                        >
                                                            {patient.first_name} , {patient.last_name}
                                                        </span>
                                                        <div className="text-[#666666] text-[12px] font-normal font-poppins leading-[16px] mt-0.5">
                                                            {patient.service_name}
                                                        </div>
                                                        <div
                                                            className="text-xs text-gray-500 mt-0.5 truncate"
                                                            style={{
                                                                fontFamily: 'Poppins, sans-serif',
                                                                fontWeight: 400,
                                                                fontSize: '12px',
                                                                lineHeight: '16px',
                                                                letterSpacing: 0,
                                                                color: '#8F95B2'
                                                            }}
                                                        >
                                                            {patient.description}
                                                        </div>
                                                    </div>
                                                    {/* Actions */}
                                                    <div className="flex flex-row px-2 gap-1 ml-2 items-center" style={{
                                                        background: '#FFFFFF',
                                                        borderRadius: '10px'
                                                    }}>
                                                        <button
                                                            key={patient.id}
                                                            className="mt-1 transition"
                                                            onClick={() => openVitalForm(patient)}
                                                            title="Favorite"
                                                        >

                                                            <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M5.5 0C4.04131 0 2.64236 0.579463 1.61091 1.61091C0.579463 2.64236 0 4.04131 0 5.5C0 6 0.09 6.5 0.22 7H4.3L5.57 3.63C5.87 2.83 7.05 2.75 7.43 3.63L9.5 9L10.09 7.58C10.22 7.25 10.57 7 11 7H19.78C19.91 6.5 20 6 20 5.5C20 4.04131 19.4205 2.64236 18.3891 1.61091C17.3576 0.579463 15.9587 0 14.5 0C12.64 0 11 0.93 10 2.34C9 0.93 7.36 0 5.5 0ZM1 8.5C0.734784 8.5 0.48043 8.60536 0.292893 8.79289C0.105357 8.98043 0 9.23478 0 9.5C0 9.76522 0.105357 10.0196 0.292893 10.2071C0.48043 10.3946 0.734784 10.5 1 10.5H3.44L9 16C10 16.9 10 16.9 11 16L16.56 10.5H19C19.2652 10.5 19.5196 10.3946 19.7071 10.2071C19.8946 10.0196 20 9.76522 20 9.5C20 9.23478 19.8946 8.98043 19.7071 8.79289C19.5196 8.60536 19.2652 8.5 19 8.5H11.4L10.47 10.8C10.07 11.81 8.92 11.67 8.55 10.83L6.5 5.5L5.54 7.83C5.39 8.21 5.05 8.5 4.6 8.5H1Z" fill="#429ABF" />
                                                            </svg>

                                                        </button>

                                                        {/* <button 
                                                            className="hover:bg-blue-100 transition" 
                                                            title="Edit"
                                                        >
                                                            <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M20.0305 2.90539L20.5152 3.39003C21.183 4.05867 21.082 5.244 20.2876 6.0375L10.2933 16.0318L7.05524 17.2163C6.64863 17.3658 6.25271 17.172 6.17221 16.7851C6.14509 16.6447 6.1579 16.4996 6.20917 16.3661L7.41667 13.1001L17.3831 3.13292C18.1774 2.33942 19.3627 2.23675 20.0305 2.90539ZM9.85713 3.89932C9.96501 3.89932 10.0718 3.92056 10.1715 3.96184C10.2711 4.00313 10.3617 4.06363 10.438 4.13991C10.5142 4.21618 10.5748 4.30674 10.616 4.4064C10.6573 4.50606 10.6786 4.61287 10.6786 4.72075C10.6786 4.82862 10.6573 4.93543 10.616 5.03509C10.5748 5.13475 10.5142 5.22531 10.438 5.30158C10.3617 5.37786 10.2711 5.43837 10.1715 5.47965C10.0718 5.52093 9.96501 5.54217 9.85713 5.54217H6.57142C6.13571 5.54217 5.71784 5.71526 5.40974 6.02336C5.10165 6.33145 4.92856 6.74932 4.92856 7.18503V17.0422C4.92856 17.4779 5.10165 17.8958 5.40974 18.2038C5.71784 18.5119 6.13571 18.685 6.57142 18.685H16.4286C16.8643 18.685 17.2821 18.5119 17.5902 18.2038C17.8983 17.8958 18.0714 17.4779 18.0714 17.0422V13.7565C18.0714 13.5386 18.158 13.3297 18.312 13.1756C18.4661 13.0216 18.675 12.935 18.8928 12.935C19.1107 12.935 19.3196 13.0216 19.4737 13.1756C19.6277 13.3297 19.7143 13.5386 19.7143 13.7565V17.0422C19.7143 17.9136 19.3681 18.7493 18.7519 19.3655C18.1357 19.9817 17.3 20.3279 16.4286 20.3279H6.57142C5.69999 20.3279 4.86426 19.9817 4.24807 19.3655C3.63188 18.7493 3.28571 17.9136 3.28571 17.0422V7.18503C3.28571 6.31361 3.63188 5.47787 4.24807 4.86168C4.86426 4.24549 5.69999 3.89932 6.57142 3.89932H9.85713Z" fill="#429ABF"/>
                                                            </svg>
                                                        </button> */}
                                                        {auth.user.role === 'doctor' || auth.user.role === 'admin' ? (
                                                            <NavLink
                                                                href={route('patientvisitform.index', { patient_id: patient.patient_id, appointment_id: patient.appointment_id })}


                                                                active={route().current("patientvisitform.index")}
                                                                className="items-center"
                                                                activeClassName=""
                                                            >
                                                                <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M17.0305 0.905267L17.5152 1.38991C18.183 2.05855 18.082 3.24387 17.2876 4.03737L7.29331 14.0317L4.05524 15.2162C3.64863 15.3657 3.25271 15.1718 3.17221 14.7849C3.14509 14.6446 3.1579 14.4995 3.20917 14.366L4.41667 11.1L14.3831 1.1328C15.1774 0.339302 16.3627 0.236624 17.0305 0.905267ZM6.85713 1.8992C6.96501 1.8992 7.07182 1.92044 7.17148 1.96172C7.27114 2.003 7.3617 2.06351 7.43797 2.13979C7.51425 2.21606 7.57475 2.30662 7.61604 2.40628C7.65732 2.50594 7.67856 2.61275 7.67856 2.72062C7.67856 2.8285 7.65732 2.93531 7.61604 3.03497C7.57475 3.13463 7.51425 3.22518 7.43797 3.30146C7.3617 3.37774 7.27114 3.43824 7.17148 3.47952C7.07182 3.52081 6.96501 3.54205 6.85713 3.54205H3.57142C3.13571 3.54205 2.71784 3.71514 2.40974 4.02323C2.10165 4.33133 1.92856 4.7492 1.92856 5.18491V15.0421C1.92856 15.4778 2.10165 15.8956 2.40974 16.2037C2.71784 16.5118 3.13571 16.6849 3.57142 16.6849H13.4286C13.8643 16.6849 14.2821 16.5118 14.5902 16.2037C14.8983 15.8956 15.0714 15.4778 15.0714 15.0421V11.7563C15.0714 11.5385 15.158 11.3295 15.312 11.1755C15.4661 11.0215 15.675 10.9349 15.8928 10.9349C16.1107 10.9349 16.3196 11.0215 16.4737 11.1755C16.6277 11.3295 16.7143 11.5385 16.7143 11.7563V15.0421C16.7143 15.9135 16.3681 16.7492 15.7519 17.3654C15.1357 17.9816 14.3 18.3278 13.4286 18.3278H3.57142C2.69999 18.3278 1.86426 17.9816 1.24807 17.3654C0.631878 16.7492 0.285706 15.9135 0.285706 15.0421V5.18491C0.285706 4.31348 0.631878 3.47775 1.24807 2.86156C1.86426 2.24537 2.69999 1.8992 3.57142 1.8992H6.85713Z" fill="#429ABF" />
                                                                </svg>

                                                            </NavLink>
                                                        ) : (
                                                            null
                                                        )}


                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-end mt-4 sticky bottom-0 bg-white">
                                            <NavLink
                                                href="/appointment-manager"
                                                className="text-[#429ABF] text-sm font-medium hover:text-[#2D7A9C] transition-colors"
                                            >
                                                See All &gt;&gt;
                                            </NavLink>
                                        </div>
                                    </div>

                                    {/* Pending Procedures Section */}
                                    <div className="pr-3">
                                        <h3 className="text-lg font-semibold mb-3 sticky z-10 top-0 bg-white" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '24px', letterSpacing: 0, color: '#429ABF' }}>PENDING PROCEDURES</h3>
                                        <div style={{ borderBottom: '1px solid #E6E8F0', marginBottom: '12px' }}></div>
                                        <div className="space-y-3 min-h-[200px] patient-template-2">
                                            {pendingpatients.map((patient, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center"
                                                    style={{
                                                        background: '#DFF2FF',
                                                        fontFamily: 'Poppins, sans-serif',
                                                        fontWeight: 400,
                                                        fontSize: '14px',
                                                        lineHeight: '24px',
                                                        letterSpacing: 0,
                                                        borderRadius: '15px',
                                                        borderWidth: '1px',
                                                        borderStyle: 'solid',
                                                        borderColor: '#D0D7DD',
                                                        width: '100%',
                                                        height: '51px',
                                                        paddingLeft: '12px',
                                                        paddingRight: '12px',
                                                        boxSizing: 'border-box',
                                                    }}
                                                >
                                                    {/* Tag */}
                                                    <div className="flex items-center justify-center pr-2">
                                                        <span
                                                            style={{
                                                                fontFamily: 'Poppins, sans-serif',
                                                                fontWeight: 700,
                                                                fontSize: '24px',
                                                                lineHeight: '36px',
                                                                letterSpacing: 0,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                color: patient.queue_type.startsWith('S') ? '#FF8000' : '#429ABF',
                                                            }}
                                                        >
                                                            {patient.queue_type}
                                                        </span>
                                                    </div>
                                                    <div className="h-[34px] w-px mx-1" style={{ backgroundColor: '#D0D7DD' }} />
                                                    {/* Patient Info */}
                                                    <div className="flex-1 min-w-0 pl-2">
                                                        <span
                                                            style={{
                                                                fontFamily: 'Poppins, sans-serif',
                                                                fontWeight: 700,
                                                                fontSize: '14px',
                                                                lineHeight: '21px',
                                                                letterSpacing: 0,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                color: '#429ABF',
                                                            }}
                                                            className="text-gray-800 text-base truncate block"
                                                        >
                                                            {patient.first_name},{patient.last_name}
                                                        </span>
                                                        <div className="font-poppins font-normal text-[12px] leading-[16px] text-[#666666] mt-0.5">
                                                            {patient.service_name}
                                                        </div>
                                                        <div
                                                            className="text-xs text-gray-500 mt-0.5 truncate"
                                                            style={{
                                                                fontFamily: 'Poppins, sans-serif',
                                                                fontWeight: 400,
                                                                fontSize: '12px',
                                                                lineHeight: '16px',
                                                                letterSpacing: 0,
                                                                color: '#8F95B2',
                                                            }}
                                                        >
                                                            {patient.description}
                                                        </div>
                                                    </div>
                                                    {/* Actions */}
                                                    <div className="flex flex-row px-2 gap-1 ml-2 items-center" style={{
                                                        background: '#FFFFFF',
                                                        borderRadius: '10px'
                                                    }}>
                                                        <button
                                                            className="mt-1"
                                                            onClick={() => setIsModalOpen(true)}
                                                            title="Favorite"
                                                        >
                                                            <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M5.5 0C4.04131 0 2.64236 0.579463 1.61091 1.61091C0.579463 2.64236 0 4.04131 0 5.5C0 6 0.09 6.5 0.22 7H4.3L5.57 3.63C5.87 2.83 7.05 2.75 7.43 3.63L9.5 9L10.09 7.58C10.22 7.25 10.57 7 11 7H19.78C19.91 6.5 20 6 20 5.5C20 4.04131 19.4205 2.64236 18.3891 1.61091C17.3576 0.579463 15.9587 0 14.5 0C12.64 0 11 0.93 10 2.34C9 0.93 7.36 0 5.5 0ZM1 8.5C0.734784 8.5 0.48043 8.60536 0.292893 8.79289C0.105357 8.98043 0 9.23478 0 9.5C0 9.76522 0.105357 10.0196 0.292893 10.2071C0.48043 10.3946 0.734784 10.5 1 10.5H3.44L9 16C10 16.9 10 16.9 11 16L16.56 10.5H19C19.2652 10.5 19.5196 10.3946 19.7071 10.2071C19.8946 10.0196 20 9.76522 20 9.5C20 9.23478 19.8946 8.98043 19.7071 8.79289C19.5196 8.60536 19.2652 8.5 19 8.5H11.4L10.47 10.8C10.07 11.81 8.92 11.67 8.55 10.83L6.5 5.5L5.54 7.83C5.39 8.21 5.05 8.5 4.6 8.5H1Z" fill="#429ABF" />
                                                            </svg>

                                                        </button>
                                                        {/* <button 
                                                            // className="hover:bg-blue-100 transition" 
                                                            title="Edit"
                                                        >
                                                            <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M20.0305 2.90539L20.5152 3.39003C21.183 4.05867 21.082 5.244 20.2876 6.0375L10.2933 16.0318L7.05524 17.2163C6.64863 17.3658 6.25271 17.172 6.17221 16.7851C6.14509 16.6447 6.1579 16.4996 6.20917 16.3661L7.41667 13.1001L17.3831 3.13292C18.1774 2.33942 19.3627 2.23675 20.0305 2.90539ZM9.85713 3.89932C9.96501 3.89932 10.0718 3.92056 10.1715 3.96184C10.2711 4.00313 10.3617 4.06363 10.438 4.13991C10.5142 4.21618 10.5748 4.30674 10.616 4.4064C10.6573 4.50606 10.6786 4.61287 10.6786 4.72075C10.6786 4.82862 10.6573 4.93543 10.616 5.03509C10.5748 5.13475 10.5142 5.22531 10.438 5.30158C10.3617 5.37786 10.2711 5.43837 10.1715 5.47965C10.0718 5.52093 9.96501 5.54217 9.85713 5.54217H6.57142C6.13571 5.54217 5.71784 5.71526 5.40974 6.02336C5.10165 6.33145 4.92856 6.74932 4.92856 7.18503V17.0422C4.92856 17.4779 5.10165 17.8958 5.40974 18.2038C5.71784 18.5119 6.13571 18.685 6.57142 18.685H16.4286C16.8643 18.685 17.2821 18.5119 17.5902 18.2038C17.8983 17.8958 18.0714 17.4779 18.0714 17.0422V13.7565C18.0714 13.5386 18.158 13.3297 18.312 13.1756C18.4661 13.0216 18.675 12.935 18.8928 12.935C19.1107 12.935 19.3196 13.0216 19.4737 13.1756C19.6277 13.3297 19.7143 13.5386 19.7143 13.7565V17.0422C19.7143 17.9136 19.3681 18.7493 18.7519 19.3655C18.1357 19.9817 17.3 20.3279 16.4286 20.3279H6.57142C5.69999 20.3279 4.86426 19.9817 4.24807 19.3655C3.63188 18.7493 3.28571 17.9136 3.28571 17.0422V7.18503C3.28571 6.31361 3.63188 5.47787 4.24807 4.86168C4.86426 4.24549 5.69999 3.89932 6.57142 3.89932H9.85713Z" fill="#429ABF"/>
                                                            </svg>
                                                        </button> */}
                                                        {auth.user.role === 'doctor' || auth.user.role === 'admin' ? (
                                                            <NavLink

                                                                href={route('patientvisitform.index', { patient_id: patient.patient_id, appointment_id: patient.appointment_id })}
                                                                active={route().current("patientvisitform.index")}
                                                                className="items-center"
                                                                activeClassName=""
                                                            >
                                                                <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M17.0305 0.905267L17.5152 1.38991C18.183 2.05855 18.082 3.24387 17.2876 4.03737L7.29331 14.0317L4.05524 15.2162C3.64863 15.3657 3.25271 15.1718 3.17221 14.7849C3.14509 14.6446 3.1579 14.4995 3.20917 14.366L4.41667 11.1L14.3831 1.1328C15.1774 0.339302 16.3627 0.236624 17.0305 0.905267ZM6.85713 1.8992C6.96501 1.8992 7.07182 1.92044 7.17148 1.96172C7.27114 2.003 7.3617 2.06351 7.43797 2.13979C7.51425 2.21606 7.57475 2.30662 7.61604 2.40628C7.65732 2.50594 7.67856 2.61275 7.67856 2.72062C7.67856 2.8285 7.65732 2.93531 7.61604 3.03497C7.57475 3.13463 7.51425 3.22518 7.43797 3.30146C7.3617 3.37774 7.27114 3.43824 7.17148 3.47952C7.07182 3.52081 6.96501 3.54205 6.85713 3.54205H3.57142C3.13571 3.54205 2.71784 3.71514 2.40974 4.02323C2.10165 4.33133 1.92856 4.7492 1.92856 5.18491V15.0421C1.92856 15.4778 2.10165 15.8956 2.40974 16.2037C2.71784 16.5118 3.13571 16.6849 3.57142 16.6849H13.4286C13.8643 16.6849 14.2821 16.5118 14.5902 16.2037C14.8983 15.8956 15.0714 15.4778 15.0714 15.0421V11.7563C15.0714 11.5385 15.158 11.3295 15.312 11.1755C15.4661 11.0215 15.675 10.9349 15.8928 10.9349C16.1107 10.9349 16.3196 11.0215 16.4737 11.1755C16.6277 11.3295 16.7143 11.5385 16.7143 11.7563V15.0421C16.7143 15.9135 16.3681 16.7492 15.7519 17.3654C15.1357 17.9816 14.3 18.3278 13.4286 18.3278H3.57142C2.69999 18.3278 1.86426 17.9816 1.24807 17.3654C0.631878 16.7492 0.285706 15.9135 0.285706 15.0421V5.18491C0.285706 4.31348 0.631878 3.47775 1.24807 2.86156C1.86426 2.24537 2.69999 1.8992 3.57142 1.8992H6.85713Z" fill="#429ABF" />
                                                                </svg>

                                                            </NavLink>
                                                        ) : (
                                                            null
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-end bg-white sticky bottom-0">
                                            <NavLink
                                                href="/appointment-manager"
                                                className="text-[#429ABF] text-sm font-medium hover:text-[#2D7A9C] transition-colors"
                                            >
                                                See All &gt;&gt;
                                            </NavLink>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Middle Column */}
                            <div className="space-y-6 flex flex-col h-full">
                                <div className="bg-[#F8FDFF] p-6 rounded-lg flex-grow">
                                    <h3 className="text-[#429ABF] text-[14px] font-normal mb-4">MONTHLY CALENDAR</h3>
                                    <div style={{ borderBottom: '1px solid #E6E8F0', marginBottom: '12px' }}></div>
                                    <div className="flex justify-between items-center mb-4 text-[#429ABF] text-[14px] font-normal">
                                        <button onClick={goToPreviousMonth} className="px-2">&lt;</button>
                                        <div>{currentMonth?.format("MMMM YYYY").toUpperCase()}</div>
                                        <button onClick={goToNextMonth} className="px-2">&gt;</button>
                                    </div>

                                    <div className="grid grid-cols-7 text-center bg-[#EAF7FC] rounded-t-lg py-2">
                                        {weekdays.map((day) => (
                                            <div key={day} className="text-[#666666] text-sm font-normal">{day}</div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-7 gap-1 text-center bg-[#EAF7FC] mt-4">
                                        {daysArray.map((day, index) => (
                                            <div
                                                key={index}
                                                className={
                                                    day === null
                                                        ? "invisible p-2"
                                                        : `p-2 ${isToday(day, currentMonth)
                                                            ? 'bg-[#6BC2E6] text-white rounded-lg w-8 h-8 flex items-center justify-center mx-auto'
                                                            : 'text-[#666666]'
                                                        }`
                                                }
                                            >
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Reminders */}

                                <div className="bg-white p-4 rounded-lg flex-grow">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-lg font-semibold"
                                            style={{
                                                fontFamily: 'Poppins, sans-serif',
                                                fontWeight: 400,
                                                fontSize: '14px',
                                                lineHeight: '24px',
                                                letterSpacing: 0,
                                                color: '#429ABF',
                                            }}
                                        >
                                            REMINDERS
                                        </h3>
                                        <button onClick={() => setIsReminderModalOpen(true)}
                                            className="p-1 hover:bg-gray-100 rounded-full transition">
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4ZM12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM17 11H13V7H11V11H7V13H11V17H13V13H17V11Z"
                                                    fill="#429ABF"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    <div style={{ borderBottom: '1px solid #E6E8F0', marginBottom: '12px' }}></div>

                                    {/* Scrollable reminders section */}


                                    <div className="space-y-2 text-sm overflow-y-auto" style={{ maxHeight: '180px' }}>
                                        {remindercurrents.map((reminder, index) => (
                                            <div
                                                key={index}
                                                className="bg-gray-100 p-2 rounded-lg shadow-sm text-[#666666]"
                                            >
                                                {reminder.reminder_text}
                                            </div>
                                        ))}
                                    </div>



                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6 flex flex-col h-full">
                                {/* Queue Number */}



                                {/* <div className="bg-[#6BC2E6] text-white p-4 rounded-lg text-center shadow">
                                    <div className="flex justify-center items-center mb-2">
                                        <div style={{ fontFamily: 'Poppins', fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', lineHeight: '1' }}>{queueData?.current_patient}</div>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px', opacity: 1 }}>{queueData?.previous_patient} PREV</div>
                                        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px', opacity: 1 }}>QUEUE NUMBER</div>
                                        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px', opacity: 1, color: '#FF8000' }}>{queueData?.next_patient} NEXT</div>
                                    </div>
                                </div> */}
                                <div className="bg-[#6BC2E6] text-white p-2 rounded-lg text-center shadow">
                                    {/* Current Patient */}
                                    <div className="flex justify-center items-center mb-0">
                                        <div
                                            style={{
                                                fontFamily: 'Poppins',
                                                fontSize: '36px',
                                                fontWeight: 800,
                                                letterSpacing: '-1px',
                                                lineHeight: '1',
                                                color: queueData?.current_patient?.startsWith('R') ? '#FFFFFF' : '#FF8000',
                                            }}
                                        >
                                            {queueData?.current_patient}
                                        </div>
                                    </div>

                                    {/* PREV - QUEUE NUMBER - NEXT */}
                                    <div className="flex justify-between items-center mt-2">
                                        {/* PREV */}
                                        <div
                                            className="flex flex-col items-center leading-tight translate-y-[-8px] ml-4"
                                            style={{
                                                fontFamily: 'Poppins, sans-serif',
                                                fontWeight: 700,
                                                fontSize: '16px',
                                                opacity: 1,
                                            }}
                                        >
                                            <span
                                             style={{
                                                color:
                                                  queueData?.previous_patient?.startsWith('R') ? '#FFFFFF' : '#FF8000',
                                              }}
                                            >{queueData?.previous_patient}</span>
                                            <span>PREV</span>
                                        </div>

                                        {/* QUEUE NUMBER */}
                                        <div
                                            style={{
                                                fontFamily: 'Poppins, sans-serif',
                                                fontWeight: 700,
                                                fontSize: '16px',
                                                opacity: 1,
                                            }}
                                        >
                                            QUEUE NUMBER
                                        </div>

                                        {/* NEXT */}
                                        <div
                                            className="flex flex-col items-center leading-tight translate-y-[-8px] mr-4"
                                            style={{
                                                fontFamily: 'Poppins, sans-serif',
                                                fontWeight: 700,
                                                fontSize: '16px',
                                                opacity: 1,
                                                color: '#FFFFFF',
                                            }}
                                        >
                                            <span  style={{
                                                        color:
                                                        queueData?.next_patient?.startsWith('R') ? '#FFFFFF' : '#FF8000',
                                                        }}>{queueData?.next_patient}</span>
                                            <span>NEXT</span>
                                        </div>
                                    </div>
                                </div>











                                {/* For Billing Section */}
                                <div className="bg-white p-4 rounded-lg flex-grow">
                                    <div class="pr-3">
                                        <h3 className="text-lg font-semibold mb-3 sticky top-0 z-10 bg-white" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '24px', letterSpacing: 0, color: '#429ABF' }}>FOR BILLING</h3>
                                        <div style={{ borderBottom: '1px solid #E6E8F0', marginBottom: '12px' }}></div>
                                        <div className="space-y-3 min-h-[200px] patient-template">
                                            {billingpatients.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center"
                                                    style={{
                                                        background: '#DFF2FF',
                                                        fontFamily: 'Poppins, sans-serif',
                                                        fontWeight: 400,
                                                        fontSize: '14px',
                                                        lineHeight: '24px',
                                                        letterSpacing: 0,
                                                        borderRadius: '15px',
                                                        borderWidth: '1px',
                                                        borderStyle: 'solid',
                                                        borderColor: '#D0D7DD',
                                                        width: '100%',
                                                        height: '51px',
                                                        paddingLeft: '12px',
                                                        paddingRight: '12px',
                                                        boxSizing: 'border-box',
                                                    }}
                                                >
                                                    {/* Tag */}
                                                    <div className="flex items-center justify-center pr-2">
                                                        <span
                                                            style={{
                                                                fontFamily: 'Poppins, sans-serif',
                                                                fontWeight: 700,
                                                                fontSize: '24px',
                                                                lineHeight: '36px',
                                                                letterSpacing: 0,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                color: item.queue_type.startsWith('S') ? '#FF8000' : '#429ABF'
                                                            }}

                                                        >
                                                            {item.queue_type}{item.queue_number}
                                                        </span>
                                                    </div>
                                                    <div className="h-[34px] w-px mx-1" style={{ backgroundColor: '#D0D7DD' }} />
                                                    {/* Billing Info */}
                                                    <div className="flex-1 min-w-0 pl-2 leading-[18px]">
                                                        <span
                                                            style={{
                                                                fontFamily: 'Poppins, sans-serif',
                                                                fontWeight: 700,
                                                                fontSize: '14px',
                                                                lineHeight: '21px',
                                                                letterSpacing: 0,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                color: '#429ABF',
                                                            }}
                                                            className="text-gray-800 text-base truncate block"
                                                        >
                                                            {item.first_name} , {item.last_name}
                                                        </span>
                                                        <div className="text-[#666666] text-[12px] font-normal font-poppins leading-[16px] mt-0.5">
                                                            {item.service_name}
                                                        </div>
                                                    </div>
                                                    {/* Amount */}
                                                    <div
                                                        style={{
                                                            fontFamily: 'Poppins, sans-serif',
                                                            fontWeight: 700,
                                                            fontSize: '14px',
                                                            lineHeight: '21px',
                                                            color: '#429ABF',
                                                            marginLeft: '12px',
                                                        }}
                                                    >
                                                        PHP {item.final_total}
                                                    </div>

                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-end bg-white sticky bottom-0">
                                            <NavLink
                                                href="/appointment-manager"
                                                className="text-[#429ABF] text-sm font-medium hover:text-[#2D7A9C] transition-colors"
                                            >
                                                See All &gt;&gt;
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* Today's Activities */}
                                <div className="bg-white p-4 rounded-lg flex-grow">
                                    <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '24px', letterSpacing: 0, color: '#429ABF' }}>TODAY'S ACTIVITIES</h3>
                                    <div style={{ borderBottom: '1px solid #E6E8F0', marginBottom: '12px' }}></div>
                                    <div className="space-y-4">
                                        {/* Unfinished Docs - Red pill bar */}
                                        <div className="flex items-center">
                                            <span className="text-[#848484] mr-4" style={{ minWidth: 120, fontSize: '12px', fontWeight: 500 }}>Unfinished Docs</span>
                                            <div className="relative w-[100%] h-8">
                                                <div className="absolute left-0 top-0 h-8 w-full rounded-xl bg-[#DA3D22] flex items-center">
                                                    <span className="font-bold text-white text-sm ml-4">{todayactivities.unfinished_docs}</span>
                                                    <div className="flex-1 flex justify-center">
                                                        <span className="font-bold text-white text-sm">REVIEW</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Total Waiting */}
                                        <div className="flex items-center">
                                            <span className="text-[#848484] mr-4" style={{ minWidth: 120, fontSize: '12px', fontWeight: 500 }}>Total Waiting</span>
                                            <div className="relative w-[100%] h-8">
                                                <div className="absolute left-0 top-0 h-8 w-full rounded-xl bg-[#CACACA]"></div>
                                                <div className="absolute right-0 top-0 h-8 rounded-xl bg-[#6BC2E6]"
                                                    style={{
  width: `${((todayactivities?.total_waiting?.total - todayactivities?.total_waiting?.count) / todayactivities?.total_waiting?.total) * 100}%`,
                                                    }}>
                                                </div>
                                                <div className="absolute inset-0 flex items-center">
                                                    <span className="font-medium text-white text-sm ml-4">{todayactivities?.total_waiting?.count}</span>
                                                    <span className="font-medium text-white text-sm ml-1">/ {todayactivities?.total_waiting?.total}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Total On Hold */}
                                        <div className="flex items-center">
                                            <span className="text-[#848484] mr-4" style={{ minWidth: 120, fontSize: '12px', fontWeight: 500 }}>Total On Hold</span>
                                            <div className="relative w-[100%] h-8">
                                                <div className="absolute left-0 top-0 h-8 w-full rounded-xl bg-[#CACACA]"></div>
                                                <div className="absolute right-0 top-0 h-8 rounded-xl bg-[#6BC2E6]"
                                                    style={{
                                                        width: `${((todayactivities?.total_on_hold?.total - todayactivities?.total_on_hold?.count) / todayactivities?.total_on_hold?.total) * 100}%`,
                                                    }}>
                                                </div>
                                                <div className="absolute inset-0 flex items-center">
                                                    <span className="font-medium text-white text-sm ml-4">{todayactivities?.total_on_hold?.count}</span>
                                                    <span className="font-medium text-white text-sm ml-1">/ {todayactivities?.total_on_hold?.total}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Total Checked Out */}
                                        <div className="flex items-center">
                                            <span className="text-[#848484] mr-4" style={{ minWidth: 120, fontSize: '12px', fontWeight: 500 }}>Total Checked Out</span>
                                            <div className="relative w-[100%] h-8">
                                                <div className="absolute left-0 top-0 h-8 w-full rounded-xl bg-[#CACACA]"></div>
                                                <div className="absolute left-0 top-0 h-8 rounded-xl bg-[#6BC2E6]"
                                                    style={{
                                                        width: `${(todayactivities?.total_checked_out?.count / todayactivities?.total_checked_out?.total) * 100}%`,

//   width: `${((todayactivities?.total_checkout?.total - todayactivities?.total_checkout?.count) / todayactivities?.total_check_out?.total) * 100}%`,
                                                    }}>
                                                </div>
                                                <div className="absolute inset-0 flex items-center">
                                                    <span className="font-medium text-white text-sm ml-4">{todayactivities?.total_checked_out?.count} / {todayactivities?.total_checked_out?.total}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>

    );

}
