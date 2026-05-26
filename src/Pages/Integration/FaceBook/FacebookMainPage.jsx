import React from "react";
import { TbListDetails } from "react-icons/tb";
import { Tabs } from "antd";
import { FaRegCircleCheck } from "react-icons/fa6";
import FaceBook from "./FaceBook";
import FacebookAdsAccount from "../FaceBookAdsAccount/FacebookAdsAccount";
import { FaFacebook } from "react-icons/fa";

const FacebookMainPage = () => {

  const column = [
    {
      key: "1",
      label: <strong>Facebook</strong>,
      children: (
        <FaceBook />
      ),
      icon: <FaFacebook className="inline-block" />,
    },
    {
      key: "2",
      label: <strong>Facebook Ad Account</strong>,
      children: (
        <FacebookAdsAccount />
      ),
      icon: <FaRegCircleCheck className="inline-block" />,
    },
  ];


  return (
    <>
      {/* <div className="mx-6 pb-5 bg-white px-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"> */}
      <div>
        <div className="relative">
          <Tabs
            className="mt-4 p-0"
            defaultActiveKey="1"
            items={column.map((item) => ({
              key: item.key,
              label: item.label,
              children: item.children,
              icon: item.icon,
            }))}
          />
        </div>
      </div>
    </>
  );
};

export default FacebookMainPage;
