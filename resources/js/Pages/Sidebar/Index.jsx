import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Sidebar from '@/Components/Sidebar';
import Modal from '@/Components/Modal';
import DeleteConfirmationModal from '@/Components/DeleteConfirmationModal';
import ListMedicationForTemplete from '@/Components/ListMedicationForTemplete';

export default function MedicationTemplates({ auth, templates }) {
    const [selectedMenu, setSelectedMenu] = useState('Medication Template');
    const [activeActionRow, setActiveActionRow] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [sortDirection, setSortDirection] = useState(null);
    const [sortedTemplates, setSortedTemplates] = useState(templates.data);
    const [perPage, setPerPage] = useState(templates?.per_page || 10);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [medications, setMedications] = useState([]);
    
    const { data, setData, post, processing, errors, reset, put } = useForm({
        name: '',
    });

    // Sort templates only when direction changes
    useEffect(() => {
        if (sortDirection === null) {
            setSortedTemplates(templates.data);
            return;
        }
        
        const sorted = [...templates.data].sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            return sortDirection === 'asc' 
                ? nameA.localeCompare(nameB)
                : nameB.localeCompare(nameA);
        });
        setSortedTemplates(sorted);
    }, [sortDirection, templates.data]);

    // Handle rows per page change
    const handlePerPageChange = (e) => {
        const newPerPage = parseInt(e.target.value);
        setPerPage(newPerPage);
        router.get(route('medication-templates'), { 
            perPage: newPerPage,
            page: 1
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['templates']
        });
    };

    // Handle pagination click
    const handlePaginationClick = (url) => {
        if (url) {
            router.get(url, {
                preserveState: true,
                preserveScroll: true,
                only: ['templates']
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

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('medication-templates.store'), {
            onSuccess: () => {
                setShowAddModal(false);
                reset();
            },
        });
    };

    const handleSort = () => {
        // Cycle through: null (original) -> asc -> desc -> null
        setSortDirection(current => {
            if (current === null) return 'asc';
            if (current === 'asc') return 'desc';
            return null;
        });
    };

    const handleDeleteClick = (template) => {
        setItemToDelete(template);
        setShowDeleteModal(true);
        setActiveActionRow(null);
    };

    const handleDeleteConfirm = () => {
        if (itemToDelete) {
            router.delete(route('medication-templates.destroy', itemToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                },
            });
        }
    };

    const handleEditClick = (template) => {
        setEditingTemplate(template);
        setData('name', template.name);
        setShowEditModal(true);
        setActiveActionRow(null);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        put(route('medication-templates.update', editingTemplate.id), {
            onSuccess: () => {
                setShowEditModal(false);
                setEditingTemplate(null);
                reset();
            },
        });
    };

    const handleEdit = async (template) => {
        try {
            const response = await fetch(`/medication-templates/${template.id}/medications`);
            const data = await response.json();
            setMedications(data);
            setSelectedTemplate(template);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching medications:', error);
        }
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-[14px] text-gray-800 leading-tight font-poppins">Medication Templates</h2>}
        >
            <Head title="Medication Templates">
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </Head>

            <div className="max-w-8xl py-3 mx-auto sm:px-6 lg:px-8">
                <div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-0">
                        <div className="flex font-poppins min-h-screen">
                            <Sidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} auth={auth}/>

                            {/* Main Content */}
                            <div className="flex-1 p-4 bg-white overflow-x-auto flex flex-col">
                                <div className="flex flex-col mb-4">
                                    <div className="w-full flex justify-center mb-4">
                                        <h3 className="font-poppins font-bold text-[16px] leading-[100%] tracking-[0px] text-[#429ABF]">
                                            MEDICATION TEMPLATES
                                        </h3>
                                    </div>
                                    <div className="w-full flex justify-end">
                                        <button 
                                            className="text-white px-4 py-2 rounded-[6px] flex items-center text-[14px] add-templates-btn"
                                            onClick={() => setShowAddModal(true)}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                                <path d="M12.5212 0.270508H1.30597C1.00852 0.270508 0.723261 0.388668 0.512935 0.598994C0.302608 0.80932 0.184448 1.09458 0.184448 1.39203V12.6073C0.184448 12.9047 0.302608 13.19 0.512935 13.4003C0.723261 13.6106 1.00852 13.7288 1.30597 13.7288H12.5212C12.8186 13.7288 13.1039 13.6106 13.3142 13.4003C13.5246 13.19 13.6427 12.9047 13.6427 12.6073V1.39203C13.6427 1.09458 13.5246 0.80932 13.3142 0.598994C13.1039 0.388668 12.8186 0.270508 12.5212 0.270508ZM10.8389 7.5604H7.47434V10.925C7.47434 11.0737 7.41526 11.2163 7.3101 11.3215C7.20494 11.4267 7.06231 11.4857 6.91358 11.4857C6.76486 11.4857 6.62223 11.4267 6.51707 11.3215C6.4119 11.2163 6.35282 11.0737 6.35282 10.925V7.5604H2.98825C2.83953 7.5604 2.6969 7.50132 2.59174 7.39616C2.48657 7.291 2.42749 7.14837 2.42749 6.99964C2.42749 6.85092 2.48657 6.70829 2.59174 6.60312C2.6969 6.49796 2.83953 6.43888 2.98825 6.43888H6.35282V3.07431C6.35282 2.92559 6.4119 2.78296 6.51707 2.6778C6.62223 2.57263 6.76486 2.51355 6.91358 2.51355C7.06231 2.51355 7.20494 2.57263 7.3101 2.6778C7.41526 2.78296 7.47434 2.92559 7.47434 3.07431V6.43888H10.8389C10.9876 6.43888 11.1303 6.49796 11.2354 6.60312C11.3406 6.70829 11.3997 6.85092 11.3997 6.99964C11.3997 7.14837 11.3406 7.291 11.2354 7.39616C11.1303 7.50132 10.9876 7.5604 10.8389 7.5604Z" fill="white"/>
                                            </svg>
                                            Add Templates
                                        </button>
                                    </div>
                                </div>

                              <div className="bg-white rounded-[6px] ">
                                <div className=" flex-1 flex flex-col table-screen">
                                    {/* Table Header */}
                                    <div className="table-header-item px-6 font-semibold text-[14px] text-[#666666] sticky top-0 z-10">
                                        SET NAME <SortArrow column="name" />
                                    </div>

                                    {/* Table Body */}
                                    <div className="flex-1">
                                        {sortedTemplates.map((template, index) => (
                                            <div 
                                                key={template.id} 
                                                className={`flex justify-between items-center px-6 py-3 text-[14px] table-row-base ${index % 2 === 0 ? 'row-even' : 'row-odd'}`}
                                            >
                                                <span>{template.name}</span>
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
                                                                type="button"
                                                                className="block w-full text-left px-4 py-2 text-[14px] text-gray-700 hover:bg-[#CDCDCD] transition-colors"
                                                                onClick={() => handleEdit(template)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button 
                                                                type="button"
                                                                className="block w-full text-left px-4 py-2 text-[14px] text-gray-700 hover:bg-[#CDCDCD] transition-colors"
                                                                onClick={() => handleDeleteClick(template)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
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
                                                onClick={() => handlePaginationClick(templates?.prev_page_url)}
                                                disabled={!templates?.prev_page_url}
                                                className={`px-2 py-1 rounded flex items-center ${!templates?.prev_page_url ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
                                            >
                                                <div className="custom-text-color flex items-center">
                                                    <span style={{ fontSize: '20px', marginRight: '2px' }}>&laquo;</span>
                                                    <span>Prev</span>
                                                    <span className="mx-1">|</span>
                                                </div>
                                            </button>

                                            <span className="custom-text-color flex items-center px-1">
                                                Page {templates?.current_page || 1} of {templates?.last_page || 1}
                                            </span>

                                            <button
                                                onClick={() => handlePaginationClick(templates?.next_page_url)}
                                                disabled={!templates?.next_page_url}
                                                className={`px-2 py-1 rounded flex items-center ${!templates?.next_page_url ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
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

            {/* Add Template Modal */}
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
                        ADD TEMPLATE
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="name" className="block font-poppins font-medium text-[16px] text-left mb-2 template-label">
                            Enter Medication Template Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="template-input"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="Pedia Infection (0-12 month)"
                        />
                        {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                        <div className="flex justify-end mt-4">
                            <button
                                type="submit"
                                className="template-confirm-btn"
                                disabled={processing}
                            >
                                Confirm
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Edit Template Modal */}
            <Modal show={showEditModal} onClose={() => {
                setShowEditModal(false);
                setEditingTemplate(null);
                reset();
            }} maxWidth="lg">
                <div className="template-modal-content">
                    <button
                        onClick={() => {
                            setShowEditModal(false);
                            setEditingTemplate(null);
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
                        EDIT TEMPLATE
                    </h1>
                    <form onSubmit={handleEditSubmit}>
                        <label htmlFor="edit-name" className="block font-poppins font-medium text-[16px] text-left mb-2 template-label">
                            Enter Medication Template Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="edit-name"
                            className="template-input"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="Pedia Infection (0-12 month)"
                        />
                        {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                        <div className="flex justify-end mt-4">
                            <button
                                type="submit"
                                className="template-confirm-btn"
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
                title="Delete Template?"
            />

            <ListMedicationForTemplete
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                medications={medications}
                title={selectedTemplate?.name}
                templateId={selectedTemplate?.id}
            />
        </AuthenticatedLayout>
    );
} 