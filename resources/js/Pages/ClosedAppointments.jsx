import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/Components/Sidebar';
import NavLink from "@/Components/NavLink";
import Modal from '@/Components/Modal';
import DeleteConfirmationModal from '@/Components/DeleteConfirmationModal';

export default function ClosedAppointments({ auth, patient }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [perPage, setPerPage] = useState(patient?.per_page || 10);
    const [sortDirection, setSortDirection] = useState(null);
    const [SortedAllPatients, setSortedBillingRecord] = useState(patient.data);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAllPatients, setselectedAllPatients] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const { data, setData, post, processing, errors, reset, put } = useForm({
        patient_information: '',
        last_visit: ''
    });
    const dropdownRef = useRef(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Sort patient only when direction changes
    useEffect(() => {
    if (sortDirection === null) {
        setSortedBillingRecord(patient.data);
        return;
    }
    const sorted = [...patient.data].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return sortDirection === 'asc' 
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
    });
    setSortedBillingRecord(sorted);
}, [sortDirection, patient.data]);


    // Handle rows per page change
    const handlePerPageChange = (e) => {
        const newPerPage = parseInt(e.target.value);
        setPerPage(newPerPage);
        router.get(route('billingrecord'), { 
            perPage: newPerPage,
            page: 1
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['patient']
        });
    };

    // Handle pagination click
    const handlePaginationnClick = (url) => {
        console.log(url)
        if (url) {
            router.get(url, {
                preserveState: true,
                preserveScroll: true,
                only: ['patient']
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
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleActionClick = (index, e) => {
        e.preventDefault();
        e.stopPropagation();
        setDropdownOpen(dropdownOpen === index ? null : index);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('allpatients.store'), {
            onSuccess: () => {
                setShowAddModal(false);
                reset();
            },
        });
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
        setDropdownOpen(null);
    };

    const handleDeleteConfirm = () => {
        if (itemToDelete) {
            router.delete(route('appointments.destroy.closed', itemToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                },
            });
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        router.get(route('appointments.closed'), {
            search: value,
            perPage
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['patient']
        });
    };


    const handlePageChange = (url) => {
        if (url) {
            const queryString = url.split('?')[1];
            router.visit(route('allpatients.index') + '?' + queryString);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800  leading-tight">Closed Appointments</h2>}
        >
            <Head title="All Patients" />

    <div className="py-3">
        <div className="max-w-8xl mx-8 main-screen  bg-white">
            <div className="text-center m-0 border-b-[5px] border-[#E9F9FF] pt-6 pb-6" style={{ color: '#429ABF' , fontWeight: 800 }}>CLOSED APPOINTMENTS</div>
               
               <br />
                <div className="flex justify-between mb-7 mt-2 px-4 ">
                    
                    <div className="flex items-center w-full max-w-md rounded border border-gray-300 overflow-hidden">
                    <div className="pl-4 text-gray-400">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
                        </svg>
                    </div>

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search for ID or patient name"
                        className="w-full py-2 px-2 text-sm outline-none border-none focus:outline-none focus:border-none focus:ring-0"
                    />

                    <button className="bg-[#429ABF] p-2 pr-4 pl-3 h-full flex items-center justify-center rounded"
                    onClick={() => handleSearch({ target: { value: searchQuery } })}
                    >
                        <svg width="18" height="18" viewBox="0 0 21 21" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M9.41899 0.570313C7.99026 0.570434 6.58228 0.912222 5.31251 1.56716C4.04274 2.2221 2.94801 3.1712 2.11964 4.33527C1.29128 5.49934 0.753301 6.84464 0.550597 8.25891C0.347894 9.67318 0.486341 11.1154 0.954389 12.4653C1.42244 13.8152 2.20651 15.0336 3.2412 16.0188C4.27589 17.004 5.53118 17.7275 6.90235 18.129C8.27353 18.5304 9.72082 18.5981 11.1235 18.3264C12.5261 18.0547 13.8435 17.4516 14.9656 16.5672L18.8152 20.4168C19.014 20.6088 19.2802 20.715 19.5566 20.7126C19.833 20.7102 20.0974 20.5994 20.2928 20.4039C20.4883 20.2085 20.5991 19.9441 20.6015 19.6677C20.6039 19.3914 20.4977 19.1251 20.3057 18.9263L16.4561 15.0767C17.4975 13.7556 18.146 12.1679 18.3272 10.4954C18.5085 8.82286 18.2152 7.13311 17.4809 5.61951C16.7467 4.10591 15.6011 2.82961 14.1754 1.93666C12.7496 1.04371 11.1013 0.5702 9.41899 0.570313ZM2.56738 9.5301C2.56738 7.71294 3.28925 5.97021 4.57417 4.68529C5.8591 3.40036 7.60183 2.6785 9.41899 2.6785C11.2361 2.6785 12.9789 3.40036 14.2638 4.68529C15.5487 5.97021 16.2706 7.71294 16.2706 9.5301C16.2706 11.3473 15.5487 13.09 14.2638 14.3749C12.9789 15.6598 11.2361 16.3817 9.41899 16.3817C7.60183 16.3817 5.8591 15.6598 4.57417 14.3749C3.28925 13.09 2.56738 11.3473 2.56738 9.5301Z" fill="white"/>
                        </svg>
                    </button>

                    </div>
                    <NavLink
                     href={route("appointments.index")}
                            active
                    className="bg-gar-blue flex items-center gap-1 px-2 save-button py-1 btn" style={{height:'40px'}}>
                                Current Appointments
                    </NavLink>
                </div>
                <div className="all-patients-table-screen px-4">
                    <table className="w-full">
                        <thead className="sticky top-0 z-10 bg-white">
                            <tr className="row-odd" style={{color:'#666666'}}>
                                <th className="text-left px-4 py-3 w-[15%]">QUEUE NUMBER</th>
                                <th className="text-left px-4 py-3 w-[25%]">PATIENT INFORMATION</th>
                                <th className="text-left px-4 py-3 w-[20%]">SERVICES</th>
                                <th className="text-left px-4 py-3 text-center">STATUS</th>
                                {/* <th className="text-left px-4 py-3 w-[15%]">ACTION</th> */}
                                {/* <th className="text-left px-4 py-3 text-center">OTHERS</th> */}
                                <th className="text-left px-4 py-3 text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {patient.data.map((item, index) => (
                                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'row-odd'}>
                                   
                                   <td className="px-4 py-3">
                                         <div className="text-[32px]">
                                            <span className={`font-bold ${item.queue_number.startsWith('R') ? 'text-[#1D7498]' : 'text-[#FF8000]'}`}>
                                                {item.queue_number}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="font-semibold font-light-blue">{item.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {item.age} , {item.gender}
                                        </div>
                                    </td>
                                    
                                    <td className="px-4 py-3 capitalize text-sm text-gray-700">
                                        <div className="text-sm text-gray-500">
                                            {item.service}
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                         <div className="text-sm text-gray-500">
                                            <span className="bg-[#EAEAEA] text-[#BBC1C7] rounded py-1 px-4 capitalize">
                                            {item.status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                                            </span>
                                        </div>
                                    </td>
                                    
                                    <td className="px-4 py-3 text-center relative" ref={dropdownRef}>
                                        <div className="text-sm text-gray-500">
                                            <button 
                                                onClick={() => setDropdownOpen(dropdownOpen === item.id ? null : item.id)}
                                                className="focus:outline-none"
                                            >
                                                <svg width="21" height="5" viewBox="0 0 21 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1.83984 2.76917C1.83984 3.08583 1.95594 3.38952 2.16259 3.61343C2.36924 3.83734 2.64952 3.96314 2.94177 3.96314C3.23402 3.96314 3.5143 3.83734 3.72095 3.61343C3.9276 3.38952 4.0437 3.08583 4.0437 2.76917C4.0437 2.45251 3.9276 2.14881 3.72095 1.9249C3.5143 1.70099 3.23402 1.5752 2.94177 1.5752C2.64952 1.5752 2.36924 1.70099 2.16259 1.9249C1.95594 2.14881 1.83984 2.45251 1.83984 2.76917ZM9.55333 2.76917C9.55333 3.08583 9.66942 3.38952 9.87607 3.61343C10.0827 3.83734 10.363 3.96314 10.6553 3.96314C10.9475 3.96314 11.2278 3.83734 11.4344 3.61343C11.6411 3.38952 11.7572 3.08583 11.7572 2.76917C11.7572 2.45251 11.6411 2.14881 11.4344 1.9249C11.2278 1.70099 10.9475 1.5752 10.6553 1.5752C10.363 1.5752 10.0827 1.70099 9.87607 1.9249C9.66942 2.14881 9.55333 2.45251 9.55333 2.76917ZM17.2668 2.76917C17.2668 3.08583 17.3829 3.38952 17.5896 3.61343C17.7962 3.83734 18.0765 3.96314 18.3687 3.96314C18.661 3.96314 18.9413 3.83734 19.1479 3.61343C19.3546 3.38952 19.4707 3.08583 19.4707 2.76917C19.4707 2.45251 19.3546 2.14881 19.1479 1.9249C18.9413 1.70099 18.661 1.5752 18.3687 1.5752C18.0765 1.5752 17.7962 1.70099 17.5896 1.9249C17.3829 2.14881 17.2668 2.45251 17.2668 2.76917Z" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </button>
                                            {dropdownOpen === item.id && (
                                                <div className="absolute right-8 mt-2 w-32 bg-white rounded-md shadow-lg z-30 border border-gray-200">
                                                    <button
                                                        onMouseDown={(e) => e.stopPropagation()}
                                                        onClick={() => handleDeleteClick(item)}
                                                        className="block w-full text-center px-4 py-2 text-sm text-[#666666] hover:bg-[#CDCDCD] rounded-md"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {/* <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                    <div>
                        Rows per page: {patient.per_page}
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handlePaginationClick(patient?.prev_page_url)}
                            disabled={!patient.prev_page_url}
                            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <span>Page {patient.current_page} of {patient.last_page}</span>
                        <button
                            onClick={() => handlePaginationClick(patient?.next_page_url)}
                            disabled={!patient.next_page_url}
                            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div> */}

                     <div className="flex items-center p-2 bg-white border-t-[5px] border-[#E9F9FF]">
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
                                            onClick={() => handlePaginationClick(patient?.prev_page_url)}
                                            disabled={!patient?.prev_page_url}
                                            className={`px-2 py-1 rounded flex items-center ${!patient?.prev_page_url ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
                                        >
                                            <div className="custom-text-color flex items-center">
                                                <span style={{ fontSize: '20px', marginRight: '2px' }}>&laquo;</span>
                                                <span>Prev</span>
                                                <span className="mx-1">|</span>
                                            </div>
                                        </button>
                                        <span className="custom-text-color flex items-center px-1">
                                            Page {patient?.current_page || 1} of {patient?.last_page || 1}
                                        </span>
                                        <button
                                            onClick={() => handlePaginationClick(appointments?.next_page_url)}
                                            disabled={!patient?.next_page_url}
                                            className={`px-2 py-1 rounded flex items-center ${!patient?.next_page_url ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
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

            <DeleteConfirmationModal
                show={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Appointment?"
            />
        </AuthenticatedLayout>
    );
}
