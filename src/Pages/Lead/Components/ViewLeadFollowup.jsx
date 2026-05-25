import { Grid, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { patchFollowupService } from "../../My Followup/ApiService";

export const ViewLeadFollowup = ({
  followupData,
  followUpModalOpenFunction,
  leadFollowupList,
  leadFollowupListGetApi,
}) => {
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  useEffect(() => {
    leadFollowupListGetApi();
  }, []);

  let columns = [
    {
      title: "Followup Time",
      fixed: screens?.md ? "left" : false,
      dataIndex: "datetime",
      key: "datetime",
      width: "15%",
      minWidth: "200px",
      render: (text, record) => <p className="font-semibold text-black hover:text-orange-500">{text}</p>,
    },
    {
      title: "Created By",
      dataIndex: "user_name",
      key: "user_name",
      width: "15%",
      render: (text, record) => (
        <p className="font-medium hover:text-orange-500">{text}</p>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remark",
      key: "remark",
      width: "30%",
      render: (text, record) => (
        <p className="font-medium hover:text-orange-500 whitespace-pre-wrap">{text}</p>
      ),
    },
    {
      title: "Created On",
      dataIndex: "created_at",
      key: "created_at",
      width: "15%",
      minWidth: "200px",
      render: (text, record) => <p className="hover:text-orange-500">{text ? text : "-"}</p>,
    },
    {
      title: "Completed On",
      dataIndex: "updated_at",
      key: "updated_at",
      width: "15%",
      minWidth: "200px",
      render: (text, record) => <p className="hover:text-orange-500">{text ? text : "-"}</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "10%",
      minWidth: "100px",
      render: (text, record) => (
        <p>
          {text === true ? (
            <p className="bg-success text-success inline-flex bg-opacity-10 rounded-full  py-1 px-3 text-sm font-medium">
              Done
            </p>
          ) : (
            <p className="bg-danger text-danger inline-flex rounded-full bg-opacity-10  py-1 px-3 text-sm font-medium">
              Pending
            </p>
          )}
        </p>
      ),
    },
  ];
  return (
    <>
      <div className="pt-2">
        {/* <PrimaryButton
          title="Add Followup"
          type={"primary"}
          onClick={followUpModalOpenFunction}
          className="py-3 float-end"
        /> */}
        <br />
        <Table
          columns={columns}
          dataSource={leadFollowupList}
          pagination={false}
          scroll={{ x: "max-content" }}
        />
      </div>
    </>
  );
};
