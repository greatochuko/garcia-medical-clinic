import React from 'react';
import Modal from '@/Components/Modal';

export default function DeleteConfirmationModal({ show, onClose, onConfirm, title = "Delete Item?" }) {
    const itemType = title.toLowerCase().replace('delete ', '').replace('?', '');
    
    const handleClose = (e) => {
        e.stopPropagation();  // Prevent event from bubbling up
        onClose();
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="lg">
            <div className="p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-2 text-center delete-modal-content">{title}</h2>
                <hr className="border-t border-gray-200 mb-4" />
                <p className="text-gray-600 mb-8 text-center">
                    This can not be undone. Are you sure you want to delete this {itemType} permanently?
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        className="w-24 px-4 py-2 cancel-button rounded-md "
                    >
                        Cancel
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onConfirm();
                        }}
                        className="w-24 px-4 py-2 save-button text-white bg-red-600 rounded-md save-button" 
                        style={{fontSize: '14px', fontWeight: '100', fontFamily: 'Poppins',}}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    );
} 