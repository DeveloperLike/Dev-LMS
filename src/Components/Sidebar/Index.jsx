import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SidebarLinkGroup from "./SidebarLinkGroup";
import { AiFillFunnelPlot, AiOutlineUser } from "react-icons/ai";
import { FaFacebook, FaGoogle, FaUserFriends } from "react-icons/fa";
import { TbTableExport } from "react-icons/tb";
import { FaKey, FaHashtag } from "react-icons/fa";
import { BsBank2 } from "react-icons/bs";
import { GrTemplate, GrIntegration } from "react-icons/gr";
import { FaCity } from "react-icons/fa";
import { AiFillContainer } from "react-icons/ai";
import { GoPackage } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { MdDashboard, MdOutlineAccountTree, MdOutlineExplore } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { MdLeaderboard } from "react-icons/md";
import { GiModernCity } from "react-icons/gi";
import { CgNotes } from "react-icons/cg";
import { RiChatFollowUpLine } from "react-icons/ri";
import { FaBarsProgress } from "react-icons/fa6";
import { MdOutlineWidgets } from "react-icons/md";
import { MdAssignment } from "react-icons/md";
import { MdManageAccounts } from "react-icons/md";
import { MdOutlinePendingActions } from "react-icons/md";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { MdOutlineImportExport } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaUser } from "react-icons/fa";
import { SiSimpleanalytics } from "react-icons/si";
import { BsInfoSquareFill } from "react-icons/bs";
import { IoBusiness, IoSettingsOutline } from "react-icons/io5";
import { IoMdAnalytics } from "react-icons/io";
import { BiSupport } from "react-icons/bi";
import { FaCcVisa } from "react-icons/fa6";
import { LiaUniversitySolid } from "react-icons/lia";
import { PiCertificate } from "react-icons/pi";
import { AiOutlineMacCommand } from "react-icons/ai";
import { setLeadFilters } from "../../lib/redux/leadFilterSlice";
import logo from "../../assets/Logo.png"
import { InteractionOutlined, CreditCardOutlined, BarChartOutlined } from '@ant-design/icons';
import { AiFillHdd } from "react-icons/ai";
import { HiPhoneMissedCall } from "react-icons/hi";
import { MdOutlineSchedule } from "react-icons/md";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import LeadStatusAnalytics from "../../Pages/Analytics/LeadStatusAnalytics";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdOutlineTrendingUp, MdOutlineMail } from "react-icons/md";
import { LucideChartNoAxesCombined } from "lucide-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen, mode }) => {
  const location = useLocation();
  const { pathname, state } = location;

  const fromPage = state?.from || "lead";

  const trigger = useRef(null);
  const sidebar = useRef(null);
  const dispatch = useDispatch();

  const modulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );

  // console.log(modulePermission, "modulePermission ppp");

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded, modulePermission]);

  const checkingActiveRoutes = [
    "drip-marketing-rule",
    "assignment-rule",
    "lead-status",
    "lead-sub-status",
    "customise-widget",
  ];

  const isActiveRoutes = checkingActiveRoutes.some((route) =>
    pathname.includes(route)
  );

  const integrationRoutes = [
    "integrations",
    "facebook-page",
    "customise-widget",
    "bulk-actions",
    "Mail-Settings",
    "lead-status",
    "lead-sub-status",
    "lead-source"
  ];

  const isIntegrationActive = integrationRoutes.some((route) =>
    pathname.includes(route)
  );

  return (
    <aside
      ref={sidebar}
      className={` sidebar bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-white absolute left-0 top-0 z-9999 flex h-screen w-75 flex-col overflow-y-hidden bg-white duration-300 ease-linear lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className={` hover:text-black dark:hover:text-yellow-500 flex items-center justify-between gap-2 px-6 pt-4.5  lg:pt-4.5 `}>
        <NavLink to="/">
          <img src={logo} alt="Logo" style={{ maxHeight: "80px" }} />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-0 py-0 px-4 lg:mt-0 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item dashboard --> */}
              {
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      isActive
                        ? "group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium bg-[#ffce00] text-black"
                        : "group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-current duration-300 ease-in-out hover:bg-[#ffce00] hover:text-black dark:hover:text-black"
                    }
                  >
                    <MdDashboard className="text-current" />
                    Dashboard
                  </NavLink>

                </li>
              }
              {/* <!-- Menu Item dashboard --> */}

              {/* <!-- Menu Item Analytics --> */}
              {modulePermission.lead_management !== "no_access" && false && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === "/auth" || pathname.includes("auth")
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        {/* <div
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 dark:text-white text-black ease-in-out hover:text-white hover:bg-[#ffce00] ${(pathname === "/auth" ||
                            pathname.includes("auth")) &&
                            "bg-graydark dark:bg-meta-4"
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <IoMdAnalytics />
                          Analytics
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                              }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </div> */}

                        <div
                          className={`translate transform overflow-hidden ${!open && "hidden"
                            }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            {/* {
                              <li>
                                <NavLink
                                  to="/analytics-dashboard"
                                  className={({ isActive }) =>
                                    isActive
                                      ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                      : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium dark:text-white text-black duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4
                                        ${pathname.includes("calendar") &&
                                      "bg-graydark dark:bg-meta-4"
                                      }`
                                  }
                                >
                                  <SiSimpleanalytics />
                                  Analytics
                                </NavLink>
                              </li>
                            } */}
                            {/* {
                              <li>
                                <NavLink
                                  to="/lead-status-analytics"
                                  className={({ isActive }) =>
                                    isActive
                                      ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                      : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium dark:text-white text-black duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4
                                          ${pathname.includes("calendar") &&
                                      "bg-graydark dark:bg-meta-4"
                                      }`
                                  }
                                >
                                  <SiSimpleanalytics />
                                  Lead Status Analytics
                                </NavLink>
                              </li>
                            } */}

                            {/* {
                              <li>
                                <NavLink
                                  to="/lead-analytics"
                                  className={({ isActive }) =>
                                    isActive
                                      ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                      : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium dark:text-white text-black duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4
                    ${pathname.includes("calendar") &&
                                      "bg-graydark dark:bg-meta-4"
                                      }`
                                  }
                                >
                                  <SiSimpleanalytics />
                                  Lead Analytics
                                </NavLink>
                              </li>
                            } */}

                            {/* {
                              <li>
                                <NavLink
                                  to="/sales-analytics"
                                  className={({ isActive }) =>
                                    isActive
                                      ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                      : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium dark:text-white text-black duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4
                                         ${pathname.includes("calendar") &&
                                      "bg-graydark dark:bg-meta-4"
                                      }`
                                  }
                                >
                                  <SiSimpleanalytics />
                                  Sales Analytics
                                </NavLink>
                              </li>
                            } */}

                            {/* <li>
                              <NavLink
                                to="/status-wise-lead"
                                className={({ isActive }) =>
                                  isActive
                                    ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                    : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium dark:text-white text-black duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4
                                       ${pathname.includes("calendar") &&
                                    "bg-graydark dark:bg-meta-4"
                                    }`
                                }
                              >
                                <BsInfoSquareFill />
                                Status Wise Lead
                              </NavLink>
                            </li> */}
                          </ul>
                        </div>
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}
              {/* <!-- Menu Item Analytics --> */}


              {/* <!-- Menu Item Branch --> */}
              {(modulePermission.branch_management === "edit" ||
                modulePermission.branch_management === "view") && (
                  <li>
                    <NavLink
                      to="/branch"
                      className={({ isActive }) =>
                        isActive
                          ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                          : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                  ${pathname.includes("calendar") &&
                          "bg-graydark dark:bg-meta-4"
                          }`
                      }
                    >
                      <BsBank2 />
                      Branch
                    </NavLink>
                  </li>
                )}
              {/* <!-- Menu Item Branch --> */}
              {/* <!-- Menu Item City --> */}
              {(modulePermission.city_management === "edit" ||
                modulePermission.city_management === "view") && (
                  <li>
                    <NavLink
                      to="/city"
                      className={({ isActive }) =>
                        isActive
                          ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                          : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                  ${pathname.includes("calendar") &&
                          "bg-graydark dark:bg-meta-4"
                          }`
                      }
                    >
                      <GiModernCity />
                      City
                    </NavLink>
                  </li>
                )}
              {/* <!-- Menu Item City --> */}

              {/* <!-- Menu Item State --> */}
              {(modulePermission.state_management === "edit" ||
                modulePermission.state_management === "view") && (
                  <li>
                    <NavLink
                      to="/state"
                      className={({ isActive }) =>
                        isActive
                          ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                          : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium  duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                  ${pathname.includes("calendar") &&
                          "bg-graydark dark:bg-meta-4"
                          }`
                      }
                    >
                      <FaCity />
                      State
                    </NavLink>
                  </li>
                )}
              {/* <!-- Menu Item State --> */}


              {/* <!-- Menu Item Lead Management --> */}

              {(modulePermission.lead_management === "no_access" &&
                modulePermission.assignment_rule_management === "no_access" &&
                modulePermission.lead_form_management === "no_access") || (
                  <SidebarLinkGroup
                    activeCondition={
                      pathname === "/auth" || pathname.includes("auth")
                    }
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <div
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300  ease-in-out hover:text-white hover:bg-[#ffce00] ${(pathname === "/auth" ||
                              pathname.includes("auth")) &&
                              "bg-graydark dark:bg-meta-4"
                              }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded
                                ? handleClick()
                                : setSidebarExpanded(true);
                            }}
                          >
                            <MdManageAccounts />
                            Lead Management
                            <svg
                              className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                                }`}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                fill=""
                              />
                            </svg>
                          </div>
                          {/* <!-- Dropdown Menu Start --> */}
                          <div
                            className={`translate transform overflow-hidden ${!open && "hidden"
                              }`}
                          >
                            <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                              {/* <!-- Menu Item Lead Form--> */}
                              {(modulePermission.lead_form_management ===
                                "edit" ||
                                modulePermission.lead_form_management ===
                                "view") && (
                                  <li>
                                    <NavLink
                                      to="/form-field"
                                      className={({ isActive }) =>
                                        isActive
                                          ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                          : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium  duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                              ${pathname.includes("calendar") &&
                                          "bg-graydark dark:bg-meta-4"
                                          }`
                                      }
                                    >
                                      <MdFormatListBulletedAdd />
                                      Lead Form Fields
                                    </NavLink>
                                  </li>
                                )}
                              {/* <!-- Menu Item Lead Form--> */}



                              {/* <!-- Menu Item Lead --> */}
                              {
                                <li>
                                  <NavLink
                                    to="/lead"
                                    onClick={() => {
                                      dispatch(setLeadFilters({ leads_status: "" }));
                                    }}
                                    className={({ isActive }) =>
                                      isActive || (pathname.startsWith("/view-lead") && fromPage === "lead")
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium bg-[#ffce00] text-black"
                                        : "group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4"
                                    }
                                  >
                                    <AiFillContainer />
                                    Lead
                                  </NavLink>
                                </li>
                              }
                              {/* <!-- Menu Item Lead --> */}

                              {/* <!-- Menu Item Fresh Lead --> */}
                              {
                                <li>
                                  <NavLink
                                    to="/lead-filter/0233cefc-fb3e-49d5-9ee1-5f8adadf143a"
                                    onClick={() => {
                                      dispatch(setLeadFilters({ leads_status: "" }));
                                    }}
                                    className={({ isActive }) =>
                                      isActive || (pathname.startsWith("/view-lead") && fromPage === "fresh")
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium bg-[#ffce00] text-black"
                                        : "group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4"
                                    }

                                  >
                                    <MdOutlineMarkEmailUnread />
                                    Fresh Lead
                                  </NavLink>
                                </li>
                              }
                              {/* <!-- Menu Item Fresh Lead --> */}

                              {/* <!-- Menu Item Future Lead --> */}
                              {
                                <li>
                                  <NavLink
                                    to="/lead-filter/c8704f97-f12c-47f7-81db-e82b6069ee2f"
                                    onClick={() => {
                                      dispatch(setLeadFilters({ leads_status: "" }));
                                    }}
                                    className={({ isActive }) =>
                                      isActive || (pathname.startsWith("/view-lead") && fromPage === "Future Lead")
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium bg-[#ffce00] text-black"
                                        : "group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4"
                                    }

                                  >
                                    <MdOutlineSchedule />
                                    Future Lead
                                  </NavLink>
                                </li>
                              }
                              {/* <!-- Menu Item Future Lead --> */}

                              {/* <!-- Menu Item Did Not Pick --> */}
                              {
                                <li>
                                  <NavLink
                                    to="/lead-filter/4b3428a2-18f5-47ec-a842-ae732ac7c9cb"
                                    onClick={() => {
                                      dispatch(setLeadFilters({ leads_status: "" }));
                                    }}
                                    className={({ isActive }) =>
                                      isActive || (pathname.startsWith("/view-lead") && fromPage === "Did Not Pick")
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium bg-[#ffce00] text-black"
                                        : "group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4"
                                    }
                                  >
                                    <HiPhoneMissedCall />
                                    Did Not Pick
                                  </NavLink>
                                </li>
                              }
                              {/* <!-- Menu Item Did Not Pick --> */}

                              {/* <!-- Menu Item Unassigned Lead --> */}
                              {(modulePermission.unassigned_leads_management ===
                                "edit" ||
                                modulePermission.unassigned_leads_management ===
                                "view") && (
                                  <li>
                                    <NavLink
                                      to="/unassigned-lead"
                                      className={({ isActive }) =>
                                        isActive
                                          ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                          : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium  duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                              ${pathname.includes("calendar") &&
                                          "bg-graydark dark:bg-meta-4"
                                          }`
                                      }
                                    >
                                      <MdOutlinePendingActions />
                                      Unassigned Lead
                                    </NavLink>
                                  </li>
                                )}
                              {/* <!-- Menu Item Unassigned Lead --> */}



                              {/* <!-- Menu Item Sales --> */}

                              {
                                <li>
                                  <NavLink
                                    to="/sales"
                                    className={({ isActive }) =>
                                      isActive || pathname.startsWith("/sales")
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium bg-[#ffce00] text-black"
                                        : "group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4"
                                    }
                                  >
                                    <MdOutlineTrendingUp size={18} />
                                    Sales
                                  </NavLink>
                                </li>
                              }

                              {/* <!-- Menu Sales --> */}




                              {/* <!-- Menu Item WhatsAppLayout --> */}
                              {/* {modulePermission.user_group === "admin" && ( */}

                              <li>
                                <NavLink
                                  to="/whatsapp"
                                  className={({ isActive }) =>
                                    isActive || pathname.startsWith("/whatsapp")
                                      ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium bg-[#ffce00] text-black"
                                      : "group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4"
                                  }
                                >
                                  <IoLogoWhatsapp />
                                  Whatsapp
                                </NavLink>
                              </li>


                              {/* <!-- Menu Item WhatsAppLayout --> */}


                              {/* <!-- Menu Item Export --> */}
                              {/* {modulePermission.user_group === "admin" && (

                                <li>
                                  <NavLink
                                    to="/export"
                                    className={({ isActive }) =>
                                      isActive || pathname.startsWith("/export")
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium bg-[#ffce00] text-black"
                                        : "group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4"
                                    }
                                  >
                                    <TbTableExport />
                                    Export
                                  </NavLink>
                                </li>

                              )} */}
                              {/* <!-- Menu Item Export end --> */}

                            </ul>
                          </div>
                          {/* <!-- Dropdown Menu End --> */}
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                )}

              {/* <!-- Menu Item Lead Settings --> */}
              <li>
                <SidebarLinkGroup
                  activeCondition={isActiveRoutes}
                >
                  {(handleSettingsClick, settingsOpen) => {
                    return (
                      <React.Fragment>
                        <div
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 ${isActiveRoutes ? "bg-[#ffce00] text-black" : ""
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleSettingsClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <IoSettingsOutline />
                          Lead Settings
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${settingsOpen && "rotate-180"
                              }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </div>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden ${!settingsOpen && "hidden"
                            }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            {/* <!-- Menu Item Drip Marketing Rule --> */}
                            {(modulePermission.assignment_rule_management ===
                              "edit" ||
                              modulePermission.assignment_rule_management ===
                              "view") && (
                                <li>
                                  <NavLink
                                    to="/drip-marketing-rule"
                                    className={({ isActive }) =>
                                      isActive || pathname.startsWith("/drip-marketing-rule")
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium bg-[#ffce00] text-black"
                                        : "group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4"
                                    }
                                  >
                                    <MdAssignment />
                                    Drip Marketing Rule
                                  </NavLink>
                                </li>
                              )}
                            {/* <!-- Menu Item Drip Marketing Rule --> */}

                            {/* <!-- Menu Item Assignment Rule --> */}
                            {(modulePermission.assignment_rule_management ===
                              "edit" ||
                              modulePermission.assignment_rule_management ===
                              "view") && (
                                <li>
                                  <NavLink
                                    to="/assignment-rule"
                                    className={({ isActive }) =>
                                      isActive || pathname.startsWith("/assignment-rule")
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium bg-[#ffce00] text-black"
                                        : "group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4"
                                    }
                                  >
                                    <MdAssignment />
                                    Assignment Rule
                                  </NavLink>
                                </li>
                              )}
                            {/* <!-- Menu Item Assignment Rule --> */}




                          </ul>
                        </div>
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              </li>


              {/* <!-- Menu Item Lead Management --> */}
              {/* <!-- Menu Item Registered Users --> */}
              {/*(modulePermission.finance_management === "edit" ||
                modulePermission.finance_management === "view" ||
                modulePermission.registered_students_management === "edit" ||
                modulePermission.registered_students_management === "view") && (
                  <li>
                    <NavLink
                      to="/registered-users"
                      className={({ isActive }) =>
                        isActive
                          ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                          : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                  ${pathname.includes("calendar") &&
                          "bg-graydark dark:bg-meta-4"
                          }`
                      }
                    >
                      <FaUser />
                      Registered Student
                    </NavLink>
                  </li>
                )*/}
              {/* <!-- Menu Item Registered Users --> */}

              {/* <!-- Menu Item Marketing Management --> */}
              {(modulePermission.role_management !== "no_access" ||
                modulePermission.staff_management !== "no_access") && (
                  <SidebarLinkGroup
                    activeCondition={
                      pathname === "/auth" || pathname.includes("auth")
                    }
                  >
                    {(handleClick, open) => {
                      //   return (
                      //     <React.Fragment>
                      //       <div
                      //         className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 text-black ease-in-out hover:text-white hover:bg-[#ffce00] ${
                      //           (pathname === "/auth" ||
                      //             pathname.includes("auth")) &&
                      //           "bg-graydark dark:bg-meta-4"
                      //         }`}
                      //         onClick={(e) => {
                      //           e.preventDefault();
                      //           sidebarExpanded
                      //             ? handleClick()
                      //             : setSidebarExpanded(true);
                      //         }}
                      //       >
                      //         <MdManageAccounts />
                      //         Marketing Campaign
                      //         <svg
                      //           className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                      //             open && "rotate-180"
                      //           }`}
                      //           width="20"
                      //           height="20"
                      //           viewBox="0 0 20 20"
                      //           fill="none"
                      //           xmlns="http://www.w3.org/2000/svg"
                      //         >
                      //           <path
                      //             fillRule="evenodd"
                      //             clipRule="evenodd"
                      //             d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                      //             fill=""
                      //           />
                      //         </svg>
                      //       </div>
                      //       {/* <!-- Dropdown Menu Start --> */}
                      //       <div
                      //         className={`translate transform overflow-hidden ${
                      //           !open && "hidden"
                      //         }`}
                      //       >
                      //         <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                      //           {/* <!-- Menu Item Lead Category --> */}
                      //           {(modulePermission.role_management === "edit" ||
                      //             modulePermission.role_management === "view") && (
                      //             <li>
                      //               <NavLink
                      //                 to="/lead-category"
                      //                 className={({ isActive }) =>
                      //                   isActive
                      //                     ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                      //                     : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4
                      // ${
                      //   pathname.includes("calendar") &&
                      //   "bg-graydark dark:bg-meta-4"
                      // }`
                      //                 }
                      //               >
                      //                 <FaKey />
                      //                 Lead Category
                      //               </NavLink>
                      //             </li>
                      //           )}
                      //           {/* <!-- Menu Item Lead Category --> */}
                      //           {/* <!-- Menu Item Campaign --> */}
                      //           {/* {(modulePermission.staff_management === "edit" ||
                      //             modulePermission.staff_management === "view") && (
                      //             <li>
                      //               <NavLink
                      //                 to="/campaign"
                      //                 className={({ isActive }) =>
                      //                   isActive
                      //                     ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                      //                     : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4
                      //             ${
                      //               pathname.includes("calendar") &&
                      //               "bg-graydark dark:bg-meta-4"
                      //             }`
                      //                 }
                      //               >
                      //                 <FaUserFriends />
                      //                 Campaign
                      //               </NavLink>
                      //             </li>
                      //           )} */}
                      //           {/* <!-- Menu Item Campaign --> */}
                      //         </ul>
                      //       </div>
                      //       {/* <!-- Dropdown Menu End --> */}
                      //     </React.Fragment>
                      //   );
                    }}
                  </SidebarLinkGroup>
                )}
              {/* <!-- Menu Item Marketing Management --> */}

              {/* <!-- Menu Item Visa Management --> */}
              {/* {modulePermission.user_group === "admin" && (
                <li>
                  <NavLink
                    to="/visa-application"
                    className={({ isActive }) =>
                      isActive
                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                        : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                  ${
                    pathname.includes("calendar") &&
                    "bg-graydark dark:bg-meta-4"
                  }`
                    }
                  >
                    <FaCcVisa />
                    Visa Management
                  </NavLink>
                </li>
              )} */}
              {/* <!-- Menu Item Visa Management --> */}

              {/* <!-- Menu Item Accommodation --> */}
              {/* {(modulePermission.accommodation_management === "edit" ||
                modulePermission.accommodation_management === "view") && (
                <li>
                  <NavLink
                    to="/accommodation"
                    className={({ isActive }) =>
                      isActive
                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                        : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                  ${
                    pathname.includes("calendar") &&
                    "bg-graydark dark:bg-meta-4"
                  }`
                    }
                  >
                    <LiaUniversitySolid />
                    Accommodation
                  </NavLink>
                </li>
              )} */}
              {/* <!-- Menu Item Accommodation --> */}

              {/* <!-- Menu Item University --> */}
              {/* {modulePermission.course_management !== "no_access" && (
                <li>
                  <NavLink
                    to="/university"
                    className={({ isActive }) =>
                      isActive
                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                        : `group relative flex items-center gap-2.5 round ed-sm py-2 px-4 font-medium text-black duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                  ${
                    pathname.includes("calendar") &&
                    "bg-graydark dark:bg-meta-4"
                  }`
                    }
                  >
                    <LiaUniversitySolid />
                    University
                  </NavLink>
                </li>
              )} */}
              {/* <!-- Menu Item University --> */}

              {/* <!-- Menu Item Course --> */}
              {/* {modulePermission.user_group === "admin" && (
                <li>
                  <NavLink
                    to="/course"
                    className={({ isActive }) =>
                      isActive
                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                        : `group relative flex items-center gap-2.5 round ed-sm py-2 px-4 font-medium text-black duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                  ${
                    pathname.includes("calendar") &&
                    "bg-graydark dark:bg-meta-4"
                  }`
                    }
                  >
                    <PiCertificate />
                    Course
                  </NavLink>
                </li>
              )} */}
              {/* <!-- Menu Item Course --> */}

              {/* <!-- Menu Item Course Admission Application --> */}
              {/* {modulePermission.user_group === "admin" && (
                <li>
                  <NavLink
                    to="/course-admission-application"
                    className={({ isActive }) =>
                      isActive
                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                        : `group relative flex items-center gap-2.5 round ed-sm py-2 px-4 font-medium text-black duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                  ${
                    pathname.includes("calendar") &&
                    "bg-graydark dark:bg-meta-4"
                  }`
                    }
                  >
                    <PiCertificate />
                    Admission Application
                  </NavLink>
                </li>
              )} */}
              {/* <!-- Menu Item Course Admission Application  --> */}

              {/* <!-- Menu Item Document Management --> */}
              {/* {modulePermission.document_management !== "no_access" && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === "/auth" || pathname.includes("auth")
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <div
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 text-black ease-in-out hover:text-white hover:bg-[#ffce00] ${
                            (pathname === "/auth" ||
                              pathname.includes("auth")) &&
                            "bg-graydark dark:bg-meta-4"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <CgNotes />
                          Document Management
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && "rotate-180"
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </div>
                        
                        <div
                          className={`translate transform overflow-hidden ${
                            !open && "hidden"
                          }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            
                            {(modulePermission.lead_management === "edit" ||
                              modulePermission.lead_management === "view") && (
                              <li>
                                <NavLink
                                  to="/document-category"
                                  className={({ isActive }) =>
                                    isActive
                                      ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                      : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                              ${
                                pathname.includes("calendar") &&
                                "bg-graydark dark:bg-meta-4"
                              }`
                                  }
                                >
                                  <CgNotes />
                                  Document Category
                                </NavLink>
                              </li>
                            )}
                            
                            {(modulePermission.lead_management === "edit" ||
                              modulePermission.lead_management === "view") && (
                              <li>
                                <NavLink
                                  to="/document"
                                  className={({ isActive }) =>
                                    isActive
                                      ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                      : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                  ${
                    pathname.includes("calendar") &&
                    "bg-graydark dark:bg-meta-4"
                  }`
                                  }
                                >
                                  <CgNotes />
                                  Document
                                </NavLink>
                              </li>
                            )}
                            
                          </ul>
                        </div>
                        
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )} */}
              {/* <!-- Menu Item Document Management --> */}

              {/* <!-- Menu Item Reports --> */}
              {modulePermission.lead_management !== "no_access" && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === "/auth" || pathname.includes("auth")
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <div
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] ${(pathname === "/auth" ||
                            pathname.includes("auth")) &&
                            "bg-graydark dark:bg-meta-4"
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <CgNotes />
                          Reports
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                              }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </div>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden ${!open && "hidden"
                            }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            {/* <!-- Menu Item Call Log --> */}
                            {(modulePermission.lead_management === "edit" ||
                              modulePermission.lead_management === "view") && (
                                <li>
                                  <NavLink
                                    to="/call-logs"
                                    className={({ isActive }) =>
                                      isActive
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                        : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                  ${pathname.includes("calendar") &&
                                        "bg-graydark dark:bg-meta-4"
                                        }`
                                    }
                                  >
                                    <CgNotes />
                                    Call Logs
                                  </NavLink>
                                </li>
                              )}
                            {/* <!-- Menu Item Call Log --> */}

                            {/* <!-- Menu Item Call Report --> */}
                            {(modulePermission.lead_management === "edit" ||
                              modulePermission.lead_management === "view") && (
                                <li>
                                  <NavLink
                                    to="/call-report"
                                    className={({ isActive }) =>
                                      isActive
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                        : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                              ${pathname.includes("calendar") &&
                                        "bg-graydark dark:bg-meta-4"
                                        }`
                                    }
                                  >
                                    <CgNotes />
                                    Call Reports
                                  </NavLink>
                                </li>
                              )}
                            {/* <!-- Menu Item Call Report --> */}

                            {/* <!-- Menu Item Lead Funnel --> */}
                            {(modulePermission.lead_management === "edit" ||
                              modulePermission.lead_management === "view") && (
                                <li>
                                  <NavLink
                                    to="/lead-funnel"
                                    className={({ isActive }) =>
                                      isActive
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                        : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                              ${pathname.includes("calendar") &&
                                        "bg-graydark dark:bg-meta-4"
                                        }`
                                    }
                                  >
                                    <AiFillFunnelPlot />
                                    Lead Funnel
                                  </NavLink>
                                </li>
                              )}
                            {/* <!-- Menu Item Lead Funnel --> */}

                            {/* <!-- Menu Item Branch Lead Performance --> */}
                            {(modulePermission.user_group === "admin" ||
                              modulePermission.user_group === "manager") &&
                              (modulePermission.lead_management === "edit" ||
                                modulePermission.lead_management === "view") && (
                                <li>
                                  <NavLink
                                    to="/branch-perfomance"
                                    className={({ isActive }) =>
                                      isActive
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                        : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                                   ${pathname.includes("calendar") && "bg-graydark dark:bg-meta-4"}`
                                    }
                                  >
                                    <MdOutlineAccountTree />
                                    Branch Perfomance
                                  </NavLink>
                                </li>
                              )}
                            {/* <!-- Menu Item Branch Lead Performance --> */}

                            {/* <!-- Menu Item User Lead Performance --> */}
                            {/* {(modulePermission.user_group === "admin" ||
                              modulePermission.user_group === "manager") &&
                              (modulePermission.lead_management === "edit" ||
                                modulePermission.lead_management === "view") && (
                                <li>
                                  <NavLink
                                    to="/user-perfomance"
                                    className={({ isActive }) =>
                                      isActive
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                        : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                                   ${pathname.includes("calendar") && "bg-graydark dark:bg-meta-4"}`
                                    }
                                  >
                                    <CgNotes />
                                    User Perfomance
                                  </NavLink>
                                </li>
                              )} */}
                            {/* <!-- Menu Item User Lead Performance --> */}

                            {/* <!-- Menu  Marketing Performance --> */}
                            {modulePermission.user_group === "admin" &&
                              (modulePermission.lead_management === "edit" ||
                                modulePermission.lead_management === "view") && (
                                <li>
                                  <NavLink
                                    to="/marketing-performance"
                                    className={({ isActive }) =>
                                      isActive
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                        : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                                     ${pathname.includes("calendar") && "bg-graydark dark:bg-meta-4"}`
                                    }
                                  >
                                    <LucideChartNoAxesCombined size={16} />
                                    Marketing Performance
                                  </NavLink>
                                </li>
                              )}
                            {/* <!-- Menu  Marketing Performance --> */}
                            {/* <!-- Menu  Facebook Performance --> */}
                            {modulePermission.user_group === "admin" &&
                              (modulePermission.lead_management === "edit" ||
                                modulePermission.lead_management === "view") && (
                                <li>
                                  <NavLink
                                    to="/facebook-performance"
                                    className={({ isActive }) =>
                                      isActive
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                        : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                                     ${pathname.includes("calendar") && "bg-graydark dark:bg-meta-4"}`
                                    }
                                  >
                                    <FaFacebook />
                                    Facebook Performance
                                  </NavLink>
                                </li>
                              )}
                            {/* <!-- Menu  Facebook Performance --> */}

                            {/* <!-- Menu Google Search Console --> */}
                            {modulePermission.user_group === "admin" &&
                              (modulePermission.lead_management === "edit" ||
                                modulePermission.lead_management === "view") && (
                                <li>
                                  <NavLink
                                    to="/google-performance"
                                    className={({ isActive }) =>
                                      isActive
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                        : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                                     ${pathname.includes("calendar") && "bg-graydark dark:bg-meta-4"}`
                                    }
                                  >
                                    <FaGoogle />
                                    Google Performance
                                  </NavLink>
                                </li>
                              )}
                            {/* <!-- Menu Google Search Console --> */}

                            {/* <!-- Menu Google Analytics --> */}
                            {/* {modulePermission.user_group === "admin" &&
                              (modulePermission.lead_management === "edit" ||
                                modulePermission.lead_management === "view") && (
                                <li>
                                  <NavLink
                                    to="/google-analytics"
                                    className={({ isActive }) =>
                                      isActive
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                        : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                                     ${pathname.includes("calendar") && "bg-graydark dark:bg-meta-4"}`
                                    }
                                  >
                                    <BarChartOutlined />
                                    Google Analytics
                                  </NavLink>
                                </li>
                              )} */}
                            {/* <!-- Menu Google Analytics --> */}

                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}
              {/* <!-- Menu Item Reports --> */}

              {/* <!-- Menu Item Template --> */}
              {(modulePermission.template_management === "edit" ||
                modulePermission.template_management === "view") && (
                  <li>
                    <NavLink
                      to="/template"
                      className={({ isActive }) =>
                        isActive
                          ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                          : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                  ${pathname.includes("calendar") &&
                          "bg-graydark dark:bg-meta-4"
                          }`
                      }
                    >
                      <CreditCardOutlined />
                      Template
                    </NavLink>
                  </li>
                )}
              {/* <!-- Menu Item Template --> */}

              {/* <!-- Menu Item User Management --> */}
              {(modulePermission.role_management !== "no_access" ||
                modulePermission.staff_management !== "no_access") && (
                  <SidebarLinkGroup
                    activeCondition={
                      pathname === "/auth" || pathname.includes("auth")
                    }
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <div
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] ${(pathname === "/auth" ||
                              pathname.includes("auth")) &&
                              "bg-graydark dark:bg-meta-4"
                              }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded
                                ? handleClick()
                                : setSidebarExpanded(true);
                            }}
                          >
                            <MdManageAccounts />
                            Staff Management
                            <svg
                              className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                                }`}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                fill=""
                              />
                            </svg>
                          </div>
                          {/* <!-- Dropdown Menu Start --> */}
                          <div
                            className={`translate transform overflow-hidden ${!open && "hidden"
                              }`}
                          >
                            <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                              {/* <!-- Menu Item Roles --> */}
                              {(modulePermission.role_management === "edit" ||
                                modulePermission.role_management === "view") && (
                                  <li>
                                    <NavLink
                                      to="/roles"
                                      className={({ isActive }) =>
                                        isActive
                                          ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                          : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                  ${pathname.includes("calendar") &&
                                          "bg-graydark dark:bg-meta-4"
                                          }`
                                      }
                                    >
                                      <FaKey />
                                      Roles
                                    </NavLink>
                                  </li>
                                )}
                              {/* <!-- Menu Item Users --> */}
                              {(modulePermission.staff_management === "edit" ||
                                modulePermission.staff_management === "view") && (
                                  <li>
                                    <NavLink
                                      to="/users"
                                      className={({ isActive }) =>
                                        isActive
                                          ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                          : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                               ${pathname.includes("calendar") &&
                                          "bg-graydark dark:bg-meta-4"
                                          }`
                                      }
                                    >
                                      <FaUserFriends />
                                      Staff
                                    </NavLink>
                                  </li>
                                )}
                              {/* <!-- Menu Item Users --> */}

                              {/* <!-- Menu Item DID Numbers --> */}
                              {(modulePermission.staff_management === "edit" ||
                                modulePermission.staff_management === "view") && (
                                  <li>
                                    <NavLink
                                      to="/did-numbers"
                                      className={({ isActive }) =>
                                        isActive
                                          ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                          : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                               ${pathname.includes("calendar") &&
                                          "bg-graydark dark:bg-meta-4"
                                          }`
                                      }
                                    >
                                      <FaHashtag />
                                      DID Numbers
                                    </NavLink>
                                  </li>
                                )}
                              {/* <!-- Menu Item DID Numbers --> */}
                            </ul>
                          </div>
                          {/* <!-- Dropdown Menu End --> */}
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                )}
              {/* <!-- Menu Item User Management --> */}

              {/* <!-- Menu Item Integration Management --> */}
              {(modulePermission.is_superuser === true) && (
                <SidebarLinkGroup
                  activeCondition={isIntegrationActive}
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <div
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] ${isIntegrationActive ? "bg-[#ffce00] text-black" : ""
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <InteractionOutlined />
                          Integrations
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                              }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </div>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden ${!open && "hidden"
                            }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to="/integrations/google"
                                className={({ isActive }) =>
                                  isActive
                                    ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                    : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                               ${pathname.includes("calendar") &&
                                    "bg-graydark dark:bg-meta-4"
                                    }`
                                }
                              >
                                <FaGoogle />
                                Google
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/facebook-page"
                                className={({ isActive }) =>
                                  isActive
                                    ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                    : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                                 ${pathname.includes("calendar") &&
                                    "bg-graydark dark:bg-meta-4"
                                    }`
                                }
                              >
                                <FaFacebook />
                                Facebook
                              </NavLink>
                            </li>
                            {/* <!-- Menu Item Customise Widget --> */}
                            {(modulePermission.lead_management === "edit" ||
                              modulePermission.lead_management === "view") &&
                              modulePermission.user_group === "admin" && (
                                <li>
                                  <NavLink
                                    to="/customise-widget"
                                    className={({ isActive }) =>
                                      isActive
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                        : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium  duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                            ${pathname.includes("calendar") &&
                                        "bg-graydark dark:bg-meta-4"
                                        }`
                                    }
                                  >
                                    <MdOutlineWidgets />
                                    Customise Widget
                                  </NavLink>
                                </li>
                              )}
                            {/* <!-- Menu Item Customise Widget --> */}
                            {/* <!-- Menu Item Bulk Actions --> */}
                            {(modulePermission.bulk_action_management ===
                              "edit" ||
                              modulePermission.bulk_action_management ===
                              "view") && (
                                // modulePermission.user_group === "admin" &&
                                <li>
                                  <NavLink
                                    to="/bulk-actions"
                                    className={({ isActive }) =>
                                      isActive
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                        : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium  duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                              ${pathname.includes("calendar") &&
                                        "bg-graydark dark:bg-meta-4"
                                        }`
                                    }
                                  >
                                    <MdOutlineImportExport />
                                    Bulk Actions
                                  </NavLink>
                                </li>
                              )}
                            {/* <!-- Menu Item Bulk Actions --> */}

                            <li>
                              <NavLink
                                to="/Mail-Settings"
                                className={({ isActive }) =>
                                  isActive
                                    ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                    : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium  duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                                           ${pathname.includes("Mail-Settings") &&
                                    "bg-graydark dark:bg-meta-4"
                                    }`
                                }
                              >
                                <MdOutlineMail />
                                Mail Settings
                              </NavLink>
                            </li>

                            {/* <!-- Menu Item Lead Status --> */}
                            {(modulePermission.lead_management === "edit" ||
                              modulePermission.lead_management === "view") &&
                              modulePermission.user_group === "admin" && (
                                <li>
                                  <NavLink
                                    to="/lead-status"
                                    className={({ isActive }) =>
                                      isActive
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                        : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium  duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                            ${pathname.includes("calendar") &&
                                        "bg-graydark dark:bg-meta-4"
                                        }`
                                    }
                                  >
                                    <FaBarsProgress />
                                    Lead Status
                                  </NavLink>
                                </li>
                              )}
                            {/* <!-- Menu Item Lead Status --> */}

                            {/* <!-- Menu Item Lead Sub Status --> */}
                            {(modulePermission.lead_management === "edit" ||
                              modulePermission.lead_management === "view") &&
                              modulePermission.user_group === "admin" && (
                                <li>
                                  <NavLink
                                    to="/lead-sub-status"
                                    className={({ isActive }) =>
                                      isActive
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                        : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium  duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                            ${pathname.includes("calendar") &&
                                        "bg-graydark dark:bg-meta-4"
                                        }`
                                    }
                                  >
                                    <FaBarsProgress />
                                    Lead Sub Status
                                  </NavLink>
                                </li>
                              )}
                            {/* <!-- Menu Item Lead Sub Status --> */}

                            {/* <!-- Menu Item Lead Source --> */}
                            {(modulePermission.state_management === "edit" ||
                              modulePermission.state_management === "view") && (
                                <li>
                                  <NavLink
                                    to="/lead-source"
                                    className={({ isActive }) =>
                                      isActive
                                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                                        : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium  duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                            ${pathname.includes("calendar") &&
                                        "bg-graydark dark:bg-meta-4"
                                        }`
                                    }
                                  >
                                    <MdOutlineExplore />
                                    Lead Source
                                  </NavLink>
                                </li>
                              )}
                            {/* <!-- Menu Item Lead Source --> */}

                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}
              {/* <!-- Menu Item Integration Management --> */}

              {/* <!-- Menu Item Package --> */}
              {(modulePermission.package_management === "edit" ||
                modulePermission.package_management === "view") && (
                  <li>
                    <NavLink
                      to="/package"
                      className={({ isActive }) =>
                        isActive
                          ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                          : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                  ${pathname.includes("calendar") &&
                          "bg-graydark dark:bg-meta-4"
                          }`
                      }
                    >
                      <GoPackage />
                      Package
                    </NavLink>
                  </li>
                )}

              {/* {(modulePermission.lead_management === "edit" ||
                modulePermission.lead_management === "view") && (
                  <li>
                    <NavLink
                      to="/followup"
                      className={({ isActive }) =>
                        isActive
                          ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                          : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                  ${pathname.includes("calendar") &&
                          "bg-graydark dark:bg-meta-4"
                          }`
                      }
                    >
                      <RiChatFollowUpLine />
                      My Followup
                    </NavLink>
                  </li>
                )} */}
              {(modulePermission.lead_management === "edit" ||
                modulePermission.lead_management === "view") && (
                  <li>
                    <NavLink
                      to="/follow-up"
                      className={({ isActive }) =>
                        isActive
                          ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                          : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                  ${pathname.includes("calendar") &&
                          "bg-graydark dark:bg-meta-4"
                          }`
                      }
                    >
                      <RiChatFollowUpLine />
                      Follow Ups
                    </NavLink>
                  </li>
                )}

              <li>
                <NavLink
                  to="/reminder"
                  className={({ isActive }) =>
                    isActive
                      ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                      : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                  ${pathname.includes("calendar") &&
                      "bg-graydark dark:bg-meta-4"
                      }`
                  }
                >
                  <CgNotes />
                  My Reminders
                </NavLink>
              </li>
              {/* {modulePermission.user_group === "admin" && (
                <li>
                  <NavLink
                    to="/tickets"
                    className={({ isActive }) =>
                      isActive
                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                        : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                  ${pathname.includes("calendar") &&
                        "bg-graydark dark:bg-meta-4"
                        }`
                    }
                  >
                    <BiSupport />
                    Technical Support
                  </NavLink>
                </li>
              )} */}
              {/* <!-- Menu Item Support Management --> */}

              {/* <!-- Menu Item Profile --> */}
              {/* {
                <li>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      isActive
                        ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                        : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4 
                  ${pathname.includes("calendar") &&
                        "bg-graydark dark:bg-meta-4"
                        }`
                    }
                  >
                    <CgProfile />
                    Profile
                  </NavLink>
                </li>
              } */}
              {/* <!-- Menu Item Profile --> */}

              {/* <!-- Menu Item Integration Partners --> */}
              {
                // <li>
                //   <NavLink
                //     to="/integration-partners"
                //     className={({ isActive }) =>
                //       isActive
                //         ? "sidebarActive group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium"
                //         : `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black duration-300 ease-in-out hover:text-white hover:bg-[#ffce00] dark:hover:bg-meta-4
                //   ${
                //     pathname.includes("calendar") &&
                //     "bg-graydark dark:bg-meta-4"
                //   }`
                //     }
                //   >
                //     <IoBusiness />
                //     Integration Partners
                //   </NavLink>
                // </li>
              }
              {/* <!-- Menu ItemIntegration Partners  --> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
