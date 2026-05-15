import React from "react";
import { AndroidOutlined, AppleOutlined } from "@ant-design/icons";
import { Card, Tabs } from "antd";
import TabChildComponent from "./TabChildComponent";
import { UserList } from "./UserList";
import { ActivityReport } from "./ActivityReport";
import { ViewLeadFollowup } from "./ViewLeadFollowup";
import { GoPackage } from "react-icons/go";
import { ViewLeadTransactionDetails } from "./ViewLeadTransactionDetails";
import { OutLineButton } from "../../../Components/CustomComponents/ButtonUi";
import { CgNotes } from "react-icons/cg";
import { GrTransaction } from "react-icons/gr";
import { RxActivityLog } from "react-icons/rx";
import { TfiPackage } from "react-icons/tfi";
import { TbListDetails } from "react-icons/tb";
import { RiChatFollowUpLine } from "react-icons/ri";
import LeadReminders from "./LeadReminders";
import { ViewPackageLeadTab } from "./ViewPackageLeadTab";
import { FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { LeadStudentDetails } from "../LeadStudentDetails/LeadStudentDetails";
import { SwapOutlined } from '@ant-design/icons';
import { UserOutlined } from '@ant-design/icons';

export const TabLeadCard = ({
  moreinfoData,
  packageData,
  userData,
  followupData,
  activityList,
  transactionList,
  followUpModalOpenFunction,
  showModal,
  setIsModalOpenTransactionFun,
  leadReminderListGetApi,
  laedreminderList,
  isRegistered,
  packageList,
  leadFollowupListGetApi,
  leadFollowupList,
  leadActivityListGetApi,
  leadTransactionListGetApi,
  leadPackageListGetApi,
  transactionPaymentDetails,
  userDataDetails,
  getDetailsDataApi,
  mode,
}) => {

  const modulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );

  const column = [
    {
      key: "1",
      label: "Activity Report",
      children: (
        <ActivityReport
          activityList={activityList}
          leadActivityListGetApi={leadActivityListGetApi}
        />
      ),
      icon: <RxActivityLog className="inline-block" />,
    },
    {
      key: "2",
      label: "Followup",
      children: (
        <ViewLeadFollowup
          followUpModalOpenFunction={followUpModalOpenFunction}
          followupData={followupData}
          leadFollowupListGetApi={leadFollowupListGetApi}
          leadFollowupList={leadFollowupList}
        />
      ),
      icon: <RiChatFollowUpLine className="inline-block" />,
    },
    {
      key: "3",
      label: "Reminder",
      children: (
        <LeadReminders
          leadReminderListGetApi={leadReminderListGetApi}
          laedreminderList={laedreminderList}
          mode={mode}
        />
      ),
      icon: <CgNotes className="inline-block" />,
    },
    {
      key: "5",
      label: "Transaction Details",
      children: (
        <ViewLeadTransactionDetails
          setIsModalOpenTransactionFun={setIsModalOpenTransactionFun}
          packageData={packageData}
          transactionList={transactionList}
          isRegistered={isRegistered}
          leadTransactionListGetApi={leadTransactionListGetApi}
          userData={userData}
          transactionPaymentDetails={transactionPaymentDetails}
        />
      ),
      icon: <SwapOutlined className="inline-block" />,
    },
    {
      key: "6",
      label: "Packages",
      children: (
        <ViewPackageLeadTab
          showModal={showModal}
          packageList={packageList}
          leadPackageListGetApi={leadPackageListGetApi}
        />
      ),
      icon: <TfiPackage className="inline-block" />,
    },
    {
      key: "7",
      label: "Other Details",
      children: <TabChildComponent moreinfoData={moreinfoData} />,
      icon: <TbListDetails className="inline-block" />,
    },
  ];

  // packageData !== null &&
  //   packageData?.length > 0 &&
  isRegistered === "registered" &&
    column.push({
      key: "4",
      label: "User",
      children: <UserList userData={userDataDetails} />,
      icon: <FaUser className="inline-block" />,
    });
  modulePermission?.student_profile_management !== "no_access" &&
    column.push(
      {
        key: "8",
        label: "Profile",
        children: <LeadStudentDetails
          modulePermission={modulePermission}
          mode={mode}
        />,
        icon: <UserOutlined className="inline-block" />,
      },
    );

  return (
    <>
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
    </>
  );
};
