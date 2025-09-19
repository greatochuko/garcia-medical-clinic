import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import { useEffect} from 'react';
import NavLink from "@/Components/NavLink";
import axios from 'axios';
import PatientMedicalHistoryModal from "@/Components/PatientMedicalHistory";

export default function ViewMedicalRecord({ auth, errors, patient = null, medicalRecords = [] , totalappointments }) {
    const handleBack = () => {
        window.history.back();
    };

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [diseases, setdiseases] = useState(null);

    const handlePrevious = () => {
        if (currentIndex > 0 && !isAnimating) {
            setIsAnimating(true);
            setCurrentIndex(prev => prev - 1);
            setTimeout(() => setIsAnimating(false), 500);
        }
    };

    const handleNext = () => {
        if (currentIndex < medicalRecords.length - 4 && !isAnimating) {
            setIsAnimating(true);
            setCurrentIndex(prev => prev + 1);
            setTimeout(() => setIsAnimating(false), 500);
        }
    };

    // If patient data is not available, show loading or error state
    if (!patient) {
        return (
            <AuthenticatedLayout auth={auth} errors={errors}>
                <Head title="Medical Records" />
                <div className="py-3">
                    <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-gray-900">Loading patient data...</div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }


      const fetchMedicalHistory = () => {
  axios.get(`/medicalhistory/${patient.patient_id}`)
    .then((response) => {
      const data = response.data;
      setdiseases(data);
  }
)}

 useEffect(() => {
    fetchMedicalHistory();
  }, [patient?.patient_id]);

    return (
        <AuthenticatedLayout
            auth={auth}
            errors={errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Medical Records</h2>}
        >
            <Head title="Medical Records" />
 <PatientMedicalHistoryModal
  isOpen={modalVisible}
  onClose={() => {
    setModalVisible(false);
    fetchMedicalHistory(); // Call after close
  }}
  onUpdate={(updatedTags) => {
    setModalVisible(false); // Close modal
    fetchMedicalHistory();  // Call after update
  }}
  patient={patient}
/>
            <div className="py-3">
                <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
                    <div className="rounded-lg mb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
                            <div className="absolute top-0 left-0 w-full h-[calc(100%-120px)] bg-white z-0"></div>
                            <div className="lg:col-span-12 p-8 relative z-10 bg-white">
                                <div className="relative flex items-center justify-between mb-4">
                                    <button 
                                        onClick={handleBack}
                                        className="flex items-center text-[#429ABF] hover:text-[#2B4E64] transition-colors duration-200 active:bg-transparent focus:outline-none"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                                            <path d="M15.7049 4.70504C16.0954 5.09557 16.0954 5.72544 15.7049 6.11597L9.82083 12L15.7049 17.884C16.0954 18.2746 16.0954 18.9044 15.7049 19.295C15.3144 19.6855 14.6845 19.6855 14.294 19.295L7.70492 12.7059C7.31439 12.3154 7.31439 11.6855 7.70492 11.295L14.294 4.70594C14.6845 4.31542 15.3144 4.31542 15.7049 4.70594V4.70504Z" fill="currentColor"/>
                                        </svg>
                                        <span className="text-[14px] font-semibold">Back</span>
                                    </button>
                                    <div className="absolute left-1/2 transform -translate-x-1/2">
                                        <div className="text-[14px] font-bold text-[#429ABF] font-poppins head-text uppercase">
                                            <b>Medical RECORDS: SEARCH RECORD</b>
                                        </div>
                                    </div>
                                </div>
                                <hr className="mb-4 mt-10" />
                                <span className="text-[20px] flex justify-between font-700 mt-5" style={{color:'#429ABF',fontWeight:'700'}}>
                                   <div>{patient.fullName} <span className="font-medium text-sm font-light-grey ">{patient.age}, {patient.gender}</span></div> 
                                   <div className="text-sm font-medium  flex row"><span><svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.95652 1.14286C3.95652 0.839753 4.08478 0.549062 4.31309 0.334735C4.54139 0.120408 4.85104 0 5.17391 0L8.82609 0C9.14896 0 9.45861 0.120408 9.68691 0.334735C9.91522 0.549062 10.0435 0.839753 10.0435 1.14286V1.71429C10.0435 2.01739 9.91522 2.30808 9.68691 2.52241C9.45861 2.73674 9.14896 2.85714 8.82609 2.85714H5.17391C4.85104 2.85714 4.54139 2.73674 4.31309 2.52241C4.08478 2.30808 3.95652 2.01739 3.95652 1.71429V1.14286ZM11.5652 1.14286H12.1739C12.6582 1.14286 13.1227 1.32347 13.4652 1.64496C13.8076 1.96645 14 2.40249 14 2.85714V14.2857C14 14.7404 13.8076 15.1764 13.4652 15.4979C13.1227 15.8194 12.6582 16 12.1739 16H1.82609C1.34178 16 0.877306 15.8194 0.534849 15.4979C0.192391 15.1764 0 14.7404 0 14.2857V2.85714C0 2.40249 0.192391 1.96645 0.534849 1.64496C0.877306 1.32347 1.34178 1.14286 1.82609 1.14286H2.43478V1.71429C2.43478 2.39627 2.72337 3.05032 3.23706 3.53256C3.75074 4.0148 4.44745 4.28571 5.17391 4.28571H8.82609C9.55255 4.28571 10.2493 4.0148 10.7629 3.53256C11.2766 3.05032 11.5652 2.39627 11.5652 1.71429V1.14286ZM5.74609 6.79771C5.74609 6.54971 5.96035 6.34971 6.22452 6.34971H7.7767C8.03965 6.34971 8.25391 6.54971 8.25391 6.79771V8.58057H10.153C10.4172 8.58057 10.6303 8.78171 10.6303 9.02971V10.4869C10.6306 10.5458 10.6185 10.6042 10.5946 10.6587C10.5707 10.7131 10.5356 10.7627 10.4912 10.8043C10.4468 10.846 10.3941 10.879 10.336 10.9014C10.278 10.9238 10.2158 10.9352 10.153 10.9349H8.25391V12.7177C8.2544 12.7767 8.24239 12.8352 8.2186 12.8899C8.1948 12.9445 8.15969 12.9941 8.11529 13.0359C8.0709 13.0777 8.01811 13.1108 7.95998 13.1333C7.90186 13.1557 7.83956 13.1672 7.7767 13.1669H6.2233C6.16044 13.1672 6.09814 13.1557 6.04002 13.1333C5.98189 13.1108 5.9291 13.0777 5.88471 13.0359C5.84031 12.9941 5.8052 12.9445 5.7814 12.8899C5.75761 12.8352 5.7456 12.7767 5.74609 12.7177V10.9349H3.84696C3.7842 10.9352 3.722 10.9238 3.66395 10.9014C3.60591 10.879 3.55317 10.846 3.50879 10.8043C3.46442 10.7627 3.42928 10.7131 3.40541 10.6587C3.38154 10.6042 3.36942 10.5458 3.36974 10.4869V9.02857C3.36974 8.78057 3.58278 8.57943 3.84696 8.57943H5.74609V6.79771Z" fill="#429ABF"/>
</svg>
</span>&nbsp;&nbsp;&nbsp;<span>Total Appointments:</span>&nbsp;&nbsp;<span>{totalappointments}</span></div>
                                </span>

                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 border-box lg:grid-cols-5 text-sm text-gray-600 mt-2 gap-2 ml-1">
                                        <div className="font-light-grey"><span className="font-semibold text-[#429ABF]">Patient ID:</span> <br /> {patient.patient_id}</div>
                                        <div className="font-light-grey border-box"><span className="font-semibold text-[#429ABF]">Date of Birth:</span> <br /> {new Date(patient.dateOfBirth).toLocaleDateString('en-US', {year: 'numeric',month: 'long',day: 'numeric'})}</div>
                                        <div className="font-light-grey border-box"><span className="font-semibold text-[#429ABF]">Mobile Number:</span> <br /> {patient.mobileNumber}</div>
                                        <div className="font-light-grey border-box"><span className="font-semibold text-[#429ABF]">Home Address:</span> <br /> {patient.address}</div>
                                    </div>
                                    <div className="mt-10 flex flex-col items-start ml-1 border-box">
                                        <span className="flex items-center gap-1">
                                            <p className="text-sm font-semibold text-[#429ABF]">Medical History</p>
                                            <button onClick={() => setModalVisible(true)}>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8 15C4.14 15 1 11.86 1 8C1 4.14 4.14 1 8 1C11.86 1 15 4.14 15 8C15 11.86 11.86 15 8 15ZM8 2C4.69 2 2 4.69 2 8C2 11.31 4.69 14 8 14C11.31 14 14 11.31 14 8C14 4.69 11.31 2 8 2Z" fill="#429ABF"/>
                                                <path d="M8 11.5C7.72 11.5 7.5 11.28 7.5 11V5C7.5 4.72 7.72 4.5 8 4.5C8.28 4.5 8.5 4.72 8.5 5V11C8.5 11.28 8.28 11.5 8 11.5Z" fill="#429ABF"/>
                                                <path d="M11 8.5H5C4.72 8.5 4.5 8.28 4.5 8C4.5 7.72 4.72 7.5 5 7.5H11C11.28 7.5 11.5 7.72 11.5 8C11.5 8.28 11.28 8.5 11 8.5Z" fill="#429ABF"/>
                                            </svg>
                                            </button>
                                        </span>

                                        <span>
                                            <p className="text-sm text-[#999999] font-normal font-poppins text-[14px]">
                                                 {Array.isArray(diseases) ? diseases.join(', ') : diseases}
                                            </p>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Past Medical Records Section */}
                            <div className="lg:col-span-12 mt-8">
                                <div className="text-[#429ABF] mb-4 px-8 font-[14px] font-semibold text-poppins">
                                    <div>Past Medical Records</div>
                                </div>
                                <div className="relative overflow-hidden px-8">
                                    <div 
                                        className="flex transition-transform duration-500 ease-in-out"
                                        style={{ 
                                            transform: `translateX(-${currentIndex * 25}%)`,
                                            width: '100%'
                                        }}
                                    >
                                        {medicalRecords.map((record, index) => (
                                             <a
                                                href={`/medicalrecords/patientvisitform/${record.patient_id}/${record.appointment_id}`}
                                                active={route().current("patientvisitform.index")}
                                                 style={{ flex: '0 0 25%', paddingRight: '16px' }}
                                                >
                                            <div 
                                                key={index}
                                                style={{ 
                                                    flex: '0 0 25%',
                                                    paddingRight: '16px'
                                                }}
                                            >
                                               
                                                <div className="bg-[#7F9BA7] rounded-[14px] p-4 flex justify-between items-start h-full">
                                                    <div className="text-white flex-1">
                                                        <div className="text-xs truncate max-w-[190px]">{record.date}</div>
                                                        <div className="text-base font-semibold mt-2">{record.diagnosis}</div>
                                                        <div className="text-xs truncate max-w-[200px]">{record.service}</div>
                                                        <div className="mt-4">
                                                            <span className="bg-white text-[#2B4E64] px-3 py-1.5 rounded-full font-medium text-[10px]">{record.status}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* {record.hasDocument && ( */}
                                                        <div className="flex flex-col items-end mt-6">
                                                            <div className="mr-5">
                                                                {record.service === "Medical Certificate" ? (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
       <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_20_724)">
<path d="M31.6667 48.3333H30C30 48.6429 30.0862 48.9463 30.2489 49.2096C30.4116 49.4729 30.6445 49.6856 30.9213 49.824C31.1982 49.9625 31.5081 50.0211 31.8163 49.9933C32.1246 49.9655 32.4191 49.8524 32.6667 49.6667L31.6667 48.3333ZM38.3333 43.3333L39.3333 42C39.0448 41.7836 38.694 41.6667 38.3333 41.6667C37.9727 41.6667 37.6218 41.7836 37.3333 42L38.3333 43.3333ZM45 48.3333L44 49.6667C44.2476 49.8524 44.5421 49.9655 44.8503 49.9933C45.1586 50.0211 45.4685 49.9625 45.7454 49.824C46.0222 49.6856 46.255 49.4729 46.4178 49.2096C46.5805 48.9463 46.6667 48.6429 46.6667 48.3333H45ZM38.3333 36.6667C36.1232 36.6667 34.0036 35.7887 32.4408 34.2259C30.878 32.6631 30 30.5435 30 28.3333H26.6667C26.6667 31.4275 27.8958 34.395 30.0838 36.5829C32.2717 38.7708 35.2391 40 38.3333 40V36.6667ZM46.6667 28.3333C46.6667 30.5435 45.7887 32.6631 44.2259 34.2259C42.6631 35.7887 40.5435 36.6667 38.3333 36.6667V40C41.4275 40 44.395 38.7708 46.5829 36.5829C48.7708 34.395 50 31.4275 50 28.3333H46.6667ZM38.3333 20C40.5435 20 42.6631 20.878 44.2259 22.4408C45.7887 24.0036 46.6667 26.1232 46.6667 28.3333H50C50 25.2391 48.7708 22.2717 46.5829 20.0838C44.395 17.8958 41.4275 16.6667 38.3333 16.6667V20ZM38.3333 16.6667C35.2391 16.6667 32.2717 17.8958 30.0838 20.0838C27.8958 22.2717 26.6667 25.2391 26.6667 28.3333H30C30 26.1232 30.878 24.0036 32.4408 22.4408C34.0036 20.878 36.1232 20 38.3333 20V16.6667ZM30 35V48.3333H33.3333V35H30ZM32.6667 49.6667L39.3333 44.6667L37.3333 42L30.6667 47L32.6667 49.6667ZM37.3333 44.6667L44 49.6667L46 47L39.3333 42L37.3333 44.6667ZM46.6667 48.3333V35H43.3333V48.3333H46.6667ZM50 16.6667V5H46.6667V16.6667H50ZM45 0H5V3.33333H45V0ZM0 5V45H3.33333V5H0ZM5 50H26.6667V46.6667H5V50ZM0 45C0 46.3261 0.526784 47.5979 1.46447 48.5355C2.40215 49.4732 3.67392 50 5 50V46.6667C4.55797 46.6667 4.13405 46.4911 3.82149 46.1785C3.50893 45.866 3.33333 45.442 3.33333 45H0ZM5 0C3.67392 0 2.40215 0.526784 1.46447 1.46447C0.526784 2.40215 0 3.67392 0 5H3.33333C3.33333 4.55797 3.50893 4.13405 3.82149 3.82149C4.13405 3.50893 4.55797 3.33333 5 3.33333V0ZM50 5C50 3.67392 49.4732 2.40215 48.5355 1.46447C47.5979 0.526784 46.3261 0 45 0V3.33333C45.442 3.33333 45.866 3.50893 46.1785 3.82149C46.4911 4.13405 46.6667 4.55797 46.6667 5H50ZM10 16.6667H26.6667V13.3333H10V16.6667ZM10 26.6667H20V23.3333H10V26.6667Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_20_724">
<rect width="50" height="50" fill="white"/>
</clipPath>
</defs>
</svg>

    </svg>
) : (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_20_733)">
<path d="M42.1875 18.375C41.3125 18.375 40.625 17.6875 40.625 16.8125V4.6875C40.625 3.8125 39.9375 3.125 39.0625 3.125H10.9375C10.0625 3.125 9.375 3.8125 9.375 4.6875V10.9375C9.375 11.8125 8.6875 12.5 7.8125 12.5C6.9375 12.5 6.25 11.8125 6.25 10.9375V4.6875C6.25 2.09375 8.34375 0 10.9375 0H39.0625C41.6562 0 43.75 2.09375 43.75 4.6875V16.8125C43.75 17.6875 43.0625 18.375 42.1875 18.375Z" fill="white"/>
<path d="M45.3125 50H4.6875C2.09375 50 0 47.9062 0 45.3125V14.0625C0 11.4688 2.09375 9.375 4.6875 9.375H19.5312C20.0312 9.375 20.5 9.59375 20.7812 10L25 15.625H45.3125C47.9062 15.625 50 17.7188 50 20.3125V45.3125C50 47.9062 47.9062 50 45.3125 50ZM4.6875 12.5C3.8125 12.5 3.125 13.1875 3.125 14.0625V45.3125C3.125 46.1875 3.8125 46.875 4.6875 46.875H45.3125C46.1875 46.875 46.875 46.1875 46.875 45.3125V20.3125C46.875 19.4375 46.1875 18.75 45.3125 18.75H24.2188C23.9753 18.7551 23.7343 18.7009 23.5165 18.592C23.2987 18.4831 23.1107 18.3228 22.9688 18.125L18.75 12.5H4.6875Z" fill="white"/>
<path d="M17.1875 40.625H10.9375C10.0625 40.625 9.375 39.9375 9.375 39.0625C9.375 38.1875 10.0625 37.5 10.9375 37.5H17.1875C18.0625 37.5 18.75 38.1875 18.75 39.0625C18.75 39.9375 18.0625 40.625 17.1875 40.625Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_20_733">
<rect width="50" height="50" fill="white"/>
</clipPath>
</defs>
</svg>

)}

                                                            </div>
                                                            <div className="bg-[#2B4E64] text-white text-[10px] font-medium px-1 mt-6 rounded whitespace-nowrap truncate max-w-[190px]">{record.doctor}</div>
                                                        </div>
                                                     {/* )} */}
                                                </div>
                                            </div>

                                                </a>
                                        ))}
                                    </div>
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex gap-0 mt-4 px-8 justify-center">
                                    <button 
                                        onClick={handlePrevious}
                                        disabled={currentIndex === 0 || isAnimating}
                                        className={`w-8 h-8 flex items-center justify-center transition-opacity duration-200 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
                                    >
                                        <svg className="w-full h-full" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M26.0302 8.99992C35.4302 9.01677 43.0165 16.6304 42.9997 26.0304C42.9829 35.4303 35.3692 43.0167 25.9693 42.9999C16.5693 42.983 8.98291 35.3694 8.99976 25.9694C9.0166 16.5694 16.6302 8.98308 26.0302 8.99992ZM25.9728 40.9999C34.2728 41.0147 40.9848 34.3268 40.9997 26.0268C41.0146 17.7268 34.3266 11.0148 26.0266 10.9999C17.7266 10.985 11.0146 17.673 10.9998 25.973C10.9849 34.273 17.6729 40.985 25.9728 40.9999Z" fill="#429ABF"/>
                                            <path d="M26.3174 16.3005L27.7149 17.703L19.4 25.9881L27.6851 34.3029L26.2826 35.7004L16.6 25.9831L26.3174 16.3005Z" fill="#429ABF"/>
                                            <path d="M34.998 27.0161L17.9981 26.9856L18.0017 24.9856L35.0016 25.0161L34.998 27.0161Z" fill="#429ABF"/>
                                        </svg>
                                    </button>

                                    <button 
                                        onClick={handleNext}
                                        disabled={currentIndex >= medicalRecords.length - 4 || isAnimating}
                                        className={`w-8 h-8 flex items-center justify-center transition-opacity duration-200 ${currentIndex >= medicalRecords.length - 4 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
                                    >
                                        <svg className="w-full h-full" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M25 42C15.6 42 8 34.4 8 25C8 15.6 15.6 8 25 8C34.4 8 42 15.6 42 25C42 34.4 34.4 42 25 42ZM25 10C16.7 10 10 16.7 10 25C10 33.3 16.7 40 25 40C33.3 40 40 33.3 40 25C40 16.7 33.3 10 25 10Z" fill="#429ABF"/>
                                            <path d="M24.6998 34.7L23.2998 33.3L31.5998 25L23.2998 16.7L24.6998 15.3L34.3998 25L24.6998 34.7Z" fill="#429ABF"/>
                                            <path d="M16 24H33V26H16V24Z" fill="#429ABF"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 