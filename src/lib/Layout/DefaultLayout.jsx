import { useState, useEffect, useRef } from 'react';
import Header from '../../Components/Header/Index';
import Sidebar from '../../Components/Sidebar/Index';
import { notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { notificationFun } from '../redux/NotificationSlice';
import { permissionsData } from '../redux/UserPermission';
import authenticatedAxiosInstance from '../AxiosInstance';
import axios from "axios";
import { io } from "socket.io-client";
import { baseurl } from '../Constants';

const data = {
  branch_management: 'no_access',
  city_management: 'edit',
  lead_form_management: 'edit',
  lead_management: 'edit',
  role_management: 'edit',
  state_management: 'edit',
  template_management: 'edit',
  staff_management: 'edit',
  package_management: 'edit'
};

const DefaultLayout = ({ children }) => {

  const socket = useRef(null);

useEffect(() => {

  socket.current = io(window.location.origin, {
    path: "/socket.io/",
    transports: ["websocket"],
    auth: {
      token: localStorage.getItem("token"),
    },
    autoConnect: true,
  });

  return () => {
    if (socket.current) {
      socket.current.disconnect();
    }
  };

}, []);


  const [userData, setUserData] = useState(null)


  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userPermission, setPermission] = useState(data);
  const [api, contextHolder] = notification.useNotification();

  const messageObject = useSelector((state) => state.toastName);

  const dispatch = useDispatch();
  const usedispatch = useDispatch();

  useEffect(() => {
    if (messageObject.message != '') {
      if (messageObject.messageType === 'success') {
        api.success(messageObject);
      } else {
        api.error(messageObject);
      }
      dispatch(
        notificationFun({
          message: '',
          description: '',
          messageType: 'success',
        }),
      );
    }
  }, [messageObject.message]);



  useEffect(() => {
    // usedispatch(permissionsData(userPermission));
  }, []);



  const getUserNow = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        `${baseurl}/api/v1/user-management/profile`,
        {
          headers: {
            "Authorization": `Token ${token}`,
          },
        }
      );

      console.log('profile', data.data);
      setUserData(data.data)
      dispatch(permissionsData(data.data));

    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    authenticatedAxiosInstance({
      method: 'get',
      url: `api/v1/role-management/permissions`,
    }).then((response) => {
      if (response.data.success === '1') {
        setPermission(response.data.data)
        // console.log(response.data.data);
        dispatch(permissionsData(response.data.data));
      }
    });

    // Fetch and sync global Google Integration settings
    authenticatedAxiosInstance({
      method: 'get',
      url: `google/settings`,
    }).then((response) => {
      if (response.data.success && response.data.data) {
        const { ga_property_id, gsc_site, is_linked } = response.data.data;
        if (ga_property_id) {
          localStorage.setItem("google_property_id", ga_property_id);
        }
        if (gsc_site) {
          localStorage.setItem("google_gsc_site", gsc_site);
        }
        if (is_linked) {
          if (!localStorage.getItem("google_access_token")) {
            localStorage.setItem("google_access_token", "central_linked");
          }
        }
      }
    }).catch((err) => {
      console.warn("Failed to fetch global Google settings:", err.message);
    });

    getUserNow()
  }, []);

  return (
    <>
      {contextHolder}
      <div className="dark:bg-boxdark-2 dark:text-bodydark" >
        {/* <!-- ===== Page Wrapper Start ===== --> */}
        <div className="flex h-screen overflow-hidden">
          {/* <!-- ===== Sidebar Start ===== --> */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Sidebar End ===== --> */}

          {/* <!-- ===== Content Area Start ===== --> */}
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {/* <!-- ===== Header Start ===== --> */}
            {
              userData &&
              <Header
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                socket={socket.current}
                userData={userData}
              />
            }
            {/* <!-- ===== Header End ===== --> */}

            {/* <!-- ===== Main Content Start ===== --> */}
            <main>
              <div className="mx-auto max-w-screen-2xl px-0 py-3 " >
                {children}
              </div>
            </main>
            {/* <!-- ===== Main Content End ===== --> */}
          </div>
          {/* <!-- ===== Content Area End ===== --> */}
        </div>
        {/* <!-- ===== Page Wrapper End ===== --> */}
      </div>
    </>
  );
};

export default DefaultLayout;
