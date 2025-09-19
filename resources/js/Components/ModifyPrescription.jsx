import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

export default function AddPrescriptionModal({ isOpen, onClose }) {
  const [medicationName, setMedicationName] = useState('');
  const [medicationName2, setMedicationName2] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  
  const handleSubmit = () => onClose(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const options = [
    'Medication + Tuberculosis',
    'Hello + Pharma',
    'Magnesium Hydroxide + Aluminum Hydroxide',
     'Medication + Tuberculosis',
    'Hello + Pharma',
    'Magnesium Hydroxide + Aluminum Hydroxide',
     'Medication + Tuberculosis',
    'Hello + Pharma',
    'Magnesium Hydroxide + Aluminum Hydroxide',
     'Medication + Tuberculosis',
    'Hello + Pharma',
    'Magnesium Hydroxide + Aluminum Hydroxide',
     'Medication + Tuberculosis',
    'Hello + Pharma',
    'Magnesium Hydroxide + Aluminum Hydroxide',
     'Medication + Tuberculosis',
    'Hello + Pharma',
    'Magnesium Hydroxide + Aluminum Hydroxide',
     'Medication + Tuberculosis',
    'Hello + Pharma',
    'Magnesium Hydroxide + Aluminum Hydroxide',
     'Medication + Tuberculosis',
    'Hello + Pharma',
    'Magnesium Hydroxide + Aluminum Hydroxide',

  ];

  const handleOptionClick = (option) => {
    setMedicationName(option);
    setDropdownOpen(true);
    offdropdown();
  };

  const handleOptionClick2 = (option) => {
    setMedicationName2(option);
    setDropdownOpen2(true);
    offdropdown2();
  };
const dropdownshow = () => {
    var x = document.getElementById('dropdown');
  if(x.style.display == 'none'){
   x.style.display = 'block';
  setDropdownOpen(true);
  }else{
  x.style.display = 'none';
  setDropdownOpen(true);
  }
  }

   const dropdownshow2 = () => {
    var x = document.getElementById('dropdown2');
  if(x.style.display == 'none'){
   x.style.display = 'block';
  setDropdownOpen(true);
  }else{
  x.style.display = 'none';
  setDropdownOpen(true);
  }
  }

  const offdropdown = () => {
  document.getElementById('dropdown').style.display = 'none';
  }

  const offdropdown2 = () => {
  document.getElementById('dropdown2').style.display = 'none';
  }
  

  return (
    <Dialog open={isOpen} onClose={handleSubmit} className="relative z-50">
      {/* Light Black Background - NO BLUR */}
      <div className="fixed inset-0 bg-black bg-opacity-20" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <Dialog.Panel className="bg-white rounded-lg max-w-4xl w-full shadow-xl p-8">
          <Dialog.Title className="text-xl font-bold text-[#429ABF] mb-6">ADD PRESCRIPTION</Dialog.Title>

          <div className="grid grid-cols-3 gap-8">
            {/* Left: Patient Info */}
            <div className="text-sm col-span-1 text-gray-700 border-r border-black-500">
              <p className="text-[#A1A1A1]"><span className="font-semibold text-[#429ABF]">Patient Name</span><br />Jennings, Mark Anthony<br />53, Female</p>
              <p className="mt-4 text-[#A1A1A1]"><span className="font-semibold text-[#429ABF]">Patient ID</span><br />001867</p>
              <p className="mt-4 text-[#A1A1A1]"><span className="font-semibold text-[#429ABF]">Blood Pressure</span><br />110/70</p>
              <p className="mt-4 text-[#A1A1A1]"><span className="font-semibold text-[#429ABF]">Weight</span><br />68Kg</p>
            </div>

            {/* Right: Form */}
            <div className="space-y-4 col-span-2">
              <div>
                {/* <label className="block text-sm font-medium text-gray-700">Medication Name <span className="text-red-500">*</span></label>
                <select name="" id="" class="w-full">
                <option value=""><input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  placeholder="e.g. Magnesium Hydroxide + Aluminum Hydroxide"
                />
              </option>
              <option value="">Medication + Tuberclosis</option>
              <option value="">Hello + Pharma</option>
                </select> */}
                     <div className="relative w-full max-w-md">
      <label className="block text-sm font-medium text-[#429ABF] mb-1">
        Medication Name <span className="text-red-500">*</span>
      </label>
     <div className="relative w-full max-w-md">
  <input
    type="text"
    className="w-full border border-gray-300 rounded-md p-2 pr-10" // note the 'pr-10' for space
    value={medicationName}
    onChange={(e) => setMedicationName(e.target.value)}
    onFocus={() => setDropdownOpen(true)}
    onInput = {offdropdown}
    onClick = {offdropdown}
    placeholder="Type or select medication"
  />

  {/* Dropdown icon */}
  <div
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
    onClick={dropdownshow}
  >
    ▼
  </div>
</div>
      {dropdownOpen && (
        <ul className="absolute z-10 w-full border border-gray-300 rounded-md bg-white mt-1 max-h-48 overflow-y-auto shadow-md dropdown" id="dropdown" style={{display:'none'}}>
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

              <div>
                <label className="block text-sm font-medium text-[#429ABF]">Dosage</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                />
              </div>

              <div className="relative w-full max-w-md">
      <label className="block text-sm font-medium text-[#429ABF] mb-1">
        Frequency <span className="text-red-500">*</span>
      </label>
     <div className="relative w-full max-w-md">
  <input
    type="text"
    className="w-full border border-gray-300 rounded-md p-2 pr-10" // note the 'pr-10' for space
    value={medicationName2}
    onChange={(e) => setMedicationName2(e.target.value)}
    onFocus={() => setDropdownOpen(true)}
    onInput = {offdropdown2}
    onClick = {offdropdown2}
    placeholder="Type or select medication"
  />

  {/* Dropdown icon */}
  <div
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
    onClick={dropdownshow2}
  >
    ▼
  </div>
</div>
      {dropdownOpen && (
        <ul className="absolute z-10 w-full border border-gray-300 rounded-md bg-white mt-1 max-h-48 overflow-y-auto shadow-md dropdown" id="dropdown2" style={{display:'none'}}>
          {options.map((option, idx) => (
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
                  className="bg-white save-button text-[#429ABF] border border-[#429ABF] px-4 py-2 rounded-md"
                  onClick={handleSubmit}
                >
                  Done
                </button>
                <button
                  className="save-button text-white px-4 py-2 rounded-md"
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
