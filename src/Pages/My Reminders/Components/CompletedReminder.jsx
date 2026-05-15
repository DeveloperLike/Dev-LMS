import React, { useEffect, useState } from "react";
import { message, Pagination, Table, Tabs } from "antd";
import { NavLink } from "react-router-dom";
import { reminderPostService } from "../ApiService";
import { PAGESIZE } from "../../../lib/Constants";
import LoadSkeleton from "../../../Components/CustomComponents/Skeleton";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { GetColumnSearchProps } from "../../../Components/CustomComponents/TableColumnSearch";

const CompletedReminder = ({ dateRange, dateFormat, mode }) => {
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [reminderData, setReminderData] = useState();
  const [data, setData] = useState({});
  const [page, setPage] = useState(1);
  const [searchState, setSearchState] = useState({});
  const [reminderparam, setReminderparam] = useState("lead");

  const onShowSizeChange = (current, newPageSize) => {
    setPageSize(newPageSize);
    setPage(1, newPageSize);
  };

  // Function to handle tab changes
  const handleTabChange = (key) => {
    setReminderparam(key);
    setPage(1);
  };

  let columns = [
    {
      title: "Email",
      dataIndex: "lead",
      key: "lead",
      width: "20%",
      ...GetColumnSearchProps("lead", setSearchState, searchState),
      render: (text, record) =>
        record.lead_id ? (
          <NavLink to={`/view-lead/${record.lead_id}`}>
            <p className="font-medium hover:text-orange-500">
              {text === null ? "-" : text}
            </p>
          </NavLink>
        ) : (
          <p className="font-medium">{text === null ? "-" : text}</p>
        ),
    },
    {
      title: "Registered User",
      dataIndex: "register_user",
      key: "register_user",
      width: "20%",
      ...GetColumnSearchProps("register_user", setSearchState, searchState),
      render: (text, record) =>
        record.lead_id ? (
          <NavLink to={`/view-lead/${record.lead_id}`}>
            <p className=" hover:text-orange-500">
              {text === null ? "-" : text}
            </p>
          </NavLink>
        ) : (
          <p>{text === null ? "-" : text}</p>
        ),
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      width: "20%",
      render: (text, record) =>
        record.lead_id ? (
          <NavLink to={`/view-lead/${record.lead_id}`}>
            <p className=" hover:text-orange-500">
              {text === null ? "-" : text}
            </p>
          </NavLink>
        ) : (
          <p>{text === null ? "-" : text}</p>
        ),
    },
    {
      title: "Date",
      dataIndex: "datetime",
      key: "date",
      width: "20%",
      render: (text, record) =>
        record.lead_id ? (
          <NavLink to={`/view-lead/${record.lead_id}`}>
            <p className=" hover:text-orange-500">
              {text === null ? "-" : text}
            </p>
          </NavLink>
        ) : (
          <p>{text === null ? "-" : text}</p>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (text, record) => (
        <>
          <p
            className={`inline-flex py-1 px-3 bg-opacity-10 rounded-full text-sm font-medium ${text === true
              ? "bg-success text-success    "
              : "bg-danger text-danger "
              }`}
          >
            {text === true ? "Done" : "Pending"}
          </p>
        </>
      ),
    },
  ];

  const getReminderApi = () => {
    const payload = {
      type: "done",
      start_date: dateRange && dateRange[0].format(dateFormat),
      end_date: dateRange && dateRange[1].format(dateFormat),
    };
    reminderPostService(
      payload,
      {
        ...searchState,
        current_page_number: page,
        count_per_page: pageSize,
      },
      reminderparam
    )
      .then((response) => {
        setReminderData(response.data.data);
        setData(response.data);
        // message.success(response?.data?.message);
      })
      .catch(function (error) {
        if (error.response) {
          // handleError(error?.response?.data?.data);
          message.error(error?.response?.data?.message);
        }
      });
  };

  useEffect(getReminderApi, [
    page,
    searchState,
    dateRange,
    reminderparam,
    pageSize,
  ]);

  return (
    <>
      <div className="w-full flex justify-between">
        {/* <div className="flex gap-3">
          <PrimaryButton
            type="primary"
            className="p-2 float-end my-2 "
            title={"Lead"}
            block={false}
            onClick={() => setReminderparam("lead")}
          />
          <PrimaryButton
            type="primary"
            className="p-2 float-end my-2 "
            title={"Registered User"}
            block={false}
            onClick={() => setReminderparam("register_user")}
          />
          <PrimaryButton
            type="primary"
            className="p-2 float-end my-2 "
            title={"Self"}
            block={false}
            onClick={() => setReminderparam("self")}
          />
        </div> */}
        <Tabs defaultActiveKey="lead" onChange={handleTabChange}>
          <Tabs.TabPane
            tab={<span className={` text-slate-400`}>Lead</span>}
            key="lead"
          />
          <Tabs.TabPane
            tab={<span className={` text-slate-400`}>Registered User</span>}
            key="register_user"
          />
          <Tabs.TabPane
            tab={<span className={` text-slate-400`}>Self</span>}
            key="self"
          />
        </Tabs>
      </div>

      {reminderData === undefined || reminderData === null ? (
        <LoadSkeleton />
      ) : (
        reminderData && (
          <Table
            columns={columns.map((col) => ({
              ...col,
              className: "whitespace-nowrap",
            }))}
            scroll={{ x: "max-content" }}
            dataSource={reminderData}
            pagination={false}
            className="mt-4"
          />
        )
      )}

      <div className="flex justify-between items-center mt-4">
        <Pagination
          current={page}
          total={data.data_count}
          size="small"
          showQuickJumper
          pageSize={pageSize}
          responsive
          onChange={(page) => {
            setPage(page);
          }}
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
        />
        <div className="text-sm text-black">
          {data.current_page_data_count} of {data.data_count} records
        </div>

      </div>
    </>
  );
};

export default CompletedReminder;
