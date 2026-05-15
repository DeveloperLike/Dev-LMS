import { useEffect } from 'react';
import DropdownUser from './DropdownUser';
import Notifications from './Notifications';
import DarkModeSwitcher from './DarkModeSwitcher';

const Header = (props) => {

  useEffect(() => {
    // console.log(props.userData)
    props.socket.emit("addUser", {
      userData: props?.userData,
      username: props?.userData?.username,
    });
  }, [])
  return (
    <header className="sticky top-0 z-999 flex w-full bg-black drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center px-2 py-3 shadow-2 md:px-6 2xl:px-11">

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
