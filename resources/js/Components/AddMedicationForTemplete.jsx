import React, { useState, useEffect,useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { usePage } from '@inertiajs/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function AddMedicationForTemplete({ 
  isOpen, 
  onClose, 
  currentUser, 
  templateName, 
  onAddMedication,
  editingMedication,
  onUpdateMedication 
}) {
  if(!isOpen) {
    return
  }
  const { auth } = usePage().props;
    const [medicationName, setMedicationName] = useState('');
  const [Frequency, setFrequencyName] = useState('');
  const [dosage, setDosage] = useState('');
  const [options2, setFrequency] = useState('');
  const [options, setMedications] = useState([]);
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  



   useEffect(() => {
    axios.get('/medication-getlist')
      .then((response) => {
        if (response.data && response.data.data) {
         const medicationNames = response.data.data.map(med => med.name);
          setMedications(medicationNames);
        } else {
          console.error('Invalid response format', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching medications:', error);
      })
      .finally(() => {
        // setLoading(false);
      });
  }, []);

     useEffect(() => {
    axios.get('/frequency-getlist')
      .then((response) => {
        if (response.data && response.data.data) {
         const frequency = response.data.data.map(med => med.name);
          setFrequency(frequency);
        } else {
          console.error('Invalid response format', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching medications:', error);
      })
      .finally(() => {
        // setLoading(false);
      });
  }, []);
  const medicationInputRef = useRef(null);

  useEffect(() => {
  if (isOpen && medicationInputRef.current) {
    medicationInputRef.current.focus();
  }
}, [isOpen]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  // Set form data when editing
  useEffect(() => {
    if (editingMedication) {
      setMedicationName(editingMedication.medication_name || '');
      setDosage(editingMedication.dosage || '');
      setFrequencyName(editingMedication.frequency || '');
      setDuration(editingMedication.duration || '');
      setAmount(editingMedication.amount || '');
    } else {
      // Reset form when not editing
      setMedicationName('');
      setFrequencyName('');
      setDosage('');
      setFrequency('');
      setAmount('');
      setDuration('');
      
    }
  }, [editingMedication]);

  const handleSubmit = () => {
    if (editingMedication) {
      // Update existing medication
      const updatedMedication = {
        ...editingMedication,
        medication_name: medicationName,
        dosage: dosage,
        frequency: Frequency,
        duration: duration,
        amount: amount
      };
      onUpdateMedication(updatedMedication);
    } else {
      // Create new medication
      const newMedication = {
        id: 'temp_' + Date.now(),
        medication_name: medicationName,
        dosage: dosage,
        frequency: Frequency,
        duration: duration,
        amount: amount,
        is_temporary: true
      };
      onAddMedication(newMedication);
    }

    // Reset form and close modal
    setMedicationName('');
    setFrequencyName('');
    setDosage('');
    setFrequency('');
    setAmount('');
    setDuration('');
    onClose();
  };

  const handleAddMore = () => {
    const newMedication = {
      id: 'temp_' + Date.now(),
      medication_name: medicationName,
      dosage: dosage,
      frequency: Frequency,
      duration: duration,
      amount: amount,
      is_temporary: true
    };

    onAddMedication(newMedication);

    // Reset form
    setMedicationName('');
    setFrequencyName('');
    setDosage('');
    setFrequency('');
    setAmount('');
    setDuration('');
  };



  const handleOptionClick = (option) => {
    setMedicationName(option);
    setDropdownOpen(false);
  };

  const handleOptionClick2 = (option) => {
    setFrequencyName(option);
    setDropdownOpen2(false);
  };



const dropdownshow = () => {
    offdropdown2();
    var x = document.getElementById('dropdown');
    if(x){
  if(x.style.display == 'none'){
   x.style.display = 'block';
  setDropdownOpen(true);
  }else{
  x.style.display = 'none';
  setDropdownOpen(true);
  }
}
  }

   const dropdownshow2 = () => {

    offdropdown();
    var x = document.getElementById('dropdown2');
    if(x){
  if(x.style.display == 'none'){
   x.style.display = 'block';
  setDropdownOpen(true);
  }else{
  x.style.display = 'none';
  setDropdownOpen(true);
  }
}
  }

  const offdropdown = () => {
  document.getElementById('dropdown').style.display = 'none';
  }

  const offdropdown2 = () => {
  document.getElementById('dropdown2').style.display = 'none';
  }

  // Validate if form is complete
  const isFormValid = medicationName && medicationName && dosage && amount;

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      className="relative z-[100]"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-white rounded-lg max-w-4xl w-full shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-[20px] text-[poopins] font-bold text-[#429ABF]">ADD MEDICATION FOR TEMPLETE</Dialog.Title>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Left: User Info */}
            <div className="text-sm col-span-1 text-[#A1A1A1] border-r border-black-500">
              <p className="text-[#A1A1A1]"><span className="font-semibold text-[#429ABF]">Current User</span><br />{auth.user.first_name} {auth.user.last_name}</p>
              <p className="mt-4 text-[#A1A1A1]"><span className="font-semibold text-[#429ABF]">Template Name</span><br />{templateName}</p>
            </div>

            {/* Right: Form */}
            <div className="space-y-4 col-span-2">
              <div>
                <div className="relative w-full max-w-md">
                  <label className="block text-sm font-medium text-[#429ABF] mb-1">
                    Medication Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative w-full">
                     <input
    type="text"
    className="w-full border border-gray-300 rounded-md p-2 pr-10" // note the 'pr-10' for space
     ref={medicationInputRef}
    value={medicationName}
    onChange={(e) => setMedicationName(e.target.value)}
    onFocus={() => setDropdownOpen(true)}
    onInput = {offdropdown}
    onClick = {offdropdown}
    placeholder="Type or select medication"
  />
                    <div
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                      onClick={dropdownshow}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.01807 5.58295L7.24957 11.1799C7.66207 11.8949 8.33707 11.8949 8.74957 11.1799L11.9811 5.58245C12.3941 4.86745 12.0561 4.28345 11.2311 4.28345H4.76807C3.94307 4.28345 3.60507 4.86795 4.01807 5.58295Z" fill="#666666"/>
                      </svg>
                    </div>
                    {dropdownOpen && (
                      <ul className="absolute z-[110] w-full border border-gray-300 rounded-md bg-white mt-1 max-h-48 overflow-y-auto shadow-md" id="dropdown" style={{display:'none'}}>
                        {options.map((option, idx) => (
                          <li
                            key={idx}
                            onClick={() => handleOptionClick(option)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {option}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#429ABF]">Dosage</label>
                <input
                  type="text"
                  className="mt-1 block w-1/4 border border-gray-300 rounded-md p-2"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                />
              </div>

              <div className="relative w-full max-w-md">
                <label className="block text-sm font-medium text-[#429ABF] mb-1">
                  Frequency <span className="text-red-500">*</span>
                </label>
                <div className="relative w-full">
                  <input
    type="text"
    className="w-full border border-gray-300 rounded-md p-2 pr-10" // note the 'pr-10' for space
    value={Frequency}
    onChange={(e) => setFrequencyName(e.target.value)}
    onFocus={() => setDropdownOpen(true)}
    onInput = {offdropdown2}
    onClick = {offdropdown2}
    placeholder="Type or select Frequency"
  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={dropdownshow2}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.01807 5.58295L7.24957 11.1799C7.66207 11.8949 8.33707 11.8949 8.74957 11.1799L11.9811 5.58245C12.3941 4.86745 12.0561 4.28345 11.2311 4.28345H4.76807C3.94307 4.28345 3.60507 4.86795 4.01807 5.58295Z" fill="#666666"/>
                    </svg>
                  </div>
                  {dropdownOpen && (
                    <ul className="absolute z-[110] w-full border border-gray-300 rounded-md bg-white mt-1 max-h-48 overflow-y-auto shadow-md" id="dropdown2" style={{display:'none'}}>
                      {options2.map((option, idx) => (
                        <li
                          key={idx}
                          onClick={() => handleOptionClick2(option)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

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

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="bg-white text-[#429ABF] border border-[#429ABF] px-4 py-2 rounded-md"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#429ABF] text-white px-4 py-2 rounded-md"
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                >
                  {editingMedication ? 'Update' : 'Done'}
                </button>
                {!editingMedication && (
                  <button
                    className="bg-[#429ABF] text-white px-4 py-2 rounded-md"
                    onClick={handleAddMore}
                    disabled={!isFormValid}
                  >
                    Add More
                  </button>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
