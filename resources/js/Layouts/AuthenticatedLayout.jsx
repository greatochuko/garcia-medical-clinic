import React from "react";

import Footer from "@/Components/layout/Footer";
import Header from "@/Components/layout/Header";
import PropTypes from "prop-types";

export default function AuthenticatedLayout({ children, user, setUser }) {
    return (
        <>
            <Header user={user} setUser={setUser} />
            <main>{children}</main>
            <Footer />
        </>
    );
}

AuthenticatedLayout.propTypes = {
    children: PropTypes.node.isRequired,
    user: PropTypes.shape({
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        role: PropTypes.string,
        profile_picture: PropTypes.string,
    }).isRequired,
    setUser: PropTypes.func,
};

// return (
//     <div className="mt-6 min-h-screen">
//         <nav className="border-b border-gray-100">
//             <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex h-16 justify-between rounded-[10px] bg-white">
//                     <div className="flex shrink-0 items-center">
//                         <Link href="/dashboard">
//                             <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
//                         </Link>
//                     </div>
//                     <div className="m-auto flex max-w-5xl">
//                         <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
//                             <NavLink
//                                 href={route("dashboard")}
//                                 active={
//                                     route().current("dashboard") ||
//                                     route().current("home")
//                                 }
//                                 className="nav-item btn flex items-center gap-2 px-3 py-1"
//                             >
//                                 <svg
//                                     width="14"
//                                     height="15"
//                                     viewBox="0 0 14 15"
//                                     fill="currentColor"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className="navicon"
//                                 >
//                                     <path d="M4.66667 15H1.55556C0.7 15 0 14.25 0 13.3333V1.66667C0 0.75 0.7 0 1.55556 0H4.66667C5.52222 0 6.22222 0.75 6.22222 1.66667V13.3333C6.22222 14.25 5.52222 15 4.66667 15ZM9.33333 15H12.4444C13.3 15 14 14.25 14 13.3333V9.16667C14 8.25 13.3 7.5 12.4444 7.5H9.33333C8.47778 7.5 7.77778 8.25 7.77778 9.16667V13.3333C7.77778 14.25 8.47778 15 9.33333 15ZM14 4.16667V1.66667C14 0.75 13.3 0 12.4444 0H9.33333C8.47778 0 7.77778 0.75 7.77778 1.66667V4.16667C7.77778 5.08333 8.47778 5.83333 9.33333 5.83333H12.4444C13.3 5.83333 14 5.08333 14 4.16667Z" />
//                                 </svg>
//                                 <span>Dashboard</span>
//                             </NavLink>

//                             <NavLink
//                                 href={route("appointments.index")}
//                                 active={
//                                     route().current("appointments.index") ||
//                                     route().current("appointments.closed")
//                                 }
//                                 className="nav-item btn flex items-center gap-2 px-2 py-1"
//                                 activeClassName=""
//                             >
//                                 <svg
//                                     width="24"
//                                     height="24"
//                                     viewBox="0 0 24 24"
//                                     fill="currentColor"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className=""
//                                 >
//                                     <path d="M16 2C16.2449 2.00003 16.4813 2.08996 16.6644 2.25272C16.8474 2.41547 16.9643 2.63975 16.993 2.883L17 3V4H18C18.7652 3.99996 19.5015 4.29233 20.0583 4.81728C20.615 5.34224 20.9501 6.06011 20.995 6.824L21 7V19C21 19.7652 20.7077 20.5015 20.1827 21.0583C19.6578 21.615 18.9399 21.9399 18.176 21.995L18 22H6C5.23479 22 4.49849 21.7077 3.94174 21.1827C3.38499 20.6578 3.04989 19.9399 3.005 19.176L3 19V7C2.99996 6.23479 3.29233 5.49849 3.81728 4.94174C4.34224 4.38499 5.06011 4.04989 5.824 4.005L6 4H7V3C7.00028 2.74512 7.09788 2.49997 7.27285 2.31463C7.44782 2.1293 7.68695 2.01777 7.94139 2.00283C8.19584 1.98789 8.44638 2.07067 8.64183 2.23426C8.83729 2.39786 8.9629 2.6299 8.993 2.883L9 3V4H15V3C15 2.73478 15.1054 2.48043 15.2929 2.29289C15.4804 2.10536 15.7348 2 16 2ZM19 9H5V18.625C5 19.33 5.386 19.911 5.883 19.991L6 20H18C18.513 20 18.936 19.47 18.993 18.785L19 18.625V9Z" />
//                                     <path d="M12 12C12.2449 12 12.4813 12.09 12.6644 12.2527C12.8474 12.4155 12.9643 12.6397 12.993 12.883L13 13V16C12.9997 16.2549 12.9021 16.5 12.7271 16.6854C12.5522 16.8707 12.313 16.9822 12.0586 16.9972C11.8042 17.0121 11.5536 16.9293 11.3582 16.7657C11.1627 16.6021 11.0371 16.3701 11.007 16.117L11 16V14C10.7451 13.9997 10.5 13.9021 10.3146 13.7272C10.1293 13.5522 10.0178 13.313 10.0028 13.0586C9.98788 12.8042 10.0707 12.5536 10.2343 12.3582C10.3978 12.1627 10.6299 12.0371 10.883 12.007L11 12H12Z" />
//                                 </svg>
//                                 <span>Appointments</span>
//                             </NavLink>
//                             {/* <NavLink href={route('medicalrecords')} active={route().current('medicalrecords')}  className="items-center pl-3 pr-3"  activeClassName="">   */}

//                             {(auth.user.role === "doctor" ||
//                                 auth.user.role === "admin") && (
//                                 <div
//                                     className={`nav-item medical_records group relative inline-flex w-48 cursor-pointer items-center p-1 pl-4 pr-3 ${
//                                         route().current(
//                                             "medicalrecords.*",
//                                         ) || route().current("allpatients")
//                                             ? "nav-item-active"
//                                             : "nav-item"
//                                     }`}
//                                 >
//                                     <svg
//                                         width="15"
//                                         height="18"
//                                         viewBox="0 0 15 18"
//                                         fill="currentColor"
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         className="navicon mr-2"
//                                     >
//                                         <g clipPath="url(#clip0_46_1949)">
//                                             <path d="M9.82467 5.18027V0.851318H3.45856C3.03521 0.851318 2.69463 1.19191 2.69463 1.61525V8.99994H0.912115C0.772061 8.99994 0.657471 9.11453 0.657471 9.25458V9.76387C0.657471 9.90393 0.772061 10.0185 0.912115 10.0185H5.39704C5.49253 10.0185 5.58166 10.0726 5.62622 10.1586L6.25965 11.4254L8.06762 7.80629C8.15993 7.61849 8.43049 7.61849 8.5228 7.80629L9.62732 10.0185H11.8618C12.1419 10.0185 12.3711 10.2477 12.3711 10.5278C12.3711 10.8079 12.1419 11.0371 11.8618 11.0371H9.00026L8.2968 9.63018L6.48883 13.2493C6.39652 13.4371 6.12596 13.4371 6.03365 13.2493L4.92595 11.0371H2.69463V16.3846C2.69463 16.808 3.03521 17.1486 3.45856 17.1486H14.1536C14.577 17.1486 14.9176 16.808 14.9176 16.3846V5.94421H10.5886C10.1684 5.94421 9.82467 5.60044 9.82467 5.18027ZM14.6947 4.19353L11.5785 1.07413C11.4353 0.930895 11.2411 0.851318 11.0374 0.851318H10.8432V4.92563H14.9176V4.73146C14.9176 4.53093 14.838 4.33676 14.6947 4.19353Z" />
//                                         </g>
//                                         <defs>
//                                             <clipPath id="clip0_46_1949">
//                                                 <rect
//                                                     width="14.2601"
//                                                     height="16.2972"
//                                                     fill="white"
//                                                     transform="translate(0.657471 0.851318)"
//                                                 />
//                                             </clipPath>
//                                         </defs>
//                                     </svg>
//                                     <span>Medical Records</span>

//                                     <ul className="absolute left-1/2 top-full z-[99] hidden w-48 -translate-x-1/2 list-disc rounded-md bg-white text-sm text-gray-700 shadow-md group-hover:block">
//                                         <li>
//                                             <NavLink
//                                                 href={route(
//                                                     "medicalrecords.unfinisheddocs",
//                                                 )}
//                                                 active={route().current(
//                                                     "medicalrecords.unfinisheddocs",
//                                                 )}
//                                                 className="medicallist block w-full px-3 py-2 transition-colors duration-150 hover:bg-[#429ABF] hover:text-white"
//                                                 activeClassName="bg-[#429ABF] text-white"
//                                             >
//                                                 <span className="block w-48">
//                                                     Unfinished Docs
//                                                 </span>
//                                             </NavLink>
//                                         </li>
//                                         <li>
//                                             <NavLink
//                                                 href={route("allpatients")}
//                                                 active={route().current(
//                                                     "allpatients",
//                                                 )}
//                                                 className="medicallist2 mt-0 block w-full px-3 py-2 transition-colors duration-150 hover:bg-[#429ABF] hover:text-white"
//                                                 activeClassName="bg-[#429ABF] text-white"
//                                             >
//                                                 <span className="block w-48">
//                                                     All Patients Records
//                                                 </span>
//                                             </NavLink>
//                                         </li>
//                                     </ul>

//                                     <svg
//                                         className="ml-2 h-3 w-3"
//                                         viewBox="0 0 8 5"
//                                         fill="currentColor"
//                                         xmlns="http://www.w3.org/2000/svg"
//                                     >
//                                         <path
//                                             d="M7 1L4 4L1 1"
//                                             stroke="white"
//                                             strokeWidth="1.5"
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                         />
//                                     </svg>
//                                 </div>
//                             )}

//                             {auth.user.role === "secretary" && (
//                                 <NavLink
//                                     href={route("allpatients")}
//                                     active={route().current("allpatients")}
//                                     className="nav-item btn flex items-center gap-2 px-2 py-1"
//                                     activeClassName=""
//                                 >
//                                     <svg
//                                         width="19"
//                                         height="17"
//                                         viewBox="0 0 19 17"
//                                         fill="currentColor"
//                                         xmlns="http://www.w3.org/2000/svg"
//                                     >
//                                         <path d="M5.86823 9C4.79948 9.03348 3.92535 9.46205 3.24583 10.2857H1.91979C1.37882 10.2857 0.923611 10.1501 0.554167 9.87891C0.184722 9.6077 0 9.21094 0 8.68862C0 6.32478 0.409028 5.14286 1.22708 5.14286C1.26667 5.14286 1.41016 5.21317 1.65755 5.35379C1.90495 5.49442 2.22656 5.63672 2.6224 5.78069C3.01823 5.92467 3.41076 5.99665 3.8 5.99665C4.24201 5.99665 4.68073 5.91964 5.11615 5.76562C5.08316 6.01339 5.06667 6.23438 5.06667 6.42857C5.06667 7.35938 5.33385 8.21652 5.86823 9ZM16.4667 15.3984C16.4667 16.202 16.2259 16.8365 15.7443 17.3019C15.2627 17.7673 14.6227 18 13.8245 18H5.17552C4.37726 18 3.73733 17.7673 3.25573 17.3019C2.77413 16.8365 2.53333 16.202 2.53333 15.3984C2.53333 15.0435 2.54488 14.697 2.56797 14.3588C2.59106 14.0206 2.63724 13.6557 2.70651 13.264C2.77578 12.8722 2.86319 12.5089 2.96875 12.1741C3.07431 11.8393 3.21615 11.5128 3.39427 11.1948C3.5724 10.8767 3.77691 10.6055 4.00781 10.3811C4.23872 10.1568 4.52075 9.97768 4.85391 9.84375C5.18707 9.70982 5.55486 9.64286 5.95729 9.64286C6.02326 9.64286 6.1651 9.71484 6.38281 9.85882C6.60052 10.0028 6.84132 10.1635 7.10521 10.341C7.3691 10.5184 7.72205 10.6791 8.16406 10.8231C8.60608 10.9671 9.05139 11.0391 9.5 11.0391C9.94861 11.0391 10.3939 10.9671 10.8359 10.8231C11.278 10.6791 11.6309 10.5184 11.8948 10.341C12.1587 10.1635 12.3995 10.0028 12.6172 9.85882C12.8349 9.71484 12.9767 9.64286 13.0427 9.64286C13.4451 9.64286 13.8129 9.70982 14.1461 9.84375C14.4793 9.97768 14.7613 10.1568 14.9922 10.3811C15.2231 10.6055 15.4276 10.8767 15.6057 11.1948C15.7839 11.5128 15.9257 11.8393 16.0312 12.1741C16.1368 12.5089 16.2242 12.8722 16.2935 13.264C16.3628 13.6557 16.4089 14.0206 16.432 14.3588C16.4551 14.697 16.4667 15.0435 16.4667 15.3984ZM6.33333 2.57143C6.33333 3.28125 6.08594 3.88728 5.59115 4.38951C5.09635 4.89174 4.49931 5.14286 3.8 5.14286C3.10069 5.14286 2.50365 4.89174 2.00885 4.38951C1.51406 3.88728 1.26667 3.28125 1.26667 2.57143C1.26667 1.86161 1.51406 1.25558 2.00885 0.753348C2.50365 0.251116 3.10069 0 3.8 0C4.49931 0 5.09635 0.251116 5.59115 0.753348C6.08594 1.25558 6.33333 1.86161 6.33333 2.57143ZM13.3 6.42857C13.3 7.4933 12.9289 8.40234 12.1867 9.15569C11.4445 9.90904 10.549 10.2857 9.5 10.2857C8.45104 10.2857 7.55547 9.90904 6.81328 9.15569C6.07109 8.40234 5.7 7.4933 5.7 6.42857C5.7 5.36384 6.07109 4.4548 6.81328 3.70145C7.55547 2.9481 8.45104 2.57143 9.5 2.57143C10.549 2.57143 11.4445 2.9481 12.1867 3.70145C12.9289 4.4548 13.3 5.36384 13.3 6.42857ZM19 8.68862C19 9.21094 18.8153 9.6077 18.4458 9.87891C18.0764 10.1501 17.6212 10.2857 17.0802 10.2857H15.7542C15.0747 9.46205 14.2005 9.03348 13.1318 9C13.6661 8.21652 13.9333 7.35938 13.9333 6.42857C13.9333 6.23438 13.9168 6.01339 13.8839 5.76562C14.3193 5.91964 14.758 5.99665 15.2 5.99665C15.5892 5.99665 15.9818 5.92467 16.3776 5.78069C16.7734 5.63672 17.0951 5.49442 17.3424 5.35379C17.5898 5.21317 17.7333 5.14286 17.7729 5.14286C18.591 5.14286 19 6.32478 19 8.68862ZM17.7333 2.57143C17.7333 3.28125 17.4859 3.88728 16.9911 4.38951C16.4964 4.89174 15.8993 5.14286 15.2 5.14286C14.5007 5.14286 13.9036 4.89174 13.4089 4.38951C12.9141 3.88728 12.6667 3.28125 12.6667 2.57143C12.6666 1.86161 12.9141 1.25558 13.4089 0.753348C13.9036 0.251116 14.5007 0 15.2 0C15.8993 0 16.4964 0.251116 16.9911 0.753348C17.4859 1.25558 17.7333 1.86161 17.7333 2.57143Z" />
//                                     </svg>
//                                     <span>All Patients</span>
//                                 </NavLink>
//                             )}
//                             <NavLink
//                                 href={route("billingrecord")}
//                                 active={route().current("billingrecord")}
//                                 className="nav-item btn flex items-center gap-2 px-2 py-1"
//                                 activeClassName=""
//                             >
//                                 <svg
//                                     width="18"
//                                     height="18"
//                                     viewBox="0 0 18 18"
//                                     fill="currentColor"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                 >
//                                     <path d="M15 16.5H3C2.80109 16.5 2.61032 16.421 2.46967 16.2803C2.32902 16.1397 2.25 15.9489 2.25 15.75V2.25C2.25 2.05109 2.32902 1.86032 2.46967 1.71967C2.61032 1.57902 2.80109 1.5 3 1.5H15C15.1989 1.5 15.3897 1.57902 15.5303 1.71967C15.671 1.86032 15.75 2.05109 15.75 2.25V15.75C15.75 15.9489 15.671 16.1397 15.5303 16.2803C15.3897 16.421 15.1989 16.5 15 16.5ZM6 6.75V8.25H12V6.75H6ZM6 9.75V11.25H12V9.75H6Z" />
//                                 </svg>

//                                 <span>Billing Record</span>
//                             </NavLink>
//                         </div>
//                     </div>

//                     <div className="hidden sm:ml-6 sm:flex sm:items-center">
//                         <div className="relative ml-3">
//                             <Dropdown>
//                                 <Dropdown.Trigger>
//                                     <span className="inline-flex rounded-md">
//                                         <button
//                                             type="button"
//                                             className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-right text-sm font-medium leading-4 text-gray-400 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none active:bg-transparent"
//                                         >
//                                             {capitalize(
//                                                 auth?.user?.first_name,
//                                             )}{" "}
//                                             {capitalize(
//                                                 auth?.user?.last_name,
//                                             )}{" "}
//                                             &nbsp;&nbsp; <br />{" "}
//                                             {capitalize(auth?.user?.role)}{" "}
//                                             &nbsp;&nbsp;
//                                             <svg
//                                                 width="25"
//                                                 height="25"
//                                                 viewBox="0 0 25 25"
//                                                 fill="none"
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                             >
//                                                 <circle
//                                                     cx="12.5"
//                                                     cy="12.5"
//                                                     r="12.5"
//                                                     fill="#FF8000"
//                                                 />
//                                             </svg>
//                                             {/* <svg
//                                                 className="ml-2 -mr-0.5 h-4 w-4"
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 viewBox="0 0 20 20"
//                                                 fill="currentColor"
//                                             >
//                                                 <path
//                                                     fillRule="evenodd"
//                                                     d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                                                     clipRule="evenodd"
//                                                 />
//                                             </svg> */}
//                                         </button>
//                                     </span>
//                                 </Dropdown.Trigger>

//                                 <Dropdown.Content>
//                                     {auth.user.role === "doctor" ||
//                                     auth.user.role === "admin" ? (
//                                         <Dropdown.Link
//                                             href={route("service-charges")}
//                                         >
//                                             Settings
//                                         </Dropdown.Link>
//                                     ) : null}
//                                     <Dropdown.Link
//                                         href={route("logout")}
//                                         method="post"
//                                         as="button"
//                                     >
//                                         Log Out
//                                     </Dropdown.Link>
//                                 </Dropdown.Content>
//                             </Dropdown>
//                         </div>
//                     </div>

//                     <div className="-mr-2 flex items-center sm:hidden">
//                         <button
//                             onClick={() =>
//                                 setShowingNavigationDropdown(
//                                     (previousState) => !previousState,
//                                 )
//                             }
//                             className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
//                         >
//                             <svg
//                                 className="h-6 w-6"
//                                 stroke="currentColor"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                             >
//                                 <path
//                                     className={
//                                         !showingNavigationDropdown
//                                             ? "inline-flex"
//                                             : "hidden"
//                                     }
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth="2"
//                                     d="M4 6h16M4 12h16M4 18h16"
//                                 />
//                                 <path
//                                     className={
//                                         showingNavigationDropdown
//                                             ? "inline-flex"
//                                             : "hidden"
//                                     }
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth="2"
//                                     d="M6 18L18 6M6 6l12 12"
//                                 />
//                             </svg>
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <div
//                 className={
//                     (showingNavigationDropdown ? "block" : "hidden") +
//                     " sm:hidden"
//                 }
//             >
//                 <div className="space-y-1 pb-3 pt-2">
//                     <ResponsiveNavLink
//                         href={route("dashboard")}
//                         active={route().current("dashboard")}
//                     >
//                         Dashboard
//                     </ResponsiveNavLink>
//                 </div>

//                 <div className="border-t border-gray-200 pb-1 pt-4">
//                     <div className="px-4">
//                         <div className="text-base font-medium text-gray-800">
//                             {auth?.user?.name}
//                         </div>
//                         <div className="text-sm font-medium text-gray-500">
//                             {auth?.user?.email}
//                         </div>
//                     </div>

//                     <div className="mt-3 space-y-1">
//                         <ResponsiveNavLink
//                             href={route("medication-templates")}
//                         >
//                             Settings
//                         </ResponsiveNavLink>

//                         <ResponsiveNavLink
//                             method="post"
//                             href={route("logout")}
//                             as="button"
//                         >
//                             Log Out
//                         </ResponsiveNavLink>
//                     </div>
//                 </div>
//             </div>
//         </nav>

//         {header && (
//             <header className="bg-white shadow">
//                 {/* <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div> */}
//             </header>
//         )}

//         <main>{children}</main>
//     </div>
// );
