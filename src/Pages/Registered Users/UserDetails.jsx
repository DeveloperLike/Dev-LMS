import React, { useState, useEffect } from "react";
import { Form, Row, Col, Drawer, Tabs } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRegisteredUserDetailService,
  getRegisteredUserPackageService,
  getRegisteredUserTransactionService,
  getRegisterUserDetailsService,
} from "./ApiService";
import PostTransaction from "../Lead/Components/PostTransaction";
import { TfiPackage } from "react-icons/tfi";
import { GrTransaction } from "react-icons/gr";
import { RegisteredUserTransactions } from "./RegisteredUserTransactions";
import { LeadPackageList } from "../Lead/Components/LeadPackageList";
import ViewLeadPackage from "../Lead/Components/ViewLeadPackage";
import { CgNotes } from "react-icons/cg";
import LeadReminders from "../Lead/Components/LeadReminders";
import { RegisteredUserPackageTab } from "./RegisteredUserPackageTab";
import { IoDocumentTextSharp } from "react-icons/io5";
import RegisteredStudentDocuments from "./RegisteredStudentDocuments";
import { FaCcVisa } from "react-icons/fa6";
import { VisaApplication } from "./VisaApplication";
import { ApsApplication } from "./ApsApplication";
import { StudentDetails } from "./StudentDetails";
import { AccommodationApplication } from "./AccommodationApplication";
import { StudentCourse } from "./Components/StudentCourse";
import {
  getProfileService,
  getStudentPermissionService,
} from "../Profile/ApiService";
import { useSelector } from "react-redux";
import { CoursesTab } from "./Components/CoursesTab";
import { SwapOutlined } from '@ant-design/icons';
import { UserOutlined } from '@ant-design/icons';
import { IoBookSharp } from "react-icons/io5";

export const UserDetails = ({ mode }) => {
  const [transactionPaymentDetails, setTransactionPaymentDetails] = useState();
  const [studentDetail, setStudentDetail] = useState({});
  const [isModalOpenTransaction, setIsModalOpenTransaction] = useState(false);
  const [packageData, setPackageData] = useState(null);
  const [userData, setUserData] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  const [nextpage, setNextPage] = useState("pakagelistPackagepage");
  const [isRegistered, setIsregistered] = useState();
  const [registerUserName, setRegisterUserName] = useState();
  // contact start
  const [data, setData] = useState({});
  // contact close

  // sub tab start from here
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectedPackage, setIsSelectedPackage] = useState([]);
  const [packageList, setPackage] = useState(null);
  const [leadid, setLeadId] = useState();
  const [laedreminderList, setLaedreminderList] = useState();
  const [studentPermission, setStudentPermission] = useState();
  const [isRegisterUserreminder, setIsRegisterUserreminder] = useState(
    "isRegisterUserreminder"
  );
  // sub tab get list start from here

  const [form] = Form.useForm();
  const { id } = useParams();

  const navigate = useNavigate();

  const showPackageDrawer = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // get register user package List start
  const leadPackageListGetApi = () => {
    getRegisteredUserPackageService(id).then((response) => {
      setPackage(response.data.data);
      setPackageData(response.data.data);
    });
  };
  // get register user package list close

  const leadTransactionListGetApi = () => {
    getRegisteredUserTransactionService(id).then((response) => {
      setTransactionList(response.data.data);
      setTransactionPaymentDetails(response.data.detail);
    });
  };

  const handleCancelTransaction = () => {
    setIsModalOpenTransaction(false);
  };

  const setIsModalOpenTransactionFun = (e) => {
    setIsModalOpenTransaction(e);
  };

  const getDetailsDataApi = () => {
    getRegisteredUserDetailService(id).then((response) => {
      // setPackageData(response.data.data.packages);
      setTransactionList(response.data.data.transaction);
      // setFormData(response.data.data.lead_fields);
      setUserData(response?.data?.data?.username);
      setData(response.data.data);
      const initialFormData = {};
      fields.forEach((field) => {
        initialFormData[field.key] = {
          value: response.data.data[field.key] || "",
        };
      });
      setStudentDetail(initialFormData);
      setLeadId(response.data.data.lead);
      setIsregistered(response.data.data.registered);
      setRegisterUserName(response.data.data.username);
    });
  };

  const leadReminderListGetApi = () => {
    getRegisterUserDetailsService(id).then((response) => {
      setLaedreminderList(response.data.data);
    });
  };

  const modulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  const fields = [
    {
      key: "email",
      label: "Email id",
    },
    { key: "full_name", label: "Student Name" },
    {
      key: "phone",
      label: "Mobile Number",
    },
    {
      key: "student_journey_status",
      label: "Student Journey Status",
    },
    { key: "payment_status", label: "Payment Status" },
    { key: "passport_number", label: "Passport Number" },
    { key: "packages", label: "Packages" },
    { key: "category", label: "Category" },
    { key: "intake_session", label: "Intake Session" },
    { key: "sales_person", label: "Sales Person" },
    { key: "location", label: "Location" },
    { key: "aps_number", label: "APS Number" },
    { key: "total_amount", label: "Total Amount" },
    { key: "pending_amount", label: "Pending Amount" },
  ];

  const allColumns = [
    {
      key: "1",
      label: "Reminder",
      children: (
        <LeadReminders
          registerUserName={registerUserName}
          isRegisterUserreminder={isRegisterUserreminder}
          leadReminderListGetApi={leadReminderListGetApi}
          laedreminderList={laedreminderList}
          mode={mode}
        />
      ),
      icon: <CgNotes className="inline-block" />,
    },
    {
      key: "2",
      label: "Transaction Details",
      children: (
        <RegisteredUserTransactions
          // setIsModalOpenTransaction={setIsModalOpenTransaction}
          setIsModalOpenTransactionFun={setIsModalOpenTransactionFun}
          packageData={packageData}
          transactionList={transactionList}
          isRegistered={isRegistered}
          leadTransactionListGetApi={leadTransactionListGetApi}
          userData={userData}
          transactionPaymentDetails={transactionPaymentDetails}
          mode={mode}
        />
      ),
      icon: <SwapOutlined className="inline-block" />,
    },
    {
      key: "3",
      label: "Packages",
      children: (
        <RegisteredUserPackageTab
          leadPackageListGetApi={leadPackageListGetApi}
          showPackageDrawer={showPackageDrawer}
          packageList={packageList}
        />
      ),
      icon: <TfiPackage className="inline-block" />,
    },

  ];

  modulePermission?.student_profile_management !== "no_access" &&
    allColumns.push(
      {
        key: "4",
        label: "Profile",
        children:
          <StudentDetails
            modulePermission={modulePermission}
            mode={mode}
          />,
        icon: <UserOutlined className="inline-block" />,
      },
    );

  modulePermission?.course_application_management !== "no_access" &&
    allColumns.push({
      key: "7",
      label: "Courses",
      children: (
        <CoursesTab userName={userData} />
        // <StudentCourse userName={userData} />
      ),
      icon: <IoBookSharp className="inline-block" />,
    });

  modulePermission?.student_document_management !== "no_access" &&
    allColumns.push({
      key: "5",
      label: "Documents",
      children: (
        <RegisteredStudentDocuments
          setIsModalOpenTransactionFun={setIsModalOpenTransactionFun}
          packageData={packageData}
          transactionList={transactionList}
          isRegistered={isRegistered}
          leadTransactionListGetApi={leadTransactionListGetApi}
          userData={userData}
          transactionPaymentDetails={transactionPaymentDetails}
          mode={mode}
        />
      ),
      icon: <IoDocumentTextSharp className="inline-block" />,
    });

  modulePermission?.student_accommodation_management !== "no_access" &&
    allColumns.push({
      key: "9",
      label: "Accommodation Application",
      children: <AccommodationApplication
        userData={userData}
        mode={mode}
      />,
      icon: <IoDocumentTextSharp className="inline-block" />,
    });

  modulePermission?.visa_management !== "no_access" &&
    allColumns.push({
      key: "8",
      label: "Visa Application",
      children:
        <VisaApplication
          userData={userData}
          mode={mode}
        />,
      icon: <FaCcVisa className="inline-block" />,
    });

  modulePermission?.aps_management !== "no_access" &&
    allColumns.push({
      key: "6",
      label: "APS Application",
      children: <ApsApplication userData={userData} />,
      icon: <IoDocumentTextSharp className="inline-block" />,
    });

  const visibleColumns = allColumns.filter((columnItem) => {
    if (columnItem.key === "6") {
      return studentPermission?.aps;
    }
    if (columnItem.key === "7") {
      return studentPermission?.admission;
    }
    if (columnItem.key === "8") {
      return studentPermission?.visa;
    }
    if (columnItem.key === "9") {
      return studentPermission?.accomodation;
    }
    return true; // Always show other tabs
  });

  useEffect(() => {
    getDetailsDataApi();
    getStudentPermissionService(id).then((response) => {
      setStudentPermission(response.data.data);
    });
  }, [id]);

  return (
    <>
      <div className=" p-0 rounded-lg mx-0 relative mb-[60px] ">
        <div className="flex justify-between w-full px-7 ">
          <div className="w-fit mb-3 ">
            <h1 className={` ${mode === "dark" ? "text-yellow-500" : "text-black"} text-xl font-semibold `}>
              Registered Student Details
            </h1>
          </div>

          <div className="flex gap-4 items-center">
            <button
              onClick={() => history.go(-1)}
              className="underline block"
            >
              Back
            </button>
          </div>
        </div>
        <div className="bg-white py-5 px-5 rounded-lg mx-6 relative mb-[15px] bg-white dark:text-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <Row gutter={[20, 20]}>
            <React.Fragment>
              {fields.map((field) => (
                <Col xs={{ span: 12 }} md={{ span: 8 }} key={field.key}>
                  <div>
                    <h1 className="font-semibold">{field.label}</h1>
                    <p>{studentDetail[field.key]?.value || ""}</p>
                  </div>
                </Col>
              ))}
            </React.Fragment>
          </Row>
        </div>

        <div className="dark:text-white bg-white p-5 rounded-lg mx-6 relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <Tabs
            className="mt-4"
            defaultActiveKey="1"
            items={visibleColumns.map((item) => ({
              key: item.key,
              label: item.label,
              children: item.children,
              icon: item.icon,
            }))}
          />
        </div>
        <br />
      </div>

      <Drawer
        title={"Transaction"}
        placement="right"
        width={400}
        onClose={handleCancelTransaction}
        open={isModalOpenTransaction}
      >
        <PostTransaction
          setIsModalOpenTransaction={setIsModalOpenTransaction}
          userData={userData}
          setNextPage={setNextPage}
          packageData={packageData}
          getDetailsDataApi={getDetailsDataApi}
          leadTransactionListGetApi={leadTransactionListGetApi}
          isModalOpenTransaction={isModalOpenTransaction}
          leadPackageListGetApi={leadPackageListGetApi}
        />
      </Drawer>

      {/* package drawer start from here */}
      <Drawer
        title={
          nextpage === "pakageTransactionpage"
            ? "Transaction"
            : "List of Packages"
        }
        placement="right"
        width={400}
        onClose={handleCancel}
        open={isModalOpen}
      >
        {nextpage === "pakagelistPackagepage" && (
          <LeadPackageList
            packageList={packageList}
            setPackageData={setPackageData}
            packageData={packageData}
            id={id}
            setIsModalOpen={setIsModalOpen}
            setNextPage={setNextPage}
            setIsSelectedPackage={setIsSelectedPackage}
          />
        )}
        {nextpage === "pakageviewpage" && (
          <ViewLeadPackage
            packageData={packageData}
            gridCol="grid-cols-1"
            setNextPage={setNextPage}
            id={leadid}
            isSelectedPackage={isSelectedPackage}
            leadPackageListGetApi={leadPackageListGetApi}
          />
        )}
        {nextpage === "pakageTransactionpage" && (
          <PostTransaction
            setIsModalOpen={setIsModalOpen}
            setNextPage={setNextPage}
            packageData={packageData}
            userData={userData}
            leadTransactionListGetApi={leadTransactionListGetApi}
            isModalOpenTransaction={isModalOpenTransaction}
            isModalOpen={isModalOpen}
            leadPackageListGetApi={leadPackageListGetApi}
            getDetailsDataApi={getDetailsDataApi}
          />
        )}
      </Drawer>
      {/* package drawer close from here */}
    </>
  );
};
