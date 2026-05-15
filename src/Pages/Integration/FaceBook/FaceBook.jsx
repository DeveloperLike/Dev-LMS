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
    Alert
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
    getFacebookLeadsService
} from "../ApiService";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { facebookTokenUpdate } from "../../../lib/redux/FacebookToken";
import { updateFacebookEmail } from "../../../lib/redux/FacebookEmail";
import { TabTables } from "../../../Components/CustomComponents/TabTables";
import { PAGESIZE , baseurl} from "../../../lib/Constants";
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
                    <Text strong className="text-white">{text}</Text>
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
                    <Text className="text-gray-300">{text}</Text>
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
                    <Text className="text-gray-300">{text}</Text>
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
                    <Text className="text-gray-300">{text}</Text>
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
            render: (text) => <Text className="text-gray-400 text-xs">{new Date(text).toLocaleString()}</Text>,
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
                                <Title level={5} className="text-white m-0">Connected Pages ({registeredUserData.length})</Title>
                                <Button
                                    icon={<SyncOutlined spin={loading} />}
                                    onClick={getLeadApi}
                                    className="bg-[#24303F] border-[#2E3A47] text-gray-400 hover:text-white"
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
                            <div className="p-12 bg-[#24303F] border border-[#2E3A47] rounded-lg text-center shadow-inner">
                                <Paragraph className="text-gray-500 mb-0">
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
                        <Title level={5} className="text-white m-0">Synced Leads ({syncedLeads.length})</Title>
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
                            <div className="p-12 bg-[#24303F] border border-[#2E3A47] rounded-lg text-center shadow-inner">
                                <Paragraph className="text-gray-500 mb-0">
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
                    <Card className="bg-[#1A222C] border-[#2E3A47] rounded-lg">
                        <Title level={5} className="text-white mb-4 flex items-center gap-2">
                            <SafetyCertificateOutlined className="text-green-500" />
                            Real-Time Webhook Configuration
                        </Title>
                        <Paragraph className="text-gray-400 mb-6">
                            Follow these steps to enable instant lead capture. No manual sync required!
                        </Paragraph>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Step 1: Callback URL</label>
                                <Space.Compact style={{ width: '100%' }}>
                                    <Input
                                        readOnly
                                        value={baseurl + "/api/v1/webhook/facebook"}
                                        className="bg-[#24303F] border-[#2E3A47] text-gray-300"
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
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Step 2: Verify Token</label>
                                <Space.Compact style={{ width: '100%' }}>
                                    <Input
                                        readOnly
                                        value="yes123germany"
                                        className="bg-[#24303F] border-[#2E3A47] text-gray-300"
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
                                className="bg-[#24303F] border-blue-500 text-gray-300"
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
        <div className="p-4 md:p-6 bg-[#1A222C] min-h-screen custom-tabs">
            <Card
                className="bg-[#24303F] border-[#2E3A47] shadow-xl rounded-lg overflow-hidden mb-6"
                title={
                    <Space size="middle">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <FacebookOutlined style={{ fontSize: '24px', color: 'white' }} />
                        </div>
                        <Title level={4} style={{ margin: 0, color: 'white' }}>Facebook Integration Dashboard</Title>
                    </Space>
                }
                extra={
                    <Button
                        type="text"
                        icon={<SettingOutlined style={{ color: showSettings ? '#3C50E0' : '#8A99AF' }} />}
                        onClick={() => setShowSettings(!showSettings)}
                        className="hover:bg-[#1A222C]"
                    />
                }
            >
                <div className="py-2">
                    {showSettings && (
                        <div className="max-w-4xl mx-auto mb-8 p-6 bg-[#1A222C] border border-[#2E3A47] rounded-lg animate-fade-in">
                            <Title level={5} className="text-white mb-4 flex items-center gap-2">
                                <SettingOutlined /> Advanced Developer Settings
                            </Title>
                            <Paragraph className="text-gray-400 mb-6 text-sm">
                                These settings are only required if you are using a custom Facebook App for development.
                            </Paragraph>
                            <div className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Facebook App ID</label>
                                    <Input
                                        placeholder="Enter App ID"
                                        value={appId}
                                        onChange={handleAppIdChange}
                                        className="bg-[#24303F] border-[#2E3A47] text-white hover:border-primary focus:border-primary h-10"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Facebook App Secret</label>
                                    <Input.Password
                                        placeholder="Enter App Secret"
                                        value={appSecret}
                                        onChange={handleAppSecretChange}
                                        className="bg-[#24303F] border-[#2E3A47] text-white hover:border-primary focus:border-primary h-10"
                                    />
                                </div>
                            </div>
                            <Alert
                                className="mt-4 bg-[#24303F] border-[#3C50E0] text-gray-300"
                                message="Required for Localhost"
                                description={<span>Make sure <b>https://localhost:3000</b> is added to 'Allowed Domains for JavaScript SDK' in Facebook Developer Console.</span>}
                                type="info"
                                showIcon
                                icon={<InfoCircleOutlined style={{ color: '#3C50E0' }} />}
                            />
                        </div>
                    )}

                    <div className="max-w-4xl mx-auto flex flex-col items-center py-8 text-center border-b border-[#2E3A47] mb-8">
                        <div className="mb-6 relative">
                            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-10 animate-pulse"></div>
                            <FacebookOutlined style={{ fontSize: '72px', color: '#1877F2' }} />
                        </div>
                        <Title level={3} className="text-white mb-2">
                            Connect your Facebook Ads
                        </Title>
                        <Paragraph className="text-gray-400 mb-8 max-w-md">
                            Linking your Facebook account allows the CRM to automatically capture leads and sync data from your campaigns in real-time.
                        </Paragraph>

                        <FacebookLogin
                            appId={appId || "0"}
                            onSuccess={handleResponse}
                            onFail={(error) => {
                                console.error('Login Failed!', error);
                                if (error.status === 'not_authorized') message.warning("Please authorize the app to continue.");
                            }}
                            onProfileSuccess={(response) => {
                                console.log('Get Profile Success!', response);
                            }}
                            style={{
                                backgroundColor: '#1877F2',
                                color: 'white',
                                padding: '12px 32px',
                                borderRadius: '6px',
                                fontSize: '16px',
                                fontWeight: '600',
                                border: 'none',
                                cursor: appId ? 'pointer' : 'not-allowed',
                                transition: 'all 0.3s',
                                boxShadow: '0 4px 12px rgba(24, 119, 242, 0.3)'
                            }}
                            scope="pages_show_list,ads_management,ads_read,business_management,leads_retrieval,pages_read_engagement,pages_manage_metadata,pages_manage_ads"
                        >
                            <Space>
                                <FacebookOutlined />
                                {registeredUserData.length > 0 ? "Refresh Connection" : "Connect with Facebook"}
                            </Space>
                        </FacebookLogin>

                        {!appId && <Text type="danger" className="mt-4">Please set an App ID in Settings to enable login.</Text>}
                    </div>

                    <div className="px-2">
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            items={tabItems}
                            className="fb-tabs"
                        />
                    </div>
                </div>
            </Card>

            {loading && (
                <div className="fixed inset-0 bg-[#1A222C] bg-opacity-70 flex flex-col items-center justify-center z-[9999]">
                    <Spin size="large" />
                    <Text className="text-white mt-4 font-medium tracking-wider">Syncing with Facebook...</Text>
                </div>
            )}

            <style>{`
                .fb-tabs .ant-tabs-nav::before { border-bottom: 1px solid #2E3A47; }
                .fb-tabs .ant-tabs-tab { color: #8A99AF; transition: all 0.3s; }
                .fb-tabs .ant-tabs-tab-active .ant-tabs-tab-btn { color: #3C50E0 !important; }
                .fb-tabs .ant-tabs-ink-bar { background: #3C50E0; }
                .animate-slide-up { animation: slideUp 0.5s ease-out; }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
};

export default FaceBook;
