import React, { useEffect, useState } from "react";
import { TbListDetails } from "react-icons/tb";
import { Button, DatePicker, Tabs, Form } from "antd";
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdCallMissedOutgoing } from "react-icons/md";
import dayjs from "dayjs";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import DoneFollowUp from "./Components/DoneFollowup";
import MissedFollowup from "./Components/MissedFollowup";
import {
  CustomModeSelectInput,
  CustomSelectInput,
  InputWithIcon,
} from "../../Components/CustomComponents/InputWithIcon";
import { getCounsellorDropdown } from "../AssignmentRule/ApiService";
import { useSelector } from "react-redux";
import PendingFollowUp from "./Components/PendingFollowUp";
import { getLeadStatusDropdownService } from "../LeadStatus/ApiService";

const Followup = () => {
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
  const [missedFollowupDateRange, setMissedFollowupDateRange] = useState([]);
  const [tempDateRange, setTempDateRange] = useState([dayjs(), dayjs()]);
  const [counsellorDropdown, setCounsellorDropdown] = useState([]);
  const [counsellor, setCounsellor] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [leadStatusList, setLeadStatusList] = useState([]);
  const [selectedLeadStatus, setSelectedLeadStatus] = useState(null);

  const { RangePicker } = DatePicker;
  const dateFormat = "DD-MM-YYYY";
  const modulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );

  const column = [
    {
      key: "1",
      label: "Pending",
      children: (
        <PendingFollowUp
          dateRange={dateRange}
          dateFormat={dateFormat}
          counsellor={counsellor}
          phoneNumber={phoneNumber}
          selectedLeadStatus={selectedLeadStatus}
        />
      ),
      icon: <TbListDetails className="inline-block" />,
    },
    // {
    //   key: "2",
    //   label: "Done ",
    //   children: (
    //     <DoneFollowUp
    //       dateRange={dateRange}
    //       dateFormat={dateFormat}
    //       counsellor={counsellor}
    //       phoneNumber={phoneNumber}
    //       selectedLeadStatus={selectedLeadStatus}
    //     />
    //   ),
    //   icon: <FaRegCircleCheck className="inline-block" />,
    // },
    {
      key: "3",
      label: "Missed ",
      children: (
        <MissedFollowup
          missedFollowupDateRange={missedFollowupDateRange}
          dateFormat={dateFormat}
          counsellor={counsellor}
          phoneNumber={phoneNumber}
          selectedLeadStatus={selectedLeadStatus}
        />
      ),
      icon: <MdCallMissedOutgoing className="inline-block" />,
    },
  ];

  const rangePresets = [
    {
      label: "Today",
      value: [dayjs(), dayjs()],
    },
    {
      label: "Yesterday",
      value: [dayjs().subtract(1, "d"), dayjs().subtract(1, "d")],
    },
    {
      label: "Last 7 Days",
      value: [dayjs().subtract(7, "d"), dayjs()],
    },
    {
      label: "Last 14 Days",
      value: [dayjs().subtract(14, "d"), dayjs()],
    },
    {
      label: "Last 30 Days",
      value: [dayjs().subtract(30, "d"), dayjs()],
    },
    {
      label: "Last 60 Days",
      value: [dayjs().subtract(60, "d"), dayjs()],
    },
    {
      label: "Last 90 Days",
      value: [dayjs().subtract(90, "d"), dayjs()],
    },
  ];

  const applyDateRange = () => {
    setDateRange(tempDateRange);
    setMissedFollowupDateRange(tempDateRange);
  };

  const getLeadStatusDropdownApi = () => {
    getLeadStatusDropdownService().then((response) => {
      setLeadStatusList(response.data.data);
    });
  };

  useEffect(() => {
    getCounsellorDropdown().then((response) => {
      setCounsellorDropdown(response.data.data);
    });
    getLeadStatusDropdownApi();
  }, []);

  return (
    <>
      <div className="mx-6 pb-5 bg-white px-4">
        <div className="relative">
          <div className="absolute top-[60px]">
            <div className="flex gap-2 items-center flex-wrap">
              <div className="">
                <InputWithIcon
                  className={"min-w-[200px] max-w-[200px] max-h-[32px]"}
                  name="phone"
                  type={"number"}
                  placeholder={"Enter Phone Number "}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                />
              </div>

              {/* Lead Status Form Item */}
              <div className="">
                <CustomSelectInput
                  name="leadStatus"
                  className={"min-w-[200px] max-w-[200px] max-h-[32px]"}
                  required={true}
                  defaultValue={null}
                  placeholder="Select lead status"
                  handler={(value) => setSelectedLeadStatus(value)}
                  options={leadStatusList?.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                />
              </div>
              {/* End Lead Status Form Item */}

              {modulePermission.user_group !== "staff" && (
                <div className="relative min-w-[200px] max-w-[200px]">
                  <CustomModeSelectInput
                    className={
                      "min-w-[200px] max-w-[200px] absolute top-[-1rem] z-10"
                    }
                    name="counsellor"
                    mode="multiple"
                    size="medium"
                    onChange={(e) => setCounsellor(e)}
                    placeholder="Select Counsellor"
                    tokenSeparators={[","]}
                    defaultValue={null}
                    showSearch
                    required={true}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={counsellorDropdown.map((item) => ({
                      value: item.username,
                      label: item.email,
                    }))}
                  />
                </div>
              )}
              <div className="">
                <RangePicker
                  format={dateFormat}
                  className="w-full md:w-fit"
                  onChange={(v) => setTempDateRange(v)}
                  presets={rangePresets}
                  value={tempDateRange && [tempDateRange[0], tempDateRange[1]]}
                />
                <Button
                  onClick={applyDateRange}
                  type="primary"
                  className="md:ml-2 mt-2 md:mt-0 "
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
          <Tabs
            className="p-0"
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

export default Followup;
