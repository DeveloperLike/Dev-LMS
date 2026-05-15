import React from "react";
import { Table } from "antd";
import { IoMdClose } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";

const RollTable = ({ selectInputs, formData, handleSelectInput }) => {
  console.log(formData.permissions, "formData");
  console.log(selectInputs);

  const columns = [
    {
      title: "Permissions",
      dataIndex: "name",
      key: "name",
    },
    {
      align: "center",
      title: "No Access",
      dataIndex: "code",
      key: "code",
      render: (code, sectionObject) => {
        // const permissionValue = formData['permissions'][code]?.value;

        const permissionCode = sectionObject.code;

        // const permissionValue = formData['permissions'][permissionCode]?.permission;
        const permissionValue =
          formData?.permissions?.[permissionCode]?.permission || "no_access";

        if (permissionValue === "no_access") {
          return (
            <FaCheck
              onClick={() => {
                handleSelectInput(code, "no_access");
              }}
              className="text-green-500 mt-2 mx-auto"
            />
          );
        } else {
          return (
            <IoMdClose
              className="text-danger text-2xl m-auto"
              onClick={() => {
                handleSelectInput(code, "no_access");
              }}
            />
          );
        }
      },
    },
    {
      align: "center",
      title: "View",
      dataIndex: "code",
      key: "code",
      render: (code, sectionObject) => {
        // const permissionValue = formData['permissions'][code]?.value;
        const permissionCode = sectionObject.code;
        // console.log(permissionCode,'permissionCode')
        const permissionValue =
          formData["permissions"][permissionCode]?.permission;

        if (permissionValue === "view") {
          return (
            <FaCheck
              onClick={() => {
                handleSelectInput(code, "no_access");
              }}
              className="text-green-500 mt-2 mx-auto"
            />
          );
        } else {
          return (
            <IoMdClose
              className="text-danger text-2xl m-auto"
              onClick={() => {
                handleSelectInput(code, "view");
              }}
            />
          );
        }
      },
    },
    {
      align: "center",
      title: "Edit",
      dataIndex: "code",
      key: "code",
      render: (code, sectionObject) => {
        // const permissionValue = formData['permissions'][code]?.value;
        const permissionCode = sectionObject.code;
        // console.log(permissionCode,'permissionCode')
        const permissionValue =
          formData["permissions"][permissionCode]?.permission;
        if (permissionValue === "edit") {
          return (
            <FaCheck
              onClick={() => {
                handleSelectInput(code, "view");
              }}
              className="text-green-500 mt-2 mx-auto"
            />
          );
        } else {
          return (
            <IoMdClose
              className="text-danger text-2xl m-auto"
              onClick={() => {
                handleSelectInput(code, "edit");
              }}
            />
          );
        }
      },
    },
  ];

  return (
    <Table
      bordered
      rowHoverable={false}
      columns={columns.map((col) => ({
        ...col,
        className: "whitespace-nowrap",
      }))}
      scroll={{ x: "max-content" }}
      dataSource={selectInputs}
      pagination={false}
    />
  );
};
export default RollTable;
