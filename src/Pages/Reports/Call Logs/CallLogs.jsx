import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Modal } from "antd";
import { PAGESIZE } from "../../../lib/Constants";
import TableWithPagination from "../../../Components/CustomComponents/Table";
import { useSelector } from "react-redux";
import { IoRecordingSharp } from "react-icons/io5";
import ReactAudioPlayer from "react-audio-player";
import { getCallLogService } from "../ApiService";
import { GetColumnSearchProps } from "../../../Components/CustomComponents/TableColumnSearch";

const CallLogs = () => {
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [tableLoading, setTableLoading] = useState(false);
  const [callLogsData, setCallLogsData] = useState();
  const [callRecording, setCallRecording] = useState();
  const [callRecordingModal, setCallRecordingModal] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});
  const leadModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  let columns = [
    {
      title: "Lead Email",
      fixed: screens?.md ? "left" : false,
      dataIndex: "lead_email",
      key: "lead_email",
      minWidth: "150px",
      render: (text, record) => (
        <>
          {/* <NavLink> */}
          <p className="font-medium">{text}</p>
          {/* </NavLink> */}
        </>
      ),
    },
    {
      title: "Lead Name",
      dataIndex: "lead_name",
      key: "lead_name",
      minWidth: "120px",
      render: (text, record) => (
        <>
          {/* <NavLink>
           <p className="font-medium hover:text-orange-500"> */}
          {text}
          {/* </p>
         </NavLink> */}
        </>
      ),
    },
    {
      title: "Agent Mail ID",
      dataIndex: "agent_mail_id",
      key: "agent_mail_id",
      minWidth: "120px",
      ...GetColumnSearchProps("agent_mail_id", setSearchState, searchState),
      render: (text, record) => (
        <>
          {/* <NavLink>
           <p className="font-medium hover:text-orange-500"> */}
          {text}
          {/* </p>
         </NavLink> */}
        </>
      ),
    },
    {
      title: "Call Date and Time",
      dataIndex: "datetime",
      key: "datetime",
      minWidth: "190px",
      ...GetColumnSearchProps("datetime", setSearchState, searchState),
      render: (text, record) => (
        <>
          {/* <NavLink>
           <p className="font-medium hover:text-orange-500"> */}
          {text}
          {/* </p>
         </NavLink> */}
        </>
      ),
    },
    {
      title: "Call Type",
      dataIndex: "call_type",
      key: "call_type",
      minWidth: "110px",
      ...GetColumnSearchProps("call_type", setSearchState, searchState),
      render: (text, record) => (
        <>
          {/* <NavLink>
           <p className="font-medium hover:text-orange-500"> */}
          {text === "outbound" ? "Outbound" : "Inbound"}

          {/* </p>
         </NavLink> */}
        </>
      ),
    },
    {
      title: "Call Status",
      dataIndex: "call_status",
      key: "call_status",
      minWidth: "130px",
      ...GetColumnSearchProps("call_status", setSearchState, searchState),
      render: (text, record) => (
        <>
          {/* <NavLink>
           <p className="font-medium hover:text-orange-500"> */}
          {text}
          {/* </p>
         </NavLink> */}
        </>
      ),
    },
    {
      title: "Call Disconnected by",
      dataIndex: "call_disconnected_by",
      key: "call_disconnected_by",
      minWidth: "190px",
      ...GetColumnSearchProps(
        "call_disconnected_by",
        setSearchState,
        searchState
      ),
      render: (text, record) => <>{text}</>,
    },
    {
      title: "Call Duration",
      dataIndex: "call_duration",
      key: "call_duration",
      minWidth: "120px",
      render: (text, record) => <>{text}</>,
    },
    {
      title: "Talk Time",
      dataIndex: "talk_time",
      key: "talk_time",
      minWidth: "100px",
      render: (text, record) => <>{text}</>,
    },

    {
      title: "Call Recording",
      dataIndex: "call_recording",
      key: "call_recording",
      minWidth: "130px",
      render: (data, record) => (
        <IoRecordingSharp
          className="justify-self-center "
          onClick={() => {
            setCallRecording(data);
            setCallRecordingModal(true);
          }}
        />
      ),
    },
  ];

  const getCallLogsApi = () => {
    setTableLoading(true);

    getCallLogService({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    }).then((response) => {
      setCallLogsData(response.data.data);
      setData(response.data);
    })
      .catch(() => {
        // optional error handling
      })
      .finally(() => {
        setTableLoading(false);
      });
  };

  useEffect(getCallLogsApi, [
    page,
    searchState,
    leadModulePermission.lead_management,
    pageSize,
  ]);

  return (
    <>
      {/* Call recording modal */}
      <Modal
        title="Call Recording"
        open={callRecordingModal}
        footer={null}
        onCancel={() => setCallRecordingModal(false)}
        width={500}
      >
        <ReactAudioPlayer src={callRecording} controls />
      </Modal>
      {/* Call recording modal */}

      <div className="mx-6 flex items-center justify-between mb-3">
        <div>
          <h1 className="dark:text-yellow-500 text-black font-semibold flex items-center gap-2 justify-self-start text-lg rounded">
            Call Logs
          </h1>
        </div>
      </div>

      <TableWithPagination
        loading={tableLoading}
        pageSize={pageSize}
        setPageSize={setPageSize}
        tableData={callLogsData}
        rowHoverable={false}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
      />
    </>
  );
};

export default CallLogs;
