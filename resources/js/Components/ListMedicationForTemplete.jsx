import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import DeleteConfirmationModal from '@/Components/DeleteConfirmationModal';
import AddMedicationForTemplete from '@/Components/AddMedicationForTemplete';
import { router } from '@inertiajs/react';
import axios from 'axios';

const ListMedicationForTemplete = ({ isOpen, onClose, medications: initialMedications, title, templateId, currentUser }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [medicationToDelete, setMedicationToDelete] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [tempMedications, setTempMedications] = useState([]);
    const [medications, setMedications] = useState(initialMedications);
    const [editingMedication, setEditingMedication] = useState(null);

    // Update medications when initialMedications changes
    useEffect(() => {
        setMedications(initialMedications);
    }, [initialMedications]);

    const fetchMedications = async () => {
        try {
            const response = await axios.get(`/medication-templates/${templateId}/medications`);
            setMedications(response.data);
        } catch (error) {
            console.error('Error fetching medications:', error);
        }
    };

    const handleDeleteClick = (medication) => {
        setMedicationToDelete(medication);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (medicationToDelete) {
            if (medicationToDelete.is_temporary) {
                setTempMedications(tempMedications.filter(med => med.id !== medicationToDelete.id));
                setShowDeleteModal(false);
                setMedicationToDelete(null);
            } else {
                router.delete(route('medication-templates.medications.destroy', {
                    template: templateId,
                    medication: medicationToDelete.id
                }), {
                    preserveScroll: true,
                    onSuccess: async () => {
                        setShowDeleteModal(false);
                        setMedicationToDelete(null);
                        await fetchMedications();
                    },
                });
            }
        }
    };

    const handleCloseDeleteModal = (e) => {
        if (e) {
            e.stopPropagation();
        }
        setShowDeleteModal(false);
        setMedicationToDelete(null);
    };

    const handleMainModalClose = (e) => {
        if (showDeleteModal || showAddModal) {
            return;
        }
        onClose();
    };

    const handleAddMedication = (newMedication) => {
        setTempMedications([...tempMedications, newMedication]);
    };

    const handleSaveTemplate = async () => {
        let savedCount = 0;
        const totalMedications = tempMedications.length;

        for (const medication of tempMedications) {
            try {
                await axios.post(`/medication-templates/${templateId}/medications`, {
                    medication_name: medication.medication_name,
                    dosage: medication.dosage,
                    frequency: medication.frequency,
                    duration: medication.duration,
                    amount: medication.amount,
                    medication_template_id: templateId
                });
                
                savedCount++;
            } catch (error) {
                console.error('Error saving medication:', error);
            }
        }

        if (savedCount === totalMedications) {
            // Only clear temp medications and refresh if all saves were successful
            setTempMedications([]);
            await fetchMedications();
        }
    };

    const handleEditClick = (medication) => {
        setEditingMedication(medication);
        setShowAddModal(true);
    };

    const handleUpdateMedication = async (updatedMedication) => {
        try {
            if (updatedMedication.is_temporary) {
                // Update temporary medication
                setTempMedications(tempMedications.map(med => 
                    med.id === updatedMedication.id ? updatedMedication : med
                ));
            } else {
                // Update in database
                await axios.put(`/medication-templates/${templateId}/medications/${updatedMedication.id}`, {
                    medication_name: updatedMedication.medication_name,
                    dosage: updatedMedication.dosage,
                    frequency: updatedMedication.frequency,
                    duration: updatedMedication.duration,
                    amount: updatedMedication.amount,
                });
                await fetchMedications();
            }
            setEditingMedication(null);
        } catch (error) {
            console.error('Error updating medication:', error);
        }
    };

    // Combine database medications with temporary ones for display
    const allMedications = [...(medications || []), ...tempMedications];

    return (
        <>
            <Transition appear show={isOpen} as="div">
                <Dialog as="div" className="relative z-40" onClose={handleMainModalClose}>
                    <Transition.Child
                        as="div"
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as="div"
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="bg-white rounded-lg shadow-xl relative" style={{ width: '1339px', height: '602px' }}>
                                    <div className="p-6 font-poppins h-full flex flex-col" onClick={e => e.stopPropagation()}>
                                        <div className="flex justify-between items-center mb-4">
                                            <Dialog.Title className="text-lg font-semibold text-[#429ABF] font-poppins text-[20px]">
                                                {title}
                                            </Dialog.Title>
                                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                                <XMarkIcon className="h-6 w-6" />
                                            </button>
                                        </div>

                                        <div className="flex-1 overflow-x-auto">
                                            <table className="min-w-full">
                                                <thead>
                                                    <tr className="bg-[#E9F9FF]">
                                                        <th className="px-4 py-2 text-left text-[#666666] text-[14px] font-normal font-poppins">Medication Name</th>
                                                        <th className="px-4 py-2 text-left text-[#666666] text-[14px] font-normal font-poppins">Dose</th>
                                                        <th className="px-4 py-2 text-left text-[#666666] text-[14px] font-normal font-poppins">Frequency</th>
                                                        <th className="px-4 py-2 text-left text-[#666666] text-[14px] font-normal font-poppins">Duration</th>
                                                        <th className="px-4 py-2 text-left text-[#666666] text-[14px] font-normal font-poppins">Amount</th>
                                                        <th className="px-4 py-2 text-left text-[#666666] text-[14px] font-normal font-poppins">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="font-poppins">
                                                    {allMedications?.map((med, index) => (
                                                        <tr key={med.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#F1F2F5]'} ${med.is_temporary ? 'bg-opacity-60' : ''}`}>
                                                            <td className="px-4 py-2 text-[#666666] text-[14px] font-normal font-poppins">{med.medication_name}</td>
                                                            <td className="px-4 py-2 text-[#666666] text-[14px] font-normal font-poppins">{med.dosage}</td>
                                                            <td className="px-4 py-2 text-[#666666] text-[14px] font-normal font-poppins">{med.frequency}</td>
                                                            <td className="px-4 py-2 text-[#666666] text-[14px] font-normal font-poppins">{med.duration || '-'}</td>
                                                            <td className="px-4 py-2 text-[#666666] text-[14px] font-normal font-poppins">{med.amount}</td>
                                                            <td className="px-4 py-2">
                                                                <div className="flex space-x-2">
                                                                    <button 
                                                                        onClick={() => handleEditClick(med)}
                                                                        className="text-blue-500 hover:text-blue-700"
                                                                    >
                                                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M10 0C10.2549 0.000282707 10.5 0.0978791 10.6854 0.272848C10.8707 0.447818 10.9822 0.686953 10.9972 0.941395C11.0121 1.19584 10.9293 1.44638 10.7657 1.64183C10.6021 1.83729 10.3701 1.9629 10.117 1.993L10 2H2V16H16V8C16.0003 7.74512 16.0979 7.49997 16.2728 7.31463C16.4478 7.1293 16.687 7.01776 16.9414 7.00283C17.1958 6.98789 17.4464 7.07067 17.6418 7.23426C17.8373 7.39785 17.9629 7.6299 17.993 7.883L18 8V16C18.0002 16.5046 17.8096 16.9906 17.4665 17.3605C17.1234 17.7305 16.6532 17.9572 16.15 17.995L16 18H2C1.49542 18.0002 1.00943 17.8096 0.639452 17.4665C0.269471 17.1234 0.0428434 16.6532 0.00500021 16.15L1.00268e-07 16V2C-0.000159579 1.49542 0.190406 1.00943 0.533497 0.639452C0.876588 0.269471 1.34684 0.0428433 1.85 0.00500011L2 0H10ZM16.243 0.343C16.423 0.163652 16.6644 0.0595265 16.9184 0.0517719C17.1723 0.0440173 17.4197 0.133215 17.6103 0.301249C17.8008 0.469282 17.9203 0.703552 17.9444 0.956475C17.9685 1.2094 17.8954 1.46201 17.74 1.663L17.657 1.758L7.757 11.657C7.57704 11.8363 7.33557 11.9405 7.08162 11.9482C6.82767 11.956 6.58029 11.8668 6.38972 11.6988C6.19916 11.5307 6.07969 11.2964 6.0556 11.0435C6.03151 10.7906 6.10459 10.538 6.26 10.337L6.343 10.243L16.243 0.343Z" fill="#429ABF"/>
                                                                        </svg>
                                                                    </button>
                                                                    <button 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteClick(med);
                                                                        }}
                                                                        className="text-red-500 hover:text-red-700"
                                                                    >
                                                                        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M3 18C2.45 18 1.97933 17.8043 1.588 17.413C1.19667 17.0217 1.00067 16.5507 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.8043 17.021 14.413 17.413C14.0217 17.805 13.5507 18.0007 13 18H3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z" fill="#429ABF"/>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="absolute bottom-6 right-6 flex space-x-4">
                                            <button
                                                className="bg-[#429ABF] text-[14px] font-poppins text-white px-4 py-2 rounded hover:bg-blue-500 font-poppins"
                                                onClick={() => setShowAddModal(true)}
                                            >
                                                Add More
                                            </button>
                                            <button
                                                className="bg-white text-[14px] font-poppins text-[#429ABF] px-4 py-2 rounded hover:bg-[#429ABF] hover:text-white font-poppins border border-[#429ABF]"
                                                onClick={handleSaveTemplate}
                                                disabled={tempMedications.length === 0}
                                            >
                                                Save Template
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {showDeleteModal && (
                <DeleteConfirmationModal
                    show={showDeleteModal}
                    onClose={handleCloseDeleteModal}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Medication?"
                />
            )}

            <AddMedicationForTemplete
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setEditingMedication(null);
                }}
                currentUser={currentUser}
                templateName={title}
                onAddMedication={handleAddMedication}
                editingMedication={editingMedication}
                onUpdateMedication={handleUpdateMedication}
            />
        </>
    );
};

export default ListMedicationForTemplete; 