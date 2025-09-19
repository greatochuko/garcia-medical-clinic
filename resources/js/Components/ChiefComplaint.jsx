import { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react';

export default function ChiefComplaintModal({ isOpen, onClose, patient, appointment_id }) {
  if (!isOpen) return null;

  const [ChiefComplaintText, setChiefComplaintText] = useState('');
  const [originalComplaints, setOriginalComplaints] = useState([]);

  useEffect(() => {
    axios.get(`/patient/chiefcomplaint/get/${patient.patient_id}/${appointment_id}`)
      .then((response) => {
        if (response.data) {
          const complaints = response.data.map(item => item.chief_complaint);
          setChiefComplaintText(complaints.join('\n'));
          setOriginalComplaints(complaints); // Store original complaints
        } else {
          console.error('Invalid response format', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching complaints:', error);
      });
  }, [patient.patient_id]);

  const onSave = async () => {
    const current = ChiefComplaintText
      .split('\n')
      .map(c => c.trim())
      .filter(c => c !== '');

    const original = originalComplaints
      .map(c => c.trim())
      .filter(c => c !== '');

    const currentSet = new Set(current);
    const originalSet = new Set(original);

    const added = current.filter(c => !originalSet.has(c));
    const deleted = original.filter(c => !currentSet.has(c));

    try {
      for (const complaint of added) {
        await axios.post('/patient/chiefcomplaint/add', {
          patient_id: patient.patient_id,
          chief_complaint: complaint,
          appointment_id: appointment_id
        });
      }

      for (const complaint of deleted) {
        await axios.delete('/patient/chiefcomplaint/delete', {
          data: {
            patient_id: patient.patient_id,
            chief_complaint: complaint,
            appointment_id:appointment_id
          }
        });
      }

      onClose();
    } catch (error) {
      console.error('Error saving complaints:', error);
    }
  };

  return (
    <Dialog as="div" className="relative z-50" onClose={onClose} open={isOpen} style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-bold text-[#429ABF] mb-4">
              EDIT CARD TEXT
            </Dialog.Title>

            <div className="w-[90%] m-auto text-[#666666]">
            <h1>Edit Content Below</h1>
            <textarea
              rows={6}
              className="w-full p-2 border rounded text-sm outline-none focus:outline-none focus:ring-0 focus:border-gray-300"
              value={ChiefComplaintText}
              onChange={(e) => setChiefComplaintText(e.target.value)}
              placeholder="Enter one complaint per line"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="border border-[#429ABF] text-[#429ABF] px-4 py-1 rounded hover:bg-blue-50"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="bg-[#429ABF] text-white px-4 py-1 rounded  hover:bg-[#1D7498]"
              >
                Save
              </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
