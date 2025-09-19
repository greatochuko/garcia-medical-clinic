import React, { useState, useEffect } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import NavLink from "@/Components/NavLink";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../../css/appointment-manager.css';
import VitalSignsModal from '@/Components/VitalSignsModal';
import BillingModal from '@/Components/BillingModal';

export default function AppointmentManager({ auth, appointments }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [perPage, setPerPage] = useState(appointments?.per_page || 10);
    const [sortDirection, setSortDirection] = useState(null);
    const [sortedAppointments, setSortedAppointments] = useState(appointments.data);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [activeActionRow, setActiveActionRow] = useState(null);
    const [isVitalSignsModalOpen, setIsVitalSignsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
    const [selectedBillingPatient, setSelectedBillingPatient] = useState(null);
    const [appointmentid, setappointmentid] = useState(null);
    
    const { data, setData, post, put, processing } = useForm({
        name: '',
        description: '',
        status: '',
        services: [],
    });

    useEffect(() => {
        setSortedAppointments(appointments.data);
    }, [appointments.data]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.action-dropdown')) {
                setDropdownOpen(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleSort = () => {
        setSortDirection(current => {
            if (current === null) return 'asc';
            if (current === 'asc') return 'desc';
            return null;
        });
    };

    const openEditModal = (appointment) => {
        setSelectedAppointment(appointment);
        setData({
            // name: appointment.patient.name,
            // description: '',
            status: 'waiting',
            // services: appointment.services,
        });
        setIsEditModalOpen(true);
        setDropdownOpen(null);
    };

    const openDeleteModal = (appointment) => {
        setSelectedAppointment(appointment);
        setIsDeleteModalOpen(true);
        setDropdownOpen(null);
    };

    const handleEdit = (e) => {
        e.preventDefault();
        put(route('appointments.update-status', selectedAppointment.id), {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setSelectedAppointment(null);
            },
        });
    };

    const handleDelete = () => {
        router.delete(route('appointments.destroy.active', selectedAppointment.id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedAppointment(null);
            },
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'waiting':
                return 'status-badge status-waiting';
            case 'for_billing':
                return 'status-badge status-for-billing';
            case 'checked_in':
                return 'status-badge status-checked-in';
            case 'checked_out':
                return 'status-badge status-checked-out';
            case 'on_hold':
                return 'status-badge status-on-hold';
            default:
                return 'status-badge';
        }
    };

    const getStatusText = (status) => {
        switch (status.toLowerCase()) {
            case 'waiting':
                return 'Waiting';
            case 'for_billing':
                return 'For Billing';
            case 'checked_in':
                return 'Checked In';
            case 'checked_out':
                return 'Checked Out';
            case 'on_hold':
                return 'On Hold';
            default:
                return status;
        }
    };

    const handlePerPageChange = (e) => {
        const newPerPage = Number(e.target.value);
        setPerPage(newPerPage);
        router.get(route('appointments.index', { perPage: newPerPage, page: 1 }));
    };

    const handlePaginationClick = (url) => {
        if (url) {
            router.get(url);
        }
    };

//      useEffect(() => {
//     const interval = setInterval(() => {
//         axios.get('/appointments/poll')
//             .then(response => {
//                 setSortedAppointments(response.data.appointments.data); // or use setPageProps
//             })
//             .catch(console.error);
//     }, 5000);

//     return () => clearInterval(interval);
// }, []);

useEffect(() => {
    const interval = setInterval(() => {
        axios.get('/appointments/poll', {
            params: {
                page: appointments?.current_page,
                perPage: perPage,
                search: searchQuery,
            }
        })
        .then(response => {
            // setAppointments(response.data.appointments); // full object with pagination info
            setSortedAppointments(response.data.appointments.data); // just data array
        })
        .catch(console.error);
    }, 5000);

    return () => clearInterval(interval);
}, [appointments?.currentpage, perPage, searchQuery]);


    const onDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(sortedAppointments);
        const direction = result.source.index > result.destination.index ? 'up' : 'down';
        
        // Store the original item at destination before any splicing
        const originalDestinationItem = direction === 'down' ? items[result.destination.index] : null;
        
        const [removed] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, removed);

        setSortedAppointments(items);
        
        // Get dragged item's order number
        const draggedItem = removed;
        
        // Get the replaced item based on direction
        let replacedItem;
        if (direction === 'up') {
            replacedItem = items[result.destination.index >= items.length - 1 
                ? result.destination.index - 1 
                : result.destination.index + 1];
        } else {
            replacedItem = originalDestinationItem;
        }

        // Send reordering data
        router.post(route('appointments.reorder'), {
            reorderData: {
                id: draggedItem.id,
                draggedOrderNumber: draggedItem.order_number,
                replacedOrderNumber: replacedItem ? replacedItem.order_number : null,
                direction: direction
            }
        }, {
            preserveScroll: true,
            onError: (errors) => {
                console.error('Failed to reorder appointments:', errors);
                setSortedAppointments(appointments.data);
            }
        });
    };

    const handleActionClick = (appointment, e) => {
        e.preventDefault();
        e.stopPropagation();
        // console.log('zzzzzzzzzzzzzzzzzzzzzz', appointment);
        setDropdownOpen(current => current === appointment.id ? null : appointment.id);
    };


    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        router.get(route('appointments.index'), {
            search: value,
            perPage
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['appointments']
        });
    };
    const renderActionButtons = (appointment) => {
        const status = appointment.status.toLowerCase();
        return (
            <div className="action-buttons">
                {status === 'checked_in' ? (
                    <button 
                        className="action-button"
                        style={{
                            background: '#429ABF',
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '12px',
                            color: '#FFFFFF',
                            cursor: 'default',
                            opacity: 1
                        }}
                    >
                        Checked In
                    </button>
                ) : (
                    <button 
                        className={`action-button ${status === 'waiting' ? '' : 'disabled'}`}
                        disabled={status !== 'waiting'}
                        onClick={() => {
                            if (status === 'waiting') {
                                const payload = { status: 'checked_in' };
                                console.log('Sending payload:', payload);
                                router.put(route('appointments.update-status', appointment.id), payload);
                              }
                        }}
                        style={{
                            background: status === 'waiting' ? '#6F9AAB' : 'transparent',
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '12px',
                            color: status === 'waiting' ? '#FFFFFF' : '#7E8C9A',
                            opacity: status === 'waiting' ? 1 : 0.5,
                            cursor: status === 'waiting' ? 'pointer' : 'not-allowed'
                        }}
                    >
                        Check In
                    </button>
                )}
                <button 
                    className={`action-button z-[2] ${status === 'for_billing' ? '' : 'disabled'}`}
                    disabled={status !== 'for_billing'}
                    onClick={() => {
                        if (status === 'for_billing') {
                            setappointmentid(appointment.id);
                            setSelectedBillingPatient(appointment);
                            setIsBillingModalOpen(true);
                        }
                    }}
                    style={{
                        background: status === 'for_billing' ? '#2B4E64' : 'transparent',
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: '12px',
                        color: status === 'for_billing' ? '#FFFFFF' : '#7E8C9A',
                        opacity: status === 'for_billing' ? 1 : 0.5,
                        // cursor: status === 'for_billing' ? 'pointer' : 'not-allowed'
                    }}
                >
                    Check Out
                </button>
            </div>
        );
    };

    const handleVitalSignsClick = (appointment) => {
        setSelectedPatient(appointment.patient);
        setIsVitalSignsModalOpen(true);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight ">Appointment Manager</h2>}
        >
            <Head title="Appointment Manager" />


                    <div className="py-3">
                    <div className="max-w-8xl mx-8 main-screen bg-white">
                    <div className="text-center m-0 border-b-[5px] border-[#E9F9FF] pt-6 pb-6" style={{ color: '#429ABF', fontWeight: 800 }}>
                        APPOINTMENT MANAGER
                    </div>
                    <br />
                    <div className="appointment-manager-table-screen mt-2">
                        <div className="appointment-container">
                            <div className="flex justify-between mb-7 px-4">
                                <div className="flex items-center w-full max-w-md rounded border border-gray-300 overflow-hidden">
                                    <div className="pl-4 text-gray-400">
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        // onChange={(e) => setSearchQuery(e.target.value)}
                                        onChange={handleSearch}

                                        placeholder="Search for ID or patient name"
                                        className="w-full py-2 px-2 text-sm outline-none border-none focus:outline-none focus:border-none focus:ring-0"
                                    />
                                    <button className="bg-[#429ABF] save-button p-2 pr-4 pl-3 h-full flex items-center justify-center rounded"
                                    onClick={() => handleSearch({ target: { value: searchQuery } })}>
                                        <svg width="18" height="20" viewBox="0 0 21 21" fill="white" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M9.41899 0.570313C7.99026 0.570434 6.58228 0.912222 5.31251 1.56716C4.04274 2.2221 2.94801 3.1712 2.11964 4.33527C1.29128 5.49934 0.753301 6.84464 0.550597 8.25891C0.347894 9.67318 0.486341 11.1154 0.954389 12.4653C1.42244 13.8152 2.20651 15.0336 3.2412 16.0188C4.27589 17.004 5.53118 17.7275 6.90235 18.129C8.27353 18.5304 9.72082 18.5981 11.1235 18.3264C12.5261 18.0547 13.8435 17.4516 14.9656 16.5672L18.8152 20.4168C19.014 20.6088 19.2802 20.715 19.5566 20.7126C19.833 20.7102 20.0974 20.5994 20.2928 20.4039C20.4883 20.2085 20.5991 19.9441 20.6015 19.6677C20.6039 19.3914 20.4977 19.1251 20.3057 18.9263L16.4561 15.0767C17.4975 13.7556 18.146 12.1679 18.3272 10.4954C18.5085 8.82286 18.2152 7.13311 17.4809 5.61951C16.7467 4.10591 15.6011 2.82961 14.1754 1.93666C12.7496 1.04371 11.1013 0.5702 9.41899 0.570313ZM2.56738 9.5301C2.56738 7.71294 3.28925 5.97021 4.57417 4.68529C5.8591 3.40036 7.60183 2.6785 9.41899 2.6785C11.2361 2.6785 12.9789 3.40036 14.2638 4.68529C15.5487 5.97021 16.2706 7.71294 16.2706 9.5301C16.2706 11.3473 15.5487 13.09 14.2638 14.3749C12.9789 15.6598 11.2361 16.3817 9.41899 16.3817C7.60183 16.3817 5.8591 15.6598 4.57417 14.3749C3.28925 13.09 2.56738 11.3473 2.56738 9.5301Z" fill="white"/>
                                        </svg>
                                    </button>
                                </div>
                                    <div className="flex gap-2">
                                        <NavLink
                                        href={route(
                                                "allpatients.create")}
                                                active
                                                
                                        className="bg-gar-blue save-button flex items-center gap-1 px-2 py-1 btn" style={{height:'40px'}}>
                                            <svg width="12" height="12" viewBox="0 0 12 12" class="m-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5 6.66667H0V5H5V0H6.66667V5H11.6667V6.66667H6.66667V11.6667H5V6.66667Z" fill="white"/>
                                                </svg>
                                                    Register New Patient
                                        </NavLink>
                                        <NavLink
                                        href={route(
                                                "appointments.closed")}
                                                active
                                                
                                        className="bg-gar-blue save-button flex items-end gap-1 px-2 py-1 btn" style={{height:'40px'}}>
                                                    Closed Appointments
                                        </NavLink>
                                </div>
                            </div>
                            <div className="appointment-grid px-4">
                                <div className="grid-header">
                                    <div className="grid-cell col-span-2">QUEUE NUMBER</div>
                                    <div className="grid-cell ">PATIENT INFORMATION</div>
                                    <div className="grid-cell ml-[4rem] ">STATUS</div>
                                    <div className="grid-cell ml-[4rem]">ACTIONS</div>
                                    <div className="grid-cell"></div>
                                    <div className="grid-cell ml-[4rem]"></div>
                               </div>
                                
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="droppable" direction="vertical">
                                        {(provided) => (
                                            <div className="grid-body main-screen-all-patients" ref={provided.innerRef} {...provided.droppableProps} >
                                                {sortedAppointments.map((appointment, index) => (
                                                    <Draggable 
                                                        key={`appointment-${appointment.id}`}
                                                        draggableId={`appointment-${appointment.id}`}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className="grid-row py-4"
                                                            >
                                                                <div className="grid-cell" {...provided.dragHandleProps}>
                                                                <svg width="15" height="20" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M3.58899 0C4.31936 0 5.01982 0.263392 5.53627 0.732233C6.05272 1.20107 6.34286 1.83696 6.34286 2.5C6.34286 3.16304 6.05272 3.79893 5.53627 4.26777C5.01982 4.73661 4.31936 5 3.58899 5C2.85862 5 2.15816 4.73661 1.64171 4.26777C1.12526 3.79893 0.835121 3.16304 0.835121 2.5C0.835121 1.83696 1.12526 1.20107 1.64171 0.732233C2.15816 0.263392 2.85862 0 3.58899 0ZM6.34286 10C6.34286 9.33696 6.05272 8.70107 5.53627 8.23223C5.01982 7.76339 4.31936 7.5 3.58899 7.5C2.85862 7.5 2.15816 7.76339 1.64171 8.23223C1.12526 8.70107 0.835121 9.33696 0.835121 10C0.835121 10.663 1.12526 11.2989 1.64171 11.7678C2.15816 12.2366 2.85862 12.5 3.58899 12.5C4.31936 12.5 5.01982 12.2366 5.53627 11.7678C6.05272 11.2989 6.34286 10.663 6.34286 10ZM6.34286 17.5C6.34286 16.837 6.05272 16.2011 5.53627 15.7322C5.01982 15.2634 4.31936 15 3.58899 15C2.85862 15 2.15816 15.2634 1.64171 15.7322C1.12526 16.2011 0.835121 16.837 0.835121 17.5C0.835121 18.163 1.12526 18.7989 1.64171 19.2678C2.15816 19.7366 2.85862 20 3.58899 20C4.31936 20 5.01982 19.7366 5.53627 19.2678C6.05272 18.7989 6.34286 18.163 6.34286 17.5ZM14.6045 10C14.6045 9.33696 14.3143 8.70107 13.7979 8.23223C13.2814 7.76339 12.581 7.5 11.8506 7.5C11.1202 7.5 10.4198 7.76339 9.90332 8.23223C9.38687 8.70107 9.09673 9.33696 9.09673 10C9.09673 10.663 9.38687 11.2989 9.90332 11.7678C10.4198 12.2366 11.1202 12.5 11.8506 12.5C12.581 12.5 13.2814 12.2366 13.7979 11.7678C14.3143 11.2989 14.6045 10.663 14.6045 10ZM11.8506 15C12.581 15 13.2814 15.2634 13.7979 15.7322C14.3143 16.2011 14.6045 16.837 14.6045 17.5C14.6045 18.163 14.3143 18.7989 13.7979 19.2678C13.2814 19.7366 12.581 20 11.8506 20C11.1202 20 10.4198 19.7366 9.90332 19.2678C9.38687 18.7989 9.09673 18.163 9.09673 17.5C9.09673 16.837 9.38687 16.2011 9.90332 15.7322C10.4198 15.2634 11.1202 15 11.8506 15ZM14.6045 2.5C14.6045 1.83696 14.3143 1.20107 13.7979 0.732233C13.2814 0.263392 12.581 0 11.8506 0C11.1202 0 10.4198 0.263392 9.90332 0.732233C9.38687 1.20107 9.09673 1.83696 9.09673 2.5C9.09673 3.16304 9.38687 3.79893 9.90332 4.26777C10.4198 4.73661 11.1202 5 11.8506 5C12.581 5 13.2814 4.73661 13.7979 4.26777C14.3143 3.79893 14.6045 3.16304 14.6045 2.5Z" fill="#429ABF"/>
                                                                </svg>

                                                                </div>

                                                                
                                                                <div className="grid-cell">
                                                                    <div className={`queue-cell ${appointment.queue_type.toLowerCase() === 's' ? 'type-s' : ''}`}>
                                                                        {appointment.queue_type}{appointment.queue_number}
                                                                    </div>
                                                                </div>
                                                                <div className="grid-cell">
                                                                    <div className="patient-info">
                                                                        <Link className="patient-name" href={route('patientvisitform.index', { patient_id: appointment.patient.patient_id , appointment_id: appointment.id})}>
                                                                            {appointment.patient.name}
                                                                        </Link>
                                                                        <div className="patient-details">
                                                                            {appointment.patient.age}, {appointment.patient.gender}
                                                                        </div>
                                                                        <div className="patient-details">
                                                                            {appointment.services}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="grid-cell w-[70%] m-auto">
                                                                    <span className={getStatusBadgeClass(appointment.status)} style={{"width":"70%"}}>
                                                                        {getStatusText(appointment.status)}
                                                                    </span>
                                                                </div>
                                                                <div className="grid-cell" style={{"width":"65%"}}>
                                                                    {renderActionButtons(appointment)}
                                                                </div>

                                                                <div className="grid-cell">

                                                                </div>
                                                                <div className="grid-cell">
                                                                    {/* Add Record Button */}
                                                                    {auth.user.role === 'doctor' || auth.user.role === 'admin' ? (
                                                                        <Link
                                                                            href={route('patientvisitform.index', { patient_id: appointment.patient.patient_id , appointment_id: appointment.id })}
                                                                            className={`add-record-button ${appointment.status.toLowerCase() !== 'checked_in' ? 'disabled' : ''}`}
                                                                            style={{ 
                                                                                opacity: appointment.status.toLowerCase() === 'checked_in' ? 1 : 0.5,
                                                                                pointerEvents: appointment.status.toLowerCase() === 'checked_in' ? 'auto' : 'none'
                                                                            }}
                                                                        >
                                                                            <div className="add-record-content save-button">
                                                                                <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M1.616 19C1.15533 19 0.771 18.8279 0.463 18.4836C0.155 18.1394 0.000666667 17.7095 0 17.1939V2.92376C0 2.4089 0.154333 1.97935 0.463 1.63512C0.771667 1.29088 1.15567 1.11839 1.615 1.11765H10.923V2.23529H1.616C1.462 2.23529 1.32067 2.30682 1.192 2.44988C1.06333 2.59294 0.999333 2.7509 1 2.92376V17.195C1 17.3664 1.064 17.524 1.192 17.6678C1.32 17.8116 1.461 17.8831 1.615 17.8824H14.385C14.5383 17.8824 14.6793 17.8108 14.808 17.6678C14.9367 17.5247 15.0007 17.3671 15 17.195V6.79194H16V17.195C16 17.7091 15.846 18.1387 15.538 18.4836C15.23 18.8286 14.8453 19.0007 14.384 19H1.616ZM4.5 15.0882V13.9706H11.5V15.0882H4.5ZM4.5 11.7353V10.6176H11.5V11.7353H4.5ZM4.5 8.38235V7.26471H11.5V8.38235H4.5ZM14 5.58823V3.35294H12V2.23529H14V0H15V2.23529H17V3.35294H15V5.58823H14Z" fill="white"/>
                                                                                </svg>
                                                                                Add Record
                                                                            </div>
                                                                        </Link>
                                                                    ) : (
                                                                        <div className="vital-signs-wrapper">
                                                                            <button 
                                                                                className="add-vital-signs-button"
                                                                                onClick={() => handleVitalSignsClick(appointment)}
                                                                            >
                                                                                <div className="vital-signs-content">
                                                                                    VS / Measurement
                                                                                </div>
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="grid-cell text-right" style={{}}>
                                                                    <div className="appmgr-action-dropdown">
                                                                        <button 
                                                                            type="button"
                                                                            className="absolute m-auto bottom-0 top-[-14px]"
                                                                            onClick={(e) => handleActionClick(appointment, e)}
                                                                            style={{ 
                                                                                cursor: 'pointer',
                                                                                backgroundColor: dropdownOpen === appointment.id ? '#f3f4f6' : 'transparent',
                                                                                // padding: '8px',
                                                                                position : 'absolute',
                                                                                bottom:'1px',
                                                                                borderRadius: '4px',
                                                                                transition: 'background-color 0.2s'
                                                                            }}
                                                                        >
                                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke={dropdownOpen === appointment.id ? '#1f2937' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                                <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke={dropdownOpen === appointment.id ? '#1f2937' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                                <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke={dropdownOpen === appointment.id ? '#1f2937' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                            </svg>
                                                                        </button>
                                                                      
                                                                      
                                                                      
                                                                        {dropdownOpen === appointment.id && (
                                                                                <div className="absolute text-right left-7">
                                                                                    <div className="rounded-[8px] overflow-visible w-[70px] bg-white rounded-[8px] shadow-lg z-50 border border-gray-200">
                                                                                        <button 
                                                                                            type="button"
                                                                                            className="block w-full text-center px-2 py-1 text-[13px] text-gray-700 hover:bg-[#CDCDCD] transition-colors"
                                                                                            onClick={() => {
                                                                                                openEditModal(appointment);
                                                                                                setDropdownOpen(null);
                                                                                            }}
                                                                                        >
                                                                                            Update
                                                                                        </button>
                                                                                        <button 
                                                                                            type="button"
                                                                                            className="block w-full text-center px-2 py-1 text-[13px] text-gray-700 hover:bg-[#CDCDCD] transition-colors"
                                                                                            onClick={() => {
                                                                                                openDeleteModal(appointment);
                                                                                                setDropdownOpen(null);
                                                                                            }}
                                                                                        >
                                                                                            Delete
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            )}





                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>
                            <div className="flex items-center p-2 bg-white border-t-[5px] border-[#E9F9FF] ">
                                <div className="absolute flex px-5 items-center">
                                    <span className="text-sm mr-2 font-light-blue">Rows per page:</span>
                                    <select
                                        value={perPage}
                                        onChange={handlePerPageChange}
                                        className="clean-select"
                                    >
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>
                                <div className="w-full flex justify-center">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handlePaginationClick(appointments?.prev_page_url)}
                                            disabled={!appointments?.prev_page_url}
                                            className={`px-2 py-1 rounded flex items-center ${!appointments?.prev_page_url ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
                                        >
                                            <div className="custom-text-color flex items-center">
                                                <span style={{ fontSize: '20px', marginRight: '2px' }}>&laquo;</span>
                                                <span>Prev</span>
                                                <span className="mx-1">|</span>
                                            </div>
                                        </button>
                                        <span className="custom-text-color flex items-center px-1">
                                            Page {appointments?.current_page || 1} of {appointments?.last_page || 1}
                                        </span>
                                        <button
                                            onClick={() => handlePaginationClick(appointments?.next_page_url)}
                                            disabled={!appointments?.next_page_url}
                                            className={`px-2 py-1 rounded flex items-center ${!appointments?.next_page_url ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
                                        >
                                            <div className="custom-text-color flex items-center">
                                                <span className="mx-1">|</span>
                                                <span>Next</span>
                                                <span style={{ fontSize: '20px', marginLeft: '2px' }}>&raquo;</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            
            
            
           {isEditModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-[340px] max-w-full p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-[20px] font-bold font-poppins text-[#429ABF]">Update Status</h3>
                <button
                    className="text-gray-500 hover:text-gray-700 text-xl"
                    onClick={() => setIsEditModalOpen(false)}
                >
                    &times;
                </button>
            </div>

            <form onSubmit={handleEdit}>
                <div className="mb-8 w-[130px] ml-4">
                    <label className="block text-[14px] font-bold font-poppins text-[#429ABF] mb-1">
                        
                        Select Status
                    </label>
                    <select
                        className="w-full border border-gray-300 rounded-md shadow-sm text-center text-[#666666] text-[14px] bg-white focus:ring-gray-400 focus:border-gray-400"
                        value={data.status}
                        onChange={e => setData('status', e.target.value)}
                    >
                        <option value="waiting">Waiting</option>
                         <option value="for_billing">For Billing</option>
                       {/* <option value="checked_in">Checked In</option>
                        <option value="checked_out">Checked Out</option> */}
                        <option value="on_hold">On Hold</option>
                    </select>
                </div>

                {/* Uncomment this if you want to bring back service input */}
                {/* <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Services
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md shadow-sm text-sm"
                        value={data.services.join(', ')}
                        onChange={e => setData('services', e.target.value.split(', '))}
                    />
                </div> */}

                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        type="button"
                        className="px-4 cancel-button py-2.5 text-[12px] font-normal font-poppins text-[#429ABF] bg-white hover:bg-[#429ABF] hover:text-white rounded-md"
                        onClick={() => setIsEditModalOpen(false)}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2.5 save-button text-[12px] font-normal font-poppins text-white bg-[#429ABF] hover:bg-[#33859F] rounded-md"
                        disabled={processing}
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    </div>
)}





            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Delete Appointment</h3>
                            <button 
                                className="modal-close"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this appointment? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="modal-button cancel-button cancel"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="modal-button delete save-button"
                                onClick={handleDelete}
                                disabled={processing}
                            >
                                Delete Appointment
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <VitalSignsModal 
        isOpen={isVitalSignsModalOpen}
        setIsOpen={setIsVitalSignsModalOpen}
        patient={selectedPatient}
        onClose={() => {
            setIsVitalSignsModalOpen(false);
            setSelectedPatient(null);
        }}
    />
    <BillingModal
        isOpen={isBillingModalOpen}
        setIsOpen={setIsBillingModalOpen}
        patient={selectedBillingPatient}
        appointmentId={appointmentid}
        markPaidButtonEnable={true}
        onClose={() => {
            setIsBillingModalOpen(false);
            setSelectedBillingPatient(null);
        }}
    />
        </AuthenticatedLayout>
    );
}