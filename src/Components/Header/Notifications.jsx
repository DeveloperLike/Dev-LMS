import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClickOutside from "../ClickOutside";
import authenticatedAxiosInstance from "../../lib/AxiosInstance";
import { BellFilled, BellOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import { getProfileService } from '../../Pages/Profile/ApiService.js';
import NotificationSound from "../../assets/sound/CRMNotificationSound.mp3"
import { Drawer, Badge, Tabs } from "antd";


const audioFile = new Audio(NotificationSound)

function Notifications({ socket }) {
    const audioRef = useRef(audioFile);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationData, setNotificationData] = useState([])
    const [isRinging, setIsRinging] = useState(false)
    const [user, setUser] = useState(null)
    const [drawerOpen, setDrawerOpen] = useState(false);

    const getNotifications = async () => {

        const getUserData = await getProfileService();
        setUser(getUserData?.data?.data)

        authenticatedAxiosInstance({
            method: "POST",
            url: "/api/v1/common/get-notification-data",
            data: JSON.stringify({ "assign_to": getUserData?.data?.data?.username, "limit": 100, "skip": 0 })
        }).then((response) => {
            // console.log(response)
            if (response.status === 200) {
                // console.log(response.data)
                setNotificationData(response.data)
            } else {
                console.log("Unable to fetch notification")
            }
        });
    }
    const markNotificationSeen = async (uid) => {
        authenticatedAxiosInstance({
            method: "POST",
            url: "/api/v1/common/mark-notification-seen",
            data: JSON.stringify({ "uid": uid })
        }).then((response) => {
            // console.log(response)
            if (response.status === 200) {
                // console.log(response.data)
                getNotifications()
            } else {
                console.log("Unable to mark seen.")
            }
        });
    }

    useEffect(() => {

        getNotifications()
        // console.log(socket)

        // socket.on("YouAreOnline", (data) => {
        //     console.log(data)
        // })

        socket.on("notificationArrived", (data) => {
            // console.log(data)
            setIsRinging(true)

            socket.on("notificationArrived", (data) => {
                // console.log(data)

                const audio = audioRef.current;
                if (!audio) return;

                const playPromise = audio.play();

                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            // playing OK
                        })
                        .catch((err) => {
                            console.warn('Playback blocked', err);
                            // optionally show a "Tap to enable sound" UI
                        });
                }


            })


            getNotifications()
        })

        socket.onAny((event, data) => {
            console.log("EVENT:", event, data);
        });

        return () => {
            socket.off();
        };
    }, []);


    useEffect(() => {
        // console.log("currently changed notifications:", notificationData)
    }, [notificationData])

    // const dummyNotifications = Array.from({ length: 15 }, (_, i) => ({
    //     id: i + 1,
    //     assign_to: "fab098ff-56c7-4e7b-87b2-7a28eeaac9d1", // MUST match user.username
    //     // notification_type: "leadAssigned",
    //     notification_type: "followup",
    //     lead_id: `LEAD-${1000 + i}`,
    //     created_at: new Date(Date.now() - i * 60000), // 1 min gap
    // }));

    // useEffect(() => {
    //     // FORCE TEST DATA
    //     setUser({
    //         username: "fab098ff-56c7-4e7b-87b2-7a28eeaac9d1"
    //     });

    //     setNotificationData(dummyNotifications);
    // }, []);


    // const unreadNotifications = notificationData.filter(
    //     (noti) =>
    //         noti.assign_to === user?.username && !noti.is_read
    // );

    // const readNotifications = notificationData.filter(
    //     (noti) =>
    //         noti.assign_to === user?.username && noti.is_read
    // );


    return (
        <>
            <Badge>
                <span
                    className={`cursor-pointer text-xl text-white ${isRinging ? "animatedBell" : ""}`}
                    onClick={() => {
                        setDrawerOpen(true);
                        setIsRinging(false);
                    }}
                >
                    <BellOutlined />
                </span>
            </Badge>

            {/* <!-- Dropdown Start --> */}

            <Drawer
                title="Notifications"
                placement="right"
                width={420}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <div className="sticky">
                    <Tabs
                        defaultActiveKey="unread"
                        items={[
                            {
                                key: "unread",
                                label: `Unread `,
                                children: (
                                    <div className="space-y-2 mt-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
                                        {notificationData.length > 0 ? (
                                            notificationData.filter((noti) => { return noti.seen === false }).map((notify, key) => (
                                                <div
                                                    key={key}
                                                    className={`p-3 rounded-lg cursor-pointer transition ${notify.notification_type?.toLowerCase().includes("lead")
                                                        ? "bg-yellow-200 hover:bg-yellow-300 text-yellow-900 dark:bg-black dark:hover:bg-blue-900 dark:text-yellow-500"
                                                        : notify.notification_type?.toLowerCase().includes("follow")
                                                            ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 dark:bg-black dark:hover:bg-blue-900 dark:text-yellow-200"
                                                            : "bg-white hover:bg-gray-50 text-gray-900 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-white"
                                                        }
                                                     `}
                                                    onClick={(e) => { markNotificationSeen(notify.uid) }}
                                                >
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-sm font-semibold truncate">
                                                            {notify.notification_type}
                                                        </span>

                                                        <span className="text-xs text-gray-700 dark:text-gray-300">
                                                            {dayjs(notify.created_at).format("DD MMM, hh:mma")}
                                                        </span>
                                                    </div>

                                                    <p className="text-sm truncate">
                                                        Lead Id:{" "}
                                                        <Link
                                                            to={`/view-lead/${notify.lead_id}`}
                                                            className="text-blue-600 hover:underline dark:text-blue-400"
                                                            onClick={() => setDrawerOpen(false)}
                                                        >
                                                            {notify.lead_id}
                                                        </Link>
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-400 mt-6">
                                                No unread notifications
                                            </div>
                                        )}
                                    </div>
                                ),
                            },
                            {
                                key: "read",
                                label: `Read `,
                                children: (
                                    <div className="space-y-2 mt-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
                                        {notificationData.length > 0 ? (
                                            notificationData.filter((noti) => { return noti.seen === true }).map((notify, key) => (
                                                <div
                                                    key={key}
                                                    className={`p-3 rounded-lg cursor-pointer transition ${notify.notification_type?.toLowerCase().includes("lead")
                                                        ? "bg-yellow-200 hover:bg-yellow-300 text-yellow-900 dark:bg-black dark:hover:bg-blue-900 dark:text-yellow-500"
                                                        : notify.notification_type?.toLowerCase().includes("follow")
                                                            ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 dark:bg-black dark:hover:bg-blue-900 dark:text-yellow-200"
                                                            : "bg-white hover:bg-gray-50 text-gray-900 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-white"
                                                        }
                                                    `}
                                                >
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-sm font-semibold truncate">
                                                            {notify.notification_type}
                                                        </span>

                                                        <span className="text-xs text-gray-700 dark:text-gray-300">
                                                            {dayjs(notify.created_at).format("DD MMM, hh:mma")}
                                                        </span>
                                                    </div>


                                                    <p className="text-sm truncate">
                                                        Lead Id:{" "}
                                                        <Link
                                                            to={`/view-lead/${notify.lead_id}`}
                                                            className="text-blue-600 hover:underline dark:text-blue-400"
                                                            onClick={() => setDrawerOpen(false)}
                                                        >
                                                            {notify.lead_id}
                                                        </Link>
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-400 mt-6">
                                                No read notifications
                                            </div>
                                        )}
                                    </div>
                                ),
                            },
                        ]}
                        onChange={() => { getNotifications() }}
                    />
                </div>
            </Drawer>



            {/* <!-- Dropdown End --> */}
        </>
    );
};

export default Notifications