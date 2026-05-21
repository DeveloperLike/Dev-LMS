import { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import PageTitle from "./Components/PageTitle";
import SignIn from "./Pages/Authentication/SignIn";
import PaymentRedirection from './Pages/PublicPages/EaseBuzz/PaymentRedirection';
import PayLink from "./Pages/PublicPages/EaseBuzz/PayLink";
import DefaultLayout from "./lib/Layout/DefaultLayout";
import RoleList from "./Pages/Role/RoleList";
import UserList from "./Pages/User/UserList";
import AddUser from "./Pages/User/AddUser";
import AddRole from "./Pages/Role/AddRole";
import { ConfigProvider, message, Modal, theme } from "antd";
import OtpLogin from "./Pages/Authentication/OtpLogin";
import OtpVerify from "./Pages/Authentication/OtpVerify";
import Branch from "./Pages/Branch/Branch";
import EditRole from "./Pages/Role/EditRole";
import EditUser from "./Pages/User/EditUser";
import City from "./Pages/City/City";
import State from "./Pages/State/State";
import Leads2 from "./Pages/Lead/Lead";
import { Viewlead } from "./Pages/Lead/ViewLead";
import AddLeadForm2 from "./Pages/Lead/AddLead";
import { EditLeadField } from "./Pages/Lead/EditLeadfeild";
import FormField from "./Pages/LeadForm/FormField";
import Package from "./Pages/Package/Package";
import AddPackage from "./Pages/Package/AddPackage";
import EditPackage from "./Pages/Package/EditPackage";
import { AddEmailTemplate } from "./Pages/Template/EmailTemplate/AddEmailTemplate";
import { EditEmailTemplate } from "./Pages/Template/EmailTemplate/EditEmailTemplate";
import { EmailBuilder } from "./Pages/Template/EmailTemplate/Components/EmailBuilder";
import { useDispatch, useSelector } from "react-redux";
import AssignmentRule from "./Pages/AssignmentRule/AssignmentRule";
import { NotFound } from "./Pages/NotFound";
import { Dashboard } from "./Pages/Dashboard/Dashboard";
import Addvancedleadfilter from "./Pages/Lead/LeadAddvancedfilter";
import Widget from "./Pages/Lead/Widget";
import Template from "./Pages/Template/Template";
import { EditEmailBuilder } from "./Pages/Template/EmailTemplate/Components/EditEmailBuilder";
import LoaderComponent from "./Components/Loader";
import LeadStatus from "./Pages/LeadStatus/LeadStatus";
import LeadSubStatus from "./Pages/LeadSubStatus/LeadSubStatus";
import CustomiseWidget from "./Pages/Lead/CustomiseWidget";
import BulkActions from "./Pages/Bulk Actions/BulkActions";
import { Profile } from "./Pages/Profile/Profile";
import Reminder from "./Pages/My Reminders/Reminder";
import Followup from "./Pages/My Followup/Followup";
import { UnassignedLead } from "./Pages/Unassignedlead/UnassignedLead";
import RegisteredUsers from "./Pages/Registered Users/RegisteredUsers";
import { UserDetails } from "./Pages/Registered Users/UserDetails";
import AnalyticsLineChart from "./Pages/Analytics/AnalyticsByCity";
import { StatusWiseLead } from "./Pages/StatusWiseLead/StatusWiseLead";
import { IntegrationPartners } from "./Pages/IntegrationPartners/IntegrationPartners";
import DripMarketingRule from "./Pages/Drip Marketing Rule/DripMarketingRule";
import AddDripMarketingRule from "./Pages/Drip Marketing Rule/AddDripMarketingRule";
import EditDripMarketingRule from "./Pages/Drip Marketing Rule/EditDripMarketingRule";
import { AnalysisByState } from "./Pages/Analytics/AnalysisByState";
import { AnalysisByLeadSource } from "./Pages/Analytics/AnalysisByLeadSource";
import LeadStatusDetails from "./Pages/LeadStatus/LeadStatusDetails";
import TicketList from "./Pages/SupportManagement/TicketList";
import { ViewTicketList } from "./Pages/SupportManagement/ViewTicketList";
import AddTicket from "./Pages/SupportManagement/AddTicket";
import CallLogs from "./Pages/Reports/Call Logs/CallLogs.jsx";
import CallReport from "./Pages/Reports/Call Report/CallReport.jsx";
import VisaApplication from "./Pages/Visa Management/VisaApplication";
import Document from "./Pages/Document Management/Document/Document";
import University from "./Pages/University/University";
import Course from "./Pages/Course/Course";
import DocumentCategory from "./Pages/Document Management/Document Category/DocumentCategory";
import CourseAdmissionApplication from "./Pages/CourseAdmissionApplication/CourseAdmissionApplication";
import Documents from "./Pages/Document Management/Document Category/Documents";
import { LeadSourceAnalytics } from "./Pages/Analytics/LeadSourceAnalytics";
import SaleAnalyticsChart from "./Pages/Analytics/SaleAnalytics/SaleAnalytics";
import { AnalyticsDashboard } from "./Pages/Analytics/AnalyticsDashboard/AnalyticsDashboard";
import AccommodationList from "./Pages/Accommodation/AccommodationList";
import LeadCategory from "./Pages/Marketing Management/Lead Category/LeadCategory";
import Campaign from "./Pages/Marketing Management/Campaign/Campaign";
import FaceBook from "./Pages/Integration/FaceBook/FaceBook";
import FaceBookPageList from "./Pages/Integration/FaceBook/FaceBookPageList";
import FacebookAdsAccount from "./Pages/Integration/FaceBookAdsAccount/FacebookAdsAccount";
import FacebookAdsAccountList from "./Pages/Integration/FaceBookAdsAccount/FacebookAdsAccountList";
import FacebookMainPage from "./Pages/Integration/FaceBook/FacebookMainPage";
import { RegisteredUserPage } from "./Pages/Registered Users/RegisteredUserPage";
import GoogleIntegration from "./Pages/Integration/Google/GoogleIntegration";
// import NotificationTesting from "./notification";
// import { onMessageListener, requestForToken } from "./firebase";
// import { onMessageListener, requestForToken, messaging } from "./firebase"; 
// import { onMessage } from "firebase/messaging";

// import { socket } from "./socket.js";
import FollowupNew from "./Pages/My Followup/FollowupNew.jsx";
import LeadStatusAnalytics from "./Pages/Analytics/LeadStatusAnalytics.jsx";
import WhatsAppLayout from "./Pages/NewWhatsapp/WhatsAppLayout.jsx";

import ExportLayout from "./Pages/Export/ExportLayout.jsx";
import ExportOptions from "./Pages/Export/ExportOptions.jsx";


import ChatWindow from "./Pages/NewWhatsapp/ChatWindow.jsx";
import Sales from "./Pages/Sales/sales.jsx";
import LeadFunnel from "./Pages/Reports/Lead Funnel/LeadFunnel.jsx";
import BranchPerfomance from "./Pages/Reports/Branch Perfomance/BranchPerfomance.jsx";
import UserPerfomance from "./Pages/Reports/User Perfomance/UserPerfomance.jsx";
import MarketingPerformance from "./Pages/Reports/Marketing Perfomance/MarketingPerfomance.jsx";
import LeadSource from "./Pages/LeadSource/LeadSource.jsx";
import FacebookPerformance from "./Pages/Reports/Facebook Performance/FacebookPerformance.jsx";
import GoogleSearchConsole from "./Pages/Reports/Google Search Console/GoogleSearchConsole.jsx";
import GoogleAnalytics from "./Pages/Reports/Google Analytics/GoogleAnalytics.jsx";
import MailSettings from "./Pages/Integration/MailSettings/MailSettings.jsx";

function App() {
  const [mode, setMode] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setMode(localStorage.getItem("theme") || "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const [notifications, setNotifications] = useState([])

  // const [token, setToken] = useState(localStorage.getItem('token'))
  // #######################################################


  const [loading, setLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modulePermission = useSelector(
    (state) => state.permissions.permissionsData
  ) || {};

  const { pathname } = useLocation();

  const dispatch = useDispatch();

  const closeNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notif) => notif.id !== id)
    );
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);



  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // useEffect(() => {
  //   requestForToken().then((token) => {
  //     if (token) {
  //       setFcmToken(token);
  //       console.log("FCM Token:", token);
  //     }
  //   });

  //   const unsubscribe = onMessageListener().then((payload) => {
  //     console.log("firebase hits")
  //     const newNotification = {
  //       id: Date.now(),
  //       title: payload.notification.title,
  //       body: payload.notification.body,
  //     };
  //     setNotifications((prevNotifications) => [
  //       ...prevNotifications,
  //       newNotification,
  //     ]);
  //     setIsModalOpen(true); 
  //   });

  //   return () => {
  //     unsubscribe.catch((err) => message.error("Error unsubscribing:", err));
  //   };
  // }, [notifications?.title]); 


  //   useEffect(() => {
  //   // Request permission and get token
  //   requestForToken().then((token) => {
  //     if (token) {
  //       setFcmToken(token);
  //       console.log("FCM Token:", token);
  //     }
  //   });

  //   // Set up the real-time listener for foreground messages
  //   const unsubscribe = onMessage(messaging, (payload) => {
  //     console.log("Firebase hits:", payload);
  //     const newNotification = {
  //       id: Date.now(),
  //       title: payload.notification.title,
  //       body: payload.notification.body,
  //     };
  //     setNotifications((prevNotifications) => [
  //       ...prevNotifications,
  //       newNotification,
  //     ]);
  //     setIsModalOpen(true);
  //   });

  //   // The cleanup function for the listener
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);


  // console.log(notifications,"notifications")

  return loading ? (
    <LoaderComponent />
  ) : (
    <>
      <ConfigProvider
        theme={{
          algorithm:
            mode === "dark"
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,

          token: {
            colorPrimary: "#FFCE00",
            colorBgBase: mode === "dark" ? "#000000" : "#ffffff",
            colorTextBase: mode === "dark" ? "#ffffff" : "#000000",
            colorBorder: mode === "dark" ? "#000000" : "#d9d9d9",
            // colorFillSecondary: mode === "dark" ? "#ffffff" : "#000000",
          },

          components: {
            Table: {
              headerBg: mode === "dark" ? "#000000" : "#fafafa",
              rowHoverBg: mode === "dark" ? "#000000" : "#f5f5f5",
            },

            Pagination: {
              itemBg: mode === "dark" ? "#000000" : "#ffffff",
            },

            Modal: {
              contentBg: mode === "dark" ? "#000000" : "#ffffff",
            },

            Input: {
              colorBgContainer: mode === "dark" ? "#000000" : "#ffffff",
            },

            Select: {
              colorBgContainer: mode === "dark" ? "#000000" : "#ffffff",
            },
          },
        }}
      >

        <Routes>

          <Route
            index
            element={
              <>
                <PageTitle title="Log In" />
                <SignIn mode={mode} />
              </>
            }
          />
          <Route
            path="/login-with-otp"
            element={
              <>
                <PageTitle title="Log In with OTP" />
                <OtpLogin mode={mode} />
              </>
            }
          />
          <Route
            path="/verify-with-otp"
            element={
              <>
                <PageTitle title="Verify OTP" />
                <OtpVerify mode={mode} />
              </>
            }
          />
          <Route
            path="/payment"
            element={
              <>
                <PageTitle title="Payment" />
                <PaymentRedirection />
              </>
            }
          />
          <Route
            path="/pay"
            element={
              <>
                <PageTitle title="Payment" />
                <PayLink />
              </>
            }
          />
          {
            <>
              <Route
                path="/roles"
                element={
                  <>
                    <PageTitle title="Role" />
                    <DefaultLayout>
                      {modulePermission.role_management === "no_access" ? (
                        <NotFound />
                      ) : (
                        <RoleList mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />
              <Route
                path="/roles/add-role"
                element={
                  <>
                    <PageTitle title="Add Role" />
                    <DefaultLayout>
                      {modulePermission.staff_management === "no_access" ? (
                        <NotFound />
                      ) : (
                        <AddRole mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />
              <Route
                path="/roles/edit-role/:id"
                element={
                  <>
                    <PageTitle title="Edit Role" />
                    <DefaultLayout>
                      {modulePermission.staff_management === "no_access" ? (
                        <NotFound />
                      ) : (
                        <EditRole mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />
            </>
          }
          {
            <>
              <Route
                path="/users"
                element={
                  <>
                    <PageTitle title="User" />
                    <DefaultLayout>
                      {modulePermission.staff_management === "no_access" ? (
                        <NotFound />
                      ) : (
                        <UserList mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />
              <Route
                path="/users/add-user"
                element={
                  <>
                    <PageTitle title="Add User" />
                    <DefaultLayout>
                      {modulePermission.staff_management === "no_access" ? (
                        <NotFound />
                      ) : (
                        <AddUser mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />
              <Route
                path="/users/edit-user/:id"
                element={
                  <>
                    <PageTitle title="Edit User" />
                    <DefaultLayout>
                      {modulePermission.staff_management === "no_access" ? (
                        <NotFound />
                      ) : (
                        <EditUser mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />
            </>
          }
          <Route
            path="/branch"
            element={
              <>
                <PageTitle title="Branch" />
                <DefaultLayout>
                  {modulePermission.branch_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <Branch mode={mode} />
                  )}
                </DefaultLayout>
              </>
            }
          />
          <Route
            path="/city"
            element={
              <>
                <PageTitle title="City" />
                <DefaultLayout>
                  {modulePermission.city_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <City mode={mode} />
                  )}
                </DefaultLayout>
              </>
            }
          />
          <Route
            path="/state"
            element={
              <>
                <PageTitle title="State" />
                <DefaultLayout>
                  {modulePermission.state_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <State mode={mode} />
                  )}
                </DefaultLayout>
              </>
            }
          />
          <Route
            path="/lead-source"
            element={
              <>
                <PageTitle title="Lead Source" />
                <DefaultLayout>
                  {modulePermission.state_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <LeadSource />
                  )}
                </DefaultLayout>
              </>
            }
          />
          {modulePermission.user_group === "admin" && (
            <Route
              path="/lead-status"
              element={
                <>
                  <PageTitle title="Lead Status" />
                  <DefaultLayout>
                    {modulePermission.lead_management === "no_access" ? (
                      <NotFound />
                    ) : (
                      <LeadStatus mode={mode} />
                    )}
                  </DefaultLayout>
                </>
              }
            />
          )}
          {modulePermission.user_group === "admin" && (
            <Route
              path="/lead-status/:id"
              element={
                <>
                  <PageTitle title="Lead Sub Status" />
                  <DefaultLayout>
                    {modulePermission.lead_management === "no_access" ? (
                      <NotFound />
                    ) : (
                      <LeadStatusDetails mode={mode} />
                    )}
                  </DefaultLayout>
                </>
              }
            />
          )}
          {modulePermission.user_group === "admin" && (
            <Route
              path="/lead-sub-status"
              element={
                <>
                  <PageTitle title="Lead Sub Status" />
                  <DefaultLayout>
                    {modulePermission.lead_management === "no_access" ? (
                      <NotFound />
                    ) : (
                      <LeadSubStatus mode={mode} />
                    )}
                  </DefaultLayout>
                </>
              }
            />
          )}
          {
            // modulePermission.user_group === "admin" &&
            <Route
              path="/bulk-actions"
              element={
                <>
                  <PageTitle title="Bulk Actions" />
                  <DefaultLayout>
                    {modulePermission.bulk_action_management === "no_access" ? (
                      <NotFound />
                    ) : (
                      <BulkActions mode={mode} />
                    )}
                  </DefaultLayout>
                </>
              }
            />
          }
          {modulePermission.user_group === "admin" && (
            <Route
              path="/customise-widget"
              element={
                <>
                  <PageTitle title="Customise Widget" />
                  <DefaultLayout>
                    {modulePermission.lead_management === "no_access" ? (
                      <NotFound />
                    ) : (
                      <CustomiseWidget mode={mode} />
                    )}
                  </DefaultLayout>
                </>
              }
            />
          )}

          <Route
            path="/whatsapp"
            element={
              <>
                <PageTitle title="WhatsApp" />
                <DefaultLayout>
                  <WhatsAppLayout />
                </DefaultLayout>
              </>
            }
          >
            <Route index element={<ChatWindow />} />
          </Route>

          <Route
            path="/export"
            element={
              <>
                <PageTitle title="Export" />
                <DefaultLayout>
                  <ExportLayout />
                </DefaultLayout>
              </>
            }
          >
            <Route index element={<ExportOptions />} />
          </Route>

          <Route
            path="/sales"
            element={
              <>
                <PageTitle title="sales" />
                <DefaultLayout>
                  <Sales />
                </DefaultLayout>
              </>
            }
          >
          </Route>

          <Route
            path="/form-field"
            element={
              <>
                <PageTitle title="Form Field" />
                <DefaultLayout>
                  {modulePermission.lead_form_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <FormField mode={mode} />
                  )}
                </DefaultLayout>
              </>
            }
          />
          {
            <>
              <Route
                path="/lead"
                element={
                  <>
                    <PageTitle title="Lead" />
                    <DefaultLayout>
                      {modulePermission.lead_management === "no_access" ? (
                        <NotFound />
                      ) : (
                        <Leads2 mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />
              <Route
                path="/add-lead"
                element={
                  <>
                    <PageTitle title="Add Lead" />
                    <DefaultLayout>
                      {modulePermission.lead_management === "no_access" ? (
                        <NotFound />
                      ) : (
                        <AddLeadForm2 mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />
              <Route
                path="/lead-filter"
                element={
                  <>
                    <PageTitle title="Lead Filter" />
                    <DefaultLayout>
                      {modulePermission.lead_management === "no_access" ? (
                        <NotFound />
                      ) : (
                        <Addvancedleadfilter mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />
              <Route
                path="/lead-filter/:leadstatus"
                element={
                  <>
                    <PageTitle title="Lead Filter" />
                    <DefaultLayout>
                      {modulePermission.lead_management === "no_access" ? (
                        <NotFound />
                      ) : (
                        <Leads2 mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />
              <Route
                path="/widget"
                element={
                  <>
                    <PageTitle title="Widget" />
                    <DefaultLayout>
                      {modulePermission.lead_management === "no_access" ? (
                        <NotFound />
                      ) : (
                        <Widget mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />
              <Route
                path="/profile"
                element={
                  <>
                    <PageTitle title="Profile" />
                    <DefaultLayout>
                      <Profile mode={mode} />
                    </DefaultLayout>
                  </>
                }
              />

              <Route
                path="/registered-users"
                element={
                  <>
                    <PageTitle title="Registered User" />
                    <DefaultLayout>
                      {modulePermission.finance_management === "no_access" &&
                        modulePermission.registered_students_management ===
                        "no_access" ? (
                        <NotFound />
                      ) : (
                        <RegisteredUserPage mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />

              <Route
                path="/user-details/:id"
                element={
                  <>
                    <PageTitle title="Registered User Details" />
                    <DefaultLayout>
                      {modulePermission.finance_management === "no_access" &&
                        modulePermission.registered_students_management ===
                        "no_access" ? (
                        <NotFound />
                      ) : (
                        <UserDetails mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />

              <Route
                path="/view-lead/:id"
                element={
                  <>
                    <PageTitle title="View Lead" />
                    <DefaultLayout>
                      {modulePermission.lead_management === "no_access" ? (
                        <NotFound />
                      ) : (
                        <Viewlead mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />
              <Route
                path="/edit-lead/:id"
                element={
                  <>
                    <PageTitle title="Edit Lead" />
                    <DefaultLayout>
                      {modulePermission.lead_management === "no_access" ? (
                        <NotFound />
                      ) : (
                        <EditLeadField mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />
            </>
          }
          <Route
            path="/drip-marketing-rule"
            element={
              <>
                <PageTitle title="Drip Marketing Rule" />
                <DefaultLayout>
                  {modulePermission.assignment_rule_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <DripMarketingRule />
                  )}
                </DefaultLayout>
              </>
            }
          />
          <Route
            path="/drip-marketing-rule/add-drip-marketing-rule"
            element={
              <>
                <PageTitle title="Add Drip Marketing Rule" />
                <DefaultLayout>
                  {modulePermission.assignment_rule_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <AddDripMarketingRule />
                  )}
                </DefaultLayout>
              </>
            }
          />
          <Route
            path="/drip-marketing-rule/edit-drip-marketing-rule/:id"
            element={
              <>
                <PageTitle title="Edit Drip Marketing Rule" />
                <DefaultLayout>
                  {modulePermission.assignment_rule_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <EditDripMarketingRule />
                  )}
                </DefaultLayout>
              </>
            }
          />
          <Route
            path="/assignment-rule"
            element={
              <>
                <PageTitle title="Assignment Rule" />
                <DefaultLayout>
                  {modulePermission.assignment_rule_management ===
                    "no_access" ? (
                    <NotFound />
                  ) : (
                    <AssignmentRule mode={mode} />
                  )}
                </DefaultLayout>
              </>
            }
          />
          {
            <>
              <Route
                path="/template"
                element={
                  <>
                    <PageTitle title="Template" />
                    <DefaultLayout>
                      {modulePermission.template_management === "no_access" ? (
                        <NotFound />
                      ) : (
                        <Template mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />
              <Route
                path="/add-email-template"
                element={
                  <>
                    <PageTitle title="Add Email Template" />
                    <DefaultLayout>
                      {modulePermission.template_management === "no_access" ? (
                        <NotFound />
                      ) : (
                        <AddEmailTemplate mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />
              <Route
                path="/edit-email-template/:id"
                element={
                  <>
                    <PageTitle title="Edit Email Template" />
                    <DefaultLayout>
                      {modulePermission.template_management === "no_access" ? (
                        <NotFound />
                      ) : (
                        <EditEmailTemplate mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />
              <Route
                path="/edit-advanced-email-template/:id"
                element={
                  <>
                    <PageTitle title="Edit Email Template" />
                    <DefaultLayout>
                      {modulePermission.template_management === "no_access" ? (
                        <NotFound />
                      ) : (
                        <EditEmailBuilder mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />
              <Route
                path="/add-advanced-email"
                element={
                  <>
                    <PageTitle title="Edit Email Template" />
                    <DefaultLayout>
                      {modulePermission.template_management === "no_access" ? (
                        <NotFound />
                      ) : (
                        <EmailBuilder mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />
            </>
          }
          {
            <>
              {" "}
              <Route
                path="/package"
                element={
                  <>
                    <PageTitle title="Package" />
                    <DefaultLayout>
                      {modulePermission.package_management === "no_access" ? (
                        <NotFound />
                      ) : (
                        <Package mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />
              <Route
                path="/package/add-package"
                element={
                  <>
                    <PageTitle title="Add Package" />
                    <DefaultLayout>
                      {modulePermission.package_management === "no_access" ? (
                        <NotFound />
                      ) : (
                        <AddPackage mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />
              <Route
                path="/package/edit-package/:id"
                element={
                  <>
                    <PageTitle title="Edit Package" />
                    <DefaultLayout>
                      {modulePermission.package_management === "no_access" ? (
                        <NotFound />
                      ) : (
                        <EditPackage mode={mode} />
                      )}
                    </DefaultLayout>
                  </>
                }
              />
            </>
          }

          <Route
            path="/lead-analytics"
            element={
              <>
                <PageTitle title="Lead Analytics" />
                <DefaultLayout>
                  <LeadSourceAnalytics mode={mode} />
                </DefaultLayout>
              </>
            }
          />

          <Route
            path="/status-wise-lead"
            element={
              <>
                <PageTitle title="Status Wise Lead" />
                <DefaultLayout>
                  <StatusWiseLead mode={mode} />
                </DefaultLayout>
              </>
            }
          />
          <Route
            path="/sales-analytics"
            element={
              <>
                <PageTitle title="Status Wise Lead" />
                <DefaultLayout>
                  <SaleAnalyticsChart mode={mode} />
                </DefaultLayout>
              </>
            }
          />

          <Route
            path="/dashboard"
            element={
              <>
                <PageTitle title="Dashboard" />
                <DefaultLayout>
                  <Dashboard mode={mode} />
                </DefaultLayout>
              </>
            }
          />

          <Route
            path="/analytics-dashboard"
            element={
              <>
                <PageTitle title="Analytics Dashboard" />
                <DefaultLayout>
                  <AnalyticsDashboard mode={mode} />
                </DefaultLayout>
              </>
            }
          />

          <Route
            path="/lead-status-analytics"
            element={
              <>
                <PageTitle title="Lead Status Analytics" />
                <DefaultLayout>
                  <LeadStatusAnalytics mode={mode} />
                </DefaultLayout>
              </>
            }
          />


          {/* <Route
          path="/integration-partners"
          element={
            <>
              <PageTitle title="Integration Partners" />
              <DefaultLayout>
                <IntegrationPartners />
              </DefaultLayout>
            </>
          }
        /> */}
          <Route
            path="/reminder"
            element={
              <>
                <PageTitle title="My Reminders" />
                <DefaultLayout>
                  <Reminder mode={mode} />
                </DefaultLayout>
                {/* <DefaultLayout>
                {modulePermission.lead_management === "no_access" ? (
                  <NotFound />
                ) : (
                  <Reminder />
                )}
              </DefaultLayout> */}
              </>
            }
          />
          <Route
            path="/followup"
            element={
              <>
                <PageTitle title="My Followup" />
                {/* <DefaultLayout>
                <Followup />
              </DefaultLayout> */}
                <DefaultLayout>
                  {modulePermission.lead_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <Followup mode={mode} />
                  )}
                </DefaultLayout>
              </>
            }
          />
          <Route
            path="/follow-up"
            element={
              <>
                <PageTitle title="Follow Ups" />
                {/* <DefaultLayout>
                <Followup />
              </DefaultLayout> */}
                <DefaultLayout>
                  {modulePermission.lead_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <FollowupNew mode={mode} />
                  )}
                </DefaultLayout>
              </>
            }
          />
          {
            // modulePermission.user_group === "admin" &&
            <Route
              path="/unassigned-lead"
              element={
                <>
                  <PageTitle title="Unassigned Lead" />
                  <DefaultLayout>
                    {modulePermission.unassigned_leads_management ===
                      "no_access" ? (
                      <NotFound />
                    ) : (
                      <UnassignedLead mode={mode} />
                    )}
                  </DefaultLayout>
                </>
              }
            />
          }

          <Route
            path="/call-logs"
            element={
              <>
                <PageTitle title="Call Logs" />
                <DefaultLayout>
                  {modulePermission.lead_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <CallLogs mode={mode} />
                  )}
                </DefaultLayout>
              </>
            }
          />

          <Route
            path="/call-report"
            element={
              <>
                <PageTitle title="Call Report" />
                <DefaultLayout>
                  {modulePermission.lead_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <CallReport mode={mode} />
                  )}
                </DefaultLayout>
              </>
            }
          />

          <Route
            path="/lead-funnel"
            element={
              <>
                <PageTitle title="Lead Funnel" />
                <DefaultLayout>
                  {modulePermission.lead_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <LeadFunnel />
                  )}
                </DefaultLayout>
              </>
            }
          />
          <Route
            path="/branch-perfomance"
            element={
              <>
                <PageTitle title="Branch Lead Perfomance" />
                <DefaultLayout>
                  {modulePermission.lead_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <BranchPerfomance />
                  )}
                </DefaultLayout>
              </>
            }
          />
          <Route
            path="/user-perfomance"
            element={
              <>
                <PageTitle title="User Lead Perfomance" />
                <DefaultLayout>
                  {modulePermission.lead_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <UserPerfomance />
                  )}
                </DefaultLayout>
              </>
            }
          />
          <Route
            path="/marketing-performance"
            element={
              <>
                <PageTitle title="Marketing Performance" />
                <DefaultLayout>
                  {modulePermission.lead_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <MarketingPerformance />
                  )}
                </DefaultLayout>
              </>
            }
          />
          <Route
            path="/facebook-performance"
            element={
              <>
                <PageTitle title="Facebook Performance" />
                <DefaultLayout>
                  {modulePermission.lead_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <FacebookPerformance />
                  )}
                </DefaultLayout>
              </>
            }
          />
          <Route
            path="/google-performance"
            element={
              <>
                <PageTitle title="Google Search Console" />
                <DefaultLayout>
                  {modulePermission.lead_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <GoogleSearchConsole />
                  )}
                </DefaultLayout>
              </>
            }
          />
          <Route
            path="/google-analytics"
            element={
              <>
                <PageTitle title="Google Analytics" />
                <DefaultLayout>
                  {modulePermission.lead_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <GoogleAnalytics />
                  )}
                </DefaultLayout>
              </>
            }
          />

          {/* <Route
          path="/visa-application"
          element={
            <>
              <PageTitle title="Visa Application" />
              <DefaultLayout>
                {modulePermission.lead_management === "no_access" ? (
                  <NotFound />
                ) : (
                  <VisaApplication />
                )}
              </DefaultLayout>
            </>
          }
        /> */}

          <Route
            path="/document"
            element={
              <>
                <PageTitle title="Document" />
                <DefaultLayout>
                  {modulePermission.lead_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <Document mode={mode} />
                  )}
                </DefaultLayout>
              </>
            }
          />

          <Route
            path="/document-category"
            element={
              <>
                <PageTitle title="Document Category" />
                <DefaultLayout>
                  {modulePermission.lead_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <DocumentCategory mode={mode} />
                  )}
                </DefaultLayout>
              </>
            }
          />
          <Route
            path="/document-category/:id"
            element={
              <>
                <PageTitle title="Documents" />
                <DefaultLayout>
                  {modulePermission.lead_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <Documents mode={mode} />
                  )}
                </DefaultLayout>
              </>
            }
          />

          <Route
            path="/university"
            element={
              <>
                <PageTitle title="University" />
                <DefaultLayout>
                  {modulePermission.lead_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <University mode={mode} />
                  )}
                </DefaultLayout>
              </>
            }
          />

          <Route
            path="/course"
            element={
              <>
                <PageTitle title="Course" />
                <DefaultLayout>
                  {modulePermission.lead_management === "no_access" ? (
                    <NotFound />
                  ) : (
                    <Course mode={mode} />
                  )}
                </DefaultLayout>
              </>
            }
          />

          {/* <Route
          path="/course-admission-application"
          element={
            <>
              <PageTitle title="Course Admission Application" />
              <DefaultLayout>
                {modulePermission.lead_management === "no_access" ? (
                  <NotFound />
                ) : (
                  <CourseAdmissionApplication />
                )}
              </DefaultLayout>
            </>
          }
        /> */}

          <Route
            path="/tickets"
            element={
              <>
                <PageTitle title="Tickets" />
                <DefaultLayout>
                  <TicketList mode={mode} />
                </DefaultLayout>
              </>
            }
          />
          <Route
            path="/add-ticket"
            element={
              <>
                <PageTitle title="Add Ticket" />
                <DefaultLayout>
                  <AddTicket mode={mode} />
                </DefaultLayout>
              </>
            }
          />

          <Route
            path="/view-ticket/:id"
            element={
              <>
                <PageTitle title="View Tickets" />
                <DefaultLayout>
                  <ViewTicketList mode={mode} />
                </DefaultLayout>
              </>
            }
          />

          {/* Accommodation start from here */}
          <Route
            path="/accommodation"
            element={
              <>
                <PageTitle title="Accommodation" />
                <DefaultLayout>
                  <AccommodationList mode={mode} />
                </DefaultLayout>
              </>
            }
          />
          {/* Accommodation close from here */}

          {/* <Route
          path="/lead-category"
          element={
            <>
              <PageTitle title="Lead Category" />
              <DefaultLayout>
                {modulePermission.lead_management === "no_access" ? (
                  <NotFound />
                ) : (
                  <LeadCategory />
                )}
              </DefaultLayout>
            </>
          }
        />
        <Route
          path="/campaign"
          element={
            <>
              <PageTitle title="Campaign" />
              <DefaultLayout>
                {modulePermission.lead_management === "no_access" ? (
                  <NotFound />
                ) : (
                  <Campaign />
                )}
              </DefaultLayout>
            </>
          }
        /> */}

          <Route
            path="/facebook-page"
            element={
              <>
                <PageTitle title="Facebook" />
                <DefaultLayout>
                  <FacebookMainPage mode={mode} />
                </DefaultLayout>
              </>
            }
          />

          <Route
            path="/facebook-page-list"
            element={
              <>
                <PageTitle title="Facebook" />
                <DefaultLayout>
                  <FaceBookPageList mode={mode} />
                </DefaultLayout>
              </>
            }
          />

          {/* <Route
            path="/notification"
            element={
              <>
                <PageTitle title="NotificationTesting" />
                <DefaultLayout>
                  <NotificationTesting />
                </DefaultLayout>
              </>
            }
          /> */}

          <Route
            path="/integrations/google"
            element={
              <>
                <PageTitle title="Google Integration" />
                <DefaultLayout>
                  <GoogleIntegration mode={mode} />
                </DefaultLayout>
              </>
            }
          />

          <Route
            path="*"
            element={
              <>
                <PageTitle title="404" />
                <DefaultLayout>
                  <NotFound mode={mode} />
                </DefaultLayout>
              </>
            }
          />
          <Route
            path="/Mail-Settings"
            element={
              <>
                <PageTitle title="Mail Settings" />
                <DefaultLayout>
                  {modulePermission.is_superuser === true || modulePermission.user_group === 'admin' ? (
                    <MailSettings mode={mode} />
                  ) : (
                    <NotFound mode={mode} />
                  )}
                </DefaultLayout>
              </>
            }
          />
        </Routes>
      </ConfigProvider>

      <Modal
        title="Notifications"
        open={isModalOpen && notifications.length > 0}
        onCancel={handleModalClose}
        footer={null}
        width={500}
        maskClosable={false}
      >
        <div className="p-4 h-[380px] overflow-y-scroll">
          {notifications.map((notif) => (
            <div key={notif.id} className="mb-4 p-3 border rounded-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => closeNotification(notif.id)}
              >
                &times;
              </button>
              <p className="text-lg font-semibold">{notif.title}</p>
              <p className="mt-1 text-gray-700">{notif.body}</p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}

export default App;
