import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import NavLink from "@/Components/NavLink";
import Modal from '@/Components/Modal';
import DeleteConfirmationModal from '@/Components/DeleteConfirmationModal';

export default function AllPatients({ authh ,  patient }) {
     const { auth } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [perPage, setPerPage] = useState(patient?.per_page || 10);
    const [sortDirection, setSortDirection] = useState(null);
    const [SortedAllPatients, setSortedAllPatients] = useState(patient.data);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAllPatients, setselectedAllPatients] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [activeActionRow, setActiveActionRow] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const { data, setData, post, processing, errors, reset, put } = useForm({
        patient_information: '',
        last_visit: ''
    });

    // Sort patient only when direction changes
    useEffect(() => {
    if (sortDirection === null) {
        setSortedAllPatients(patient.data);
        return;
    }
    const sorted = [...patient.data].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return sortDirection === 'asc' 
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
    });
    setSortedAllPatients(sorted);
}, [sortDirection, patient.data]);


    // Handle rows per page change
    const handlePerPageChange = (e) => {
        const newPerPage = parseInt(e.target.value);
        setPerPage(newPerPage);
        router.get(route('allpatients'), { 
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
        setActiveActionRow(null);
        
    };

    const handleDeleteConfirm = () => {
        if (itemToDelete) {
            // Add your delete logic here
            setShowDeleteModal(false);
            setItemToDelete(null);
            router.delete(route('patient.destroy', { id: itemToDelete.id }), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                },
            });
        }
    };

    const handleEditClick = (item) => {
        setEditingService(item);
        setData({
        patient_information: item.name,
        last_visit: item.name
        });
        setShowEditModal(true);
        setActiveActionRow(null);
    };

    const handleEditSubmit = (item) => {
        router.get(route('patient.edit', item.id), {
            onSuccess: () => {
                setShowEditModal(false);
                setEditingService(null);
                reset();
            },
        });
    };

    const handleCreateAppointment = (id) => {
        router.visit(route('appointments.create', { id }));
    };


    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        router.get(route('allpatients'), {
            search: value,
            perPage
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['patient']
        });
    };

    const handlePaginationClick = (url) => {
        console.log(url)
        if (url) {
            router.get(url, {
                preserveState: true,
                preserveScroll: true,
                only: ['patient']
            });
        }
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
            header={<h2 className="font-semibold text-xl text-gray-800  leading-tight">All Patients</h2>}
        >
            <Head title="All Patients" />


    <div className="py-3">
  <div className="max-w-8xl mx-8 main-screen bg-white">

               <div className="text-center m-0  border-b-[5px] border-[#E9F9FF] pt-6 pb-6" style={{ color: '#429ABF' , fontWeight: 800 }}>ALL PATIENTS</div>

                <div className="py-4 flex justify-between px-4 mb-3 mt-4">
<div className="flex items-center w-full max-w-md rounded border border-gray-300 overflow-hidden ">
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
  onClick={() => handleSearch({ target: { value: searchQuery } })}>
    <svg width="18" height="18" viewBox="0 0 21 21" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M9.41899 0.570313C7.99026 0.570434 6.58228 0.912222 5.31251 1.56716C4.04274 2.2221 2.94801 3.1712 2.11964 4.33527C1.29128 5.49934 0.753301 6.84464 0.550597 8.25891C0.347894 9.67318 0.486341 11.1154 0.954389 12.4653C1.42244 13.8152 2.20651 15.0336 3.2412 16.0188C4.27589 17.004 5.53118 17.7275 6.90235 18.129C8.27353 18.5304 9.72082 18.5981 11.1235 18.3264C12.5261 18.0547 13.8435 17.4516 14.9656 16.5672L18.8152 20.4168C19.014 20.6088 19.2802 20.715 19.5566 20.7126C19.833 20.7102 20.0974 20.5994 20.2928 20.4039C20.4883 20.2085 20.5991 19.9441 20.6015 19.6677C20.6039 19.3914 20.4977 19.1251 20.3057 18.9263L16.4561 15.0767C17.4975 13.7556 18.146 12.1679 18.3272 10.4954C18.5085 8.82286 18.2152 7.13311 17.4809 5.61951C16.7467 4.10591 15.6011 2.82961 14.1754 1.93666C12.7496 1.04371 11.1013 0.5702 9.41899 0.570313ZM2.56738 9.5301C2.56738 7.71294 3.28925 5.97021 4.57417 4.68529C5.8591 3.40036 7.60183 2.6785 9.41899 2.6785C11.2361 2.6785 12.9789 3.40036 14.2638 4.68529C15.5487 5.97021 16.2706 7.71294 16.2706 9.5301C16.2706 11.3473 15.5487 13.09 14.2638 14.3749C12.9789 15.6598 11.2361 16.3817 9.41899 16.3817C7.60183 16.3817 5.8591 15.6598 4.57417 14.3749C3.28925 13.09 2.56738 11.3473 2.56738 9.5301Z" fill="white"/>
    </svg>
  </button>
</div>
                    <NavLink
                     href={route(
                            "allpatients.create"
                            )}
                            active
                            
                    className="bg-gar-blue flex items-center gap-1 px-2 py-1 btn save-button" style={{height:'40px'}}>
                        <svg width="12" height="12" viewBox="0 0 12 12" class="m-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 6.66667H0V5H5V0H6.66667V5H11.6667V6.66667H6.66667V11.6667H5V6.66667Z" fill="white"/>
                        </svg>
                                Register New Patient
                    </NavLink>
                </div>

                <div className="px-4 all-patients-table-screen">
  <table className="min-w-full table-fixed ">
    <thead className="sticky top-0 z-10 bg-white row-odd" style={{ color: '#429ABF' }}>
      <tr>
        <th className="text-left px-4 py-3">PATIENT INFORMATION</th>
        <th className="text-center px-4 py-3">LAST VISIT DATE</th>
        <th className="px-4 py-3 text-center">ACTIONS</th>
        <th></th>
      </tr>
    </thead>
    
                        <tbody>
                            {patient.data.map((item, index) => (
                                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'row-odd'}>
                                    <td className="px-4 py-8">
                                        <div className="font-semibold font-light-blue">{item.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {item.age} , {item.gender}
                                        </div>
                                    </td>
                                    
                                    <td className="px-4 py-3 capitalize text-sm text-gray-700 text-center ">
                                        {new Date(item.last_visit_date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        {auth.role === 'admin' || auth.role === 'doctor' ? (
                                            <div className="bg-[#EAEAEA] p-1 rounded-[12px] inline-block">
                                                <Link
                                                    href={route('medicalrecords.view', { id: item.id })}
                                                className="px-6 py-2 text-[14px] rounded-[10px] font-['Poppins'] text-white bg-[#2B4E64] hover:bg-[#1f3b4c] inline-block transition"
                                                >
                                                    View Medical Record
                                                </Link>
                                            </div>
                                        ) : (
                                            <>
                                                {/* <button className="text-white px-3 py-1 text-sm rounded-l hover:bg-blue-50" 
                                                style={{color:'#2B4E64',border:'1px solid #2B4E64'}}
                                                onClick={() => handleCreateAppointment(item.id)}>
                                                    Create Appointment
                                                </button>
                                                <button className="border border-blue-500 text-blue-500 px-3 rounded-r py-1 hover:bg-blue-50 text-sm" 
                                                style={{color:'#2B4E64',border:'1px solid #2B4E64',borderLeft:'0px'}}
                                                onClick={() => handleEditSubmit(item)}
                                                >
                                                    Edit Patient Info
                                                </button> */}
                                                <div
  className="inline-flex p-[9px] rounded-md"
  style={{ backgroundColor: '#E5E7EB' }} // tray color
>
  <button
    onClick={() => handleEditSubmit(item)}
    className="px-4 py-[6px] text-sm font-medium mr-1"
    style={{
      backgroundColor: "#ffffff",
      color: "#2B4E64",
      borderRight: "none",
      borderRadius: "6px",
    }}
  >
    Edit Patient Profile
  </button>
  <button
    onClick={() => handleCreateAppointment(item.id)}
    className="px-4 py-[6px] text-sm font-medium text-white ml-1"
    style={{
      backgroundColor: "#5D8AA8",
      border: "1px solid #5D8AA8",
      borderRadius: "6px"
    }}
  >
    Create Appointment
  </button>
</div>

                                            </>
                                        )}
                                    </td>
                                    <td>
                                          {auth.role === 'admin' || auth.role === 'doctor' ? (
                                        <div className="relative">
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
                                                <div className="absolute right-0 w-24 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                                                    <button
                                                        onClick={() => handleDeleteClick(item)}
                                                        className="w-full text-center px-4 py-2 font-normal text-[12px] text-[#666666] font-['Poppins'] hover:bg-[#CDCDCD] hover:text-[#2B4E64]"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        ) : ( null )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                

                </div>

                <DeleteConfirmationModal
                    show={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Patient?"
                />


                  {/* <div className="flex items-center p-2 bg-white border-t-[5px] border-[#E9F9FF]">
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
                                                        onClick={() => handlePaginationnClick(patient?.prev_page_url)}
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
                                                        onClick={() => handlePaginationnClick(patient?.next_page_url)}
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
                                            onClick={() => handlePaginationClick(patient?.next_page_url)}
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
        </AuthenticatedLayout>
    );
}
