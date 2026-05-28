import React, { useState, useEffect, useRef, Suspense } from "react";
import {
  Form,
  Select,
  Row,
  Col,
  Radio,
  Drawer,
  Badge,
  Tooltip,
  message,
  Grid,
  Modal,
  Button,
} from "antd";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  OutLineButton,
  PrimaryButton,
} from "../../Components/CustomComponents/ButtonUi";
import { TabLeadCard } from "./Components/TabLeadCard";
import {
  editLeadListService,
  getLeadActivityReportDetailsService,
  getLeadListService,
  getLeadMyFollowupDetailsService,
  getLeadMyReminderDetailsService,
  getLeadSourceService,
  getViewLeadCardDetailsService,
  getViewLeadDetailService,
  getLeadPackageListService
} from "./ApiService";
import { getCityDropdownService } from "../City/ApiService";
import { LeadPackageList } from "./Components/LeadPackageList";
import { AddFollowup } from "./Components/AddFollowup";
import ViewLeadPackage from "./Components/ViewLeadPackage";
import PostTransaction from "./Components/PostTransaction";
import { getLeadStatusDetailService } from "../LeadStatus/ApiService";
import { patchSubStatusService } from "../LeadSubStatus/ApiService";
import { notificationFun } from "../../lib/redux/NotificationSlice";
import { useDispatch, useSelector } from "react-redux";
import TextArea from "antd/es/input/TextArea";
import { IoIosVideocam, IoLogoWhatsapp, IoMdCall } from "react-icons/io";
import { MdEmail, MdMoney, MdOutlineSchedule, MdPayment, MdSms } from "react-icons/md";
import Sms from "./Contact/Sms";
import Whatsapp from "./Contact/Whatsapp";
import Email from "./Contact/Email";
import Call from "./Contact/Call";
import { AddSubStatusFollowup } from "./Components/AddSubStatusFollowup";
import {
  getRegisteredUserPackageService,
  getRegisteredUserTransactionService,
} from "../Registered Users/ApiService";

import { ArrowLeftOutlined, TagFilled, SwapOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";

import { getCounsellorDropdown } from "../AssignmentRule/ApiService";
import { getProfileService } from "../Profile/ApiService";
import { assignMultipleLeadService } from "../Unassignedlead/ApiService";
import { CustomSelectInput } from "../../Components/CustomComponents/InputWithIcon";
import axios from "axios";
import { LeadStudentDetails } from "./LeadStudentDetails/LeadStudentDetails";
import { EditLeadDrawer } from "./Components/EditLeadDrawer";
import { baseurl } from "../../lib/Constants";

const EaseBuzzPaymentForm = React.lazy(() => import("./EasebuzzPaymentForm"));

// import { ZoomMtg } from "@zoom/meetingsdk";

export const Viewlead = ({ mode }) => {

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [formData, setFormData] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState();
  const [campaign, setCampaign] = useState();
  const [moreinfoData, setMoreinfoData] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenTransaction, setIsModalOpenTransaction] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isFollowUpSubStatusDrawerOpen, setIsFollowUpSubStatusDrawerOpen] = useState(false);
  const [leadsource, setLeadSource] = useState();
  const [leadstatus, setLeadstatus] = useState();
  const [subleadstatus, setSubLeadstatus] = useState([]);
  const [dropdownData, setDropdown] = useState([]);
  const [packageData, setPackageData] = useState(null);
  const [followupData, setFollowupData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [assignedToUsername, setAssignedToUsername] = useState(null)
  const [userDataDetails, setUserDataDetails] = useState([]);
  const [activityList, setActivity] = useState([]);
  const [nextpage, setNextPage] = useState("pakagelistPackagepage");
  const [isSelectedPackage, setIsSelectedPackage] = useState([]);
  const [leadSubStatusDropdown, setLeadSubStatusDropdown] = useState([]);
  const [leadStatusId, setLeadStatusId] = useState();
  const [leadSubStatus, setLeadSubStatus] = useState(null);
  const [openRemarks, setOpenRemarks] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [useAddFollowupService, setUseAddFollowupService] = useState(false);
  const [isRegistered, setIsRegistered] = useState();
  const [dataForMetaPush, setDataForMetaPush] = useState(null);
  // contact start
  const [data, setData] = useState({});
  // const [dataCard, setDataCard] = useState({});
  const [openVideoCall, setOpenVideoCall] = useState(false);
  const [videoCallId, setVideoCallId] = useState(null);
  const [openAudioCall, setOpenAudioCall] = useState(false);
  const [audioCallId, setAudioCallId] = useState(null);
  const [openSms, setOpenSms] = useState(false);
  const [smsId, setSmsId] = useState(null);
  const [openEmail, setOpenEmail] = useState(false);
  const [emailId, setEmailId] = useState(null);
  const [openWhatsapp, setOpenWhatsapp] = useState(false);
  const [whatsappId, setWhatsappId] = useState(null);
  // contact close

  // sub tab get list start from here
  const [packageList, setPackage] = useState(null);
  const [laedreminderList, setLaedreminderList] = useState();
  const [transactionList, setTransactionList] = useState([]);
  const [transactionPaymentDetails, setTransactionPaymentDetails] = useState();
  const [leadFollowupList, setLeadFollowupList] = useState();
  const [registeredLeadSuccess, setRegisteredLeadSuccess] = useState();
  // sub tab get list close from here

  const [openTransferDrawer, setOpenTransferDrawer] = useState(false);
  const [counsellorDropdown, setCounsellorDropdown] = useState([]);
  const [counsellor, setCounsellor] = useState(null);
  const [counsellorError, setCounsellorError] = useState([]);
  const [transferLoading, setTransferLoading] = useState(false);

  const leadCategories = ["Hot", "Warm", "Cold"];

  const [leadCategory, setLeadCategory] = useState(null);

  // Payment
  const [openPaymentLinkForm, setOpenPaymentLinkForm] = useState(false);
  const [paymentAlert, setPaymentAlert] = useState({
    type: "",
    message: ""
  });
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    if (data?.lead_category) {
      setLeadCategory(data.lead_category);
    }
  }, [data]);

  const [tagDrawerOpen, setTagDrawerOpen] = useState(false);

  const closeTagDrawer = () => {
    setTagDrawerOpen(false);
  };


  const [openTagDrawer, setOpenTagDrawer] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const [leadTag, setLeadTag] = useState("");

  const [subStatusLoading, setSubStatusLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  // Sub Status Drawer
  const [openSubStatusDrawer, setOpenSubStatusDrawer] = useState(false);

  // Followup & Remarks
  const [openFollowupDrawer, setOpenFollowupDrawer] = useState(false);
  const [openRemarksDrawer, setOpenRemarksDrawer] = useState(false);

  // Selected Sub Status
  const [selectedSubStatus, setSelectedSubStatus] = useState(null);

  const isPrivilegedUser = ["admin", "manager"].includes(
    loggedInUser?.user_group
  );

  const restrictedFields = [
    "Lead source",
    "YG Session Active",
    "YG Referral URL",
    "Tracking Url",
    "Campaign",
    "utm_campaign",
    "utm_medium",
    "utm_source",
    "utm_term",
    "utm_content",
    "secondary_source"
  ];

  const handleSubStatusClick = (status) => {
    if (subStatusLoading) return;

    setSelectedSubStatus(status);
    setSubStatusLoading(true);

    // Followup required
    if (status.follow_up) {
      setOpenSubStatusDrawer(false);
      setOpenFollowupDrawer(true);
      setSubStatusLoading(false);
      return;
    }

    // Remarks required
    if (status.remarks) {
      setFollowupStep(FOLLOWUP_STEPS.REMARK);
      setOpenSubStatusDrawer(false);
      setOpenRemarksDrawer(true);
      setSubStatusLoading(false);
      return;
    }

    // Direct update
    patchSubStatusService(
      { lead_sub_status: status.lead_sub_status_id },
      id
    )
      .then((response) => {
        if (response.data.success === "1") {
          getDetailsDataApi();
          message.success("Sub status updated");
          setOpenSubStatusDrawer(false);
        }
      })
      .finally(() => {
        setSubStatusLoading(false);
      });
  };


  useEffect(() => {
    if (openSubStatusDrawer && subleadstatus?.lead_sub_status_id) {
      const el = document.getElementById(
        `sub-${subleadstatus.lead_sub_status_id}`
      );

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [openSubStatusDrawer]);

  const [followupRemark, setFollowupRemark] = useState("");

  const FOLLOWUP_STEPS = {
    LIST: "LIST",
    FOLLOWUP: "FOLLOWUP",
    REMARK: "REMARK",
  };

  const [followupStep, setFollowupStep] = useState(FOLLOWUP_STEPS.LIST);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const leadModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );

  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  // Enhanced hasValue function to check if a field has a valid value
  const hasValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === "undefined"
    ) return false;

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (
        trimmed === "" ||
        trimmed === "-" ||
        trimmed.toLowerCase() === "undefined" ||
        trimmed.toLowerCase() === "null"
      ) return false;
    }

    if (Array.isArray(value) && value.length === 0) return false;

    if (typeof value === "object" && !Array.isArray(value)) {
      if (Object.keys(value).length === 0) return false;
    }

    return true;
  };

  // Get package List
  const leadPackageListGetApi = () => {
    // console.log("leadPackageListGetApi calling");
    // userData &&
    getRegisteredUserPackageService(userData).then((response) => {
      setPackage(response.data.data);
      setPackageData(response.data.data);
    });
  };
  // get package list close

  // Get reminder list
  const leadFollowupListGetApi = () => {
    getLeadMyFollowupDetailsService(id).then((response) => {
      setLeadFollowupList(response.data.data);
    });
  };
  // get reminder list close from here

  // Activity report fetching data
  const leadActivityListGetApi = () => {
    getLeadActivityReportDetailsService(id).then((response) => {
      setActivity(response.data.data);
    });
  };
  // activity report fecting data close

  // Get reminder list
  const leadReminderListGetApi = () => {
    getLeadMyReminderDetailsService(id).then((response) => {
      setLaedreminderList(response.data.data);
    });
  };
  // get reminder list close from here

  // Transaction fetching data
  const leadTransactionListGetApi = () => {
    // console.log("leadTransactionListGetApi lead calling");
    getRegisteredUserTransactionService(userData).then((response) => {
      console.log(response.data.data, "transaction list response");
      setTransactionList(response.data.data);
      setTransactionPaymentDetails(response.data.detail);
    });
  };
  // transaction fetching data close from here

  // Getting data from city dropdown
  const getCityDropdownApi = () => {
    getCityDropdownService().then((response) => {
      setCityOptions(response.data.data);
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCancelTransaction = () => {
    setIsModalOpenTransaction(false);
  };

  const setIsModalOpenTransactionFun = (e) => {
    setIsModalOpenTransaction(e);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const followUpModalOpenFunction = () => {
    setIsFollowUpModalOpen(true);
    leadFollowupListGetApi();
  };

  const setSubStatusFunction = (e) => {
    const selectedSubStatus = leadSubStatusDropdown.find(
      (status) => status.lead_sub_status_id === e
    );
    setLeadSubStatus(selectedSubStatus);

    setSubLeadstatus({
      name: selectedSubStatus.lead_sub_status_name,
    });

    // console.log(
    //   selectedSubStatus.follow_up,
    //   ":selectedSubStatus follow_up",
    //   selectedSubStatus.remarks,
    //   ":selectedSubStatus remarks"
    // );

    if (selectedSubStatus.follow_up) {
      // console.log("follow up opened");
      setIsFollowUpSubStatusDrawerOpen(true);
      setUseAddFollowupService(true);
    } else if (selectedSubStatus.remarks) {
      // console.log("remarks opened");
      setOpenRemarks(true);
      setUseAddFollowupService(false);
    } else if (
      selectedSubStatus.remarks === false &&
      selectedSubStatus.follow_up === false
    ) {
      setUseAddFollowupService(false);
      const payload = { lead_sub_status: e };
      patchSubStatusService(payload, id).then((response) => {
        if (response.data.success === "1") {
          getDetailsDataApi();
          leadFollowupListGetApi();
          message.success(response.data.message);
        }
      });
    }
  };

  const handleVideoCall = () => {
    setVideoCallId(id);
    setOpenVideoCall(true);
  };

  const onVideoCallClose = () => {
    setVideoCallId(null);
    setOpenVideoCall(false);
  };

  const handleAudioCall = () => {
    setAudioCallId(id);
    setOpenAudioCall(true);
  };

  const onAudioCallClose = () => {
    setAudioCallId(null);
    setOpenAudioCall(false);
  };

  const handleSms = () => {
    setSmsId(id);
    // console.log(id, "id id");
    setOpenSms(true);
  };

  const onSmsClose = () => {
    setSmsId(null);
    setOpenSms(false);
  };

  const handleEmail = () => {
    setEmailId(id);
    setOpenEmail(true);
  };

  const onEmailClose = () => {
    setEmailId(null);
    setOpenEmail(false);
  };

  const handleWhatsapp = () => {
    setWhatsappId(id);
    setOpenWhatsapp(true);
  };

  const onWhatsappClose = () => {
    setWhatsappId(null);
    setOpenWhatsapp(false);
  };
  // conatct close

  // Handle sub status remarks
  const handleRemarks = () => {
    const payload = {
      lead_sub_status: leadSubStatus.lead_sub_status_id,
      lead_status: leadStatusId,
      remark: remarks,
    };
    patchSubStatusService(payload, id).then((response) => {
      if (response.data.success === "1") {
        getDetailsDataApi();
        setOpenRemarks(false);
        setRemarks("");
        message.success(response.data.message);
      }
    });
  };

  // Getting data from dropdown
  const dropdownGetApi = () => {
    getLeadSourceService().then((response) => {
      setDropdown(response.data.data);
    });
  };
  // getting data from dropdown end

  const getViewLeadCardDetailsServiceApiCall = () => {
    getViewLeadCardDetailsService(id).then((response) => {
      //  console.log(response.data.data.lead_fields);
      setFormData(response?.data?.data?.lead_fields);
      setTrackingUrl(response?.data?.data?.tracking_url);
      setCampaign(response?.data?.data?.campaign);
      setData(response?.data?.data);
      setLeadSource(response.data.data.lead_source);
    });
  };

  // View details get data
  const getDetailsDataApi = () => {
    setLoading(true);

    getViewLeadDetailService(id)
      .then((response) => {
        // console.log(response.data.data.lead_fields)

        setAssignedToUsername(response.data.data.assign_to_username)
        setPhoneNumber(response.data.data.phone);
        setLeadstatus(response.data.data.leads_status.name);
        setLeadStatusId(response.data.data.leads_status.id);
        setSubLeadstatus(response.data.data.leads_sub_status);
        setFollowupData(response.data.data.follow_up);
        setUserData(response?.data?.data?.username);
        setUserDataDetails(response.data.data.user_detail);
        setIsRegistered(response.data.data.registered);
        setDataForMetaPush(response.data.data.lead_fields.filter((field) => { return field.code === "email" || field.code === "phone" }))
        setMoreinfoData(
          response.data.data.lead_fields.filter(
            (item) => item.is_primary === true
          )
        );
      })
      .catch(() => {
        // keep data empty on error
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // veiwDetailsGetData closes here

  // Sub status dropdown api
  const leadSubStatusDropdownApi = () => {
    getLeadStatusDetailService(leadStatusId).then((response) => {
      setLeadSubStatusDropdown(response.data.data.sub_status);
      // console.log(response.data.data.sub_status, "sub status");
    });
  };

  // console.log(isModalOpenTransaction, "isModalOpenTransaction");
  // console.log(isModalOpen, 'isModalOpen')

  const transferLeadApi = async () => {
    const myData = await getProfileService();

    const payload = {
      assign_to: counsellor,

      // backend expects array
      lead_id: [id],

      user_id: myData?.data?.data?.username,
    };

    if (transferLoading) return;
    setTransferLoading(true);

    assignMultipleLeadService(payload)
      .then((res) => {
        if (res.data.success === "1") {
          message.success(res?.data?.message);

          setOpenTransferDrawer(false);
          setCounsellor(null);

          getDetailsDataApi();
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message);
        setCounsellorError(err?.response?.data?.data?.assign_to);
      })
      .finally(() => setTransferLoading(false));
  };

  useEffect(() => {
    getDetailsDataApi();
    getCityDropdownApi();
    dropdownGetApi();

    getCounsellorDropdown().then((res) => {
      setCounsellorDropdown(res.data.data);
    });

    if (leadStatusId) {
      leadSubStatusDropdownApi();
    }
  }, [leadStatusId, leadModulePermission?.lead_management]);

  useEffect(() => {
    getViewLeadCardDetailsServiceApiCall();
  }, [id]);


  // Filter formData to only include fields with values
  const fieldsWithValues =
    formData?.filter((field) => {
      if (!hasValue(field.value)) return false;

      if (!loggedInUser) return true;

      if (!isPrivilegedUser && restrictedFields.includes(field.label)) {
        return false;
      }

      return true;
    }) || [];

  // Additional fields that should be shown if they have values
  const additionalFields = [
    { label: "Tracking Url", value: trackingUrl, key: "tracking_url" },
    { label: "Lead source", value: leadsource, key: "lead_source" },
    { label: "Assignment Rule", value: data?.assignment_rule, key: "assignment_rule" },
    { label: "Campaign", value: campaign, key: "campaign" },
  ];

  const additionalFieldsWithValues = additionalFields.filter((field) => {
    if (!hasValue(field.value)) return false;

    if (!loggedInUser) return true;

    if (!isPrivilegedUser && restrictedFields.includes(field.label)) {
      return false;
    }

    return true;
  });


  const sortedSubStatusList = [...(leadSubStatusDropdown || [])].sort(
    (a, b) =>
      a.lead_sub_status_name
        .toLowerCase()
        .localeCompare(b.lead_sub_status_name.toLowerCase())
  )

  const leadName =
    formData?.find((field) => field.code === "full_name")?.value || "Lead";


  const getPrService = async () => {
    const myData = await getProfileService();
    setLoggedInUser(myData?.data?.data);
  }

  useEffect(() => {
    getPrService()
  }, []);

  // useEffect(async () => {
  //   const myData = await getProfileService();
  //   setLoggedInUser(myData?.data?.data);
  // }, []);

  const refreshAllData = () => {
    getDetailsDataApi();
    getViewLeadCardDetailsServiceApiCall();
  };

  return (
    <>
      <div className="p-0 rounded-lg mx-0 relative mb-[60px]">
        <div className="flex flex-wrap justify-between w-full px-7 text-black dark:text-white">
          <div className="w-fit mb-3">
            <h1 className={` ${mode === "dark" ? "text-yellow-500" : "text-black"}  text-xl font-semibold`}>View Lead</h1>
            <p className="text-sm font-thin">Manage your lead</p>
          </div>

          <div className="flex flex-wrap gap-5 md:gap-auto items-center">
            <div className="flex gap-2 items-center">
              <div className="h-7 w-[1px] bg-gray-400"></div>
              <p className="text-sm">{data.total_calls} Total Calls</p>
              <div className="h-7 w-[1px] bg-gray-400"></div>
              <p className="text-sm">{data.connected_calls} Connected Calls</p>
              <div className="h-7 w-[1px] bg-gray-400"></div>
              <p className="text-sm">{data.reached_out_count} Reach Out</p>
              <div className="h-7 w-[1px] bg-gray-400"></div>
              <p className="text-sm">{data.interaction_count} Interaction</p>
              <div className="h-7 w-[1px] bg-gray-400"></div>
              <p className="text-sm">{data.interest_count} Interest Count</p>
              <div className="h-7 w-[1px] bg-gray-400"></div>
              <p className="text-sm">{data.vc_count} Video Call</p>
              <div className="h-7 w-[1px] bg-gray-400"></div>
              <p className="text-sm">{data.visit_count} Visit</p>
              <div className="h-7 w-[1px] bg-gray-400"></div>
            </div>

            <div className="flex gap-4 items-center">
              {leadModulePermission.lead_management === "edit" && (
                <div className="flex items-center gap-1">
                  <Tooltip title="Call">
                    <span className="flex items-center justify-center w-6 h-6 cursor-pointer">
                      <IoMdCall className="text-lg hover:text-orange-500" onClick={handleAudioCall} />
                    </span>
                  </Tooltip>

                  <Tooltip title="Payment">
                    <span className="flex items-center justify-center w-6 h-6 cursor-pointer">
                      <MdPayment className="text-lg hover:text-orange-500" onClick={() => {
                        setPaymentAlert({});
                        setOpenPaymentLinkForm(true);
                      }} />
                    </span>
                  </Tooltip>

                  <Tooltip title="Email">
                    <span className="flex items-center justify-center w-6 h-6 cursor-pointer">
                      <MdEmail className="text-lg hover:text-orange-500" onClick={handleEmail} />
                    </span>
                  </Tooltip>

                  <Tooltip title="Whatsapp">
                    <span className="flex items-center justify-center w-6 h-6 cursor-pointer">
                      <IoLogoWhatsapp className="text-lg hover:text-orange-500" onClick={handleWhatsapp} />
                    </span>
                  </Tooltip>

                  <Tooltip title="Add Tag">
                    <span className="flex items-center justify-center w-6 h-6 cursor-pointer">
                      <TagFilled className="text-lg hover:text-orange-500" onClick={() => setTagDrawerOpen(true)} />
                    </span>
                  </Tooltip>

                  <Tooltip title="Transfer">
                    <span className="flex items-center justify-center w-6 h-6 cursor-pointer">
                      <SwapOutlined className="text-lg hover:text-orange-500" onClick={() => setOpenTransferDrawer(true)} />
                    </span>
                  </Tooltip>
                </div>
              )}

              <button
                onClick={() => history.go(-1)}
                className="underline block pl-45 md:pl-0"
              >
                Back
              </button>

            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 py-5 px-5 rounded-lg mx-6 relative mb-[15px] dark:text-white text-black">
          <Row gutter={[16, 16]}>

            {fieldsWithValues.map((field, index) => (
              <Col
                key={field.code || `field-${index}`}
                xs={24}
                sm={12}
                md={8}
                lg={6}
              >
                <div className="w-full overflow-hidden">

                  <h1 className="font-semibold text-sm break-words">
                    {field.label}
                  </h1>

                  {field.type === "radio" ? (
                    <p className="text-sm mt-1">
                      {field.value === true ? "Yes" : "No"}
                    </p>
                  ) : (
                    <p
                      className="text-sm mt-1 line-clamp-2 break-all whitespace-normal cursor-pointer"
                      title={field.value}
                    >
                      {field.value}
                    </p>
                  )}

                </div>
              </Col>
            ))}

            {additionalFieldsWithValues.map((field, index) => (
              <Col
                key={field.key || `additional-${index}`}
                xs={24}
                sm={12}
                md={8}
                lg={6}
              >
                <div className="w-full overflow-hidden">

                  <h1 className="font-semibold text-sm break-words">
                    {field.label}
                  </h1>

                  <p
                    className="text-sm mt-1 line-clamp-2 break-all whitespace-normal cursor-pointer"
                    title={field.value}
                  >
                    {field.value}
                  </p>

                </div>
              </Col>
            ))}

          </Row>

          {!loading &&
            fieldsWithValues.length === 0 &&
            additionalFieldsWithValues.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No lead data available
                </p>
              </div>
            )}
        </div>

        <div className="bg-white dark:bg-gray-800 text-black p-5 rounded-lg mx-6 relative">
          <TabLeadCard
            moreinfoData={moreinfoData}
            packageData={packageData}
            followupData={followupData}
            activityList={activityList}
            userData={userData}
            transactionList={transactionList}
            transactionPaymentDetails={transactionPaymentDetails}
            followUpModalOpenFunction={followUpModalOpenFunction}
            showModal={showModal}
            setIsModalOpenTransactionFun={setIsModalOpenTransactionFun}
            getDetailsDataApi={getDetailsDataApi}
            laedreminderList={laedreminderList}
            isRegistered={isRegistered}
            packageList={packageList}
            leadFollowupListGetApi={leadFollowupListGetApi}
            leadFollowupList={leadFollowupList}
            leadReminderListGetApi={leadReminderListGetApi}
            leadActivityListGetApi={leadActivityListGetApi}
            leadTransactionListGetApi={leadTransactionListGetApi}
            leadPackageListGetApi={leadPackageListGetApi}
            userDataDetails={userDataDetails}
          />
        </div>
        <br />
      </div>

      <div className="h-18 overflow-x-scroll md:overflow-hidden w-[100%] fixed bottom-0 bg-white dark:bg-gray-800 border-t border-slate-200 dark:border-slate-700 z-10">
        <div className="w-[max-content] md:w-[78%] h-full flex items-center justify-between px-2">
          <div className="flex gap-3">
            <h2 className="inline-flex text-success bg-opacity-10 rounded-md py-1 px-3 text-sm font-medium">
              Status: {leadstatus && leadstatus}
            </h2>
            <h2 className="inline-flex text-orange-500 bg-opacity-10 rounded-md py-1 px-3 text-sm font-medium">
              Sub Status: {data?.last_sub_status}
            </h2>

            {leadModulePermission.lead_management === "edit" && (
              <h2 className="inline-flex items-center gap-2 bg-yellow-100 text-warning rounded-md py-1 px-2 text-sm font-medium">
                <button
                  type="button"
                  className="px-1 py-1 bg-yellow text-black text-xs font-medium"
                  onClick={() => setOpenSubStatusDrawer(true)}
                >
                  {subleadstatus?.name || "Change Status"}
                </button>
              </h2>
            )}

          </div>

          {leadModulePermission.lead_management === "edit" && (
            <div className="flex items-center ml-auto">
              <PrimaryButton
                type="primary"
                className="px-6 py-5 text-black text-lg rounded-md"
                onClick={() => setOpenEditDrawer(true)}
              >
                <EditOutlined />
              </PrimaryButton>

            </div>
          )}


          {leadModulePermission.lead_management === "edit" && (
            <div className="h-full flex items-center">

              <div className="grid grid-rows-1 grid-flow-col gap-2 ml-2">
                {isRegistered !== "registered" && (
                  <OutLineButton
                    title="Register Lead"
                    onclick={showModal}
                    className="py-5"
                  />
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Transaction Drawer */}
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
          isshowBackButton={false}
          leadTransactionListGetApi={leadTransactionListGetApi}
          isModalOpenTransaction={isModalOpenTransaction}
          leadPackageListGetApi={leadPackageListGetApi}
          isLead="lead"
        />
      </Drawer>

      {/* Package Drawer */}
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
            getDetailsDataApi={getDetailsDataApi}
            setIsSelectedPackage={setIsSelectedPackage}
          />
        )}
        {nextpage === "pakageviewpage" && (
          <ViewLeadPackage
            packageData={packageData}
            gridCol="grid-cols-1"
            setNextPage={setNextPage}
            id={id}
            isSelectedPackage={isSelectedPackage}
            getDetailsDataApi={getDetailsDataApi}
            leadPackageListGetApi={leadPackageListGetApi}
            setRegisteredLeadSuccess={setRegisteredLeadSuccess}
            userData={userData}
          />
        )}
        {nextpage === "pakageTransactionpage" && (
          <PostTransaction
            setNextPage={setNextPage}
            packageData={packageData}
            userData={userData}
            getDetailsDataApi={getDetailsDataApi}
            isshowBackButton={true}
            setIsModalOpen={setIsModalOpen}
            isModalOpenTransaction={isModalOpenTransaction}
            setIsModalOpenTransaction={setIsModalOpenTransaction}
            leadTransactionListGetApi={leadTransactionListGetApi}
            isModalOpen={isModalOpen}
            leadPackageListGetApi={leadPackageListGetApi}
            isLead="lead"
          />
        )}
      </Drawer>

      {/* Sub Status List Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-yellow-400/20 text-yellow-500">
              <SwapOutlined className="text-lg" />
            </div>

            <div>
              <h2 className="text-base font-semibold leading-none">
                Select Sub Status
              </h2>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Update lead progress
              </p>
            </div>
          </div>
        }
        placement="right"
        width={420}
        open={openSubStatusDrawer}
        onClose={() => setOpenSubStatusDrawer(false)}
        closeIcon={<ArrowLeftOutlined />}
        className="[&_.ant-drawer-header]:border-b [&_.ant-drawer-header]:border-gray-200 dark:[&_.ant-drawer-header]:border-gray-800 [&_.ant-drawer-body]:p-0"
      >
        <div className="h-full flex flex-col bg-white dark:bg-[#0B1120]">

          {/* Current Status */}
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between rounded-2xl bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 px-4 py-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Current Status
                </p>

                <h3 className="font-semibold text-yellow-600 dark:text-yellow-400">
                  {subleadstatus?.name || "Not Selected"}
                </h3>
              </div>

              <Badge status="processing" />
            </div>
          </div>

          {/* Status List */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

            {leadSubStatusDropdown?.length > 0 ? (
              sortedSubStatusList.map((status) => {
                const isActive =
                  subleadstatus?.lead_sub_status_id ===
                  status.lead_sub_status_id;

                return (
                  <button
                    key={status.lead_sub_status_id}
                    id={`sub-${status.lead_sub_status_id}`}
                    disabled={subStatusLoading}
                    onClick={() => handleSubStatusClick(status)}
                    className={`
                     group
                     relative
                     w-full
                     rounded-2xl
                     border
                     px-4
                     py-4
                     text-left
                     transition-all
                     duration-200
     
                     ${isActive
                        ? `
                           border-yellow-400
                           bg-yellow-50
                           dark:bg-yellow-500/10
                           shadow-md
                         `
                        : `
                           border-gray-200
                           dark:border-gray-800
                           bg-white
                           dark:bg-[#111827]
                           hover:border-yellow-400
                           hover:shadow-lg
                           hover:-translate-y-[2px]
                         `
                      }
     
                     ${subStatusLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                      }
                   `}
                  >

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse" />
                    )}

                    <div className="flex items-center justify-between gap-3">

                      <div className="flex flex-col">
                        <h3
                          className={`
                           text-sm
                           font-semibold
                           transition-colors
     
                           ${isActive
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-gray-800 dark:text-gray-100"
                            }
                         `}
                        >
                          {status.lead_sub_status_name}
                        </h3>

                      </div>

                      <div
                        className={`
                         w-8
                         h-8
                         rounded-xl
                         flex
                         items-center
                         justify-center
                         transition-all
     
                         ${isActive
                            ? `
                               bg-yellow-400
                               text-black
                             `
                            : `
                               bg-gray-100
                               dark:bg-gray-800
                               text-gray-500
                               group-hover:bg-yellow-400
                               group-hover:text-black
                             `
                          }
                       `}
                      >
                        →
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                    <SwapOutlined className="text-2xl text-gray-400" />
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No sub status available
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Drawer>


      {/* Followup Drawer */}

      <Drawer
        title={
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-yellow-400/15 text-yellow-500">
              <MdOutlineSchedule className="text-lg" />
            </div>

            <div>
              <h2 className="text-base font-semibold leading-none">
                Add Followup
              </h2>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Schedule next lead action
              </p>
            </div>
          </div>
        }
        placement="right"
        width={420}
        open={openFollowupDrawer}
        onClose={() => {
          setOpenFollowupDrawer(false);
          setFollowupStep(FOLLOWUP_STEPS.LIST);
          setOpenSubStatusDrawer(true);
        }}
        closeIcon={<ArrowLeftOutlined />}
        rootClassName="modern-drawer"
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <div className="h-full flex flex-col bg-white dark:bg-[#0B1120]">

          {/* Top Info */}
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">

            <div className="rounded-2xl border border-yellow-200 dark:border-yellow-500/20 bg-yellow-50 dark:bg-yellow-500/10 p-4">

              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Selected Sub Status
              </p>

              <h3 className="font-semibold text-yellow-600 dark:text-yellow-400">
                {selectedSubStatus?.lead_sub_status_name || "Followup"}
              </h3>

            </div>

          </div>

          {/* Form Area */}
          <div className="flex-1 overflow-y-auto px-5 py-5">

            <AddFollowup
              id={id}
              dataForMetaPush={dataForMetaPush}
              leadSubStatus={selectedSubStatus}
              leadStatusId={leadStatusId}
              setIsFollowUpModalOpen={setOpenFollowupDrawer}
              getDetailsDataApi={getDetailsDataApi}
              leadFollowupListGetApi={leadFollowupListGetApi}
            />

          </div>

        </div>
      </Drawer>

      {/* Remarks Drawer */}

      <Drawer
        title={
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-yellow-400/15 text-yellow-500">
              ✎
            </div>

            <div>
              <h2 className="text-base font-semibold leading-none">
                Add Remarks
              </h2>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Update lead remark details
              </p>
            </div>
          </div>
        }
        placement="right"
        width={420}
        open={openRemarksDrawer}
        onClose={() => {
          setOpenRemarksDrawer(false);
          setFollowupStep(FOLLOWUP_STEPS.LIST);
          setOpenSubStatusDrawer(true);
        }}
        closeIcon={<ArrowLeftOutlined />}
        rootClassName="modern-drawer"
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <div className="h-full flex flex-col bg-white dark:bg-[#0B1120]">

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-5">

            {/* Info Card */}
            <div className="mb-5 rounded-2xl border border-yellow-200 dark:border-yellow-500/20 bg-yellow-50 dark:bg-yellow-500/10 p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Selected Sub Status
              </p>

              <h3 className="font-semibold text-yellow-600 dark:text-yellow-400">
                {selectedSubStatus?.lead_sub_status_name || "Remark Update"}
              </h3>
            </div>

            {/* Remark Field */}
            <div className="space-y-2">

              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Remark
              </label>

              <div className="relative">
                <TextArea
                  rows={8}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Write detailed remarks here..."
                  maxLength={200}
                  className="
                   !rounded-2xl
                   !bg-gray-50
                   dark:!bg-[#111827]
                   !border-gray-200
                   dark:!border-gray-700
                   hover:!border-yellow-400
                   focus:!border-yellow-500
                   !shadow-none
                   !text-sm
                   !py-3
                   !px-4
                 "
                />

                <div className="flex justify-end mt-2">
                  <span className="text-xs text-gray-400">
                    {remarks?.length || 0}/200
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-[#0B1120]">

            <PrimaryButton
              type="primary"
              title={subStatusLoading ? "Submitting..." : "Submit Remark"}
              disabled={subStatusLoading || !remarks?.trim()}
              className="
               w-full
               !h-[48px]
               !rounded-xl
               !bg-yellow-400
               hover:!bg-yellow-500
               !border-none
               !text-black
               !font-semibold
               !shadow-lg
               hover:!shadow-yellow-500/20
               transition-all
             "
              onClick={() => {

                patchSubStatusService(
                  {
                    lead_sub_status: selectedSubStatus.lead_sub_status_id,
                    remark: remarks,
                  },
                  id
                ).then(async (response) => {

                  if (response.data.success === "1") {

                    setOpenRemarksDrawer(false);
                    setRemarks("");
                    getDetailsDataApi();

                    message.success("Remark added successfully");

                    try {

                      if (Array.isArray(dataForMetaPush)) {

                        const phoneObj = dataForMetaPush.find(
                          (data) => data.code === "phone"
                        );

                        const emailObj = dataForMetaPush.find(
                          (data) => data.code === "email"
                        );

                        const phone = phoneObj ? phoneObj.value : "";
                        const email = emailObj ? emailObj.value : "";

                        if (phone || email) {

                          const userList = {
                            users: [
                              {
                                email,
                                phone,
                              },
                            ],
                            FB_CUSTOM_AUDIENCE_ID:
                              "120243338931080581",
                          };

                          await axios.post(
                            baseurl +
                            "/crmCallbacks/addAudienceToMetaAdd",
                            userList
                          );
                        }
                      }

                    } catch (metaError) {
                      console.error(
                        "META AUDIENCE PUSH ERROR:",
                        metaError
                      );
                    }
                  }
                });
              }}
            />

          </div>
        </div>
      </Drawer>


      {/* Video Call Drawer */}
      {videoCallId && (
        <Drawer
          title={
            <div className="flex items-center gap-2">
              <IoIosVideocam className="text-xl" />
              Video Call {videoCallId.name}
            </div>
          }
          placement="right"
          width={400}
          onClose={onVideoCallClose}
          open={openVideoCall}
        >
          {/* <ZoomMeeting /> */}
        </Drawer>
      )}
      {/* Video Call section */}

      {/* Audio Call Drawer */}
      {audioCallId && (
        <Drawer
          title={
            <div className="flex items-center gap-2">
              <IoMdCall className="text-xl" /> Call {audioCallId.name}
            </div>
          }
          placement="right"
          width={400}
          onClose={onAudioCallClose}
          open={openAudioCall}
        >
          <Call
            id={id}
            phone={phoneNumber}
            alternate={data?.alternate_mobile}
            father={data?.father_mobile}
            mother={data?.mother_mobile}
            setOpenAudioCall={setOpenAudioCall}
          />
        </Drawer>
      )}
      {/* Audio Call section */}

      {/* SMS Drawer */}
      {smsId && (
        <Drawer
          title={
            <div className="flex items-center gap-2">
              <MdSms className="text-xl" />
              Sms {smsId.name}
            </div>
          }
          placement="right"
          width={400}
          onClose={onSmsClose}
          open={openSms}
        >
          <Sms smsId={smsId} record={emailId} setOpenSms={setOpenSms} />
        </Drawer>
      )}
      {/* Sms section */}

      {/* Email Drawer */}
      {emailId && (
        <Drawer
          title={
            <div className="flex items-center gap-2">
              <MdEmail className="text-xl" />
              Send Email to {emailId.name}
            </div>
          }
          placement="right"
          width={400}
          onClose={onEmailClose}
          open={openEmail}
        >
          <Email record={emailId} setOpenEmail={setOpenEmail} />
        </Drawer>
      )}
      {/* Email section */}

      {/* Tags section */}

      <Drawer
        title="Select Lead Category"
        placement="right"
        width={350}
        onClose={closeTagDrawer}
        open={tagDrawerOpen}
        closeIcon={<ArrowLeftOutlined />}
      >
        <div className="flex flex-col h-full justify-between">

          {/* Category List */}
          <div className="flex flex-col gap-2">

            {leadCategories.map((item) => (
              <button
                key={item}
                onClick={() => setLeadCategory(item)}
                className={`
                  w-full text-left px-3 py-2 rounded-md border
                  transition-all duration-200
                  
                  ${leadCategory === item
                    ? "bg-warning/15 border-warning text-warning shadow-sm"
                    : "bg-white border-gray-200 text-gray-700"
                  }
      
                  hover:bg-warning/10 hover:border-warning hover:text-warning
                `}
              >
                {item}
              </button>
            ))}

          </div>

          {/* Update Button */}
          <div className="pt-4 border-t mt-4">
            <PrimaryButton
              title="Update"
              className="w-full !bg-yellow-400 hover:!bg-yellow-500 !text-black dark:text-white"
              onClick={() => {

                if (!leadCategory) {
                  message.warning("Please select a category");
                  return;
                }

                editLeadListService(
                  leadsource, id,
                  {
                    "field_data": [{
                      "code": "lead_category",
                      "value": leadCategory
                    }],
                    assign_to: assignedToUsername,
                    campaign: campaign,
                    lead_status: leadStatusId
                  });

                // updateLeadCategoryService(id, leadCategory).then(() => {
                //   message.success("Lead Category Updated");
                //   setTagDrawerOpen(false);
                // });
                setTagDrawerOpen(false);
              }}
            />
          </div>

        </div>
      </Drawer>

      {/* Tags section */}

      {/* Transfer Lead Drawer */}

      <Drawer
        title="Transfer Lead"
        placement="right"
        width={350}
        open={openTransferDrawer}
        onClose={() => setOpenTransferDrawer(false)}
        closeIcon={<ArrowLeftOutlined />}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            transferLeadApi();
          }}
          className="flex flex-col h-full justify-between"
        >
          {/* Body */}
          <div className="flex flex-col gap-2">

            <label>
              Assign to <sup className="text-red-500">*</sup>
            </label>

            <CustomSelectInput
              size="large"
              name="counsellor"
              placeholder="Select Counsellor"
              value={counsellor}
              errors={counsellorError}
              onChange={(value) => setCounsellor(value)}
              options={counsellorDropdown.map((item) => ({
                value: item.username,
                label: item.email,
              }))}
            />

          </div>

          {/* Footer */}
          <div className="pt-4 border-t mt-4">

            <PrimaryButton
              htmlType="submit"
              title="Transfer"
              disabled={transferLoading}
              className="w-full !bg-yellow-400 hover:!bg-yellow-500 !text-black dark:text-white"
            />

          </div>
        </form>
      </Drawer>


      {/* Transfer Lead Drawer */}

      {/* Whatsapp section */}
      {whatsappId && (

        // <Modal
        //   title="Whatsapp Messages"
        //   centered
        //   open={openWhatsapp}
        //   onOk={onWhatsappClose}
        //   onCancel={onWhatsappClose}
        //   Style={{
        //     padding: 0,
        //     maxHeight: "80vh",
        //     overflow: "hidden",
        //     maxWidth: "95vw",
        //   }}
        // >
        //   {
        //     formData &&
        //     (
        //       <>
        //         <iframe src={`https://yesgermany.org/app/whatsappExternal?name=${formData?.[0]?.value}&email=${formData?.[1]?.value}&phone=${formData?.[2]?.value?.replaceAll("+", "")}`} width={"100%"} style={{ minHeight: "60vh", border: "none" }} frameborder="0"></iframe>
        //       </>
        //     )
        //   }
        // </Modal>

        <Drawer
          title={
            <div className="flex items-center gap-2">
              <IoLogoWhatsapp className="text-xl" />
              Send message to {leadName}
            </div>
          }
          placement="right"
          width={420}
          onClose={onWhatsappClose}
          open={openWhatsapp}
        >
          <Whatsapp
            smsId={smsId}
            record={emailId}
            setOpenWhatsapp={setOpenWhatsapp}
            id={id}
            phoneNumber={phoneNumber}
            fieldsWithValues={fieldsWithValues}
          />
        </Drawer>
      )}

      {/* Whatsapp section */}
      {openPaymentLinkForm ? <Drawer
        open={openPaymentLinkForm}
        onClose={() => setOpenPaymentLinkForm(false)}
        title={"Payment Link"}
        placement="right"
        width={600}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <EaseBuzzPaymentForm
            studentInfo={[...fieldsWithValues, { code: 'username', value: userData }]}
            getLeadPackageListService={getLeadPackageListService}
            setAlert={setPaymentAlert}
            alert={paymentAlert}
            setOpenPaymentLinkForm={setOpenPaymentLinkForm}
            loggedInUser={loggedInUser}
            leadId={id}
          />
        </Suspense>
      </Drawer> : null}

      <EditLeadDrawer
        open={openEditDrawer}
        onClose={() => setOpenEditDrawer(false)}
        leadId={id}
        mode={mode}
        refreshData={refreshAllData}
      />

    </>
  );
};
