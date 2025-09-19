import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import '../../css/app.css';
import axios from 'axios';
import DeleteConfirmationModal from '@/Components/DeleteConfirmationModal';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';



const mockServices = [
  { id: 1, name: 'Regular Check Up', price: 250 },
  { id: 2, name: 'Senior Check Up', price: 250 },
  { id: 3, name: 'Medical Certificate', price: 300 },
];

function formatPHP(amount) {
  return `PHP ${Number(amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function BillingModal({ servicesPrice, isCompleted,isOpen, setIsOpen, patient = null, appointmentId = null, onClose, ForBillingStatus , statuss, markPaidButtonEnable }) {
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [billingId, setBillingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { auth } = usePage().props;

 if(patient?.patient){
  var ap_id = patient.id
  patient = patient.patient
 }

  useEffect(() => {
    if (isOpen && patient) {
      fetchBilling();
    } else if (!isOpen) {
      setSelectedServiceId('');
      setSelectedServices([]);
      setDiscount(0);
      setBillingId(null);
    }
  }, [isOpen, patient]);

  const fetchBilling = async () => {
    try {
      const response = await axios.get(`/billing/${patient.patient_id}`);
      if (response.data && response.data.billing) {
        const billing = response.data.billing;
        setBillingId(billing.id);
        setSelectedServices(JSON.parse(billing.services));
        setDiscount(billing.discount || 0);
      } else {
        setBillingId(null);
        setSelectedServices([]);
        setDiscount(0);
      }
    } catch (error) {
      setBillingId(null);
      setSelectedServices([]);
      setDiscount(0);
    }
  };


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/services');
        setServices(response.data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
      }
    };
    
    fetchServices();
  }, []);

  const handleAddService = () => {
    const service = services.find(s => s.id === Number(selectedServiceId));
    if (service && !selectedServices.some(s => s.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
    }
    setSelectedServiceId('');
  };

  const handleDeleteService = (id) => {
    setSelectedServices(selectedServices.filter(s => s.id !== id));
  };

  const total = selectedServices.reduce((sum, s) => sum + Number(s.price), 0);
  const totalAfterDiscount = Math.max(total - Number(discount), 0);

  const handleSave = async () => {
    if (!selectedServices.length) {
      alert('Please add at least one service');
      return;
    }

    const data = {
      patient_id: patient.patient_id,
      services: JSON.stringify(selectedServices),
      total: total || 0,
      discount: Number(discount) || 0,
      final_total: totalAfterDiscount || 0,
      paid: false,
      status: statuss,
      appointment_id: appointmentId ,
      appointment_date: patient.appointment_date,
      // ...(billingId && { status: 'open' })
    };

    try {
      if (billingId) {
        await axios.put(`/billing/${billingId}`, data);
        if(ForBillingStatus){
        ForBillingStatus();
        }
        // ForBillingStatus
      } else {
        await axios.post('/billing', data);
      }
      
      // setIsOpen(false);
      if (onClose) onClose();
      // onClose();

      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error saving billing. Please try again.';
      console.error('Error saving billing:', errorMessage);
      // alert(errorMessage);
    }
    if (isCompleted) {
        router.visit(route('appointments.index'));
      }
  };

  const handleDelete = async () => {
    if (!billingId) return;
    try {
      await axios.delete(`/billing/${billingId}`);
      setIsOpen(false);
      setShowDeleteModal(false);
      onClose();
    } catch (error) {
      // alert('Error deleting billing');
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };


  const handleMarkPaid = async () => {
    try {
      const billingData = {
        patient_id: patient.patient_id,
        services: JSON.stringify(selectedServices),
        total: total || 0,
        discount: Number(discount) || 0,
        final_total: totalAfterDiscount || 0,
        paid: true,
        status: statuss,
        appointment_id: appointmentId,
        appointment_date: patient.appointment_date,
      };
  
      if (!selectedServices.length) {
        alert('Please add at least one service');
        return;
      }
  
      if (billingId) {
        await axios.put(`/billing/${billingId}`, billingData);
      } else {
        await axios.post('/billing', billingData);
      }
  
      // Optional callback if needed
      if (ForBillingStatus) {
        ForBillingStatus();
      }
  
      // Mark appointment as checked out
      await axios.post(`/appointments/check-out/${patient.patient_id}`);
  
      // Close modal
      if (onClose) onClose();
  
      // Redirect
      // if (auth.user.role === 'secretary') {
        window.location.href = route('appointments.index');
      // }
  
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error marking as paid. Please try again.';
      console.error('Error marking as paid:', errorMessage);
      alert(errorMessage);
    }
  };


  // const handleMarkPaid = async () => {
  //   try {
  //     // First save the billing
  //     const billingData = {
  //       patient_id: patient.patient_id,
  //       services: JSON.stringify(selectedServices),
  //       total: total || 0,
  //       discount: Number(discount) || 0,
  //       final_total: totalAfterDiscount || 0,
  //       paid: true,
  //       appointment_id: appointmentId
  //     };

  //     if (billingId) {
  //       await axios.put(`/billing/${billingId}`, billingData);
  //     } else {
  //       await axios.post('/billing', billingData);
  //     }

  //     // Then mark as paid and check out
  //     await axios.post(`/appointments/check-out/${patient.patient_id}`);
      
  //     setIsOpen(false);
  //     if (onClose) onClose();

  //     if (auth.user.role === 'secretary') {
  //       window.location.href = route('appointments.index');
  //     }
  //   } catch (error) {
  //     const errorMessage = error.response?.data?.message || 'Error marking as paid. Please try again.';
  //     console.error('Error marking as paid:', errorMessage);
  //     alert(errorMessage);
  //   }
  // };

  const handleUnPaid = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };


  return (
    <Dialog open={isOpen} onClose={handleCancel} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-20" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <Dialog.Panel className="bg-white rounded-xl p-8 w-full max-w-4xl min-h-[600px] flex items-stretch">
          <div className="flex gap-6 w-full">
            {/* Left: Patient Info */}
            <div className="w-1/3 border-r pr-6 flex flex-col justify-start">
              <h2 className="text-[20px] font-bold text-[#429ABF] mb-6 uppercase">Billing Form</h2>
              <p className="text-sm text-[#429ABF] font-semibold mb-1">Patient Name</p>
              <p className="text-gray-400 mb-4">{patient ? patient.name : ''}</p>
              <p className="text-sm text-[#429ABF] font-semibold mb-1">Patient ID</p>
              <p className="text-gray-400">{patient ? patient.patient_id : ''}</p>
            </div>
            {/* Right: Billing Form */}
            <div className="w-full flex flex-col justify-between">
              <div>
                {/* Service Dropdown and Add Button */}
                <div className="flex items-center gap-3 mb-4 mt-16">
                  <select
                    className="border rounded px-3 py-2 w-full max-w-xs focus:outline-none text-[#666666] font-bold"
                    value={selectedServiceId}
                    onChange={e => setSelectedServiceId(e.target.value)}
                  >
                    <option value="" className='text-[#666666]'>Select Service</option>
                    {services && services.map(service => (
                      <option className='text-[#666666]' key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="bg-[#429ABF] text-white save-button font-normal px-5 py-2 rounded font-medium"
                    style={{ minWidth: 80 }}
                    onClick={handleAddService}
                    disabled={!selectedServiceId}
                  >
                   + Add Charges
                  </button>
                </div>
                {/* Services Table */}
                <div className="rounded overflow-hidden mb-2">
                  <table className="w-full">
                    <thead className='text-[16px] font-poopins'>
                      <tr className="bg-[#E9F9FF] text-[#429ABF]">
                        <th className="p-4 text-left font-bold">Services</th>
                        <th className="p-2 text-left font-semibold">Price</th>
                        <th className="p-2 text-center font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedServices.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="p-4 text-center text-gray-400">No services added</td>
                        </tr>
                      ) : (
                        selectedServices.map(service => (
                          <tr key={service.id} className=" last:border-b-0 ml-[15px]">
                            <td className="px-4 p-2 text-[#666666] ">{service.name}</td>
                            <td className="p-2 text-left text-[#666666]">{formatPHP(service.price)}</td>
                            <td className="p-2 text-center">
                              <button
                                type="button"
                                className="text-[#429ABF] hover:text-[#21729b]"
                                onClick={() => handleDeleteService(service.id)}
                                title="Delete"
                              >
                                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 18C2.45 18 1.97933 17.8043 1.588 17.413C1.19667 17.0217 1.00067 16.5507 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.8043 17.021 14.413 17.413C14.0217 17.805 13.5507 18.0007 13 18H3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z" fill="#429ABF"/>
                                </svg>

                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Discount Input and Total Amount */}
              <div>

              
              
              
              
              
              <div className="flex items-center  gap-x-[209px] mb-4">
                  {/* Label */}
                  <label
                    htmlFor=""
                    className="w-[150px] ml-[15px] font-poppins text-[#429ABF] font-medium text-[15px] text-left template-label"
                  >
                    <span className="font-poppins text-[#429ABF] font-semibold text-[15px]">
                    Add discount 
                    </span>
                    
                  </label>

                  {/* Input container */}
                  <div className="relative w-[170px]">
                    <span className="absolute left-0 top-0 bottom-0 bg-gray-200 px-3 text-sm text-[#AAAAAA] flex items-center rounded-l pointer-events-none">
                      PHP
                    </span>
                    <input
                      type="number"
                      id="edit-charge"
                      className="w-full pl-14 pr-12 py-2 bg-white border text-[#666666] border-gray-300 rounded-md focus:outline-none"
                      value={parseInt(discount) || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        // Optional: block decimals
                        if (val.includes('.')) return;
                    
                        setDiscount(val);
                      }}
                      required
                      min="0"
                      max={total}
                      inputMode="numeric"
                    />
                    <span className="absolute right-0 top-0 bottom-0 bg-gray-200 px-3 text-sm text-[#AAAAAA] flex items-center rounded-r pointer-events-none">
                      .00
                    </span>
                  </div>
              </div>








                {/* <div className="flex items-center gap-2 mb-2 mt-4 justify-start">
                  <span className="text-[#429ABF] font-bold text-[15px]">Add Discount</span>
                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-[100px] ml-2"
                    value={discount}
                    min={0}
                    max={total}
                    onChange={e => setDiscount(e.target.value)}
                  />
                </div> */}
              <div className="bg-[#E9F9FF] rounded flex justify-between items-center px-4 py-3 font-bold text-[#666666] text-[14px] font-poppins mb-6 mt-4">
                <span>TOTAL AMOUNT</span>
                <span className="mr-[120px]">{formatPHP(totalAfterDiscount)}</span>
              </div>
               
               
               
               
                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-2">
  {auth.user.role === 'secretary' ? (
    <>
      
      <button
        type="button"
        onClick={handleUnPaid}
        className="w-20 h-10 flex items-center justify-center text-center bg-[#EF3616] hover:bg-[#EF3616] text-white font-poppins text-[12px] rounded font-medium"
        >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleMarkPaid}
        className="w-22 h-10 bg-[#1B7E45] hover:bg-[#1B7E45] text-[#FFFFFF] font-poppins text-[12px] px-6 py-2 rounded font-medium"
      >
        Mark Paid
      </button>
    </>
  ) : (
    <>
      <button
        type="button"
        onClick={handleCancel}
        className="cancel-button text-[#429ABF] px-4 py-2 rounded bg-white hover:bg-[#429ABF] hover:text-white font-medium"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSave}
        className="bg-[#429ABF]v save-button text-white px-6 py-2 rounded font-medium"
      >
        Save
      </button>
      {markPaidButtonEnable && (
        <button
          type="button"
          onClick={handleMarkPaid}
          className="w-22 h-10 bg-[#1B7E45] hover:bg-[#1B7E45] text-[#FFFFFF] font-poppins text-[12px] px-6 py-2 rounded font-medium"
        >
          Mark Paid
        </button>
)}
    </>
  )}
</div>








              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
     
    </Dialog>
  );
} 