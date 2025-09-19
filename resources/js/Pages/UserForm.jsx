import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Sidebar from '@/Components/Sidebar';

export default function UserForm({ auth, role = 'doctor', user = null, isEditing = false }) {
    const [selectedMenu, setSelectedMenu] = useState('Users Account (Admin only)');
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        first_name: user ? user.first_name : '',
        last_name: user ? user.last_name : '',
        middle_initial: user ? user.middle_initial : '',
        license_number: user ? user.license_number : '',
        ptr_number: user ? user.ptr_number : '',
        login_id: user ? user.login_id : '',
        password: '',
        role: user ? user.role : role
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('users.update', user.id), {
                onSuccess: () => {
                    router.visit(route('users.index'));
                }
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => {
                    router.visit(route('users.index'));
                }
            });
        }
    };

    // Function to get formatted role text
    const getRoleText = () => {
        switch(role) {
            case 'doctor':
                return 'Doctor';
            case 'admin':
                return 'Admin';
            case 'secretary':
                return 'Secretary';
            default:
                return 'USER';
        }
    };

    // Function to determine if doctor-specific fields should be shown
    const showDoctorFields = role === 'doctor';

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-[14px] text-gray-800 leading-tight font-poppins">Users Account</h2>}
        >
            <Head title={`${isEditing ? 'Edit' : 'Add'} ${getRoleText()} Account`}>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </Head>

            <div className="max-w-8xl py-3 mx-auto sm:px-6 lg:px-8">
                <div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-0">
                        <div className="flex font-poppins" style={{ minHeight: '650px' }}>
                            <Sidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} auth={auth}/>

                            {/* Main Content */}
                            <div className="flex-1 pl-0 pr-2 pt-4 pb-4 bg-white overflow-x-auto">
                                <div className="flex flex-col">
                                    <div className="w-full flex justify-center mb-4">
                                        <h3 className="font-poppins font-bold text-[16px] leading-[100%] tracking-[0px] text-[#429ABF]">
                                            USERS ACCOUNT: {isEditing ? 'EDIT PROFILE' : `ADD ${getRoleText()} ACCOUNT`}
                                        </h3>
                                    </div>

                                    {/* Form */}
                                    <div className="max-w-5xl w-full pl-5">
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {/* User Role - Single Row */}
                                            <div>
                                                <label className="block text-[14px] font-semibold mb-2" style={{ color: '#429ABF' }}>User Role</label>
                                                <input 
                                                    type="text"
                                                    className="w-[200px] rounded px-3 py-2 text-[14px]"
                                                    value={getRoleText()}
                                                    readOnly
                                                    style={{ color: '#666666', border: '1px solid #CDCDCD', background: '#CDCDCD', fontWeight:600 }}
                                                />
                                            </div>

                                            {/* Name Fields Row */}
                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <label className="block text-[14px] font-semibold mb-2" style={{ color: '#429ABF' }}>
                                                        First Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <input 
                                                        type="text"
                                                        className={`w-full border rounded px-3 py-2 text-[14px] ${errors.first_name ? 'border-red-500' : 'border-gray-200'}`}
                                                        value={data.first_name}
                                                        onChange={e => setData('first_name', e.target.value)}
                                                        style={{ color: '#666666' }}
                                                    />
                                                    {errors.first_name && <div className="text-red-500 text-sm mt-1">{errors.first_name}</div>}
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-[14px] font-semibold mb-2" style={{ color: '#429ABF' }}>
                                                        Last Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <input 
                                                        type="text"
                                                        className={`w-full border rounded px-3 py-2 text-[14px] ${errors.last_name ? 'border-red-500' : 'border-gray-200'}`}
                                                        value={data.last_name}
                                                        onChange={e => setData('last_name', e.target.value)}
                                                        style={{ color: '#666666' }}
                                                    />
                                                    {errors.last_name && <div className="text-red-500 text-sm mt-1">{errors.last_name}</div>}
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-[14px] font-semibold mb-2" style={{ color: '#429ABF' }}>
                                                        Middle Initial
                                                    </label>
                                                    <input 
                                                        type="text"
                                                        className={`w-full border rounded px-3 py-2 text-[14px] ${errors.middle_initial ? 'border-red-500' : 'border-gray-200'}`}
                                                        value={data.middle_initial}
                                                        onChange={e => setData('middle_initial', e.target.value)}
                                                        style={{ color: '#666666' }}
                                                    />
                                                    {errors.middle_initial && <div className="text-red-500 text-sm mt-1">{errors.middle_initial}</div>}
                                                </div>
                                            </div>

                                            {/* License and PTR Numbers Row - Only show for doctors */}
                                            {showDoctorFields && (
                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <label className="block text-[14px] font-semibold mb-2" style={{ color: '#429ABF' }}>
                                                            License Number <span className="text-red-500">*</span>
                                                        </label>
                                                        <input 
                                                            type="text"
                                                            className={`w-full border rounded px-3 py-2 text-[14px] ${errors.license_number ? 'border-red-500' : 'border-gray-200'}`}
                                                            value={data.license_number}
                                                            onChange={e => setData('license_number', e.target.value)}
                                                            style={{ color: '#666666' }}
                                                        />
                                                        {errors.license_number && <div className="text-red-500 text-sm mt-1">{errors.license_number}</div>}
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-[14px] font-semibold mb-2" style={{ color: '#429ABF' }}>
                                                            PTR Number
                                                        </label>
                                                        <input 
                                                            type="text"
                                                            className={`w-full border rounded px-3 py-2 text-[14px] ${errors.ptr_number ? 'border-red-500' : 'border-gray-200'}`}
                                                            value={data.ptr_number}
                                                            onChange={e => setData('ptr_number', e.target.value)}
                                                            style={{ color: '#666666' }}
                                                        />
                                                        {errors.ptr_number && <div className="text-red-500 text-sm mt-1">{errors.ptr_number}</div>}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Login Credentials Row */}
                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <label className="block text-[14px] font-semibold mb-2" style={{ color: '#429ABF' }}>
                                                        Login ID <span className="text-red-500">*</span>
                                                    </label>
                                                    <input 
                                                        type="text"
                                                        className={`w-full border rounded px-3 py-2 text-[14px] ${errors.login_id ? 'border-red-500' : 'border-gray-200'}`}
                                                        value={data.login_id}
                                                        onChange={e => setData('login_id', e.target.value)}
                                                        style={{ color: '#666666' }}
                                                    />
                                                    {errors.login_id && <div className="text-red-500 text-sm mt-1">{errors.login_id}</div>}
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-[14px] font-semibold mb-2" style={{ color: '#429ABF' }}>
                                                        Password <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <input 
                                                            type={showPassword ? "text" : "password"}
                                                            className={`w-full border rounded px-3 py-2 text-[14px] ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                                                            value={data.password}
                                                            onChange={e => setData('password', e.target.value)}
                                                            style={{ color: '#666666' }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#666666"/>
                                                            </svg>
                                                        </button>
                                                        {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <div className="flex justify-end mt-6">
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className={`bg-[#429ABF] text-white px-6 py-2 rounded text-[14px] hover:bg-opacity-90 transition-colors ${processing ? 'opacity-75 cursor-not-allowed' : ''}`}
                                                >
                                                    {processing ? (isEditing ? 'Updating...' : 'Registering...') : (isEditing ? 'Update Account' : 'Register Account')}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 