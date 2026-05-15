import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import FormItem from "antd/es/form/FormItem";
import { InputWithIcon } from "../../../Components/CustomComponents/InputWithIcon";
import { message } from "antd";
import { PostTransactionDiscountService } from "../ApiService";

const TransactionDiscount = ({
  userData,
  leadTransactionListGetApi,
  setOpenDiscount,
  mode
}) => {
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [paymentProof, setPaymentProof] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    user: userData,
    remarks: "",
    payment_proof: paymentProof,
  });

  const [formErrors, setFormErrors] = useState({
    amount: null,
    remarks: null,
    payment_proof: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInputFile = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setPaymentProof(selectedFile);
    }
  };

  const resetFormData = () => {
    setFormData({
      amount: "",
      user: userData || "",
      remarks: "",
      payment_proof: paymentProof,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    // Append the file separately
    if (paymentProof) {
      formDataToSend.append("payment_proof", paymentProof);
    }

    // Function to make the API call
    try {
      const response = await PostTransactionDiscountService(formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success === "1") {
        resetFormData();
        setPaymentProof(null);
        setFileInputKey(Date.now()); 
        message.success(response?.data?.message);
        leadTransactionListGetApi();
        setOpenDiscount(false);
      }
    } catch (error) {
      if (error?.response) {
        message.error(error?.response?.data?.message);
        setFormErrors(error?.response?.data?.data);
      }
    }
  };

  useEffect(() => {
    if (userData) {
      setFormData((prevData) => ({
        ...prevData,
        user: userData,
      }));
    }
    setFormData((prevData) => ({
      ...prevData,
      payment_proof: paymentProof,
    }));
  }, [userData, paymentProof]);

  useEffect(() => {
    leadTransactionListGetApi();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-3/3 space-y-4">
      <div>
        <div className="mb-[50px]">
          <FormItem>
            <div className="flex flex-col gap-1">
              <label>
                Discount Amount <sup className="text-red-500">*</sup>
              </label>
              <InputWithIcon
                name="amount"
                required={true}
                value={formData.amount}
                onChange={handleInputChange}
                className=""
                type="number"
                placeholder="Please enter amount"
              />
              {formErrors.amount && (
                <div className="text-red-500 text-sm">{formErrors.amount}</div>
              )}
            </div>
          </FormItem>

          <FormItem>
            <div className="flex flex-col gap-1">
              <label>Remarks</label>
              <InputWithIcon
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                className=""
                type="text"
                placeholder="Please enter remarks"
              />
              {formErrors.remarks && (
                <div className="text-red-500 text-sm">{formErrors.remarks}</div>
              )}
            </div>
          </FormItem>

          <FormItem>
            <label className="block mb-2">
              Please upload approval document
              <sup className="text-red-500">*</sup>
            </label>
            <input
              key={fileInputKey} // Changes when resetFileInput is called
              type="file"
              accept=".jpg, .jpeg, .png, .pdf"
              className="block border p-4"
              required
              onChange={handleInputFile}
            />
            {formErrors.payment_proof && (
              <div className="text-red-500 text-sm">
                {formErrors.payment_proof}
              </div>
            )}
          </FormItem>
        </div>

        <PrimaryButton
          onClick={handleSubmit}
          type="primary"
          htmlType="submit"
          className="p-5"
          title={"Submit"}
          block={false}
        />
      </div>
    </form>
  );
};

export default TransactionDiscount;
