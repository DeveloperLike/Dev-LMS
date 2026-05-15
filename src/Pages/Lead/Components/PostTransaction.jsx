import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import FormItem from "antd/es/form/FormItem";
import { InputWithIcon } from "../../../Components/CustomComponents/InputWithIcon";
import { message, Select } from "antd";
import { PostleadPackageTransactionService } from "../ApiService";

const PostTransaction = ({
  setNextPage,
  userData,
  setIsModalOpenTransaction,
  getDetailsDataApi,
  isshowBackButton,
  leadTransactionListGetApi,
  setIsModalOpen,
  isModalOpenTransaction,
  leadPackageListGetApi,
  isLead,
  mode
}) => {
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [paymentProof, setPaymentProof] = useState(null);
  const [formData, setFormData] = useState({
    degree_applied_for: null,
    category: null,
    medium_of_study: null,
    amount_paid_for: "",
    // description: "",
    amount: "",
    mode: null,
    user: userData,
    remarks: "",
    payment_proof: paymentProof,
  });

  const [formErrors, setFormErrors] = useState({
    degree_applied_for: null,
    category: null,
    medium_of_study: null,
    amount_paid_for: null,
    // description: null,
    amount: null,
    mode: null,
    remarks: null,
    payment_proof: null,
  });

  // Calculate total amount
  // const totalAmount =
  //   packageData &&
  //   packageData.reduce(
  //     (total, item) => total + parseFloat(item.total_amount),
  //     0
  //   );

  // const validateForm = () => {
  //   const errors = {};
  //   for (const field in formData) {
  //     if (
  //       formData[field] === null ||
  //       formData[field] === undefined ||
  //       formData[field] === ""
  //     ) {
  //       errors[field] = `${field.replace(/_/g, " ")} is required.`;
  //     }
  //   }
  //   setFormErrors(errors);
  //   return Object.keys(errors).length === 0;
  // };

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

  const handleSelectChange = (value, name) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // console.log(userData, "username for payload");

  const resetFormData = () => {
    setFormData({
      degree_applied_for: null,
      category: null,
      medium_of_study: null,
      amount_paid_for: "",
      // description: "",
      amount: "",
      mode: null,
      user: userData || "",
      remarks: "",
      payment_proof: paymentProof,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) {
    //   console.log("Validation failed. Errors:", formErrors);
    //   return;
    // }

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
      const response = await PostleadPackageTransactionService(formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // leadTransactionListGetApi();
      // isModalOpenTransaction === true && setIsModalOpenTransaction(false);
      // setIsModalOpen(false);
      if (response.data.success === "1") {
        resetFormData();
        setPaymentProof(null);
        setFileInputKey(Date.now()); // Change key to reset input field
        message.success(response?.data?.message);

        leadTransactionListGetApi();
        isModalOpenTransaction === true && setIsModalOpenTransaction(false);
        setIsModalOpen(false);
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
    // leadTransactionListGetApi();
    isLead === "lead" && getDetailsDataApi();
  }, []);

  useEffect(() => {
    isLead === "lead" && leadPackageListGetApi();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-3/3 space-y-4">
      <div>
        <div className="mb-[100px]">
          <FormItem>
            <div className="flex flex-col gap-1">
              <label>
                Degree Applied for <sup className="text-red-500">*</sup>
              </label>
              <Select
                name="degree_applied_for"
                size="large"
                style={{ width: "100%" }}
                placeholder="Select Degree"
                value={formData.degree_applied_for || undefined}
                onChange={(value) =>
                  handleSelectChange(value, "degree_applied_for")
                }
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  {
                    value: "bachelor",
                    label: "Bachelor",
                  },
                  {
                    value: "master",
                    label: "Master",
                  },
                  {
                    value: "german_language",
                    label: "German Language",
                  },
                  {
                    value: "ielts",
                    label: "IELTS",
                  },
                ]}
              />
              {formErrors.degree_applied_for && (
                <div className="text-red-500 text-sm">
                  {formErrors.degree_applied_for}
                </div>
              )}
            </div>
          </FormItem>

          <FormItem>
            <div className="flex flex-col gap-1">
              <label>
                Category <sup className="text-red-500">*</sup>
              </label>
              <Select
                name="category"
                size="large"
                style={{ width: "100%" }}
                placeholder="Select Category"
                value={formData.category}
                onChange={(value) => handleSelectChange(value, "category")}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  {
                    value: "public",
                    label: "Public",
                  },
                  {
                    value: "private",
                    label: "Private",
                  },
                  {
                    value: "mixed",
                    label: "Mixed",
                  },
                  {
                    value: "german_language",
                    label: "German Language",
                  },
                  {
                    value: "ielts",
                    label: "IELTS",
                  },
                ]}
              />
              {formErrors.category && (
                <div className="text-red-500 text-sm">
                  {formErrors.category}
                </div>
              )}
            </div>
          </FormItem>

          <FormItem>
            <div className="flex flex-col gap-1">
              <label>
                Medium of Study <sup className="text-red-500">*</sup>
              </label>
              <Select
                name="medium_of_study"
                value={formData.medium_of_study}
                onChange={(value) =>
                  handleSelectChange(value, "medium_of_study")
                }
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                size="large"
                style={{ width: "100%" }}
                placeholder="Select Medium of Study"
                options={[
                  {
                    value: "english",
                    label: "English",
                  },
                  {
                    value: "german",
                    label: "German",
                  },
                ]}
              />
              {formErrors.medium_of_study && (
                <div className="text-red-500 text-sm">
                  {formErrors.medium_of_study}
                </div>
              )}
            </div>
          </FormItem>

          <div className="flex-1 flex flex-col gap-1 mt-3 mb-5">
            <label className="text-sm">
              Amount Paid for <sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="amount_paid_for"
              value={formData.amount_paid_for}
              onChange={(value) => handleInputChange(value)}
              placeholder="Please enter amount paid for"
            />
            {formErrors.amount_paid_for && (
              <div className="text-red-500 text-sm">
                {formErrors.amount_paid_for}
              </div>
            )}
          </div>

          {/* <FormItem>
            <div className="flex flex-col gap-1">
              <label>
                Description <sup className="text-red-500">*</sup>
              </label>
              <InputWithIcon
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className=""
                type="text"
                placeholder="Please enter Description"
              />
              {formErrors.description && (
                <div className="text-red-500 text-sm">
                  {formErrors.description}
                </div>
              )}
            </div>
          </FormItem> */}

          <FormItem>
            <div className="flex flex-col gap-1">
              <label>
                Amount <sup className="text-red-500">*</sup>
              </label>
              <InputWithIcon
                name="amount"
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

          <div className="flex-1 flex flex-col gap-1 mt-3 mb-5">
            <label className="text-sm">
              Mode <sup className="text-red-500">*</sup>
            </label>
            <Select
              name="mode"
              size="large"
              style={{ width: "100%" }}
              placeholder="Select Mode"
              value={formData.mode}
              onChange={(value) => handleSelectChange(value, "mode")}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                {
                  value: "online",
                  label: "Online",
                },
                {
                  value: "cash",
                  label: "Cash",
                },
              ]}
            />
            {formErrors.mode && (
              <div className="text-red-500 text-sm">{formErrors.mode}</div>
            )}
          </div>

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
              Please upload payment proof
              {
                formData.mode !== "cash" &&
                (<sup className="text-red-500">*</sup>)
              }
            </label>
            <input
              key={fileInputKey} // Changes when resetFileInput is called
              type="file"
              accept=".jpg, .jpeg, .png, .pdf"
              className="block border p-4"
              required={formData.mode !== "cash"}
              onChange={handleInputFile}
            />
            {formErrors.payment_proof && (
              <div className="text-red-500 text-sm">
                {formErrors.payment_proof}
              </div>
            )}
          </FormItem>
        </div>

        <div className="absolute bottom-0 p-4 dark:bg-black dark:text-white bg-white text-black w-full left-0">
          <div>
            {/* <strong>Selected Package: {packageData.length}</strong> */}
            <strong>{/* Total Amount: ₹ {totalAmount} */}</strong>

            <div className="flex gap-2 pt-4 border-t mt-4">
              {isshowBackButton && (
                <PrimaryButton
                  onClick={() => setNextPage("pakageviewpage")}
                  type="primary"
                  className="p-5"
                  title={"Back"}
                  block={false}
                />
              )}
              <PrimaryButton
                onClick={handleSubmit}
                type="primary"
                htmlType="submit"
                title={"Submit"}
                block={false}
                className="p-5 w-full !bg-yellow-400 hover:!bg-yellow-500 !text-black dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PostTransaction;
