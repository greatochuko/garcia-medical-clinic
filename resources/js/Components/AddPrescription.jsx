import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import axios from 'axios';

export default function AddPrescriptionModal({ isOpen, onClose, patient, prescription, onResetPrescription, appointment_id }) {
  const [medicationName, setMedicationName] = useState('');
  const [frequency, setFrequency] = useState('');
  const [dosage, setDosage] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [options, setMedications] = useState([]);
  const [options2, setFrequencies] = useState([]);
  const [showMedDropdown, setShowMedDropdown] = useState(false);
  const [showFreqDropdown, setShowFreqDropdown] = useState(false);
  const wrapperRef = useRef(null);
  useEffect(() => {
    if (prescription) {
      setMedicationName(prescription.medication || '');
      setDosage(prescription.dosage || '');
      setFrequency(prescription.frequency || '');
      setAmount(prescription.amount || '');
      setDuration(prescription.duration || '');
    } else {
      setMedicationName('');
      setDosage('');
      setFrequency('');
      setAmount('');
      setDuration('');
    }
  }, [prescription]);

  useEffect(() => {
   medilist();
   freqlist();
  }, []);

  useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                
                setShowFreqDropdown(false)
                setShowMedDropdown(false)
                
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  const medilist = () => {
     axios.get('/medication-getlist')
      .then((response) => {
        if (response.data && response.data.data) {
          const medicationNames = response.data.data.map(med => med.name);
          setMedications(medicationNames);
        }
      });
  }
  const freqlist = () =>{
     axios.get('/frequency-getlist')
      .then((response) => {
        if (response.data && response.data.data) {
          const freq = response.data.data.map(f => f.name);
          setFrequencies(freq);
        }
      });
  }

  const handleSubmit = async (resetform = false) => {
    try {
      const data = {
        patient_id: patient.patient_id,
        medication: medicationName,
        appointment_id: appointment_id,
        dosage,
        frequency,
        amount,
        duration,
      };

      let response;
      if (prescription) {
        data.id = prescription.id;
        response = await axios.put('/patient/prescription/update', data);
      } else {
        response = await axios.post('/patient/prescription/add', data);
      }

      if (resetform && response.data.success) {
        setMedicationName('');
        setDosage('');
        setFrequency('');
        setAmount('');
        setDuration('');
        onResetPrescription?.();
      } else {
        setMedicationName('');
        setDosage('');
        setFrequency('');
        setAmount('');
        setDuration('');
        onClose(false);
      }
      freqlist()
      medilist()
    } catch (error) {
      console.error('Error sending prescription:', error);
      onClose(true);
      // alert('An error occurred.');
    }
  };

  const filteredMedications = options.filter(opt =>
    opt.toLowerCase().includes(medicationName.toLowerCase())
  );

  const filteredFrequencies = options2.filter(opt =>
    opt.toLowerCase().includes(frequency.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onClose={() => onClose(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-20" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <Dialog.Panel className="bg-white rounded-lg max-w-4xl w-full shadow-xl p-8">
          <Dialog.Title className="text-xl font-bold text-[#429ABF] mb-6">ADD PRESCRIPTION</Dialog.Title>

          <div className="grid grid-cols-3 gap-8">
            <div className="text-sm col-span-1 text-gray-700 border-r border-black-500">
              <p className="text-[#A1A1A1]">
                <span className="font-semibold text-[#429ABF]">Patient Name</span><br />
                {patient.first_name},{patient.last_name}<br />
                {patient.age}, {patient.gender}
              </p>
              <p className="mt-4 text-[#A1A1A1]">
                <span className="font-semibold text-[#429ABF]">Patient ID</span><br />
                {patient.patient_id}
              </p>
              <p className="mt-4 text-[#A1A1A1]">
                <span className="font-semibold text-[#429ABF]">Blood Pressure</span><br />
                {patient?.vitals[0]?.blood_systolic_pressure}/{patient?.vitals[0]?.blood_diastolic_pressure}
              </p>
              <p className="mt-4 text-[#A1A1A1]">
                <span className="font-semibold text-[#429ABF]">Weight</span><br />
                {patient?.vitals[0]?.weight}Kg
              </p>
            </div>

            <div className="space-y-4 col-span-2">
              {/* Medication Input */}
              <div className="relative w-full max-w-md">
                <label className="block text-sm font-medium text-[#429ABF] mb-1">
                  Medication Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 pr-10"
                    value={medicationName}
                    onChange={(e) => {
                      setMedicationName(e.target.value);
                      setShowMedDropdown(true);
                    }}
                    onClick={(e) => {
                      setMedicationName(e.target.value);
                      setShowMedDropdown(true);
                    }}
                    onFocus={() => setShowMedDropdown(true)}
                    placeholder="Type or select medication"
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={() => setShowMedDropdown(prev => !prev)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.01807 5.58295L7.24957 11.1799C7.66207 11.8949 8.33707 11.8949 8.74957 11.1799L11.9811 5.58245C12.3941 4.86745 12.0561 4.28345 11.2311 4.28345H4.76807C3.94307 4.28345 3.60507 4.86795 4.01807 5.58295Z" fill="#666666"/>
                    </svg>
                  </div>
                  {showMedDropdown && (
                    <ul ref={wrapperRef} className="absolute z-10 w-full border border-gray-300 rounded-md bg-white mt-1 max-h-48 overflow-y-auto shadow-md">
                      {(filteredMedications.length > 0 ? filteredMedications : [medicationName]).map((option, idx) => (
                        <li
                          key={idx}
                          onClick={() => {
                            setMedicationName(option);
                            setShowMedDropdown(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Dosage */}
              <div>
                <label className="block text-sm font-medium text-[#429ABF]">Dosage</label>
                <input
                  type="text"
                  className="mt-1 block w-1/4 border border-gray-300 rounded-md p-2"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                />
              </div>

              {/* Frequency Input */}
              <div className="relative w-full max-w-md">
                <label className="block text-sm font-medium text-[#429ABF] mb-1">
                  Frequency <span className="text-red-500">*</span>
                </label>
                <div className="relative" >
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 pr-10"
                    value={frequency}
                    onChange={(e) => {
                      setFrequency(e.target.value);
                      setShowFreqDropdown(true);
                    }}
                    onClick={(e) => {
                      setFrequency(e.target.value);
                      setShowFreqDropdown(true);
                    }}
                    onFocus={() => setShowFreqDropdown(true)}
                    placeholder="Type or select frequency"
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={() => setShowFreqDropdown(prev => !prev)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.01807 5.58295L7.24957 11.1799C7.66207 11.8949 8.33707 11.8949 8.74957 11.1799L11.9811 5.58245C12.3941 4.86745 12.0561 4.28345 11.2311 4.28345H4.76807C3.94307 4.28345 3.60507 4.86795 4.01807 5.58295Z" fill="#666666"/>
                    </svg>
                  </div>
                  {showFreqDropdown && (
                    <ul ref={wrapperRef} className="absolute z-10 w-full border border-gray-300 rounded-md bg-white mt-1 max-h-48 overflow-y-auto shadow-md">
                      {(filteredFrequencies.length > 0 ? filteredFrequencies : [frequency]).map((option, idx) => (
                        <li
                          key={idx}
                          onClick={() => {
                            setFrequency(option);
                            setShowFreqDropdown(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Amount & Duration */}
              <div className="flex gap-4">
                <div className="w-1/4">
                  <label className="block text-sm font-medium text-[#429ABF]">Amount (#)</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="w-1/4">
                  <label className="block text-sm font-medium text-[#429ABF]">Duration (In Days)</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="bg-white text-[#429ABF] px-4 py-2 rounded-md cancel-button"
                  onClick={() => handleSubmit(false)}
                >
                  Done
                </button>
                <button
                  className="bg-[#429ABF] text-white px-4 py-2 rounded-md save-button"
                  onClick={() => handleSubmit(true)}
                >
                  Add More
                </button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
