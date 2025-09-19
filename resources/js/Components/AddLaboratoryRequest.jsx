import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddLaboratoryRequest = ({ isOpen, onClose, patient, onLabRequestsUpdate, appointment_id }) => {
    const [selectedTests, setSelectedTests] = useState([]);
    const [others, setOthers] = useState('');
    const [loading, setLoading] = useState(true);
    const [existingTests, setExistingTests] = useState([]);

    useEffect(() => {
        if (isOpen && patient) {
            fetchExistingTests();
        }
    }, [isOpen, patient]);

    // const fetchExistingTests = async () => {
    //     try {
    //         const response = await axios.get(`/laboratory-requests/${patient.patient_id}/${appointment_id}`);
    //         setExistingTests(response.data.map(test => test.test_name));
    //         setSelectedTests(response.data.map(test => test.test_name));
    //     } catch (error) {
    //         console.error('Error fetching tests:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const fetchExistingTests = async () => {
        try {
            const response = await axios.get(`/laboratory-requests/${patient.patient_id}/${appointment_id}`);
    
            const testData = response.data;
    
            // Collect test names
            const testNames = testData.map(test => test.test_name);
            setExistingTests(testNames);
            setSelectedTests(testNames);
    
            // ✅ Get 'others' fields and combine them into a string if multiple
            const otherValues = testData
                .filter(test => test.others) // Only rows that have 'others'
                .map(test => test.others.trim()) // Remove extra spaces
                .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
    
            // Join as comma-separated string
            setOthers(otherValues.join(', '));
    
        } catch (error) {
            console.error('Error fetching tests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (testName) => {
        setSelectedTests(prev => {
            if (prev.includes(testName)) {
                return prev.filter(test => test !== testName);
            } else {
                return [...prev, testName];
            }
        });
    };


    const handleSubmit = async () => {
        try {
            // ✅ Clean up the "others" field: split, trim, and filter
            const cleanedOthers = others
                .split(',')
                .map(item => item.trim())
                .filter(item => item !== '');
    
            await axios.post('/laboratory-requests', {
                patient_id: patient.patient_id,
                test_names: selectedTests,
                appointment_id: appointment_id,
                others: cleanedOthers.join(', ') // Final cleaned value
            });
    
            if (onLabRequestsUpdate) {
                onLabRequestsUpdate();
            }
    
            onClose();
        } catch (error) {
            console.error('Error saving tests:', error);
        }
    };

    // const handleSubmit = async () => {
    //     try {
    //         await axios.post('/laboratory-requests', {
    //             patient_id: patient.patient_id,
    //             test_names: selectedTests,
    //             appointment_id : appointment_id,
    //             others: others
    //         });
    //         if (onLabRequestsUpdate) {
    //             onLabRequestsUpdate();
    //         }
    //         onClose();
    //     } catch (error) {
    //         console.error('Error saving tests:', error);
    //     }
    // };

    if (!isOpen) return null;

    const checkboxStyle = `
        w-4 h-4 mr-2 
        appearance-none 
        border border-gray-300 
        rounded-[5px] 
        cursor-pointer
        bg-white 
        checked:!bg-black 
        checked:!border-transparent
        !outline-none
        !ring-0
        !ring-offset-0
        focus:!ring-0 
        focus:!ring-offset-0
        focus:!outline-none
        focus:!border-gray-300
        active:!outline-none
        hover:!border-gray-300
        focus-visible:!outline-none
        focus-visible:!ring-0
        -webkit-appearance-none
        -moz-appearance-none
    `.replace(/\s+/g, ' ').trim();

    const buttonStyle = "px-4 py-1.5 text-sm rounded font-['Poppins']";

    // Add this style to the head of the document
    if (typeof document !== 'undefined') {
        const style = document.createElement('style');
        style.textContent = `
        input[type="checkbox"] {
            background-image: none !important;
        }
        input[type="checkbox"]:checked {
            background-image: none !important;
        }
        `;
        document.head.appendChild(style);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[1000px]">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-[#429ABF]">ADD LABORATORY REQUESTS</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </button>
                    </div>

                    <div className="flex gap-6">
                        {/* Left Column */}
                        <div className="w-1/2 space-y-8">
                            {/* Hematology Section */}
                            <div>
                                <h3 className="font-[700] text-[12px] mb-1 text-[#429ABF] font-['Poppins']">Hematology</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="grid grid-cols-1 gap-y-1">
                                        <div className="flex items-center">
                                            {/* <input type="checkbox" id="cbc" className={checkboxStyle} /> */}
                                            <input type="checkbox" id="cbc" className={checkboxStyle} checked={selectedTests.includes('CBC')} onChange={() => handleCheckboxChange('CBC')} />
                                            <label htmlFor="cbc" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">CBC</label>
                                        </div>
                                        <div className="flex items-center">
                                            {/* <input type="checkbox" id="protime" className={checkboxStyle} /> */}
                                            <input type="checkbox" id="protime" className={checkboxStyle} checked={selectedTests.includes('Protime (PT)')} onChange={() => handleCheckboxChange('Protime (PT)')} />
                                            <label htmlFor="protime" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Protime (PT)</label>
                                        </div>
                                        <div className="flex items-center">
                                            {/* <input type="checkbox" id="ptt" className={checkboxStyle} /> */}
                                            <input type="checkbox" id="ptt" className={checkboxStyle} checked={selectedTests.includes('PTT')} onChange={() => handleCheckboxChange('PTT')} />
                                            <label htmlFor="ptt" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">PTT</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input type="checkbox" id="clotting-time" className={checkboxStyle} checked={selectedTests.includes('Clotting Time')} onChange={() => handleCheckboxChange('Clotting Time')} />
                                            <label htmlFor="clotting-time" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Clotting Time</label>
                                        </div>
                                        <div className="flex items-center">
                                            {/* <input type="checkbox" id="bleeding-time" className={checkboxStyle} /> */}
                                            <input type="checkbox" id="bleeding-time" className={checkboxStyle} checked={selectedTests.includes('Bleeding Time')} onChange={() => handleCheckboxChange('Bleeding Time')} />
                                            <label htmlFor="bleeding-time" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Bleeding Time</label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-y-1">
                                        <div className="flex items-center">
                                            {/* <input type="checkbox" id="cbc-platelet" className={checkboxStyle} /> */}
                                            <input type="checkbox" id="cbc-platelet" className={checkboxStyle} checked={selectedTests.includes('CBC with Platelet Count')} onChange={() => handleCheckboxChange('CBC with Platelet Count')} />
                                            <label htmlFor="cbc-platelet" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">CBC with Platelet Count</label>
                                        </div>
                                        {/* <div className="flex items-center">
                                            <input type="checkbox" id="reticulocyte" className={checkboxStyle} checked={selectedTests.includes('Reticulocyte Count')} onChange={() => handleCheckboxChange('Reticulocyte Count')} />
                                            <label htmlFor="clotting-time" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Clotting Time</label>
                                        </div> */}
                                        <div className="flex items-center">
                                            {/* <input type="checkbox" id="reticulocyte" className={checkboxStyle} /> */}
                                            <input type="checkbox" id="reticulocyte" className={checkboxStyle} checked={selectedTests.includes('Reticulocyte Count')} onChange={() => handleCheckboxChange('Reticulocyte Count')} />
                                            <label htmlFor="reticulocyte" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Reticulocyte Count</label>
                                        </div>
                                        <div className="flex items-center">
                                            {/* <input type="checkbox" id="peripheral" className={checkboxStyle} /> */}
                                            <input type="checkbox" id="peripheral" className={checkboxStyle} checked={selectedTests.includes('Peripheral Blood Smear')} onChange={() => handleCheckboxChange('Peripheral Blood Smear')} />
                                            <label htmlFor="peripheral" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Peripheral Blood Smear</label>
                                        </div>
                                        <div className="flex items-center">
                                            {/* <input type="checkbox" id="abo" className={checkboxStyle} /> */}
                                            <input type="checkbox" id="abo" className={checkboxStyle} checked={selectedTests.includes('ABO with RH Typing')} onChange={() => handleCheckboxChange('ABO with RH Typing')} />
                                            <label htmlFor="abo" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">ABO with RH Typing</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Serology Section */}
                            <div>
                                <h3 className="font-[700] text-[12px] mb-1 text-[#429ABF] font-['Poppins']">Serology</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="grid grid-cols-1 gap-y-1">
                                        {/* <div className="flex items-center">
                                            <input type="checkbox" id="tsh-ser" className={checkboxStyle} checked={selectedTests.includes('TSH')} onChange={() => handleCheckboxChange('TSH')} />
                                            <label htmlFor="tsh-ser" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">TSH</label>
                                        </div> */}
                                        <div className="flex items-center">
                                            {/* <input type="checkbox" id="ft3-ser" className={checkboxStyle} /> */}
                                            <input type="checkbox" id="ft3-ser" className={checkboxStyle} checked={selectedTests.includes('FT3 / T3')} onChange={() => handleCheckboxChange('FT3 / T3')} />
                                            <label htmlFor="ft3-ser" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">FT3 / T3</label>
                                        </div>
                                        <div className="flex items-center">
                                            {/* <input type="checkbox" id="ft4-ser" className={checkboxStyle} /> */}
                                            <input type="checkbox" id="ft4-ser" className={checkboxStyle} checked={selectedTests.includes('FT4 / T4')} onChange={() => handleCheckboxChange('FT4 / T4')} />
                                            <label htmlFor="ft4-ser" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">FT4 / T4</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input type="checkbox" id="serum-bhcg" className={checkboxStyle} checked={selectedTests.includes('Serum B-HCG')} onChange={() => handleCheckboxChange('Serum B-HCG')} />
                                            <label htmlFor="serum-bhcg" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Serum B-HCG</label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-y-1">
                                        <div className="flex items-center">
                                            <input type="checkbox" id="hbsag-ser" className={checkboxStyle} checked={selectedTests.includes('HBSaG Screening')} onChange={() => handleCheckboxChange('HBSaG Screening')} />
                                            <label htmlFor="hbsag-ser" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">HBSaG Screening</label>
                                        </div>
                                        {/* <div className="flex items-center">
                                            <input type="checkbox" id="hepatitis-ser" className={checkboxStyle} checked={selectedTests.includes('Hepatitis Profiling')} onChange={() => handleCheckboxChange('Hepatitis Profiling')} />
                                            <label htmlFor="hepatitis-ser" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Hepatitis Profiling</label>
                                        </div> */}
                                        {/* <div className="flex items-center">
                                            <input type="checkbox" id="dengue-ns1" className={checkboxStyle} checked={selectedTests.includes('Dengue NS1')} onChange={() => handleCheckboxChange('Dengue NS1')} />
                                            <label htmlFor="dengue-ns1" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Dengue NS1</label>
                                        </div> */}
                                        <div className="flex items-center">
                                            <input type="checkbox" id="dengue-igg-igm" className={checkboxStyle} checked={selectedTests.includes('Dengue IgG / IgM')} onChange={() => handleCheckboxChange('Dengue IgG / IgM')} />
                                            <label htmlFor="dengue-igg-igm" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Dengue IgG / IgM</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Clinical Microscopy Section */}
                            <div>
                                <h3 className="font-[700] text-[12px] mb-1 text-[#429ABF] font-['Poppins']">Clinical Microscopy</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="grid grid-cols-1 gap-y-1">
                                        <div className="flex items-center">
                                            <input type="checkbox" id="urinalysis" className={checkboxStyle} checked={selectedTests.includes('Urinalysis')} onChange={() => handleCheckboxChange('Urinalysis')} />
                                            <label htmlFor="urinalysis" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Urinalysis</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input type="checkbox" id="fecalysis" className={checkboxStyle} checked={selectedTests.includes('Fecalysis')} onChange={() => handleCheckboxChange('Fecalysis')} />
                                            <label htmlFor="fecalysis" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Fecalysis</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input type="checkbox" id="fecal-occult" className={checkboxStyle} checked={selectedTests.includes('Fecal Occult Blood')} onChange={() => handleCheckboxChange('Fecal Occult Blood')} />
                                            <label htmlFor="fecal-occult" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Fecal Occult Blood</label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-y-1">
                                        <div className="flex items-center">
                                            <input type="checkbox" id="pregnancy" className={checkboxStyle} checked={selectedTests.includes('Pregnancy Test')} onChange={() => handleCheckboxChange('Pregnancy Test')} />
                                            <label htmlFor="pregnancy" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Pregnancy Test</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input type="checkbox" id="semen" className={checkboxStyle} checked={selectedTests.includes('Semen Analysis')} onChange={() => handleCheckboxChange('Semen Analysis')} />
                                            <label htmlFor="semen" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Semen Analysis</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="w-1/2 space-y-8">
                            {/* Clinical Chemistry Section */}
                            <div>
                                <h3 className="font-[700] text-[12px] mb-1 text-[#429ABF] font-['Poppins']">Clinical Chemistry</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="grid grid-cols-1 gap-y-1">
                                        {/* <div className="flex items-center">
                                            <input type="checkbox" id="tsh-chem" className={checkboxStyle} checked={selectedTests.includes('TSH')} onChange={() => handleCheckboxChange('TSH')} />
                                            <label htmlFor="tsh-chem" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">TSH</label>
                                        </div> */}
                                        {/* <div className="flex items-center">
                                            <input type="checkbox" id="ft3-chem" className={checkboxStyle} checked={selectedTests.includes('FT3 / T3')} onChange={() => handleCheckboxChange('FT3 / T3')} />
                                            <label htmlFor="ft3-chem" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">FT3 / T3</label>
                                        </div> */}
                                        {/* <div className="flex items-center">
                                            <input type="checkbox" id="ft4-chem" className={checkboxStyle} checked={selectedTests.includes('FT4 / T4')} onChange={() => handleCheckboxChange('FT4 / T4')} />
                                            <label htmlFor="ft4-chem" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">FT4 / T4</label>
                                        </div> */}
                                        {/* <div className="flex items-center">
                                            <input type="checkbox" id="serum-bhcg-1" className={checkboxStyle} checked={selectedTests.includes('Serum B-HCG')} onChange={() => handleCheckboxChange('Serum B-HCG')} />
                                            <label htmlFor="serum-bhcg-1" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Serum B-HCG</label>
                                        </div> */}
                                        <div className="flex items-center">
                                            <input type="checkbox" id="tsh-2" className={checkboxStyle} checked={selectedTests.includes('TSH')} onChange={() => handleCheckboxChange('TSH')} />
                                            <label htmlFor="tsh-2" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">TSH</label>
                                        </div>
                                        {/* <div className="flex items-center">
                                            <input type="checkbox" id="ft3-chem-2" className={checkboxStyle} checked={selectedTests.includes('FT3 / T3')} onChange={() => handleCheckboxChange('FT3 / T3')} />
                                            <label htmlFor="ft3-chem-2" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">FT3 / T3</label>
                                        </div> */}
                                        {/* <div className="flex items-center">
                                            <input type="checkbox" id="ft4-chem-2" className={checkboxStyle} checked={selectedTests.includes('FT4 / T4')} onChange={() => handleCheckboxChange('FT4 / T4')} />
                                            <label htmlFor="ft4-chem-2" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">FT4 / T4</label>
                                        </div> */}
                                        {/* <div className="flex items-center">
                                            <input type="checkbox" id="serum-bhcg-2" className={checkboxStyle} checked={selectedTests.includes('Serum B-HCG')} onChange={() => handleCheckboxChange('Serum B-HCG')} />
                                            <label htmlFor="serum-bhcg-2" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Serum B-HCG</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input type="checkbox" id="serum-bhcg-3" className={checkboxStyle} checked={selectedTests.includes('Serum B-HCG')} onChange={() => handleCheckboxChange('Serum B-HCG')} />
                                            <label htmlFor="serum-bhcg-3" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Serum B-HCG</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input type="checkbox" id="serum-bhcg-4" className={checkboxStyle} checked={selectedTests.includes('Serum B-HCG')} onChange={() => handleCheckboxChange('Serum B-HCG')} />
                                            <label htmlFor="serum-bhcg-4" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Serum B-HCG</label>
                                        </div> */}
                                        <div className="flex items-center">
                                            <input type="checkbox" id="fbs" className={checkboxStyle} checked={selectedTests.includes('Fasting Blood Sugar')} onChange={() => handleCheckboxChange('Fasting Blood Sugar')} />
                                            <label htmlFor="fbs" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Fasting Blood Sugar</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input type="checkbox" id="rbs" className={checkboxStyle} checked={selectedTests.includes('Random Blood Sugar')} onChange={() => handleCheckboxChange('Random Blood Sugar')} />
                                            <label htmlFor="rbs" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Random Blood Sugar</label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-y-1">
                                        {/* <div className="flex items-center">
                                            <input type="checkbox" id="fbs" className={checkboxStyle} checked={selectedTests.includes('Fasting Blood Sugar')} onChange={() => handleCheckboxChange('Fasting Blood Sugar')} />
                                            <label htmlFor="fbs" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Fasting Blood Sugar</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input type="checkbox" id="rbs" className={checkboxStyle} checked={selectedTests.includes('Random Blood Sugar')} onChange={() => handleCheckboxChange('Random Blood Sugar')} />
                                            <label htmlFor="rbs" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Random Blood Sugar</label>
                                        </div> */}
                                        {/* <div className="flex items-center">
                                            <input type="checkbox" id="dengue-ns1-chem" className={checkboxStyle} checked={selectedTests.includes('Dengue NS1')} onChange={() => handleCheckboxChange('Dengue NS1')} />
                                            <label htmlFor="dengue-ns1-chem" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Dengue NS1</label>
                                        </div> */}
                                        {/* <div className="flex items-center">
                                            <input type="checkbox" id="dengue-igg-igm-chem" className={checkboxStyle} checked={selectedTests.includes('Dengue IgG / IgM')} onChange={() => handleCheckboxChange('Dengue IgG / IgM')} />
                                            <label htmlFor="dengue-igg-igm-chem" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Dengue IgG / IgM</label>
                                        </div> */}
                                        {/* <div className="flex items-center">
                                            <input type="checkbox" id="hbsag-chem" className={checkboxStyle} checked={selectedTests.includes('HBSaG Screening')} onChange={() => handleCheckboxChange('HBSaG Screening')} />
                                            <label htmlFor="hbsag-chem" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">HBSaG Screening</label>
                                        </div> */}
                                        {/* <div className="flex items-center">
                                            <input type="checkbox" id="hepatitis-chem" className={checkboxStyle} checked={selectedTests.includes('Hepatitis Profiling')} onChange={() => handleCheckboxChange('Hepatitis Profiling')} />
                                            <label htmlFor="hepatitis-chem" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Hepatitis Profiling</label>
                                        </div> */}
                                        {/* <div className="flex items-center">
                                            <input type="checkbox" id="dengue-ns1-chem-2" className={checkboxStyle} checked={selectedTests.includes('Dengue NS1')} onChange={() => handleCheckboxChange('Dengue NS1')} />
                                            <label htmlFor="dengue-ns1-chem-2" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Dengue NS1</label>
                                        </div> */}
                                        {/* <div className="flex items-center">
                                            <input type="checkbox" id="dengue-igg-igm-chem-2" className={checkboxStyle} checked={selectedTests.includes('Dengue IgG / IgM')} onChange={() => handleCheckboxChange('Dengue IgG / IgM')} />
                                            <label htmlFor="dengue-igg-igm-chem-2" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Dengue IgG / IgM</label>
                                        </div> */}
                                        <div className="flex items-center">
                                            <input type="checkbox" id="hepatitis-chem-2" className={checkboxStyle} checked={selectedTests.includes('Hepatitis Profiling')} onChange={() => handleCheckboxChange('Hepatitis Profiling')} />
                                            <label htmlFor="hepatitis-chem-2" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Hepatitis Profiling</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input type="checkbox" id="dengue-ns1-chem-3" className={checkboxStyle} checked={selectedTests.includes('Dengue NS1')} onChange={() => handleCheckboxChange('Dengue NS1')} />
                                            <label htmlFor="dengue-ns1-chem-3" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Dengue NS1</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Radiology Section */}
                            <div>
                                <h3 className="font-[700] text-[12px] mb-1 text-[#429ABF] font-['Poppins']">Radiology</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="grid grid-cols-1 gap-y-1">
                                        <div className="flex items-center">
                                            <input type="checkbox" id="chest-xray" className={checkboxStyle} checked={selectedTests.includes('Chest Xray')} onChange={() => handleCheckboxChange('Chest Xray')} />
                                            <label htmlFor="chest-xray" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Chest Xray</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input type="checkbox" id="xray-other" className={checkboxStyle} checked={selectedTests.includes('Other Xray')} onChange={() => handleCheckboxChange('Other Xray')} />
                                            <label htmlFor="xray-other" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Other Xray</label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-y-1">
                                        <div className="flex items-center">
                                            <input type="checkbox" id="ultrasound" className={checkboxStyle} checked={selectedTests.includes('Ultrasound')} onChange={() => handleCheckboxChange('Ultrasound')} />
                                            <label htmlFor="ultrasound" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">Ultrasound</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input type="checkbox" id="ct-scan" className={checkboxStyle} checked={selectedTests.includes('CT Scan')} onChange={() => handleCheckboxChange('CT Scan')} />
                                            <label htmlFor="ct-scan" className="font-['Poppins'] font-[400] text-[13px] text-[#666666]">CT Scan</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Others Section */}
                    <div className="mt-6">
                        <h3 className="font-[700] text-[12px] mb-1 text-[#429ABF] font-['Poppins']">Others:</h3>
                        <input 
                            type="text" 
                            placeholder=""
                            className="w-[400px] p-2 rounded-lg border border-gray-300 rounded font-['Poppins'] text-[13px] text-[#666666]"
                            value={others}
                            onChange={(e) => setOthers(e.target.value)}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        <button 
                            onClick={onClose}
                            className={`${buttonStyle} w-[80px] text-gray-600 border border-gray-300 hover:bg-[#429ABF] hover:text-white`}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSubmit}
                            className={`${buttonStyle} w-[80px] text-white bg-[#429ABF] hover:bg-[#3789ac]`}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddLaboratoryRequest;