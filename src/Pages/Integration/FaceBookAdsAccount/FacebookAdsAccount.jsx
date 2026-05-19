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
            render: (text) => <Text className="text-white font-medium">{text}</Text>,
        },
        {
            title: "Ad Account ID",
            dataIndex: "ad_account_id",
            key: "ad_account_id",
            render: (text) => <Text code className="bg-[#1A222C] text-[#FFA500] border-none">{text}</Text>,
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
                    onChange={(checked) => handleToggleAdAccountStatus(record.ad_account_id, checked)}
                />
            ),
        },
    ];

    return (
        <div className="p-4 md:p-6 bg-[#1A222C] min-h-screen">
            <Card 
                className="bg-[#24303F] border-[#2E3A47] shadow-xl rounded-lg overflow-hidden mb-6"
                title={
                    <Space size="middle">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <AreaChartOutlined style={{ fontSize: '24px', color: 'white' }} />
                        </div>
                        <Title level={4} style={{ margin: 0, color: 'white' }}>Facebook Ad Account Integration</Title>
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
                <div className="max-w-4xl mx-auto py-2">
                    {showSettings && (
                        <div className="mb-8 p-6 bg-[#1A222C] border border-[#2E3A47] rounded-lg animate-fade-in">
                            <Title level={5} className="text-white mb-4 flex items-center gap-2">
                                <SettingOutlined /> Advanced Developer Settings
                            </Title>
                            <Paragraph className="text-gray-400 mb-6 text-sm">
                                These settings are shared with the Facebook Pages integration.
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
                        </div>
                    )}

                    <div className="flex flex-col items-center py-8 text-center">
                        <div className="mb-6 relative">
                            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-10 animate-pulse"></div>
                            <AreaChartOutlined style={{ fontSize: '72px', color: '#1877F2' }} />
                        </div>
                        <Title level={3} className="text-white mb-2">
                            Manage your Facebook Ad Accounts
                        </Title>
                        <Paragraph className="text-gray-400 mb-8 max-w-md">
                            Connect your ad accounts to track campaign performance and lead costs directly inside the CRM.
                        </Paragraph>
                        
                        <FacebookLogin
                            appId={appId || "0"}
                            onSuccess={handleResponse}
                            onFail={(error) => {
                                console.error('Login Failed!', error);
                                if (error.status === 'not_authorized') message.warning("Please authorize the app to continue.");
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
                                {registeredUserData.length > 0 ? "Sync Ad Accounts" : "Connect with Facebook"}
                            </Space>
                        </FacebookLogin>
                        
                        {!appId && <Text type="danger" className="mt-4">Please set an App ID in Settings to enable login.</Text>}
                    </div>
                </div>
            </Card>

            {registeredUserData.length > 0 ? (
                <div className="animate-slide-up">
                    <div className="flex items-center justify-between mb-4 mx-2">
                        <Title level={5} className="text-white m-0">Linked Ad Accounts ({registeredUserData.length})</Title>
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
                    <div className="mx-2 p-12 bg-[#24303F] border border-[#2E3A47] rounded-lg text-center shadow-inner">
                        <Paragraph className="text-gray-500 mb-0">
                            No Facebook Ad Accounts are currently linked.<br />
                            Click the button above to sync your accounts.
                        </Paragraph>
                    </div>
                )
            )}

            {loading && (
                <div className="fixed inset-0 bg-[#1A222C] bg-opacity-70 flex flex-col items-center justify-center z-[9999]">
                    <Spin size="large" />
                    <Text className="text-white mt-4 font-medium tracking-wider">Syncing Ad Accounts...</Text>
                </div>
            )}
        </div>
    );
};

export default FacebookAdsAccount;