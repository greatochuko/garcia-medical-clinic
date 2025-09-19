import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Sidebar from '@/Components/Sidebar';
import UserService from '@/Services/UserService';
import FlashMessage from '@/Components/FlashMessage';
import DeleteConfirmationModal from '@/Components/DeleteConfirmationModal';
import { usePage } from '@inertiajs/react';

export default function UserAccounts({ auth, users }) {
    const [selectedMenu, setSelectedMenu] = useState('Users Account (Admin only)');
    const [showAddOptions, setShowAddOptions] = useState(false);
    const [activeActionRow, setActiveActionRow] = useState(null);
    const [perPage, setPerPage] = useState(users?.per_page || 10);
    const [sortDirection, setSortDirection] = useState(null);
    const [sortedUsers, setSortedUsers] = useState(users.data);
    const [sortColumn, setSortColumn] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const { flash } = usePage().props;

    // Sort users when direction changes
    useEffect(() => {
        if (sortDirection === null) {
            setSortedUsers(users.data);
            return;
        }
        
        const sorted = [...users.data].sort((a, b) => {
            const valueA = a[sortColumn].toLowerCase();
            const valueB = b[sortColumn].toLowerCase();
            return sortDirection === 'asc' 
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        });
        setSortedUsers(sorted);
    }, [sortDirection, sortColumn, users.data]);

    // Handle rows per page change
    const handlePerPageChange = (e) => {
        const newPerPage = parseInt(e.target.value);
        setPerPage(newPerPage);
        router.get(route('user-accounts'), { 
            perPage: newPerPage,
            page: 1
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['users']
        });
    };

    // Handle pagination click
    const handlePaginationClick = (url) => {
        if (url) {
            router.get(url, {
                preserveState: true,
                preserveScroll: true,
                only: ['users']
            });
        }
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

    const handleSort = (column) => {
        setSortColumn(column);
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
                onClick={() => handleSort(column)}
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
                        fill={sortDirection === 'asc' && sortColumn === column ? '#429ABF' : '#666666'}
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
                        fill={sortDirection === 'desc' && sortColumn === column ? '#429ABF' : '#666666'}
                    />
                </svg>
            </button>
        );
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
        setActiveActionRow(null);
    };

    const handleDeleteConfirm = () => {
        if (userToDelete) {
            router.delete(route('users.destroy', userToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-[14px] text-gray-800 leading-tight font-poppins">Users Account</h2>}
        >
            <Head title="Users Account">
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </Head>
            <FlashMessage />

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
                                            USER ACCOUNT
                                        </h3>
                                    </div>
                                    <div className="w-full flex justify-end">
                                        <div className="relative">
                                            <button 
                                                className="text-white px-4 py-2 rounded-[6px] flex items-center text-[14px]"
                                                style={{ backgroundColor: '#429ABF' , borderRadius: '5px'}}
                                                onClick={() => setShowAddOptions(!showAddOptions)}
                                            >
                                                Add User Account
                                                <svg className="ml-2" width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1.41 0.589966L6 5.16997L10.59 0.589966L12 1.99997L6 7.99997L0 1.99997L1.41 0.589966Z" fill="white"/>
                                                </svg>
                                            </button>
                                            {showAddOptions && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-[5px] shadow-lg z-[60] border border-gray-200 overflow-hidden">
                                                    <Link 
                                                        href={route('user.create', { role: 'admin' })} 
                                                        className="block w-full text-left px-4 py-2 text-[14px] text-gray-700 hover:bg-[#CDCDCD] transition-colors"
                                                    >
                                                        Add Admin Account
                                                    </Link>
                                                    <Link 
                                                        href={route('user.create', { role: 'doctor' })} 
                                                        className="block w-full text-left px-4 py-2 text-[14px] text-gray-700 hover:bg-[#CDCDCD] transition-colors"
                                                    >
                                                        Add Doctor Account
                                                    </Link>
                                                    <Link 
                                                        href={route('user.create', { role: 'secretary' })} 
                                                        className="block w-full text-left px-4 py-2 text-[14px] text-gray-700 hover:bg-[#CDCDCD] transition-colors"
                                                    >
                                                        Add Secretary Account
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Table Container */}
                                <div className="flex-1 flex flex-col bg-white rounded-[6px] ">
                                    {/* Table */}
                                    <div className="flex-1 flex flex-col">
                                        {/* Table Header */}
                                    <div className="table-screen">
                                        <div className="grid grid-cols-4 gap-4 px-6 sticky top-0 z-50" style={{
                                            height: '54px',
                                            backgroundColor: '#F6FCFF',
                                            alignItems: 'center'
                                        }}>
                                            <div className="font-semibold text-[14px]" style={{ color: '#666666' }}>
                                                USER NAME <SortArrow column="name" />
                                            </div>
                                            <div className="font-semibold text-[14px]" style={{ color: '#666666' }}>
                                                ROLE <SortArrow column="role" />
                                            </div>
                                            <div className="font-semibold text-[14px]" style={{ color: '#666666' }}>REGISTRATION DATE</div>
                                            <div className="font-semibold text-[14px] text-center" style={{ color: '#666666' }}>ACTIONS</div>
                                        </div>

                                        {/* Table Body */}
                                        <div className="flex-1">
                                            {Array.isArray(sortedUsers) ? sortedUsers.map((user, index) => (
                                                <div 
                                                    key={user.id}
                                                    className="grid grid-cols-4 gap-4 px-6 text-[14px]"
                                                    style={{
                                                        height: '54px',
                                                        backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F6FCFF',
                                                        alignItems: 'center',
                                                        color: '#666666'
                                                    }}
                                                >
                                                    <div>{user.name}</div>
                                                    <div>{user.role}</div>
                                                    <div>{user.registration_date}</div>
                                                    <div className="flex justify-center">
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
                                                                    <Link 
                                                                        href={route('user.edit', { id: user.id })}
                                                                        className="block w-full text-left px-4 py-2 text-[14px] text-gray-700 hover:bg-[#CDCDCD] transition-colors"
                                                                    >
                                                                        Edit
                                                                    </Link>
                                                                    <button 
                                                                        type="button"
                                                                        className="block w-full text-left px-4 py-2 text-[14px] text-gray-700 hover:bg-[#CDCDCD] transition-colors"
                                                                        onClick={() => handleDeleteClick(user)}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : <div className="p-4 text-center text-gray-500">No users found</div>}
                                        </div>
                                        </div>
                                    </div>
<hr />
                                    {/* Pagination */}
                                    <div className="relative flex items-center mt-4 px-4 py-4">
                                        <div className="absolute left-4 flex items-center">
                                            <span className="text-sm mr-2 custom-text-color">Rows per page:</span>
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
                                                    onClick={() => handlePaginationClick(users?.prev_page_url)}
                                                    disabled={!users?.prev_page_url}
                                                    className={`px-2 py-1 rounded flex items-center ${!users?.prev_page_url ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
                                                >
                                                    <div className="custom-text-color flex items-center">
                                                        <span style={{ fontSize: '20px', marginRight: '2px' }}>&laquo;</span>
                                                        <span>Prev</span>
                                                        <span className="mx-1">|</span>
                                                    </div>
                                                </button>

                                                <span className="custom-text-color flex items-center px-1">
                                                    Page {users?.current_page || 1} of {users?.last_page || 1}
                                                </span>

                                                <button
                                                    onClick={() => handlePaginationClick(users?.next_page_url)}
                                                    disabled={!users?.next_page_url}
                                                    className={`px-2 py-1 rounded flex items-center ${!users?.next_page_url ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
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

            <DeleteConfirmationModal
                show={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete User?"
            />
        </AuthenticatedLayout>
    );
} 