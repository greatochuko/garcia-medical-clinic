import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import NavLink from "@/Components/NavLink";
// import { Link } from '@inertiajs/inertia-react';

export default function UnfinishedDocs({ auth, docs }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [perPage, setPerPage] = useState(docs?.per_page || 10);
    const [sortDirection, setSortDirection] = useState(null);

    useEffect(() => {
        // console.log('Docs data:', docs);
    }, [docs]);

    // Handle sorting
    const handleSort = () => {
        setSortDirection(current => {
            if (current === null) return 'asc';
            if (current === 'asc') return 'desc';
            return null;
        });
    };

    // Handle search
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        router.get(route('medicalrecords.unfinisheddocs'), {
            search: value,
            perPage
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['docs']
        });
    };

    // Handle rows per page change
    const handlePerPageChange = (e) => {
        const newPerPage = parseInt(e.target.value);
        setPerPage(newPerPage);
        router.get(route('medicalrecords.unfinisheddocs'), { 
            perPage: newPerPage,
            page: 1,
            search: searchQuery
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['docs']
        });
    };

    // Handle pagination click
    const handlePaginationClick = (url) => {
        // console.log('Clicking pagination URL:', url);
        if (url) {
            router.visit(url, {
                preserveState: true,
                preserveScroll: true,
                only: ['docs']
            });
        }
    };

    const SortArrow = () => {
        return (
            <button 
                onClick={handleSort}
                className="inline-flex flex-col ml-1 relative cursor-pointer select-none active:bg-transparent focus:outline-none touch-none" 
                style={{ width: '12px', height: '16px', WebkitTapHighlightColor: 'transparent' }}
            >
                <svg 
                    className="absolute top-0" 
                    width="12" 
                    height="6" 
                    viewBox="0 0 12 6" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        d="M6 0L12 6H0L6 0Z" 
                        fill={sortDirection === 'asc' ? '#429ABF' : '#666666'}
                    />
                </svg>
                <svg 
                    className="absolute bottom-0" 
                    width="12" 
                    height="6" 
                    viewBox="0 0 12 6" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        d="M6 6L0 0H12L6 6Z" 
                        fill={sortDirection === 'desc' ? '#429ABF' : '#666666'}
                    />
                </svg>
            </button>
        );
    };

    // Ensure we have an array to map over
    const displayDocs = Array.isArray(docs?.data) ? docs.data : [];
    // console.log('Display docs:', displayDocs);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Unfinished Docs</h2>}
        >
            <Head title="Unfinished Docs" />

            <div className="py-3">
                <div className="max-w-8xl bg-white mx-8">
                    <div className="text-center m-0 pt-4 pb-3  border-b-[5px] border-[#E9F9FF]  pt-6 pb-6" style={{ color: '#429ABF', fontWeight: 700, fontSize: '14px' }}>
                        UNFINISHED DOCS
                    </div>
                    <hr className="mb-4" />

                    <div className="py-4 flex justify-between px-4 font-['Poppins'] mb-4 mt-4">
                        <div className="flex items-center w-full max-w-md rounded border border-gray-300 overflow-hidden">
                            <div className="pl-4 text-gray-400">
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder="Search for ID or patient name"
                                className="w-full py-2 px-2 text-sm outline-none border-none focus:outline-none focus:border-none focus:ring-0"
                            />
                            <button 
                                onClick={() => handleSearch({ target: { value: searchQuery } })}
                                className="bg-[#429ABF] p-2 pr-4 pl-3 h-full flex items-center justify-center"
                            >
                                <svg width="18" height="18" viewBox="0 0 21 21" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.41899 0.570313C7.99026 0.570434 6.58228 0.912222 5.31251 1.56716C4.04274 2.2221 2.94801 3.1712 2.11964 4.33527C1.29128 5.49934 0.753301 6.84464 0.550597 8.25891C0.347894 9.67318 0.486341 11.1154 0.954389 12.4653C1.42244 13.8152 2.20651 15.0336 3.2412 16.0188C4.27589 17.004 5.53118 17.7275 6.90235 18.129C8.27353 18.5304 9.72082 18.5981 11.1235 18.3264C12.5261 18.0547 13.8435 17.4516 14.9656 16.5672L18.8152 20.4168C19.014 20.6088 19.2802 20.715 19.5566 20.7126C19.833 20.7102 20.0974 20.5994 20.2928 20.4039C20.4883 20.2085 20.5991 19.9441 20.6015 19.6677C20.6039 19.3914 20.4977 19.1251 20.3057 18.9263L16.4561 15.0767C17.4975 13.7556 18.146 12.1679 18.3272 10.4954C18.5085 8.82286 18.2152 7.13311 17.4809 5.61951C16.7467 4.10591 15.6011 2.82961 14.1754 1.93666C12.7496 1.04371 11.1013 0.5702 9.41899 0.570313ZM2.56738 9.5301C2.56738 7.71294 3.28925 5.97021 4.57417 4.68529C5.8591 3.40036 7.60183 2.6785 9.41899 2.6785C11.2361 2.6785 12.9789 3.40036 14.2638 4.68529C15.5487 5.97021 16.2706 7.71294 16.2706 9.5301C16.2706 11.3473 15.5487 13.09 14.2638 14.3749C12.9789 15.6598 11.2361 16.3817 9.41899 16.3817C7.60183 16.3817 5.8591 15.6598 4.57417 14.3749C3.28925 13.09 2.56738 11.3473 2.56738 9.5301Z" fill="white"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="all-patients-table-screen font-['Poppins'] px-4">
                        <table className="min-w-full">
                            <thead className="sticky top-0 z-10 bg-[#F6FCFF]">
                                <tr style={{color:'#666666'}}>
                                    <th className="text-left px-4 py-3">
                                        PATIENT INFORMATION
                                        <SortArrow />
                                    </th>
                                    <th className="text-left px-4 py-3">MOBILE NUMBER</th>
                                    <th className="text-left px-4 py-3">
                                        DATE
                                        <SortArrow />
                                    </th>
                                    <th className="text-left px-4 py-3">DOCTOR</th>
                                    <th className="text-left px-4 py-3 text-center">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayDocs.length > 0 ? (
                                    displayDocs.map((doc, index) => (
                                        <tr key={doc.id} className={index % 2 === 0 ? 'bg-white' : 'row-odd'}>
                                            <td className="px-4 py-3 cursor-pointer">
                                            <Link href={`/medicalrecords/patientvisitform/${doc.patient_id}/${doc.appointment_id}`}>
                                                <div className="font-['Poppins'] font-bold text-[#429ABF]">
                                                {doc.patient_name}
                                                </div>
                                                <div className="text-sm text-gray-500 text-[#666666]">
                                                {doc.age}, {doc.gender}
                                                </div>
                                            </Link>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-[#666666] font-normal text-[14px]">{doc.mobile_number}</td>
                                            <td className="px-4 py-3 capitalize text-sm text-[#666666] font-normal text-[14px]">
                                                {new Date(doc.appointment_date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-[#666666] font-normal text-[14px]">{doc.doctor_name}</td>
                                            <td className="px-4 py-3 text-center">
                                            <Link href={`/medicalrecords/patientvisitform/${doc.patient_id}/${doc.appointment_id}`}>
                                                <div className="bg-[#EAEAEA] p-1 rounded-[12px] inline-block">
                                                <span
                                                        key={doc.id}
                                                        className={`px-6 py-2 text-[12px] rounded-[10px] font-['Poppins'] inline-block ${
                                                        index % 2 === 0
                                                            ? 'text-[#F15E5E] border-2 border-[#EF3616] bg-white'
                                                            : 'text-white bg-[#EF3616]'
                                                        }`}
                                                    >
                                                        {doc.status}
                                                    </span>
                                                </div>
                                            </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-20">
                                            <div className="flex justify-center mb-4">
                                                <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17 0.166626L0.333313 6.41663V19.1041C0.333313 29.625 7.43748 39.4375 17 41.8333C26.5625 39.4375 33.6666 29.625 33.6666 19.1041V6.41663L17 0.166626ZM14.7916 28.375L7.41665 21L10.3541 18.0625L14.7708 22.4791L23.6041 13.6458L26.5416 16.5833L14.7916 28.375Z" fill="#429ABF"/>
                                                </svg>
                                            </div>
                                            <div className="text-center font-['Poppins'] text-[14px] leading-[150%] text-[#666666] font-normal">Great work! There are no unfinished documentations found.</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                     <div className="flex items-center p-2 bg-white border-t-[5px] border-[#E9F9FF]">
                                <div className="absolute flex px-5 items-center">
                                    <span className="text-sm mr-2 font-light-blue">Rows per page:</span>
                                    <select
                                        value={perPage}
                                        onChange={handlePerPageChange}
                                        className="clean-select"
                                    >
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>
                                <div className="w-full flex justify-center">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handlePaginationClick(docs?.prev_page_url)}
                                            disabled={!docs?.prev_page_url}
                                            className={`px-2 py-1 rounded flex items-center ${!docs?.prev_page_url ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
                                        >
                                            <div className="custom-text-color flex items-center">
                                                <span style={{ fontSize: '20px', marginRight: '2px' }}>&laquo;</span>
                                                <span>Prev</span>
                                                <span className="mx-1">|</span>
                                            </div>
                                        </button>
                                        <span className="custom-text-color flex items-center px-1">
                                            Page {docs?.current_page || 1} of {docs?.last_page || 1}
                                        </span>
                                        <button
                                            onClick={() => handlePaginationClick(appointments?.next_page_url)}
                                            disabled={!docs?.next_page_url}
                                            className={`px-2 py-1 rounded flex items-center ${!docs?.next_page_url ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
                                        >
                                            <div className="custom-text-color flex items-center">
                                                <span className="mx-1">|</span>
                                                <span>Next</span>
                                                <span style={{ fontSize: '20px', marginLeft: '2px' }}>&raquo;</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                    {/* Add debug info in development
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-4 p-4 bg-gray-100 rounded">
                            <pre className="text-xs">
                                {JSON.stringify({ currentPage: docs?.current_page, lastPage: docs?.last_page, total: docs?.total, perPage: docs?.per_page }, null, 2)}
                            </pre>
                        </div>
                    )} */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
