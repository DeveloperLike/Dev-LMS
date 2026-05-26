import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import DropdownUser from './DropdownUser';
import Notifications from './Notifications';
import DarkModeSwitcher from './DarkModeSwitcher';

import { setLeadFilters } from '../../lib/redux/leadFilterSlice';
import authenticatedAxiosInstance from '../../lib/AxiosInstance';

import { useCountUp } from '../../Pages/Reports/hook';

const Header = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [counts, setCounts] = useState({
    fresh: 0,
    backlog: 0,
    followup: 0,
  });

  const [freshLeadId, setFreshLeadId] = useState(null);

  const freshCount = useCountUp(counts.fresh);
  const followupCount = useCountUp(counts.followup);
  const backlogCount = useCountUp(counts.backlog);

  useEffect(() => {
    props.socket.emit('addUser', {
      userData: props?.userData,
      username: props?.userData?.username,
    });

    const fetchCounts = () => {
      authenticatedAxiosInstance({
        method: 'get',
        url: '/api/v1/common/dashboard',
      })
        .then((response) => {
          const data = response?.data?.data || [];

          const normalize = (str) => str?.toLowerCase().trim();

          const freshItem = data.find(
            (d) => normalize(d.name) === 'fresh lead'
          );

          const backlogItem = data.find(
            (d) => normalize(d.name) === 'backlog'
          );

          const followupItem = data.find(
            (d) => normalize(d.name) === 'followup'
          );

          setCounts({
            fresh: freshItem?.count || 0,
            backlog: backlogItem?.count || 0,
            followup: followupItem?.count || 0,
          });

          setFreshLeadId(response?.data?.fresh_lead_source_id);
        })
        .catch((err) =>
          console.error(
            'Error fetching dashboard counts for header:',
            err
          )
        );
    };

    fetchCounts();

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
    navigate('/follow-up');
  };

  const handleBacklogClick = () => {
    navigate('/follow-up', {
      state: { resetDate: 'EMPTY' },
    });
  };

  return (
    <header className="sticky top-0 z-50 min-h-[68px] border-b border-white/5 bg-[#111827]">
      <div className="flex min-h-[68px] items-center justify-between px-2 sm:px-3 md:px-6">

        {/* LEFT */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Mobile Menu */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-lg hover:bg-white/5 lg:hidden"
          >
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

        </div>

        {/* CENTER STATS */}
        <div className="flex flex-1 items-end justify-end gap-2 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-hide px-2 md:px-4 min-w-0">

          <button
            onClick={handleFreshClick}
            className="flex items-center gap-1 sm:gap-2 whitespace-nowrap text-[11px] sm:text-xs md:text-sm text-slate-300 hover:text-blue-400 transition-colors shrink-0"
          >
            <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0"></span>

            <span>Fresh Leads</span>

            <span className="font-semibold tabular-nums text-white">
              {freshCount}
            </span>
          </button>

          <button
            onClick={handleFollowupClick}
            className="flex items-center gap-1 sm:gap-2 whitespace-nowrap text-[11px] sm:text-xs md:text-sm text-slate-300 hover:text-rose-400 transition-colors shrink-0"
          >
            <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0"></span>

            <span>FollowUp</span>

            <span className="font-semibold tabular-nums text-white">
              {followupCount}
            </span>
          </button>

          <button
            onClick={handleBacklogClick}
            className="flex items-center gap-1 sm:gap-2 whitespace-nowrap text-[11px] sm:text-xs md:text-sm text-slate-300 hover:text-orange-400 transition-colors shrink-0"
          >
            <span className="h-2 w-2 rounded-full bg-orange-500 shrink-0"></span>

            <span>Backlog</span>

            <span className="font-semibold tabular-nums text-white">
              {backlogCount}
            </span>
          </button>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0 pl-2">

          {/* Notifications */}
          <div className="flex shrink-0 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-xl bg-[#1e293b] hover:bg-[#334155] transition-colors">
            <Notifications socket={props.socket} />
          </div>

          {/* Dark Mode */}
          <div className="flex shrink-0 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-xl bg-[#1e293b] hover:bg-[#334155] transition-colors">
            <DarkModeSwitcher />
          </div>

          {/* User */}
          <div className="shrink-0 rounded-xl bg-[#1e293b] px-2 sm:px-3 md:px-4 py-2.5 transition-colors hover:bg-[#334155]">
            <DropdownUser />
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;