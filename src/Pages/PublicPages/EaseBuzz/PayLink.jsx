import { Link, useSearchParams } from "react-router-dom";
import logo from "../../../assets/Logo.png";

const nodeApi = import.meta.env.VITE_NODE_API_URL;

const PayLink = () => {

    const [searchParams] = useSearchParams();
    const leadId = searchParams.get("leadId");
    const transactionId = searchParams.get("transactionId");

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center mx-auto flex justify-center flex-col items-center">
                <Link className="mb-5.5 inline-block" to="/">
                    <img className="hidden dark:block" style={{ maxHeight: "130px" }} src={logo} alt="Logo" />
                    <img className="dark:hidden" style={{ maxHeight: "130px" }} src={logo} alt="Logo" />
                </Link>
                <button
                    onClick={() =>
                        window.location.href = `${nodeApi}/pay/${leadId}/${transactionId}`
                    }
                    className="bg-yellow-300 text-dark px-6 py-3 rounded-lg"
                >
                    Pay Now
                </button>
            </div>
        </div>
    );
};

export default PayLink;
