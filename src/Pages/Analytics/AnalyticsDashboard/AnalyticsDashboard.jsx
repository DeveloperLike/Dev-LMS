import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { MdKeyboardArrowRight } from "react-icons/md";
import { BsBank2 } from "react-icons/bs";
import { FaCity, FaUserFriends } from "react-icons/fa";
import { GoPackage } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import authenticatedAxiosInstance from "../../../lib/AxiosInstance";
import LoadSkeleton from "../../../Components/CustomComponents/Skeleton";
import FunnelAnalytics from "../FunnelAnalytics";
import { IoMdAnalytics } from "react-icons/io";

const cardStyles = [
  "bg-orange-500",
  "bg-red-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-teal-500",
  "bg-indigo-500",
];

const icons = {
  city: <FaCity size={30} color="white" />,
  state: <FaCity size={30} color="white" />,
  lead: <FaUserFriends size={30} color="white" />,
  branch: <BsBank2 size={30} color="white" />,
  package: <GoPackage size={30} color="white" />,
  users: <FaUserFriends size={30} color="white" />,
};

export const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const getDashboardListService = () => {
    return authenticatedAxiosInstance({
      method: "get",
      url: "/api/v1/lead-management/lead-analytics",
    });
  };

  const GetDashboardApi = () => {
    getDashboardListService().then((response) => {
      setData(response.data.data);
    });
  };

  useEffect(() => {
    GetDashboardApi();
  }, []);

  const getRandomStyle = (index) => cardStyles[index % cardStyles.length];

  const getIcon = (name) => icons[name] || null;

  return (
    <>
      <div className="px-4">
        <div className="flex justify-center md:justify-normal flex-wrap gap-6 m-auto w-full max-w-[1100px]">
          {data === null ? (
            <LoadSkeleton />
          ) : (
            data.map((item, index) => {
              return (
                <div key={index} className="w-64">
                  <Card
                    onClick={() =>
                      item.name === "city"
                        ? navigate("/city")
                        : item.name === "state"
                        ? navigate("/state")
                        : item.name === "lead"
                        ? navigate("/lead")
                        : item.name === "branch"
                        ? navigate("/branch")
                        : item.name === "package"
                        ? navigate("/package")
                        : item.name === "users"
                        ? navigate("/users")
                        : ""
                    }
                    className={`p-0 w-full cursor-pointer ${getRandomStyle(
                      index
                    )}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-lg text-white capitalize">
                          {item.name}
                        </p>
                        <p className="text-white flex items-center">
                         <p className="" > {item.lead_type}: &nbsp; </p> {item.count}{" "}
                          <MdKeyboardArrowRight size={25} />
                        </p>
                      </div>

                      <IoMdAnalytics size={35} color="white" />
                    </div>
                  </Card>
                </div>
              );
            })
          )}
        </div>
        <br />
        <div className="max-h-[200px]">
          <Card>
            <FunnelAnalytics />
          </Card>
        </div>
      </div>
    </>
  );
};