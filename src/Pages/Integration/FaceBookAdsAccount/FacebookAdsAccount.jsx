import React, { useState, useEffect } from "react";
import {
    Card,
    Button,
    Typography,
    Space,
    message,
    Tag,
    Spin,
    Input,
    Alert,
    Switch
} from "antd";
import {
    FacebookOutlined,
    SyncOutlined,
    SettingOutlined,
    InfoCircleOutlined,
    SafetyCertificateOutlined,
    AreaChartOutlined
} from "@ant-design/icons";
import FacebookLogin from "@greatsumini/react-facebook-login";
import {
    getFacebookAdsService,
    postLinkFacebookAccountListService,
    postSyncFacebookLeadsService,
    postToggleFacebookAdAccountService
} from "../ApiService";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { facebookTokenUpdate } from "../../../lib/redux/FacebookToken";
import { updateFacebookEmail } from "../../../lib/redux/FacebookEmail";
import { TabTables } from "../../../Components/CustomComponents/TabTables";
import { PAGESIZE } from "../../../lib/Constants";

const { Title, Text, Paragraph } = Typography;

const FacebookAdsAccount = () => {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [data, setData] = useState({});
    const [registeredUserData, setRegisteredUserData] = useState([]);
    const [showSettings, setShowSettings] = useState(false);

    // Dynamic App Settings state (Sync with localStorage used in FaceBook.jsx)
    const [appId, setAppId] = useState(localStorage.getItem("fb_app_id") || import.meta.env.VITE_FACEBOOK_APP_ID || "1419171219814595");
    const [appSecret, setAppSecret] = useState(localStorage.getItem("fb_app_secret") || "");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const dispatchEmail = useDispatch();

    const leadModulePermission = useSelector(
        (state) => state.permissions.permissionsData
    );

    const getLeadApi = () => {
        if (!appId) return;
        setLoading(true);
        getFacebookAdsService({
            current_page_number: page,
            count_per_page: PAGESIZE,
        }).then((response) => {
            setRegisteredUserData(response.data.data || []);
            setData(response.data);
        }).catch((err) => {
            console.error("Fetch Ad Accounts Error:", err);
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        getLeadApi();
    }, [page, appId]);

    const handleAppIdChange = (e) => {
        const newId = e.target.value;
        setAppId(newId);
        localStorage.setItem("fb_app_id", newId);
    };

    const handleAppSecretChange = (e) => {
        const newSecret = e.target.value;
        setAppSecret(newSecret);
        localStorage.setItem("fb_app_secret", newSecret);
    };

    const handleResponse = async (resp) => {
        if (!resp.accessToken) {
            message.error("Login failed. Please ensure you selected the necessary permissions.");
            return;
        }

        setLoading(true);
        try {
            // Send token to backend to link ad accounts (ONE-CLICK SYNC)
            const response = await postLinkFacebookAccountListService({
                access_token: resp.accessToken,
                app_id: appId,
                app_secret: appSecret,
                email: resp.email || ""
            });

            if (response.data.success === "1") {
                message.success("Successfully linked Facebook Ad Accounts!");
                dispatch(facebookTokenUpdate(resp.accessToken));
                dispatchEmail(updateFacebookEmail(resp.email || ""));

                // Immediate refresh of data and lead sync
                getLeadApi();
                postSyncFacebookLeadsService().catch(err => console.error("Auto Sync Error:", err));
            } else {
                message.error(response.data.message || "Failed to link accounts");
            }
        } catch (error) {
            console.error("Link Error:", error);
            const errorMsg = error.response?.data?.message || error.message || "An error occurred while linking Facebook.";
            message.error(`❌ ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAdAccountStatus = async (adAccountId, is_active) => {
        try {
            const response = await postToggleFacebookAdAccountService({ ad_account_id: adAccountId, is_active });
            if (response.data.success === "1") {
                message.success(response.data.message || "Ad Account status updated successfully");
                getLeadApi();
            } else {
                message.error(response.data.message || "Failed to update Ad Account status");
            }
        } catch (error) {
            console.error("Toggle Ad Account Status Error:", error);
            message.error("An error occurred while updating Ad Account status.");
        }
    };

    const columns = [
        {
            title: "Index",
            fixed: "left",
            dataIndex: "id",
            key: "id",
            width: "80px",
            render: (text) => <Text className="dark:text-white text-black font-medium">{text}</Text>,
        },
        {
            title: "Ad Account ID",
            dataIndex: "ad_account_id",
            key: "ad_account_id",
            render: (text) => <Text code className="dark:bg-black bg-blue-300 text-black dark:text-[#FFA500] border-none">{text}</Text>,
        },
        {
            title: "Connected Email",
            dataIndex: "email",
            key: "email",
            render: (text) => <Text className="dark:text-white text-black">{text || "-"}</Text>,
        },
        {
            title: "Created At",
            dataIndex: "datetime",
            key: "datetime",
            render: (text) => <Text className="dark:text-white text-black text-xs">{text}</Text>,
        },
        {
            title: "Status",
            dataIndex: "expiration",
            key: "expiration",
            render: (text, record) => (
                <Tag color={text ? "green" : "blue"} icon={<SafetyCertificateOutlined />}>
                    {text ? `Valid until ${text.split(',')[0]}` : "Active"}
                </Tag>
            ),
        },
        {
            title: "Sync Leads",
            dataIndex: "is_active",
            key: "is_active",
            render: (isActive, record) => (
                <Switch
                    checked={isActive !== false}
                    onChange={(checked) => handleToggleAdAccountStatus(record.ad_account_id, checked)}
                />
            ),
        },
    ];

    return (
        <div className="mt-6 mb-6">
            <Card
                className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden mb-6"
                bodyStyle={{ padding: 0 }}
                title={
                    <div className="flex items-center gap-3 py-2">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg">
                            <AreaChartOutlined className="text-white text-2xl" />
                        </div>

                        <div>
                            <Title level={4} className="!mb-0 !text-black dark:!text-white">
                                Facebook Ad Account Integration
                            </Title>

                            <Text className="text-gray-600 dark:text-gray-400 text-sm">
                                Manage Facebook Ads & Campaign Sync
                            </Text>
                        </div>
                    </div>
                }
                extra={
                    <Button
                        type="text"
                        icon={
                            <SettingOutlined
                                className={`text-lg transition-all duration-300 ${showSettings
                                    ? "text-blue-500 rotate-90"
                                    : "text-gray-500 dark:text-gray-400"
                                    }`}
                            />
                        }
                        onClick={() => setShowSettings(!showSettings)}
                        className="hover:!bg-gray-100 dark:hover:!bg-slate-800 rounded-xl"
                    />
                }
            >
                <div className="max-w-5xl mx-auto py-4 px-4 md:px-6">

                    {/* SETTINGS */}
                    {showSettings && (
                        <div className="mb-8 p-6 bg-gray-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-2xl animate-slide-up">
                            <Title level={5} className="!text-black dark:!text-white !mb-4 flex items-center gap-2">
                                <SettingOutlined className="text-blue-500" />
                                Advanced Developer Settings
                            </Title>

                            <Paragraph className="!text-gray-600 dark:!text-gray-400 mb-6 text-sm">
                                These settings are shared with the Facebook Pages integration.
                            </Paragraph>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-semibold uppercase mb-2 text-gray-500 dark:text-gray-400">
                                        Facebook App ID
                                    </label>

                                    <Input
                                        placeholder="Enter App ID"
                                        value={appId}
                                        onChange={handleAppIdChange}
                                        className="!h-11 !bg-white dark:!bg-slate-900 !border-slate-300 dark:!border-slate-700 !text-black dark:!text-white rounded-xl"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase mb-2 text-gray-500 dark:text-gray-400">
                                        Facebook App Secret
                                    </label>

                                    <Input.Password
                                        placeholder="Enter App Secret"
                                        value={appSecret}
                                        onChange={handleAppSecretChange}
                                        className="!h-11 !bg-white dark:!bg-slate-900 !border-slate-300 dark:!border-slate-700 !text-black dark:!text-white rounded-xl"
                                    />
                                </div>
                            </div>

                            <Alert
                                className="mt-5 rounded-xl border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10"
                                message={
                                    <span className="text-black dark:text-white font-medium">
                                        Facebook Developer Setup
                                    </span>
                                }
                                description={
                                    <span className="text-gray-700 dark:text-gray-300">
                                        Make sure localhost is added inside your Facebook Developer Console settings.
                                    </span>
                                }
                                type="info"
                                showIcon
                            />
                        </div>
                    )}

                    {/* HERO */}
                    <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-gray-50 to-white dark:from-[#111827] dark:to-[#0B1120] px-6 py-14 md:px-12 md:py-16 mb-8">

                        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full"></div>

                        <div className="relative z-10 flex flex-col items-center text-center">

                            <div className="flex items-center justify-center w-28 h-28 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                                <AreaChartOutlined className="text-[64px] text-blue-500" />
                            </div>

                            <Title level={2} className="!mb-3 !text-black dark:!text-white">
                                Manage your Facebook Ad Accounts
                            </Title>

                            <Paragraph className="max-w-2xl text-base md:text-lg !text-gray-600 dark:!text-gray-400 mb-8">
                                Connect your Facebook Ad Accounts to monitor campaign performance and manage lead syncing directly from your CRM dashboard.
                            </Paragraph>

                            <FacebookLogin
                                appId={appId || "0"}
                                onSuccess={handleResponse}
                                onFail={(error) => {
                                    console.error("Login Failed!", error);

                                    if (error.status === "not_authorized") {
                                        message.warning("Please authorize the app to continue.");
                                    }
                                }}
                                style={{
                                    background: "linear-gradient(135deg,#1877F2,#2563EB)",
                                    color: "white",
                                    padding: "14px 34px",
                                    borderRadius: "14px",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    border: "none",
                                    cursor: appId ? "pointer" : "not-allowed",
                                    boxShadow: "0 10px 25px rgba(37,99,235,0.35)",
                                    transition: "all 0.3s ease"
                                }}
                                scope="pages_show_list,ads_management,ads_read,business_management,leads_retrieval,pages_read_engagement,pages_manage_metadata,pages_manage_ads"
                            >
                                <Space size="middle">
                                    <FacebookOutlined />
                                    {registeredUserData.length > 0
                                        ? "Sync Ad Accounts"
                                        : "Connect with Facebook"}
                                </Space>
                            </FacebookLogin>

                            {!appId && (
                                <Text className="text-red-500 mt-4">
                                    Please set an App ID in Settings to enable login.
                                </Text>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            {/* TABLE SECTION */}
            {registeredUserData.length > 0 ? (
                <div className="animate-slide-up">

                    <div className="flex items-center justify-between mb-4 mx-2">
                        <Title level={5} className="!text-black dark:!text-white !m-0">
                            Linked Ad Accounts ({registeredUserData.length})
                        </Title>

                        <Button
                            icon={<SyncOutlined spin={loading} />}
                            onClick={getLeadApi}
                            className="!bg-white dark:!bg-[#111827] !border-slate-300 dark:!border-slate-700 !text-gray-700 dark:!text-gray-300 hover:!text-blue-500 rounded-xl"
                        >
                            Refresh List
                        </Button>
                    </div>

                    <div >
                        <TabTables
                            tableData={registeredUserData}
                            rowHoverable={true}
                            tableColumns={columns}
                            paginationData={data}
                            paginationHandler={setPage}
                            islead={leadModulePermission.lead_management === "edit" && "lead"}
                            rowKey="id"
                            containerClassName="mx-0"
                        />
                    </div>
                </div>
            ) : (
                !loading &&
                appId && (
                    <div className="p-14 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl text-center shadow-inner">
                        <Paragraph className="!text-gray-600 dark:!text-gray-400 !mb-0 text-base">
                            No Facebook Ad Accounts are currently linked.
                            <br />
                            Click the button above to sync your accounts.
                        </Paragraph>
                    </div>
                )
            )}

            {/* LOADER */}
            {loading && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-[9999]">
                    <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-2xl px-10 py-8 shadow-2xl flex flex-col items-center">
                        <Spin size="large" />

                        <Text className="text-black dark:text-white mt-5 font-semibold tracking-wide">
                            Syncing Ad Accounts...
                        </Text>
                    </div>
                </div>
            )}

            <style>{`
              .animate-slide-up {
                  animation: slideUp 0.4s ease;
              }
  
              @keyframes slideUp {
                  from {
                      opacity: 0;
                      transform: translateY(20px);
                  }
                  to {
                      opacity: 1;
                      transform: translateY(0px);
                  }
              }
          `}</style>
        </div>
    );
};

export default FacebookAdsAccount;