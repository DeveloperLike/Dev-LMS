import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import logo from "../../../assets/Logo.png";

const PaymentRedirection = () => {
    const [searchParams] = useSearchParams();
    const paymentStatus = searchParams.get("success");
    const transactionId = searchParams.get("txnid");
    const [current, setCurrent] = React.useState({
        icon: '',
        title: '',
        message: ''
    });

    useEffect(() => {
        console.log("useEffect Fired");
        const result = statusConfig(paymentStatus);
        console.log("Status Result:", result);
        setCurrent(result);
    }, [paymentStatus]);

    const statusConfig = (paymentStatus) => {

        if(paymentStatus === "true") {
            return {
                icon: <CheckCircle className="text-green-500 w-16 h-16" />,
                title: "Payment Successful",
                message:
                    <div>Your payment has been completed successfully against the transaction ID: <b>{transactionId}</b><p className="my-3">Thank you for your purchase.</p></div>,
            };
        }
        if(paymentStatus === "false") {
            return {
                icon: <XCircle className="text-red-500 w-16 h-16" />,
                title: "Payment Failed",
                message:
                    "Something went wrong during the payment process. Please try again.",
            };
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center">
                <Link className="mb-5.5 inline-block" to="/">
                    <img className="hidden dark:block" style={{ maxHeight: "130px" }} src={logo} alt="Logo" />
                    <img className="dark:hidden" style={{ maxHeight: "130px" }} src={logo} alt="Logo" />
                </Link>
                <div className="flex justify-center mb-6">
                    {current.icon}
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {current.title}
                </h1>

                <p className="text-gray-500 mb-8">
                    {current.message}
                </p>

            </div>
        </div>
    );
};

export default PaymentRedirection;
