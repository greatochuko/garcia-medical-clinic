import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function modifyRecord({ isOpen, onClose, doctor }) {
    
    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    return (
    <Dialog open={isOpen} onClose={handleCancel} className="relative z-50" >
         <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Modify Record</h3>
                            <hr />
                            <button 
                                className="modal-close"
                                onClick={() => onClose(true)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>This Record is already been closed by {doctor}. Are you sure you want to modify this record ?</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="modal-button cancel cancel-button"
                                onClick={() => onClose(true)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="modal-button delete"
                                onClick={handleDelete}
                                disabled={processing}
                            >
                                Delete Appointment
                            </button>
                        </div>
                    </div>
                </div>
     </Dialog>
    );
}
