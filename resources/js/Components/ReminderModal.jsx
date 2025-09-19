import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import '../../css/app.css';

export default function ReminderModal({ isOpen, onClose, onSubmit }) {
    // Manage reminderText state locally within the component
    const [reminderText, setReminderText] = useState('');
    
    const handleSubmit = () => {
        onSubmit(reminderText);
        setReminderText('');
    };
    
    const handleClose = () => {
        setReminderText('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
            {/* Light Black Background */}
            <div className="fixed inset-0 bg-black bg-opacity-20" aria-hidden="true" />
            
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                    <div className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-[20px] font-poppins font-semibold text-[#429ABF]">REMINDERS</Dialog.Title>
                    </div>

                    <div className="mb-4">
                        <label className="block text-[#666666] text-[14px] mb-2">Write a reminder</label>
                        <textarea
                            className="w-full  border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            rows="4"
                            value={reminderText}
                            onChange={(e) => setReminderText(e.target.value)}
                            placeholder="Enter your reminder here..."
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            className="px-4 py-2 rounded-md cancel-button font-medium"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 text-white rounded-md transition save-button"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}