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
    CloudDownloadOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    ApiOutlined,
    CopyOutlined
} from "@ant-design/icons";

import FacebookLogin from "@greatsumini/react-facebook-login";
import {
    getFacebookService,
    postFacebookPageListService,
    postLinkFacebookPageListService,
    postLinkFacebookAccountListService,
    postSyncFacebookLeadsService,
    getFacebookLeadsService,
    postToggleFacebookPageService
} from "../ApiService";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { facebookTokenUpdate } from "../../../lib/redux/FacebookToken";
import { updateFacebookEmail } from "../../../lib/redux/FacebookEmail";
import { TabTables } from "../../../Components/CustomComponents/TabTables";
import { PAGESIZE, baseurl } from "../../../lib/Constants";
import { Tabs } from "antd";

const { Title, Text, Paragraph } = Typography;

const FaceBook = () => {
    const [loading, setLoading] = useState(false);
    const [syncingLeads, setSyncingLeads] = useState(false);
    const [page, setPage] = useState(1);
    const [leadsPage, setLeadsPage] = useState(1);
    const [data, setData] = useState({});
    const [leadsData, setLeadsData] = useState({});
    const [registeredUserData, setRegisteredUserData] = useState([]);
    const [syncedLeads, setSyncedLeads] = useState([]);
    const [showSettings, setShowSettings] = useState(false);
    const [activeTab, setActiveTab] = useState("pages");

    // Dynamic App Settings state (Sync with localStorage)
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
        getFacebookService({
            current_page_number: page,
            count_per_page: PAGESIZE,
        }).then((response) => {
            setRegisteredUserData(response.data.data || []);
            setData(response.data);
        }).catch((err) => {
            console.error("Fetch Linked Pages Error:", err);
        }).finally(() => {
            setLoading(false);
        });
    };

    const getSyncedLeadsApi = () => {
        setLoading(true);
        getFacebookLeadsService({
            current_page_number: leadsPage,
            count_per_page: PAGESIZE,
        }).then((response) => {
            setSyncedLeads(response.data.data || []);
            setLeadsData(response.data);
        }).catch((err) => {
            console.error("Fetch Synced Leads Error:", err);
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        if (activeTab === "pages") getLeadApi();
        else if (activeTab === "leads") getSyncedLeadsApi();
    }, [page, leadsPage, appId, activeTab]);

    const handleSyncLeads = async () => {
        setSyncingLeads(true);
        try {
            const response = await postSyncFacebookLeadsService();
            if (response.data.success === "1") {
                message.success(`Successfully synced ${response.data.leadsSynced} new leads!`);
                getSyncedLeadsApi();
            } else {
                message.error(response.data.message || "Failed to sync leads");
            }
        } catch (error) {
            console.error("Sync Error:", error);
            message.error("An error occurred while syncing leads.");
        } finally {
            setSyncingLeads(false);
        }
    };

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
            // Send token to backend to link pages (ONE-CLICK SYNC)
            const response = await postLinkFacebookPageListService({
                access_token: resp.accessToken,
                app_id: appId,
                app_secret: appSecret,
                email: resp.email || ""
            });

            if (response.data.success === "1") {
                message.success("Successfully linked Facebook pages!");
                dispatch(facebookTokenUpdate(resp.accessToken));
                dispatchEmail(updateFacebookEmail(resp.email || ""));

                // Immediate refresh of data and lead sync
                getLeadApi();
                handleSyncLeads();
            } else {
                message.error(response.data.message || "Failed to link pages");
            }
        } catch (error) {
            console.error("Link Error:", error);
            const errorMsg = error.response?.data?.message || error.message || "An error occurred while linking Facebook.";
            message.error(`❌ ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePageStatus = async (pageId, is_active) => {
        try {
            const response = await postToggleFacebookPageService({ page_id: pageId, is_active });
            if (response.data.success === "1") {
                message.success(response.data.message || "Page status updated successfully");
                getLeadApi();
            } else {
                message.error(response.data.message || "Failed to update page status");
            }
        } catch (error) {
            console.error("Toggle Page Status Error:", error);
            message.error("An error occurred while updating page status.");
        }
    };

    const columns = [
        {
            title: "Index",
            fixed: "left",
            dataIndex: "id",
            key: "id",
            width: "80px",
            render: (text) => <Text className="text-white font-medium">{text}</Text>,
        },
        {
            title: "Page ID",
            dataIndex: "page_id",
            key: "page_id",
            render: (text) => <Text code className="bg-[#1A222C] text-[#FFA500] border-none">{text}</Text>,
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <Text strong className="text-white">{text}</Text>,
        },
        {
            title: "Connected Email",
            dataIndex: "email",
            key: "email",
            render: (text) => <Text className="text-gray-300">{text || "-"}</Text>,
        },
        {
            title: "Created At",
            dataIndex: "datetime",
            key: "datetime",
            render: (text) => <Text className="text-gray-400 text-xs">{text}</Text>,
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
                    onChange={(checked) => handleTogglePageStatus(record.page_id, checked)}
                />
            ),
        },
    ];

    const leadColumns = [
        {
            title: "Lead Name",
            dataIndex: "full_name",
            key: "full_name",
            width: 200,
            render: (text) => (
                <Space>
                    <UserOutlined className="text-blue-400" />
                    <Text className="dark:text-white text-black">{text}</Text>
                </Space>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 250,
            render: (text) => (
                <Space>
                    <MailOutlined className="text-gray-400" />
                    <Text className="dark:text-white text-black">{text}</Text>
                </Space>
            ),
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            width: 180,
            render: (text) => (
                <Space>
                    <PhoneOutlined className="text-green-400" />
                    <Text className="dark:text-white text-black">{text}</Text>
                </Space>
            ),
        },
        {
            title: "City",
            dataIndex: "city",
            key: "city",
            width: 150,
            render: (text) => (
                <Space>
                    <EnvironmentOutlined className="text-red-400" />
                    <Text className="dark:text-white text-black">{text}</Text>
                </Space>
            ),
        },
        {
            title: "Campaign",
            dataIndex: "campaign",
            key: "campaign",
            width: 200,
            render: (text) => <Tag color="purple">{text || "N/A"}</Tag>,
        },
        {
            title: "Sync Date",
            dataIndex: "created_at",
            key: "created_at",
            width: 180,
            render: (text) => <Text className="dark:text-white text-black text-xs">{new Date(text).toLocaleString()}</Text>,
        },
    ];

    const tabItems = [
        {
            key: "pages",
            label: (
                <Space>
                    <CloudDownloadOutlined />
                    Linked Pages
                </Space>
            ),
            children: (
                <div className="mt-4">
                    {registeredUserData.length > 0 ? (
                        <div className="animate-slide-up">
                            <div className="flex items-center justify-between mb-4 mx-2">
                                <Title level={5} className="text-black dark:text-white m-0">Connected Pages ({registeredUserData.length})</Title>
                                <Button
                                    icon={<SyncOutlined spin={loading} />}
                                    onClick={getLeadApi}
                                    className="bg-white dark:bg-[#24303F] border-[#2E3A47] text-black dark:text-white hover:text-white"
                                >
                                    Refresh List
                                </Button>
                            </div>
                            <TabTables
                                tableData={registeredUserData}
                                rowHoverable={true}
                                tableColumns={columns}
                                paginationData={data}
                                paginationHandler={setPage}
                                islead={leadModulePermission.lead_management === "edit" && "lead"}
                                rowKey="id"
                            />
                        </div>
                    ) : (
                        !loading && appId && (
                            <div className="p-12 bg-white dark:bg-[#24303F] rounded-lg text-center shadow-inner">
                                <Paragraph className="text-black dark:text-white mb-0">
                                    No Facebook pages are currently linked.<br />
                                    Connect with Facebook above to start syncing.
                                </Paragraph>
                            </div>
                        )
                    )}
                </div>
            )
        },
        {
            key: "leads",
            label: (
                <Space>
                    <UserOutlined />
                    Facebook Leads
                </Space>
            ),
            children: (
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-4 mx-2">
                        <Title level={5} className="text-black dark:text-white m-0">Synced Leads ({syncedLeads.length})</Title>
                        <Button
                            type="primary"
                            icon={<CloudDownloadOutlined spin={syncingLeads} />}
                            onClick={handleSyncLeads}
                            loading={syncingLeads}
                            className="bg-blue-600 border-none hover:bg-blue-700 shadow-lg"
                        >
                            Sync New Leads
                        </Button>
                    </div>
                    {syncedLeads.length > 0 ? (
                        <TabTables
                            tableData={syncedLeads}
                            rowHoverable={true}
                            tableColumns={leadColumns}
                            paginationData={leadsData}
                            paginationHandler={setLeadsPage}
                            islead={leadModulePermission.lead_management === "edit" && "lead"}
                            rowKey="id"
                        />
                    ) : (
                        !loading && (
                            <div className="p-12 bg-white dark:bg-[#24303F] rounded-lg text-center shadow-inner">
                                <Paragraph className="text-black dark:text-white mb-0">
                                    No leads have been synced from Facebook yet.<br />
                                    Click "Sync New Leads" to fetch data from your forms.
                                </Paragraph>
                            </div>
                        )
                    )}
                </div>
            )
        },
        {
            key: "webhook",
            label: (
                <Space>
                    <ApiOutlined />
                    Webhook Setup
                </Space>
            ),
            children: (
                <div className="mt-4 animate-slide-up">
                    <Card className="bg-white dark:bg-[#1A222C] rounded-lg">
                        <Title level={5} className="text-black dark:text-white mb-4 flex items-center gap-2">
                            <SafetyCertificateOutlined className="text-green-500" />
                            Real-Time Webhook Configuration
                        </Title>
                        <Paragraph className="text-black dark:text-white mb-6">
                            Follow these steps to enable instant lead capture. No manual sync required!
                        </Paragraph>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-semibold text-black dark:text-white uppercase mb-2">Step 1: Callback URL</label>
                                <Space.Compact style={{ width: '100%' }}>
                                    <Input
                                        readOnly
                                        value={baseurl + "/api/v1/webhook/facebook"}
                                        className="bg-white dark:bg-[#24303F] border-[#2E3A47] text-black dark:text-white"
                                    />
                                    <Button
                                        icon={<CopyOutlined />}
                                        onClick={() => {
                                            navigator.clipboard.writeText(baseurl + "/api/v1/webhook/facebook");
                                            message.success("URL Copied!");
                                        }}
                                        className="bg-blue-600 border-none text-white"
                                    >
                                        Copy
                                    </Button>
                                </Space.Compact>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-black dark:text-white uppercase mb-2">Step 2: Verify Token</label>
                                <Space.Compact style={{ width: '100%' }}>
                                    <Input
                                        readOnly
                                        value="yes123germany"
                                        className="bg-white dark:bg-[#24303F] border-[#2E3A47] text-black dark:text-white"
                                    />
                                    <Button
                                        icon={<CopyOutlined />}
                                        onClick={() => {
                                            navigator.clipboard.writeText("yes123germany");
                                            message.success("Token Copied!");
                                        }}
                                        className="bg-blue-600 border-none text-white"
                                    >
                                        Copy
                                    </Button>
                                </Space.Compact>
                            </div>

                            <Alert
                                className="bg-white dark:bg-[#24303F] border-blue-500 text-black dark:text-white"
                                message="Action Required in Facebook Developer Portal"
                                description={
                                    <div className="text-xs space-y-2 mt-2">
                                        <p>1. Go to <b>Webhooks</b> section in your FB App.</p>
                                        <p>2. Select <b>Page</b> and click 'Subscribe to this object'.</p>
                                        <p>3. Paste the URL and Token above, then subscribe to <b>leadgen</b> field.</p>
                                    </div>
                                }
                                type="info"
                                showIcon
                            />
                        </div>
                    </Card>
                </div>
            )
        }
    ];

    return (
        <div className="mt-6 mb-6">
            <Card
                className="overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] rounded-2xl shadow-lg"
                bodyStyle={{ padding: 0 }}
                title={
                    <div className="flex items-center gap-3 py-2">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg">
                            <FacebookOutlined className="text-white text-2xl" />
                        </div>

                        <div>
                            <Title level={4} className="!mb-0 !text-slate-800 dark:!text-white">
                                Facebook Integration Dashboard
                            </Title>

                            <Text className="text-slate-500 dark:text-slate-400 text-[12px]">
                                Manage Facebook Ads & Lead Sync
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
                                    : "text-slate-500 dark:text-slate-400"
                                    }`}
                            />
                        }
                        onClick={() => setShowSettings(!showSettings)}
                        className="!w-10 !h-10 hover:!bg-slate-100 dark:hover:!bg-slate-800 rounded-xl flex items-center justify-center"
                    />
                }
            >
                <div className="p-4 md:p-6">

                    {/* SETTINGS PANEL */}
                    {showSettings && (
                        <div className="mb-8 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-[#111827] p-5 animate-slide-up">
                            <div className="flex items-center gap-2 mb-2">
                                <SettingOutlined className="text-blue-500" />

                                <Title level={5} className="!mb-0 !text-slate-800 dark:!text-white">
                                    Advanced Developer Settings
                                </Title>
                            </div>

                            <Paragraph className="!text-slate-500 dark:!text-slate-400 mb-6">
                                Configure your Facebook App credentials for development and testing.
                            </Paragraph>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-semibold tracking-wide uppercase mb-2 text-slate-500 dark:text-slate-400">
                                        Facebook App ID
                                    </label>

                                    <Input
                                        placeholder="Enter Facebook App ID"
                                        value={appId}
                                        onChange={handleAppIdChange}
                                        className="!h-12 rounded-xl !bg-white dark:!bg-slate-900 !border-slate-300 dark:!border-slate-700 !text-slate-700 dark:!text-white hover:!border-blue-500 focus:!border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold tracking-wide uppercase mb-2 text-slate-500 dark:text-slate-400">
                                        Facebook App Secret
                                    </label>

                                    <Input.Password
                                        placeholder="Enter Facebook App Secret"
                                        value={appSecret}
                                        onChange={handleAppSecretChange}
                                        className="!h-12 rounded-xl !bg-white dark:!bg-slate-900 !border-slate-300 dark:!border-slate-700 !text-slate-700 dark:!text-white hover:!border-blue-500 focus:!border-blue-500"
                                    />
                                </div>
                            </div>

                            <Alert
                                className="mt-5 rounded-xl border border-blue-500/30 bg-blue-50 dark:bg-blue-500/10"
                                message={
                                    <span className="text-slate-700 dark:text-white font-medium">
                                        Required for Localhost
                                    </span>
                                }
                                description={
                                    <span className="text-slate-500 dark:text-slate-300">
                                        Add{" "}
                                        <b>https://localhost:3000</b>{" "}
                                        to Allowed Domains in Facebook Developer Console.
                                    </span>
                                }
                                type="info"
                                showIcon
                            />
                        </div>
                    )}

                    {/* HERO SECTION */}
                    <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#1E293B] dark:to-[#0F172A] px-6 py-12 md:px-12 md:py-16 mb-8">

                        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full"></div>

                        <div className="relative z-10 flex flex-col items-center text-center">

                            <div className="flex items-center justify-center w-28 h-28 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                                <FacebookOutlined className="text-[60px] text-blue-500" />
                            </div>

                            <Title level={2} className="!mb-3 !text-slate-800 dark:!text-white">
                                Connect your Facebook Ads
                            </Title>

                            <Paragraph className="max-w-2xl text-base md:text-lg !text-slate-500 dark:!text-slate-400 mb-8">
                                Sync Facebook leads directly into your CRM and automate campaign lead management in real-time.
                            </Paragraph>

                            <div className="flex flex-col items-center gap-4">
                                <FacebookLogin
                                    appId={appId || "0"}
                                    onSuccess={handleResponse}
                                    onFail={(error) => {
                                        console.error("Login Failed!", error);

                                        if (error.status === "not_authorized") {
                                            message.warning("Please authorize the app to continue.");
                                        }
                                    }}
                                    onProfileSuccess={(response) => {
                                        console.log("Get Profile Success!", response);
                                    }}
                                    style={{
                                        background: "linear-gradient(135deg,#1877F2,#2563EB)",
                                        color: "white",
                                        padding: "14px 36px",
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
                                            ? "Refresh Connection"
                                            : "Connect with Facebook"}
                                    </Space>
                                </FacebookLogin>

                                {!appId && (
                                    <Text className="text-red-500 text-sm">
                                        Please configure your App ID to continue.
                                    </Text>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* TABS */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] p-3 md:p-5">
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            items={tabItems}
                            className="fb-tabs"
                        />
                    </div>
                </div>
            </Card>

            {/* LOADER */}
            {loading && (
                <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-8 py-8 shadow-2xl flex flex-col items-center">
                        <Spin size="large" />

                        <Text className="mt-5 text-slate-700 dark:text-white font-semibold tracking-wide">
                            Syncing with Facebook...
                        </Text>
                    </div>
                </div>
            )}

            <style>{`
             .fb-tabs .ant-tabs-nav::before {
                 border-bottom: 1px solid rgb(51 65 85 / 0.3);
             }
 
             .fb-tabs .ant-tabs-tab {
                 color: #64748B;
                 font-weight: 500;
                 transition: all 0.3s ease;
                 padding: 10px 16px;
                 border-radius: 12px;
             }
 
             .dark .fb-tabs .ant-tabs-tab {
                 color: #94A3B8;
             }
 
             .fb-tabs .ant-tabs-tab:hover {
                 color: #2563EB;
                 background: rgba(37,99,235,0.08);
             }
 
             .fb-tabs .ant-tabs-tab-active {
                 background: rgba(37,99,235,0.12);
             }
 
             .fb-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
                 color: #2563EB !important;
                 font-weight: 600;
             }
 
             .fb-tabs .ant-tabs-ink-bar {
                 background: #2563EB;
                 height: 3px;
                 border-radius: 999px;
             }
 
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

export default FaceBook;
