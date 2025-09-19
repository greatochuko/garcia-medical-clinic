import { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import AddPrescriptionModal from '@/Components/AddPrescription';

export default function PrescriptionTemplate({isOpen, onClose, patient , appointment_id}) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [templates, setmedicationTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

 const fetchMedicationsByTemplate = () => {
    if (!selectedTemplateId) {
      console.warn('No template selected');
      return;
    }
    axios.get(`/medication-sub-templates/${selectedTemplateId}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          // setPrescriptions((prev) => {
            // const medication_template_id = response.data.medication_template_id;
            // const existingNames = new Set(prev.map(p => p.medication_template_id));
            const newMeds = response.data;
           const postSinglePrescription = (prescription) => {
  axios.post('/patient/prescription/add', prescription)
    .then(() => console.log('Prescription posted'))
    .catch(err => console.error(err));
}

if (newMeds.length > 0) {
  const medsWithPatientId = newMeds.map(item => ({
    patient_id: patient.patient_id,
    medication: item.medication_name,
    dosage: item.dosage,
    frequency: item.frequency,
    amount: item.amount,
    duration: item.duration,
  }));

  medsWithPatientId.forEach(postSinglePrescription);
}
    axios.get(`/patient/prescription/get/${patient.patient_id}/${appointment_id}`)
      .then((response) => {
        if (response.data && response.data.data) {
         setPrescriptions(response.data.data);
        }})
            // return [...prev, ...prescriptions];
          // });
        } else {
          console.error('Invalid response format:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching template medications:', error);
      });
  };

   const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this prescription?")) {
      axios.delete(`/patient/prescription/delete/${id}`)
        .then(() => {
          // Refresh the list after deletion
          fetchPrescriptions();
        })
        .catch((error) => {
          console.error("Failed to delete prescription:", error);
        });
    }
  }
    useEffect(() => {
    if (isOpen && patient?.patient_id) {
      fetchPrescriptions();
    }
  }, [isOpen, patient?.patient_id]);

  const fetchPrescriptions = () => {
    axios.get(`/patient/prescription/get/${patient.patient_id}/${appointment_id}`)
      .then((response) => {
        if (response.data?.data) {
          setPrescriptions(response.data.data);
        }
      });
  };


     useEffect(() => {
    axios.get(`/medication-templates/medications`)
      .then((response) => {
        if (response.data) {
          setmedicationTemplates(response.data);
          setSelectedTemplateId(response.data[0].id)
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

//   loadtemplate(){
   
//   }



  return (
    
     <Dialog open={isOpen} onClose={() => onClose(false)} className="relative z-50">
      {/* Light Black Background - NO BLUR */}
      <div className="fixed inset-0 bg-black bg-opacity-20" aria-hidden="true"  />
      <div className="fixed inset-0 flex items-center justify-center p-0 z-50 font-poppins">
        <Dialog.Panel className="bg-white rounded-lg w-full shadow-xl p-4 pl-6 edit-prescription-modal">
          {/* <Dialog.Title className="text-xl font-bold text-[#429ABF] mb-6">ADD PRESCRIPTION</Dialog.Title> */}
<AddPrescriptionModal
  isOpen={isModalOpen}
  onClose={() => {
    setIsModalOpen(false);
    setSelectedPrescription(null);  // Reset after close
    fetchPrescriptions()
  }}
  patient={patient}
  prescription={selectedPrescription}
  onResetPrescription={() => setSelectedPrescription(null)}
  appointment_id = {appointment_id}
/>

    {/* <div className="rounded-lg shadow-md p-6 bg-white "> */}
    <div className="flex justify-end"> 
     <button><svg width="14" height="14" onClick={() => onClose(false)}  viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.9998 8.40005L2.0998 13.3C1.91647 13.4834 1.68314 13.575 1.3998 13.575C1.11647 13.575 0.883138 13.4834 0.699804 13.3C0.516471 13.1167 0.424805 12.8834 0.424805 12.6C0.424805 12.3167 0.516471 12.0834 0.699804 11.9L5.5998 7.00005L0.699804 2.10005C0.516471 1.91672 0.424805 1.68338 0.424805 1.40005C0.424805 1.11672 0.516471 0.883382 0.699804 0.700048C0.883138 0.516715 1.11647 0.425049 1.3998 0.425049C1.68314 0.425049 1.91647 0.516715 2.0998 0.700048L6.9998 5.60005L11.8998 0.700048C12.0831 0.516715 12.3165 0.425049 12.5998 0.425049C12.8831 0.425049 13.1165 0.516715 13.2998 0.700048C13.4831 0.883382 13.5748 1.11672 13.5748 1.40005C13.5748 1.68338 13.4831 1.91672 13.2998 2.10005L8.3998 7.00005L13.2998 11.9C13.4831 12.0834 13.5748 12.3167 13.5748 12.6C13.5748 12.8834 13.4831 13.1167 13.2998 13.3C13.1165 13.4834 12.8831 13.575 12.5998 13.575C12.3165 13.575 12.0831 13.4834 11.8998 13.3L6.9998 8.40005Z" fill="#666666"/>
</svg>
</button>
</div>
    <div className="flex justify-between">
      <h2 className="text-lg font-bold text-[#429ABF] mb-4">MODIFY PRESCRIPTION</h2>
     
        {/* <button className="bg-[#429ABF] text-white text-sm px-4 py-2 rounded mr-20" onClick={fetchMedicationsByTemplate} >Add Template</button> */}
      </div>
      <div className="grid grid-cols-4 gap-4 text-sm mb-4">
        <div>
          <div className="font-inter font-bold text-[#429ABF]">Patient Name</div>
          <div className="text-[#A1A1A1]">{patient.first_name}, {patient.last_name}<br/>{patient.age}, {patient.gender}</div>
        </div>
        <div>
          <div className="font-bold text-[#429ABF]">Patient ID</div>
          <div className="text-[#A1A1A1]">{patient.patient_id}</div>
        </div>
        <div>
          <div className="font-bold text-[#429ABF]">Blood Pressure</div>
          <div className="text-[#A1A1A1]">{patient?.vitals[0]?.blood_systolic_pressure}/{patient?.vitals[0]?.blood_diastolic_pressure}</div>
        </div>
        <div>
          <div className="font-bold text-[#429ABF]">Weight</div>
          <div className="text-[#A1A1A1]">{patient?.vitals[0]?.weight}Kg</div>
        </div>
      </div>
      {/* <div className="flex items-center gap-2 mb-4">
        <select className="border rounded px-10 py-2 text-sm text-[#A1A1A1]" onChange={(e) => {
    const templateId = e.target.value;
    setSelectedTemplateId(templateId);
  }}>
        {templates.map((item, idx) => (
          <option value={item.id}><span>{item.name}</span></option>
           ))}
        </select>
        <button className="bg-[#429ABF] text-white text-sm px-4 py-2 rounded" onClick={fetchMedicationsByTemplate} >Load Template</button>
      </div> */}
    <div className="h-[30vh] overflow-y-auto">
  <table className="w-full text-sm text-left border">
    <thead className="bg-[#E9F9FF] sticky top-0 z-10">
      <tr className="font-normal">
        <th className="p-2 font-normal text-[#666666]">Medication Name</th>
        <th className="p-2 font-normal text-[#666666]">Dose</th>
        <th className="p-2 font-normal text-[#666666]">Frequency</th>
        <th className="p-2 font-normal text-[#666666]">Duration</th>
        <th className="p-2 font-normal text-[#666666]">Amount</th>
        <th className="p-2 font-normal text-[#666666]">Actions</th>
      </tr>
    </thead>
    <tbody>
      {prescriptions.map((item, idx) => (
        <tr key={idx} className={`border-t h-12 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F1F2F5]'}`}>
          <td className="p-2">{item.medication}</td>
          <td className="p-2">{item.dosage}</td>
          <td className="p-2">{item.frequency}</td>
          <td className="p-2">{item.duration || '-'}</td>
          <td className="p-2">{item.amount}</td>
          <td className="p-2 flex gap-2">
            <button
              className="text-blue-600"
              onClick={() => {
                setSelectedPrescription(item);
                setIsModalOpen(true);
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13 3C13.2549 3.00028 13.5 3.09788 13.6854 3.27285C13.8707 3.44782 13.9822 3.68695 13.9972 3.94139C14.0121 4.19584 13.9293 4.44638 13.7657 4.64183C13.6021 4.83729 13.3701 4.9629 13.117 4.993L13 5H5V19H19V11C19.0003 10.7451 19.0979 10.5 19.2728 10.3146C19.4478 10.1293 19.687 10.0178 19.9414 10.0028C20.1958 9.98789 20.4464 10.0707 20.6418 10.2343C20.8373 10.3979 20.9629 10.6299 20.993 10.883L21 11V19C21.0002 19.5046 20.8096 19.9906 20.4665 20.3605C20.1234 20.7305 19.6532 20.9572 19.15 20.995L19 21H5C4.49542 21.0002 4.00943 20.8096 3.63945 20.4665C3.26947 20.1234 3.04284 19.6532 3.005 19.15L3 19V5C2.99984 4.49542 3.19041 4.00943 3.5335 3.63945C3.87659 3.26947 4.34684 3.04284 4.85 3.005L5 3H13ZM19.243 3.343C19.423 3.16365 19.6644 3.05953 19.9184 3.05177C20.1723 3.04402 20.4197 3.13322 20.6103 3.30125C20.8008 3.46928 20.9203 3.70355 20.9444 3.95647C20.9685 4.2094 20.8954 4.46201 20.74 4.663L20.657 4.758L10.757 14.657C10.577 14.8363 10.3356 14.9405 10.0816 14.9482C9.82767 14.956 9.58029 14.8668 9.38972 14.6988C9.19916 14.5307 9.07969 14.2964 9.0556 14.0435C9.03151 13.7906 9.10459 13.538 9.26 13.337L9.343 13.243L19.243 3.343Z" fill="#429ABF"/>
</svg>

            </button>
            <button
              className="text-red-500"
              onClick={() => handleDelete(item.id)}
            >
              <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 18C2.45 18 1.97933 17.8043 1.588 17.413C1.19667 17.0217 1.00067 16.5507 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.8043 17.021 14.413 17.413C14.0217 17.805 13.5507 18.0007 13 18H3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z" fill="#429ABF"/>
</svg>

            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      <div className="flex justify-end gap-2 mt-4">
        <button className="bg-[#429ABF] text-white save-button px-4 py-2 rounded"  onClick={() => onClose(false)}  >Done</button>
        <button className="bg-[#429ABF] save-button text-white px-4 py-2 rounded" onClick={() => {
    setSelectedPrescription(null);
    setIsModalOpen(true);
  }}>Add More</button>
      </div>
    {/* </div> */}
     </Dialog.Panel>

      </div>
    </Dialog>
  );
}
