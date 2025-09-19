import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Sidebar from '@/Components/Sidebar';
import Modal from '@/Components/Modal';
import DeleteConfirmationModal from '@/Components/DeleteConfirmationModal';

export default function ServiceCharges({ auth, services }) {
    const [selectedMenu, setSelectedMenu] = useState('Services And Charges');
    const [activeActionRow, setActiveActionRow] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [sortDirection, setSortDirection] = useState(null);
    const [sortedServices, setSortedServices] = useState(services.data);
    const [perPage, setPerPage] = useState(services?.per_page || 10);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    
    const { data, setData, post, processing, errors, reset, put } = useForm({
        name: '',
        charge: '',
        patient_type: '',
    });

    // Sort services only when direction changes
    useEffect(() => {
        setData('patient_type', 'Regular');
        if (sortDirection === null) {
            setSortedServices(services.data);
            return;
        }
        
        const sorted = [...services.data].sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            return sortDirection === 'asc' 
                ? nameA.localeCompare(nameB)
                : nameB.localeCompare(nameA);
        });
        setSortedServices(sorted);
    }, [sortDirection, services.data]);

    // Handle rows per page change
    const handlePerPageChange = (e) => {
        const newPerPage = parseInt(e.target.value);
        setPerPage(newPerPage);
        router.get(route('service-charges'), { 
            perPage: newPerPage,
            page: 1
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['services']
        });
    };

    // Handle pagination click
    const handlePaginationClick = (url) => {
        if (url) {
            router.get(url, {
                preserveState: true,
                preserveScroll: true,
                only: ['services']
            });
        }
    };

    const handleSort = () => {
        // Cycle through: null (original) -> asc -> desc -> null
        setSortDirection(current => {
            if (current === null) return 'asc';
            if (current === 'asc') return 'desc';
            return null;
        });
    };

    const SortArrow = ({ column }) => {
        return (
            <button 
                onClick={handleSort}
                className="inline-flex flex-col ml-1 relative cursor-pointer select-none active:bg-transparent focus:outline-none touch-none" 
                style={{ width: '12px', height: '16px', WebkitTapHighlightColor: 'transparent' }}
            >
                <svg 
                    className="absolute top-0" 
                    width="12" 
                    height="6" 
                    viewBox="0 0 12 6" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        d="M6 0L12 6H0L6 0Z" 
                        fill={sortDirection === 'asc' ? '#429ABF' : '#666666'}
                    />
                </svg>
                <svg 
                    className="absolute bottom-0" 
                    width="12" 
                    height="6" 
                    viewBox="0 0 12 6" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        d="M6 6L0 0H12L6 6Z" 
                        fill={sortDirection === 'desc' ? '#429ABF' : '#666666'}
                    />
                </svg>
            </button>
        );
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.action-dropdown')) {
                setActiveActionRow(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleActionClick = (index, e) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveActionRow(activeActionRow === index ? null : index);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('service-charges.store'), {
            onSuccess: () => {
                setShowAddModal(false);
                reset();
            },
        });
    };

    const handleDeleteClick = (service) => {
        setItemToDelete(service);
        setShowDeleteModal(true);
        setActiveActionRow(null);
    };

    const handleDeleteConfirm = () => {
        if (itemToDelete) {
            router.delete(route('service-charges.destroy', itemToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                },
            });
        }
    };

    const handleEditClick = (service) => {
        setEditingService(service);
        setData({
            name: service.name,
            charge: service.charge,
            patient_type: service.patient_type
        });
        setShowEditModal(true);
        setActiveActionRow(null);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        put(route('service-charges.update', editingService.id), {
            onSuccess: () => {
                setShowEditModal(false);
                setEditingService(null);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-[14px] text-gray-800 leading-tight font-poppins">Services And Charges</h2>}
        >
            <Head title="Services And Charges">
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </Head>

            <div className="max-w-8xl py-3 mx-auto sm:px-6 lg:px-8">
                <div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-0">
                        <div className="flex font-poppins min-h-screen">
                            <Sidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} auth={auth}/>

                            {/* Main Content */}
                            <div className="flex-1 p-4 bg-white flex flex-col">
                                <div className="flex flex-col mb-4">
                                    <div className="w-full flex justify-center mb-4">
                                        <h3 className="font-poppins font-bold text-[16px] leading-[100%] tracking-[0px] text-[#429ABF]">
                                            SERVICES AND CHARGES
                                        </h3>
                                    </div>
                                    <div className="w-full flex justify-end">
                                        <button 
                                            className="text-white save-button px-4 py-2 rounded-[6px] flex items-center text-[14px]"
                                            onClick={() => setShowAddModal(true)}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                                <path d="M12.5212 0.270508H1.30597C1.00852 0.270508 0.723261 0.388668 0.512935 0.598994C0.302608 0.80932 0.184448 1.09458 0.184448 1.39203V12.6073C0.184448 12.9047 0.302608 13.19 0.512935 13.4003C0.723261 13.6106 1.00852 13.7288 1.30597 13.7288H12.5212C12.8186 13.7288 13.1039 13.6106 13.3142 13.4003C13.5246 13.19 13.6427 12.9047 13.6427 12.6073V1.39203C13.6427 1.09458 13.5246 0.80932 13.3142 0.598994C13.1039 0.388668 12.8186 0.270508 12.5212 0.270508ZM10.8389 7.5604H7.47434V10.925C7.47434 11.0737 7.41526 11.2163 7.3101 11.3215C7.20494 11.4267 7.06231 11.4857 6.91358 11.4857C6.76486 11.4857 6.62223 11.4267 6.51707 11.3215C6.4119 11.2163 6.35282 11.0737 6.35282 10.925V7.5604H2.98825C2.83953 7.5604 2.6969 7.50132 2.59174 7.39616C2.48657 7.291 2.42749 7.14837 2.42749 6.99964C2.42749 6.85092 2.48657 6.70829 2.59174 6.60312C2.6969 6.49796 2.83953 6.43888 2.98825 6.43888H6.35282V3.07431C6.35282 2.92559 6.4119 2.78296 6.51707 2.6778C6.62223 2.57263 6.76486 2.51355 6.91358 2.51355C7.06231 2.51355 7.20494 2.57263 7.3101 2.6778C7.41526 2.78296 7.47434 2.92559 7.47434 3.07431V6.43888H10.8389C10.9876 6.43888 11.1303 6.49796 11.2354 6.60312C11.3406 6.70829 11.3997 6.85092 11.3997 6.99964C11.3997 7.14837 11.3406 7.291 11.2354 7.39616C11.1303 7.50132 10.9876 7.5604 10.8389 7.5604Z" fill="white"/>
                                            </svg>
                                            Add Service
                                        </button>
                                    </div>
                                </div>

                                {/* Table Container */}
                                <div className="flex-1 flex flex-col">
                                    {/* Table */}
                                    <div className="bg-white rounded-[6px] flex-1 flex flex-col ">
                                        {/* Table Header */}
                                        <div class="table-screen">
                                        <div className="grid grid-cols-4 px-6 sticky top-0 z-10" style={{
                                            height: '54px',
                                            backgroundColor: '#F6FCFF',
                                            alignItems: 'center'
                                        }}>
                                            <div className="font-semibold text-[14px] col-span-2" style={{ color: '#666666' }}>
                                                SERVICE NAME <SortArrow column="name" />
                                            </div>
                                            <div className="font-semibold text-[14px]" style={{ color: '#666666' }}>
                                                CHARGE
                                            </div>
                                            <div className="font-semibold text-[14px] flex justify-between" style={{ color: '#666666' }}>
                                                <span>PATIENT TYPE</span>
                                                {/* <span>ACTIONS</span> */}
                                            </div>
                                        </div>

                                        {/* Table Body */}
                                        <div className=" flex-1">
                                            {sortedServices.map((service, index) => (
                                                <div 
                                                    key={service.id}
                                                    className="grid grid-cols-4 px-6 text-[14px]"
                                                    style={{
                                                        height: '54px',
                                                        backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F6FCFF',
                                                        alignItems: 'center',
                                                        color: '#666666'
                                                    }}
                                                >
                                                    <div className="col-span-2">{service.name}</div>
                                                    <div>PHP {service.charge}</div>
                                                    <div className="flex justify-between">
                                                        <span>{service.patient_type}</span>
                                                        <div className="relative action-dropdown">
                                                            <button 
                                                                type="button"
                                                                onClick={(e) => handleActionClick(index, e)}
                                                                className="focus:outline-none active:bg-transparent focus:outline-none"
                                                            >
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#429ABF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                    <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="#429ABF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                    <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="#429ABF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                </svg>
                                                            </button>
                                                            {activeActionRow === index && (
                                                                <div className="absolute right-0 mt-2 w-32 bg-white rounded-[5px] shadow-lg z-10 border border-gray-200">
                                                                    <button 
                                                                        onClick={() => handleEditClick(service)}
                                                                        className="block w-full text-left px-4 py-2 text-[14px] text-gray-700 hover:bg-[#CDCDCD] transition-colors"
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button 
                                                                        type="button"
                                                                        className="block w-full text-left px-4 py-2 text-[14px] text-gray-700 hover:bg-[#CDCDCD] transition-colors"
                                                                        onClick={() => handleDeleteClick(service)}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                      </div>
                                      <hr />
                                        {/* Pagination */}
                                        <div className="relative flex items-center mt-4 px-4 py-4">
                                            <div className="absolute left-4 flex items-center">
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
                                                        onClick={() => handlePaginationClick(services?.prev_page_url)}
                                                        disabled={!services?.prev_page_url}
                                                        className={`px-2 py-1 rounded flex items-center ${!services?.prev_page_url ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
                                                    >
                                                        <div className="custom-text-color flex items-center">
                                                            <span style={{ fontSize: '20px', marginRight: '2px' }}>&laquo;</span>
                                                            <span>Prev</span>
                                                            <span className="mx-1">|</span>
                                                        </div>
                                                    </button>

                                                    <span className="custom-text-color flex items-center px-1">
                                                        Page {services?.current_page || 1} of {services?.last_page || 1}
                                                    </span>

                                                    <button
                                                        onClick={() => handlePaginationClick(services?.next_page_url)}
                                                        disabled={!services?.next_page_url}
                                                        className={`px-2 py-1 rounded flex items-center ${!services?.next_page_url ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
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
                    </div>
                </div>
            </div>

            {/* Add Service Modal */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="lg">
                <div className="template-modal-content">
                    <button
                        onClick={() => setShowAddModal(false)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 active:bg-transparent focus:outline-none"
                        style={{ lineHeight: 0 }}
                        aria-label="Close"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <h1 className="font-poppins font-bold text-[20px] text-[#429ABF] mb-4 text-left">
                        ADD SERVICE
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="name" className="block font-poppins font-medium text-[16px] text-left mb-2 template-label">
                            Service Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="template-input"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="Enter service name"
                        />
                        {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}

                        {/* Row for Patient Type and Charge Amount */}
                        <div className="flex flex-col md:flex-row gap-4 mt-4">
                            <div className="flex-1">
                                <label htmlFor="patient_type" className="block font-poppins font-medium text-[16px] text-left mb-2 template-label">
                                    Patient Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="patient_type"
                                    className="template-input"
                                    value={data.patient_type}
                                    onChange={(e) => setData('patient_type', e.target.value)}
                                    required
                                >
                                    <option value="Regular">Regular</option>
                                    <option value="Senior">Senior</option>
                                </select>
                                {errors.patient_type && <div className="text-red-500 text-sm mt-1">{errors.patient_type}</div>}
                            </div>
                            <div className="flex-1">
                                <label htmlFor="charge" className="block font-poppins font-medium text-[16px] text-left mb-2 template-label">
                                    Charge <span className="text-red-500">*</span>
                                </label>

                                <div className="relative w-full">
                                    {/* Left prefix */}
                                    <span className="absolute left-0 top-0 bottom-0 bg-gray-200 px-3 text-sm text-gray-600 flex items-center rounded-l pointer-events-none">
                                    PHP
                                    </span>

                                    {/* Input field */}
                                    <input
                                    type="number"
                                    id="charge"
                                    className="w-full pl-14 pr-12 py-2 bg-white border border-gray-300 rounded-md focus:outline-none"
                                    value={data.charge}
                                    onChange={(e) => setData('charge', e.target.value)}
                                    required
                                    min="0"
                                    step=""
                                    placeholder=""
                                    />

                                    {/* Right suffix */}
                                    <span className="absolute right-0 top-0 bottom-0 bg-gray-200 px-3 text-sm text-gray-600 flex items-center rounded-r pointer-events-none">
                                    .00
                                    </span>
                                </div>

                                {/* Error display */}
                                {errors.charge && <div className="text-red-500 text-sm mt-1">{errors.charge}</div>}
                             </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                type="submit"
                                className="template-confirm-btn save-button"
                                disabled={processing}
                            >
                                Confirm
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Edit Service Modal */}
            <Modal show={showEditModal} onClose={() => {
                setShowEditModal(false);
                setEditingService(null);
                reset();
            }} maxWidth="lg">
                <div className="template-modal-content">
                    <button
                        onClick={() => {
                            setShowEditModal(false);
                            setEditingService(null);
                            reset();
                        }}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 active:bg-transparent focus:outline-none"
                        style={{ lineHeight: 0 }}
                        aria-label="Close"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <h1 className="font-poppins font-bold text-[20px] text-[#429ABF] mb-4 text-left">
                        EDIT SERVICE
                    </h1>
                    <form onSubmit={handleEditSubmit}>
                        <label htmlFor="edit-name" className="block font-poppins font-medium text-[16px] text-left mb-2 template-label">
                            Service Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="edit-name"
                            className="template-input"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="Enter service name"
                        />
                        {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}

                        {/* Row for Patient Type and Charge Amount */}
                        <div className="flex flex-col md:flex-row gap-4 mt-4">
                            <div className="flex-1">
                                <label htmlFor="edit-patient-type" className="block font-poppins font-medium text-[16px] text-left mb-2 template-label">
                                    Patient Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="edit-patient-type"
                                    className="template-input"
                                    value={data.patient_type}
                                    onChange={(e) => setData('patient_type', e.target.value)}
                                    required
                                >
                                    <option value="Regular">Regular</option>
                                    <option value="Senior">Senior</option>
                                </select>
                                {errors.patient_type && <div className="text-red-500 text-sm mt-1">{errors.patient_type}</div>}
                            </div>
                            <div className="flex-1">
                                <label htmlFor="edit-charge" className="block font-poppins font-medium text-[16px] text-left mb-2 template-label">
                                    Charge <span className="text-red-500">*</span>
                                </label>
                                <div className="relative w-full">
                                    <span className="absolute left-0 top-0 bottom-0 bg-gray-200 px-3 text-sm text-gray-600 flex items-center rounded-l pointer-events-none">
                                        PHP
                                    </span>
                                    <input
                                        type="number"
                                        id="edit-charge"
                                        className="w-full pl-14 pr-12 py-2 bg-white border border-gray-300 rounded-md focus:outline-none"
                                        value={data.charge}
                                        onChange={(e) => setData('charge', e.target.value)}
                                        required
                                        min="0"
                                        step=""
                                    />
                                    <span className="absolute right-0 top-0 bottom-0 bg-gray-200 px-3 text-sm text-gray-600 flex items-center rounded-r pointer-events-none">
                                        .00
                                    </span>
                                </div>
                                {errors.charge && <div className="text-red-500 text-sm mt-1">{errors.charge}</div>}
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                type="submit"
                                className="template-confirm-btn save-button"
                                disabled={processing}
                            >
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            <DeleteConfirmationModal
                show={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Service?"
            />
        </AuthenticatedLayout>
    );
} 