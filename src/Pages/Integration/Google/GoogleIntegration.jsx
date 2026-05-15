import React, { useState, useEffect } from "react";
import { Card, Button, Typography, Space, message, Select, Divider, Tag, Spin, Result, Input } from "antd";
import { GoogleOutlined, LogoutOutlined, CheckCircleOutlined, SyncOutlined, SettingOutlined } from "@ant-design/icons";
import { getGoogleAuthUrlService, postGoogleCallbackService, getGooglePropertiesService, getGoogleGscSitesService } from "../../Integration/ApiService";
import { useLocation, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const GoogleIntegration = ({ mode }) => {
    const [loading, setLoading] = useState(false);
    const [properties, setProperties] = useState([]);
    const [gscSites, setGscSites] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(localStorage.getItem("google_property_id") || "");
    const [selectedGscSite, setSelectedGscSite] = useState(localStorage.getItem("google_gsc_site") || "");
    const [isConnected, setIsConnected] = useState(!!localStorage.getItem("google_access_token"));
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get("code");

        if (code) {
            handleCallback(code);
        } else if (isConnected) {
            fetchProperties();
            fetchGscSites();
        }
    }, []);

    const handleCallback = async (code) => {
        setLoading(true);
        try {
            const response = await postGoogleCallbackService({ code });
            if (response.data.success) {
                const { access_token, refresh_token } = response.data.tokens;
                localStorage.setItem("google_access_token", access_token);
                if (refresh_token) localStorage.setItem("google_refresh_token", refresh_token);
                setIsConnected(true);
                message.success("Successfully connected to Google!");
                // Clear query params
                navigate("/integrations/google", { replace: true });
                fetchProperties();
                fetchGscSites();
            } else {
                message.error(response.data.message || "Failed to handle callback");
            }
        } catch (error) {
            console.error("Callback Error:", error);
            message.error("An error occurred during Google authentication");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await getGoogleAuthUrlService();
            if (response.data.success && response.data.url) {
                window.location.href = response.data.url;
            } else {
                message.error("Failed to fetch Google Auth URL");
            }
        } catch (error) {
            console.error("Auth URL Error:", error);
            message.error("An error occurred while initiating Google login");
        } finally {
            setLoading(false);
        }
    };

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const response = await getGooglePropertiesService();
            if (response.data.success) {
                setProperties(response.data.properties);
            } else {
                message.error(response.data.message || "Failed to fetch properties");
            }
        } catch (error) {
            console.error("Properties Error:", error);
            if (error.response?.status === 401) {
                handleLogout();
                message.warning("Session expired. Please login again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchGscSites = async () => {
        setLoading(true);
        try {
            const response = await getGoogleGscSitesService();
            if (response.data.success) {
                setGscSites(response.data.sites);
            } else {
                message.error(response.data.message || "Failed to fetch Search Console sites");
            }
        } catch (error) {
            console.error("GSC Sites Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePropertyChange = (value) => {
        setSelectedProperty(value);
        localStorage.setItem("google_property_id", value);
        message.success("Analytics Property updated!");
    };

    const handleGscSiteChange = (value) => {
        setSelectedGscSite(value);
        localStorage.setItem("google_gsc_site", value);
        message.success("Search Console Site updated!");
    };

    const handleLogout = () => {
        localStorage.removeItem("google_access_token");
        localStorage.removeItem("google_refresh_token");
        localStorage.removeItem("google_property_id");
        localStorage.removeItem("google_gsc_site");
        setIsConnected(false);
        setProperties([]);
        setGscSites([]);
        setSelectedProperty("");
        setSelectedGscSite("");
        message.info("Logged out from Google Integration");
    };

    return (
        <div className="p-4 md:p-6">
            <Card 
                className={`shadow-lg rounded-xl overflow-hidden ${mode === 'dark' ? 'bg-boxdark border-strokedark' : 'bg-white'}`}
                title={
                    <Space>
                        <GoogleOutlined style={{ fontSize: '24px', color: '#4285F4' }} />
                        <span className="text-xl font-bold">Google Analytics Integration</span>
                    </Space>
                }
            >
                <div className="max-w-2xl mx-auto py-8">
                    {!isConnected ? (
                        <div className="text-center">
                            <div className="mb-8">
                                <GoogleOutlined style={{ fontSize: '64px', color: '#4285F4' }} className="animate-bounce" />
                            </div>
                            <Title level={3}>Connect your Google Account</Title>
                            <Text className="block mb-8 text-gray-500">
                                Authenticate with your Google account to view your Google Analytics data directly in the CRM dashboard.
                                We only request read-only access to your properties.
                            </Text>
                            <Button 
                                type="primary" 
                                size="large" 
                                icon={<GoogleOutlined />} 
                                onClick={handleLogin}
                                loading={loading}
                                style={{ backgroundColor: '#4285F4', borderColor: '#4285F4', height: '50px', padding: '0 40px', borderRadius: '8px' }}
                            >
                                Login with Google
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <Space direction="vertical" size={2}>
                                    <Space align="center">
                                        <Title level={4} style={{ margin: 0 }}>Connection Status</Title>
                                        <Tag color="success" icon={<CheckCircleOutlined />}>Connected</Tag>
                                    </Space>
                                    <Text type="secondary">Your account is successfully linked.</Text>
                                </Space>
                                <Button 
                                    danger 
                                    icon={<LogoutOutlined />} 
                                    onClick={handleLogout}
                                >
                                    Disconnect
                                </Button>
                            </div>

                            <Divider />

                            <div className="mb-8">
                                <Title level={5} className="mb-4">
                                    <Space><SettingOutlined /> Configuration</Space>
                                </Title>
                                <div className="p-6 rounded-lg border border-dashed border-gray-300 dark:border-strokedark">
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium mb-2">Select GA4 Property</label>
                                        <div className="flex gap-2">
                                            <Select
                                                placeholder="Choose an Analytics property"
                                                className="flex-grow"
                                                size="large"
                                                value={selectedProperty || undefined}
                                                onChange={handlePropertyChange}
                                                loading={loading}
                                                showSearch
                                                optionFilterProp="children"
                                            >
                                                {properties.map(prop => (
                                                    <Option key={prop.id} value={prop.id}>
                                                        {prop.displayName} ({prop.id})
                                                    </Option>
                                                ))}
                                            </Select>
                                            <Input 
                                                placeholder="Or enter manually (properties/123...)" 
                                                style={{ width: '250px' }}
                                                value={selectedProperty}
                                                onChange={(e) => handlePropertyChange(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium mb-2">Select Search Console Site</label>
                                        <div className="flex gap-2">
                                            <Select
                                                placeholder="Choose a Search Console site"
                                                className="flex-grow"
                                                size="large"
                                                value={selectedGscSite || undefined}
                                                onChange={handleGscSiteChange}
                                                loading={loading}
                                                showSearch
                                                optionFilterProp="children"
                                            >
                                                {gscSites.map(site => (
                                                    <Option key={site.id} value={site.id}>
                                                        {site.displayName}
                                                    </Option>
                                                ))}
                                            </Select>
                                            <Input 
                                                placeholder="Or enter manually (https://...)" 
                                                style={{ width: '250px' }}
                                                value={selectedGscSite}
                                                onChange={(e) => handleGscSiteChange(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button 
                                            icon={<SyncOutlined spin={loading} />} 
                                            onClick={() => { fetchProperties(); fetchGscSites(); }}
                                            disabled={loading}
                                        >
                                            Refresh Lists
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <Result
                                status="info"
                                title="Ready to go!"
                                subTitle="You can now view your personalized Google Analytics data in the 'Reports' section."
                                extra={[
                                    <Button type="primary" key="analytics" onClick={() => navigate('/google-performance?tab=ga')}>
                                        Go to Analytics
                                    </Button>,
                                    <Button key="search" onClick={() => navigate('/google-performance?tab=gsc')}>
                                        Go to Search Console
                                    </Button>
                                ]}
                            />
                        </div>
                    )}
                </div>
            </Card>

            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
                    <Spin size="large" />
                </div>
            )}
        </div>
    );
};

export default GoogleIntegration;
