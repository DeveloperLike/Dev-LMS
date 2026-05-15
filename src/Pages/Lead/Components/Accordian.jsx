import React, { useState } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse, Modal, Table, theme } from "antd";
import { FaDotCircle, FaFolder, FaUserAlt } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { VscSymbolField } from "react-icons/vsc";
import { MdDescription } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import { BiSolidTimeFive } from "react-icons/bi";
import ReactAudioPlayer from "react-audio-player";
import { IoRecordingSharp } from "react-icons/io5";

export const Accordian = ({ activityList }) => {
  const { token } = theme.useToken();

  const panelStyle = {
    marginBottom: 24,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  const getItems = (panelStyle) =>
    activityList.map((item, index) => {
      return {
        key: index,
        label: <AccordianLabel datetime={item.date} />,
        children: <AccordianDescription items={item.activity_report} />,
        style: panelStyle,
      };
    });

  return (
    <Collapse
      bordered={false}
      expandIconPosition="end"
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
      style={{ background: token.colorBgContainer }}
      items={getItems(panelStyle)}
    />
  );
};

const AccordianLabel = ({ datetime }) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <FaDotCircle className="text-slate-400" />
        <div className="bg-slate-50 w-full p-2 rounded">{datetime}</div>
      </div>
    </>
  );
};

const AccordianDescription = ({ items }) => {
  const [isExpanded, setIsExpanded] = useState({});

  const toggleTable = (index) => {
    setIsExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const columns = [
    {
      title: "Field Name",
      dataIndex: "field_name",
      key: "field_name",
      render: (text, record) => (
        <p onClick={() => showDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Old Data",
      dataIndex: "old_data",
      key: "old_data",
      render: (text, record) => (
        <p onClick={() => showDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "New Data",
      dataIndex: "new_data",
      key: "new_data",
      render: (text, record) => (
        <p onClick={() => showDrawer(record.id)}>{text}</p>
      ),
    },
    // {
    //   title: "Time",
    //   dataIndex: "time",
    //   key: "time",
    //   render: (text, record) => (
    //     <p onClick={() => showDrawer(record.id)}>{text}</p>
    //   ),
    // },
  ];

  return (
    <>
      {items.map((data, index) => {
        const panelKey = `panel-${index}`;
        return (
          <div className="flex gap-6" key={panelKey}>
            <div className="w-[2px] bg-slate-200 mt-[-1rem] flex flex-col items-center pt-5 ml-[0.3rem]">
              <div className="rounded-full w-6 h-6 bg-blue-100 flex items-center justify-center">
                <FaBell />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex gap-2 items-start mt-2">
                <div className="">
                  <FaUserAlt size={15} className="text-slate-500" />
                </div>
                <div>
                  <p> {data.changed_by}</p>
                </div>
              </div>

              <div className="flex gap-2 items-start">
                <div className="mt-1">
                  <VscSymbolField
                    size={20}
                    className="text-slate-500 font-bold"
                  />
                </div>
                <div>{data.purpose} </div>
              </div>

              <div className="flex gap-2 items-start mt-2">
                <div className="">
                  <MdDescription size={20} className="text-slate-500" />
                </div>
                <div>
                  <p> {data.description}</p>
                </div>
              </div>

              <div className="flex gap-2 items-start mt-2">
                <div className="">
                  <BiSolidTimeFive size={20} className="text-slate-500" />
                </div>
                <div>
                  <p> {data.time}</p>
                </div>
              </div>

              {Array.isArray(data?.data) &&
                (data?.data.length > 0 || data?.call_logs.length > 0) && (
                  <div className="flex gap-2 items-start mt-2">
                    <div>
                      <TbListDetails size={20} className="text-slate-500" />
                    </div>

                    <div className="">
                      <p
                        onClick={() => toggleTable(index)}
                        className="underline cursor-pointer"
                      >
                        {" "}
                        Show More Details
                      </p>
                    </div>
                  </div>
                )}

              {isExpanded[index] && (
                <>
                  {data.data && data?.data.length > 0 && (
                    <Table
                      footer={null}
                      rowHoverable={false}
                      columns={columns}
                      dataSource={data.data}
                      pagination={false}
                      bordered
                      className="mt-4"
                      scroll={{ x: "max-content" }}
                    />
                  )}
                  {data?.call_logs.length > 0 && <CallLogTable data={data} />}
                </>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

// columnsCalllogs start from here

const CallLogTable = ({ data }) => {
  const [callRecording, setCallRecording] = useState();
  const [callRecordingModal, setCallRecordingModal] = useState(false);

  // call logs Table start from here
  const columnsCalllogs = [
    {
      title: "Call Status",
      dataIndex: "call_status",
      key: "call_status",
      render: (text, record) => <p>{text}</p>,
    },
    {
      title: "Call Duration",
      dataIndex: "duration",
      key: "duration",
      render: (text, record) => <p>{text}</p>,
    },
    {
      title: "Call Recording",
      dataIndex: "call_recording",
      key: "call_recording",
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
    {
      title: "Call Disconnected by",
      dataIndex: "disconnected_by",
      key: "disconnected_by",
      render: (text, record) => <p>{text}</p>,
    },
  ];
  // call logs table close from here

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
      <Table
        footer={null}
        rowHoverable={false}
        columns={columnsCalllogs}
        dataSource={data.call_logs}
        pagination={false}
        bordered
        className="mt-4"
        scroll={{ x: "max-content" }}
      />
    </>
  );
};
