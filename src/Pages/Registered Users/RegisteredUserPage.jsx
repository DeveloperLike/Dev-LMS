import React from "react";
import { Card, Tabs } from "antd";
import RegisteredUsers from "./RegisteredUsers";
import { PiUserSwitchFill } from "react-icons/pi";
import { TbPackageExport } from "react-icons/tb";
import ExportedRegisteredUser from "./ExportedRegisteredUser";

export const RegisteredUserPage = ({ mode }) => {
  const column = [
    {
      key: "1",
      label: "Registered Student",
      children: (
        <RegisteredUsers mode={mode} />
      ),
      icon: <PiUserSwitchFill className="inline-block" size={18} />,
    },
    {
      key: "2",
      label: "Exported Registered Users",
      children: (
        <ExportedRegisteredUser />
      ),
      icon: <TbPackageExport className="inline-block" size={18} />,
    }
  ];

  return (
    <div className="mt-4 mx-4 px-4 pb-4">
      <Tabs
        className="mt-4 overflow-hidden"
        defaultActiveKey="1"
        items={column.map((item) => ({
          key: item.key,
          label: item.label,
          children: item.children,
          icon: item.icon,
        }))}
      />
    </div>
  );
};
