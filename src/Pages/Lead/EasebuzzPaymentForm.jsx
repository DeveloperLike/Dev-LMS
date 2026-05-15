import { Button, Select } from "antd";
import { Loader2Icon, Send, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

const nodeApi = import.meta.env.VITE_NODE_API_URL;
const appUrl = import.meta.env.VITE_APP_URL;

const getSelectedPackageInfo = (
    packageList,
    selectedPackageIds,
    setSelectedPackage
) => {
    let selectedPackages = [];

    selectedPackages.push(
        ...packageList.filter((pkg) =>
            selectedPackageIds.includes(pkg.id)
        )
    );

    setSelectedPackage(selectedPackages);
};

const normalizePhone = (phone) => {
    phone = phone?.replace(/\D/g, "");

    if (phone?.startsWith("91") && phone.length === 12) {
        phone = phone.slice(2);
    }

    if (phone?.startsWith("+91") && phone.length === 13) {
        phone = phone.slice(3);
    }

    return phone;
};

const alertColor = {
    success:
        "bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-300",

    error:
        "bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300",
};

const EasebuzzPaymentForm = ({
    studentInfo,
    getLeadPackageListService,
    setAlert,
    alert,
    setOpenPaymentLinkForm,
    loggedInUser,
    leadId,
}) => {
    const [loading, setLoading] = useState(false);
    const [paymentLinkSent, setPaymentLinkSent] = useState(false);
    const [selectedPackages, setSelectedPackages] = useState([]);

    const [formData, setFormData] = useState({
        txnid: "",
        amount: "",
        firstname: "",
        email: "",
        phone: "",
        productinfo: "",
        degree_applied_for: "",
        category: "",
        medium_of_study: "",
        description: "",
        surl: "",
        furl: "",
    });

    const [packageList, setPackageList] = useState([]);

    const inputClass =
        "w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#141414] text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 outline-none transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500";

    const selectStyles = `
        .custom-dark-select .ant-select-selector{
            background:#fff !important;
            border-radius:12px !important;
            min-height:46px !important;
            border:1px solid #e5e7eb !important;
            padding-top:5px !important;
            box-shadow:none !important;
        }

        .custom-dark-select .ant-select-selection-placeholder{
            color:#9ca3af !important;
        }

        .dark .custom-dark-select .ant-select-selector{
            background:#141414 !important;
            border:1px solid rgba(255,255,255,0.08) !important;
            color:white !important;
        }

        .dark .custom-dark-select .ant-select-selection-item{
            background:rgba(255,206,0,0.12) !important;
            color:#ffce00 !important;
            border:none !important;
        }

        .dark .custom-dark-select .ant-select-arrow{
            color:#ffffff !important;
        }
    `;

    const fetchPackageList = async () => {
        try {
            const res = await getLeadPackageListService();
            setPackageList(res?.data?.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (studentInfo?.length) {
            const getValue = (code) =>
                studentInfo.find((item) => item.code === code)?.value || "";

            setFormData((prev) => ({
                ...prev,
                firstname: getValue("full_name"),
                email: getValue("email"),
                phone: normalizePhone(getValue("phone")),
            }));
        }
    }, [studentInfo]);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            txnid: "",
            surl: "",
            furl: "",
        }));

        fetchPackageList();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        const requiredFields = [
            "amount",
            "firstname",
            "email",
            "phone",
            "productinfo",
            "degree_applied_for",
            "category",
            "medium_of_study",
            "description",
        ];

        const requiredFieldMessage = {
            amount: "Amount",
            firstname: "First Name",
            email: "Email",
            phone: "Phone",
            productinfo: "Package Information",
            degree_applied_for: "Degree Applied For",
            category: "Category",
            medium_of_study: "Medium of Study",
            description: "Description",
        };

        for (let field of requiredFields) {
            if (!formData[field] || formData[field].toString().trim() === "") {
                return `${requiredFieldMessage[field]} is required`;
            }
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setAlert({});
        setLoading(true);

        const transactionId = `TXN_${Date.now()
            .toString(36)}${Math.random()
                .toString(36)
                .slice(2, 4)}_${leadId?.slice(0, 5)}`.toUpperCase();

        const error = validateForm();

        if (error) {
            setAlert({
                type: "error",
                message: error,
            });

            setLoading(false);
            return;
        }

        formData.amount = parseFloat(formData.amount).toFixed(2);

        try {
            const emailRes = await fetch(`${nodeApi}/send-mail`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: formData.email,
                    subject: "YesGermany - Payment Link",
                    information: {
                        product: formData.productinfo,
                        payment_url: `${appUrl}/pay?leadId=${leadId}&transactionId=${transactionId}`,
                        transaction_id: transactionId,
                        amount: formData.amount,
                        name: formData.firstname,
                    },
                }),
            });

            const emailData = await emailRes.json();

            if (emailData.success) {
                setAlert({
                    type: "success",
                    message: "Payment link sent successfully",
                });

                const transactionInfo = {
                    lead_id: leadId,
                    payment_link: `${appUrl}/pay?leadId=${leadId}&transactionId=${transactionId}`,
                    transaction_id: transactionId,
                    amount: formData.amount,
                    status: "pending",
                    verified_by_id: loggedInUser?.username || null,
                    transaction_type: "package purchase",
                    degree_applied_for:
                        formData.degree_applied_for,
                    category: formData.category,
                    medium_of_study:
                        formData.medium_of_study,
                    description: formData.description,
                    created_at: new Date().toISOString(),
                    last_updated: new Date().toISOString(),
                    mode: "online",
                    user_id:
                        studentInfo?.find(
                            (item) => item.code === "username"
                        )?.value || null,
                    package: formData.productinfo,
                    selectedPackages,
                    studentInfo,
                };

                const transactionRes = await fetch(
                    `${nodeApi}/transaction-saved`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            information: transactionInfo,
                        }),
                    }
                );

                const transactionData =
                    await transactionRes.json();

                setPaymentLinkSent(transactionData.success);

                setAlert({
                    type: transactionData.success
                        ? "success"
                        : "error",

                    message: transactionData.success
                        ? "Transaction saved successfully"
                        : "Failed to save transaction",
                });

                setFormData({});
            } else {
                setAlert({
                    type: "error",
                    message: "Failed to send payment link",
                });
            }
        } catch (err) {
            console.error(err);

            setAlert({
                type: "error",
                message: "Something went wrong",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-white min-h-screen px-1">
            <style>{selectStyles}</style>

            {paymentLinkSent ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />

                    <h2 className="text-2xl font-bold mb-2">
                        Payment Link Sent
                    </h2>

                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Payment link has been sent successfully.
                    </p>

                    <Button
                        type="primary"
                        size="large"
                        className="!bg-[#ffce00] !text-black !border-none !font-semibold"
                        onClick={() =>
                            setOpenPaymentLinkForm(false)
                        }
                    >
                        Close
                    </Button>
                </div>
            ) : (
                <>
                    {alert?.type && (
                        <div
                            className={`p-4 mb-5 rounded-xl text-sm font-medium ${alertColor[alert.type]}`}
                        >
                            {alert.message}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    Amount{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    name="amount"
                                    value={formData.amount}
                                    className={inputClass}
                                    onChange={handleChange}
                                    placeholder="Enter amount"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    Name{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    name="firstname"
                                    value={formData.firstname}
                                    disabled
                                    className={`${inputClass} opacity-80 cursor-not-allowed`}
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    Email{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className={`${inputClass} opacity-80 cursor-not-allowed`}
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    Phone{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    name="phone"
                                    value={
                                        formData.phone
                                            ? normalizePhone(
                                                formData.phone
                                            )
                                            : ""
                                    }
                                    disabled
                                    className={`${inputClass} opacity-80 cursor-not-allowed`}
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    Package{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <Select
                                    className="custom-dark-select w-full"
                                    mode="multiple"
                                    allowClear
                                    placeholder="Select Package"
                                    onChange={(value) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            productinfo: value,
                                        }));

                                        getSelectedPackageInfo(
                                            packageList,
                                            value,
                                            setSelectedPackages
                                        );
                                    }}
                                >
                                    {packageList.map((pkg) => (
                                        <Select.Option
                                            key={pkg.id}
                                            value={pkg.id}
                                        >
                                            {pkg.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    Degree Applied For{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    name="degree_applied_for"
                                    value={
                                        formData.degree_applied_for
                                    }
                                    className={inputClass}
                                    onChange={handleChange}
                                    placeholder="Enter degree"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    Category{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    name="category"
                                    value={formData.category}
                                    className={inputClass}
                                    onChange={handleChange}
                                    placeholder="Enter category"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    Medium Of Study{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    name="medium_of_study"
                                    value={
                                        formData.medium_of_study
                                    }
                                    className={inputClass}
                                    onChange={handleChange}
                                    placeholder="Enter medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                Description{" "}
                                <span className="text-red-500">
                                    *
                                </span>
                            </label>

                            <textarea
                                rows={4}
                                name="description"
                                value={formData.description}
                                className={`${inputClass} resize-none`}
                                onChange={handleChange}
                                placeholder="Enter description"
                            />
                        </div>

                        <button
                            disabled={loading}
                            className="
                                w-full
                                rounded-xl
                                bg-[#ffce00]
                                hover:bg-yellow-400
                                disabled:opacity-70
                                disabled:cursor-not-allowed
                                text-black
                                font-bold
                                py-3
                                px-6
                                flex
                                items-center
                                justify-center
                                gap-2
                                transition-all
                                duration-200
                                shadow-lg
                                hover:shadow-yellow-500/20
                            "
                        >
                            {loading ? (
                                <>
                                    <Loader2Icon className="animate-spin w-5 h-5" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Send Now
                                </>
                            )}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default EasebuzzPaymentForm;