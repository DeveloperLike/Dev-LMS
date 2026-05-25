import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import DropdownUser from './DropdownUser';
import Notifications from './Notifications';
import DarkModeSwitcher from './DarkModeSwitcher';
import { setLeadFilters } from '../../lib/redux/leadFilterSlice';
import authenticatedAxiosInstance from '../../lib/AxiosInstance';
import { MdOutlineMarkEmailUnread } from 'react-icons/md';
import { RiChatFollowUpLine } from 'react-icons/ri';
import { HiOutlineInboxStack } from 'react-icons/hi2';

const Header = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [counts, setCounts] = useState({ fresh: 0, backlog: 0, followup: 0 });
  const [freshLeadId, setFreshLeadId] = useState(null);

  useEffect(() => {
    // Emit add user to socket
    props.socket.emit("addUser", {
      userData: props?.userData,
      username: props?.userData?.username,
    });

    const fetchCounts = () => {
      authenticatedAxiosInstance({
        method: "get",
        url: "/api/v1/common/dashboard",
      }).then((response) => {
        const data = response?.data?.data || [];
        const normalize = (str) => str?.toLowerCase().trim();
        
        const freshItem = data.find(d => normalize(d.name) === "fresh lead");
        const backlogItem = data.find(d => normalize(d.name) === "backlog");
        const followupItem = data.find(d => normalize(d.name) === "followup");
        
        setCounts({
          fresh: freshItem?.count || 0,
          backlog: backlogItem?.count || 0,
          followup: followupItem?.count || 0
        });
        setFreshLeadId(response?.data?.fresh_lead_source_id);
      }).catch(err => console.error("Error fetching dashboard counts for header:", err));
    };

    fetchCounts();
    // Refresh header counts every 30 seconds to keep it perfectly in sync
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleFreshClick = () => {
    if (freshLeadId) {
      dispatch(
        setLeadFilters({
          leads_status: freshLeadId,
        })
      );
      navigate(`/lead-filter/${freshLeadId}`);
    }
  };

  const handleFollowupClick = () => {
    navigate("/follow-up");
  };

  const handleBacklogClick = () => {
    navigate("/follow-up", { state: { resetDate: "EMPTY" } });
  };

  return (
    <header className="sticky top-0 z-999 flex w-full bg-black drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="relative flex flex-grow items-center px-2 py-3 shadow-2 md:px-6 2xl:px-11">

        {/* Left: Hamburger */}
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            {/* Hamburger Icon (same as before) */}
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!w-full delay-300'
                    }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && 'delay-400 !w-full'
                    }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!w-full delay-500'
                    }`}
                ></span>
              </span>
            </span>
          </button>
        </div>

        {/* Centered Premium Stats */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 sm:gap-4 select-none whitespace-nowrap text-xs sm:text-sm md:text-[15px] font-normal">
          <button
            onClick={handleFreshClick}
            className="text-gray-300 hover:text-blue-400 transition-colors duration-200 focus:outline-none flex items-center gap-1"
          >
            <span className="text-white">{counts.fresh}</span>
            <span>Fresh Leads</span>
          </button>
          <div className="h-7 w-[1px] bg-gray-600"></div>
          <button
            onClick={handleFollowupClick}
            className="text-gray-300 hover:text-red-400 transition-colors duration-200 focus:outline-none flex items-center gap-1"
          >
            <span className="text-white">{counts.followup}</span>
            <span>FollowUp</span>
          </button>
          <div className="h-7 w-[1px] bg-gray-600"></div>
          <button
            onClick={handleBacklogClick}
            className="text-gray-300 hover:text-red-600 transition-colors duration-200 focus:outline-none flex items-center gap-1"
          >
            <span className="text-white">{counts.backlog}</span>
            <span>Backlog</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="ml-auto flex items-center gap-4">

          {/* Notification */}
          <span className="text-white dark:text-white text-xl relative">
            <Notifications socket={props.socket} />
          </span>

          {/* User */}
          <DropdownUser />

          {/* Dark Mode */}
          <DarkModeSwitcher />
        </div>

      </div>
    </header>
  );
};

export default Header;
