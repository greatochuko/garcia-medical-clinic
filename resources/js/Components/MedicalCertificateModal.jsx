import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import  { useEffect } from 'react';
import axios from 'axios';

const MedicalCertificateModal = ({ isOpen, onClose, patientInfo, diagnosis , appointment_id }) => {
  if(!isOpen){
    return
  }
     const patient_diagnosis = diagnosis?.map(item => item.diagnosis) || [];

  const [formData, setFormData] = useState({
    civilStatus: '',
    diagnosis: '',
    comments: '',
    patient_id: '',
    appointment_id: appointment_id
  });


  const get_certificate_info = () => {
  axios.get(`/medical-certificate/patient/info/${patientInfo.patient_id}/${appointment_id}`)
    .then((response) => {
      const data = response.data;
      setFormData(prev => ({
        ...prev,
        civilStatus: data.civilStatus || '',
        diagnosis: data.diagnosis || '',
        comments: data.comments || '',
        patient_id: data.patient_id || ''
      }));
    })
    .catch((error) => {
      console.error("Error fetching certificate info:", error);
    });
};


   useEffect(() => {
   get_certificate_info();
   setFormData(prev => ({
    ...prev,
    diagnosis: patient_diagnosis.join(',')
  }));
   setFormData(prev => ({
    ...prev,
    patient_id: patientInfo.patient_id
  }));

  }, []);
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  axios.post('/medical-certificate', formData)
    .then((response) => {
      onClose(); // Optional: close modal if needed
      // window.open(`/medical-certificate/${formData.patient_id}/${appointment_id}`, '_blank');
    })
    .catch((error) => {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Submission failed:", error);
      }
    });
};

// const handleSubmit = (e) => {
//   e.preventDefault();

//   // Submit medical certificate
//   axios.post('/medical-certificate', formData)
//     .then(() => {
//       // Then submit patient plan
//       return axios.post('/patient/planlist', {
//         patient_id: formData.patient_id,
//         appointment_id: formData.appointment_id,
//         plan: 'Medical Certificate Issued'
//       });
//     })
//     .then(() => {
//       onClose(); // Close modal after both requests succeed
//     })
//     .catch((error) => {
//       if (error.response && error.response.status === 422) {
//         setErrors(error.response.data.errors);
//       } else {
//         console.error("Submission failed:", error);
//       }
//     });
// };



  if (!isOpen) return null;

  return (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white rounded-xl w-[1100px] h-[600px] flex flex-col overflow-hidden">
    
    {/* Header */}
    <div className="flex justify-between items-center p-4 pt-8 pl-12 pr-12">
      <h2 className="text-[#429ABF] text-xl font-bold">CREATE MEDICAL CERTIFICATE</h2>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>

    {/* Content */}
    <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
      <div className="px-12 overflow-y-auto flex-grow">
        <div className="flex">
          
          {/* Left Side - Patient Information */}
          <div className="w-1/3 pr-12 py-12">
            <div className="mb-6">
              <h3 className="text-[14px] font-poopins font-semibold text-[#429ABF] mb-1">Patient Information</h3>
              <div className="text-gray-800 mb-6">
                <p className="font-medium font-poopins text-[15px] text-[#A1A1A1]">
                  {patientInfo?.first_name}, {patientInfo?.last_name}
                </p>
                <p className="font-poopins text-[15px] text-[#A1A1A1]">
                  {patientInfo?.age}, {patientInfo?.gender}
                </p>
              </div>
              <div>
                <h4 className="text-[14px] font-poopins font-semibold text-[#429ABF] mb-1">Patient Address</h4>
                <p className="font-poopins text-[15px] text-[#A1A1A1]">
                  {patientInfo?.address || '202 Mercury, New Corella Tagum City'}
                </p>
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="border-l border-gray-300 mx-4"></div>

          {/* Right Side - Form Fields */}
          <div className="w-2/3 pl-6 py-12">
            <div className="space-y-6">
              <div className="w-3/4">
                <label className="block font-semibold font-poopins text-[#429ABF] text-[14px] mb-2">
                  Civil Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="civilStatus"
                  value={formData.civilStatus}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select Civil Status</option>
                  <option value="Married">Married</option>
                  <option value="Single">Single</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Divorced">Divorced</option>
                </select>
                {errors.civilStatus && (
                  <p className="text-red-500 text-sm mt-1">{errors.civilStatus}</p>
                )}
              </div>

              <div className="w-3/4">
                <label className="block font-semibold font-poopins text-[#429ABF] text-[14px] mb-2">
                  Diagnosis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter diagnosis"
                />
                {errors.diagnosis && (
                  <p className="text-red-500 text-sm mt-1">{errors.diagnosis}</p>
                )}
              </div>

              <div className="w-3/4">
                <label className="block font-semibold font-poopins text-[#429ABF] text-[14px] mb-2">
                  Comments <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  rows="4"
                  placeholder="Enter comments"
                />
                {errors.comments && (
                  <p className="text-red-500 text-sm mt-1">{errors.comments}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Fixed Button Section */}
      <div className="flex justify-end gap-2 p-4 px-14 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 w-24 rounded cancel-button transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 w-34 bg-[#429ABF] text-white rounded save-button hover:bg-[#3789ac] transition-colors duration-200"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default MedicalCertificateModal; 