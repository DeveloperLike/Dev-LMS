import React from 'react';
import { Table } from 'antd';
import { IoMdClose } from 'react-icons/io';
import { FaCheck } from 'react-icons/fa';

const PackageTable = ({ selectInputs, formData, handleSelectInput }) => {
  // console.log(formData.permissions, 'formData');

  const columns = [
    {
      title: 'Sections',
      dataIndex: 'name',
      key: 'name',
    },
    {
      align: 'center',
      title: 'No Access',
      dataIndex: 'access_granted',
      key: 'no_access',
      render: (access_granted, sectionObject) => {
        const sectionCode = sectionObject.code;
        const isAccessGranted = formData['permissions'][sectionCode]?.access_granted;

        if (isAccessGranted === false) {
          return (
            <FaCheck
              onClick={() => handleSelectInput(sectionCode, true)}
              className="text-green-500 mt-2 mx-auto"
            />
          );
        } else {
          return (
            <IoMdClose
              className="text-danger text-2xl m-auto"
              onClick={() => handleSelectInput(sectionCode, false)}
            />
          );
        }
      },
    },
    {
      align: 'center',
      title: 'Grant',
      dataIndex: 'access_granted',
      key: 'grant', 
      render: (access_granted, sectionObject) => {
        const sectionCode = sectionObject.code;
        const isAccessGranted = formData['permissions'][sectionCode]?.access_granted;

        if (isAccessGranted === true) {
          return (
            <FaCheck
              onClick={() => handleSelectInput(sectionCode, false)}
              className="text-green-500 mt-2 mx-auto"
            />
          );
        } else {
          return (
            <IoMdClose
              className="text-danger text-2xl m-auto"
              onClick={() => handleSelectInput(sectionCode, true)}
            />
          );
        }
      },
    },
  ];

  return (
    <Table
      bordered
      rowKey="id" 
      columns={columns}
      dataSource={selectInputs}
      pagination={{ hideOnSinglePage: true }}
      scroll={{ x: "max-content" }}
    />
  );
};

export default PackageTable;