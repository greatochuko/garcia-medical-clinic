import React from 'react';
import { Dialog } from '@headlessui/react';
import axios from 'axios';
import { Head, useForm, router } from '@inertiajs/react';
import { useEffect } from 'react';
import { useState } from 'react';
import '../../css/app.css';


export default function VitalSignsModal({ isOpen, setIsOpen, patient = null, onClose, patient_vital = null }) {
  const [vitalId, setVitalId] = useState(null);
  const { data, setData, post, processing, errors } = useForm({
    patient_id: '',
    blood_diastolic_pressure: '',
    blood_systolic_pressure: '',
    heart_rate: '',
    o2saturation: '',
    temperature: '',
    height_ft: '',
    height_in: '',
    weight: '',
  });



  const clearFormData = () => {
    setData({
      patient_id: '',
      blood_diastolic_pressure: '',
      blood_systolic_pressure: '',
      heart_rate: '',
      o2saturation: '',
      temperature: '',
      height_ft: '',
      height_in: '',
      weight: '',
    });
  };

  const closeModal = () => {
    clearFormData();
    setIsOpen(false);
    onClose()
  };
  const patient_vitals = async () => {
    try {
      const response = await fetch(`/vitalsignsmodal/${patient.patient_id}`);
      const vitalData = await response.json();
      setVitalId(vitalData.id);
      setData({
        patient_id: vitalData.patient_id || '',
        blood_diastolic_pressure: vitalData.blood_diastolic_pressure || '',
        blood_systolic_pressure: vitalData.blood_systolic_pressure || '',
        heart_rate: vitalData.heart_rate || '',
        o2saturation: vitalData.o2saturation || '',
        temperature: vitalData.temperature || '',
        height_ft: vitalData.height_ft || '',
        height_in: vitalData.height_in || '',
        weight: vitalData.weight || '',
      });
    } catch (error) {
      console.error('Error fetching vital signs:', error);
      clearFormData();
      setData('patient_id', patient.patient_id)
    }
  };
  useEffect(() => {
    if (patient && patient.patient_id) {
      setData('patient_id', patient.patient_id)
      patient_vitals();
    } else {
      clearFormData();
    }
  }, [isOpen, patient]);


  const updatedata = async () => {
    try {
      const response = await axios.put(`/vitalsignsmodal/update/${vitalId}`, data);
      closeModal()
    } catch (error) {
      console.error("Update failed:", error);
    }
  };


  const savedata = async () => {
    try {
      const response = await axios.post('/vitalsignsmodal/add', data);
      closeModal()
    } catch (error) {
      console.error("Save failed:", error);
    }
  };


  return (
    <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
      {/* Light Black Background - NO BLUR */}
      <div className="fixed inset-0 bg-black bg-opacity-20" aria-hidden="true" />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <Dialog.Panel className="bg-white rounded-xl p-8  w-full max-w-5xl">
          <h2 className="text-xl font-semibold text-[#429ABF] mb-6 uppercase">Vital Signs and Measurements</h2>
          <div className="flex gap-6">
            {/* Patient Info */}
            <div className="w-1/3 border-r pr-6">
              <p className="text-sm text-[#429ABF] font-semibold">Patient Name</p>
              <p className="text-gray-400">{patient ? patient.name : ''}</p>

              <p className="mt-4 text-sm text-[#429ABF] font-semibold">Patient ID</p>
              <p className="text-gray-400">{patient ? patient.patient_id : ''}</p>
            </div>

            {/* Input Form */}
            <div className="w-full">
              <form className="space-y-4">
                <div className="p-0 m-0 text-left text-[#429ABF] font-semibold">Enter Vital Signs</div>

                <div className="grid grid-cols-1 gap-4 ml-[20px]">
                  <div className="grid grid-cols-3">
                    <div className="col-span-1 flex">
                      <label className="block text-sm font-medium text-left text-[#666666] pt-2">Blood Pressure (mmHg)</label>
                    </div>
                    <div className="col-span-2 text-left">
                      <input type="text" className="input w-[45px] px-2 rounded" name="blood_systolic_pressure" value={data.blood_systolic_pressure} onChange={e => setData('blood_systolic_pressure', e.target.value)} />
                      <span className="w-[5px] m-[4px]">/</span>
                      <input type="text" className="input w-[45px] px-2 rounded" name="blood_diastolic_pressure" value={data.blood_diastolic_pressure} onChange={e => setData('blood_diastolic_pressure', e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3">
                    <div className="col-span-1 flex">
                      <label className="block text-sm font-medium text-left pt-2 text-[#666666]">Heart Rate (bpm)</label>
                    </div>
                    <div className="col-span-2 text-left">
                      <input type="text" className="input w-[104px] rounded" name="heart_rate" value={data.heart_rate} onChange={e => setData('heart_rate', e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3">
                    <div className="flex col-span-1">
                      <label className="block text-sm font-medium pt-2 text-[#666666]">O2 Saturation (%)</label>
                    </div>
                    <div className="col-span-2 text-left">
                      <input type="text" className="input w-[104px] rounded" name="o2saturation" value={data.o2saturation} onChange={e => setData('o2saturation', e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium pt-2 text-[#666666]">Temperature (°C)</label>
                    </div>
                    <div className="col-span-2 text-left">
                      <input type="text" className="input w-[104px] rounded" name="temperature" value={data.temperature} 
                      onChange={(e) => {
                          const inputValue = e.target.value;
                                               const numericValue = inputValue
      .replace(/[^0-9.]/g, '')        // remove everything except numbers and dot
      .replace(/^(\d*\.\d*).*$/, '$1'); // keep only the first dot and digits after it
       setData('temperature', numericValue);
                                            }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-0 m-0 text-left text-[#429ABF] font-semibold ">Enter Measurements</div>

                <div className="grid grid-cols-1 gap-4 ml-[20px]">
                  <div className="grid grid-cols-3">
                    <div className="col-span-1 flex">
                      <label className="block text-sm font-medium pt-2 text-[#666666]">Height (ft' in“)</label>
                    </div>
                    <div className="col-span-2 text-left">
                      <input type="text" className="input w-[45px] px-3 rounded" placeholder="ft" name="height_ft" value={data.height_ft} onChange={e => setData('height_ft', e.target.value)} />
                      <span className="w-[5px] m-[4px]"> </span>
                      <input type="text" className="input w-[45px] px-3 rounded" placeholder="in" name="height_in" value={data.height_in} onChange={e => setData('height_in', e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3">
                    <div className="col-span-1 flex">
                      <label className="block text-sm font-medium pt-2 text-[#666666]">Weight (kg)</label>
                    </div>
                    <div className="col-span-2 text-left">
                      <input
  type="text"
  className="input w-[104px] rounded"
  name="weight"
  value={data.weight}
  onChange={(e) => {
    const inputValue = e.target.value;

    // Allow digits and one decimal point only
    const numericValue = inputValue
      .replace(/[^0-9.]/g, '')        // remove everything except numbers and dot
      .replace(/^(\d*\.\d*).*$/, '$1'); // keep only the first dot and digits after it

    setData('weight', numericValue);
  }}
/>

                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6 mr-12">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2  rounded text-gray-600 cancel-button"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={vitalId ? updatedata : savedata}
                    className="px-4 py-2 bg-[#429ABF] save-button rounded text-white"
                  >
                    {vitalId ? "Update" : "Save"}
                  </button>

                </div>
              </form>

            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
