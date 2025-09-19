import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/plan-list.css';

export default function Index({ auth, plans }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [editingPlan, setEditingPlan] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingPlan) {
            router.put(`/plans/${editingPlan.id}`, formData);
        } else {
            router.post('/plans', formData);
        }
        closeModal();
    };

    const openModal = (plan = null) => {
        if (plan) {
            setEditingPlan(plan);
            setFormData({
                name: plan.name,
                description: plan.description || '',
            });
        } else {
            setEditingPlan(null);
            setFormData({ name: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPlan(null);
        setFormData({ name: '', description: '' });
    };

    const handleDelete = (planId) => {
        if (confirm('Are you sure you want to delete this plan?')) {
            router.delete(`/plans/${planId}`);
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Plan List" />

            <div className="min-height-container p-4 sm:p-6 lg:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="page-title text-gray-900">Plan List</h2>
                    <button
                        onClick={() => openModal()}
                        className="action-button"
                    >
                        Add Plan
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="table-header grid grid-cols-12 px-6">
                        <div className="col-span-4">Plan Name</div>
                        <div className="col-span-5">Description</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1">Action</div>
                    </div>

                    {plans.data.map((plan, index) => (
                        <div
                            key={plan.id}
                            className={`table-row grid grid-cols-12 px-6 ${
                                index % 2 === 0 ? 'table-row-even' : 'table-row-odd'
                            }`}
                        >
                            <div className="col-span-4">{plan.name}</div>
                            <div className="col-span-5">{plan.description}</div>
                            <div className="col-span-2">
                                <span className={plan.status ? 'status-active' : 'status-inactive'}>
                                    {plan.status ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="col-span-1">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => openModal(plan)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(plan.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-6">
                    {/* Add pagination component here */}
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="modal-content w-full max-w-md">
                            <div className="modal-header">
                                <h3 className="text-lg font-medium">
                                    {editingPlan ? 'Edit Plan' : 'Add New Plan'}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="modal-close"
                                >
                                    ×
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Plan Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-input"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        rows="3"
                                    />
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="action-button"
                                    >
                                        {editingPlan ? 'Update Plan' : 'Add Plan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
} 