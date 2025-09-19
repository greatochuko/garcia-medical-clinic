import { Link } from '@inertiajs/react';
import '../../css/adminsettings.css';

export default function Sidebar({ selectedMenu, setSelectedMenu, auth }) {
    const sidebarMenus = [
        // {
        //     name: 'Medication Template',
        //     route: '/medication-templates'
        // },
        {
            name: 'Services And Charges',
            route: '/service-charges'
        },
        {
            name: 'Medication List',
            route: '/medication-list'
        },
        {
            name: 'Frequency List',
            route: '/frequency-list'
        },
        {
            name: 'Plan List',
            route: '/plan-list'
        },
        {
            name: 'Laboratory Test List',
            route: '/laboratory-test'
        },
        ...(auth.user?.role === 'admin'
        ? [{
            name: 'Users Account (Admin only)',
            route: '/user-accounts'
        }]
        : [])
    ];

    return (
        <div className="flex-none" style={{ 
            width: '341px',
            borderRadius: '15px',
            backgroundColor: '#429ABF',
            padding: '0px',
            marginRight: '0px'
        }}>
            <div className="flex flex-col py-20">
                {sidebarMenus.map((menu) => (
                    <Link
                        key={menu.name}
                        href={menu.route}
                        className={`w-full text-left px-5 py-3 transition-colors text-[14px] ${
                            selectedMenu === menu.name 
                                ? 'bg-[#FFFFFF] text-[#429ABF]' 
                                : 'text-white hover:bg-white hover:bg-opacity-10'
                        }`}
                        style={{
                            width: '100%',
                            display: 'block'
                        }}
                        onClick={() => setSelectedMenu(menu.name)}
                    >
                        {menu.name}
                    </Link>
                ))}
            </div>
        </div>
    );
} 