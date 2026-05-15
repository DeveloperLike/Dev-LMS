import React, { useEffect, useState } from "react";
import { Drawer, message, Modal } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { editLeadProfileDetailService, getLeadStudentPersonalDetailsService } from "../../ApiService";
import { CustomDatePicker,  CustomSelectInput,
  InputWithIcon, } from "../../../../Components/CustomComponents/InputWithIcon";
import LoadSkeleton from "../../../../Components/CustomComponents/Skeleton";
import { PrimaryButton } from "../../../../Components/CustomComponents/ButtonUi";
import { LeadPersonalDataUpdate } from "./PersonalDataUpdate";
dayjs.extend(customParseFormat);

const fields = [
  { key: "alternate_email", label: "Alternate Email", type: "email" },
  { key: "alternate_mobile", label: "Alternate Mobile Number", type: "number" },
  { key: "date_of_birth", label: "Date of Birth", type: "date" },
  { key: "place_of_birth", label: "Place of Birth" },
  { key: "gender", label: "Gender", type: "dropdown" },
  { key: "marital_status", label: "Marital Status", type: "dropdown" },
  { key: "house_number", label: "House Number" },
  { key: "block_street", label: "Block/Street" },
  { key: "area", label: "Area" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "pin_code", label: "Pin Code", type: "number" },
  { key: "aadhaar_number", label: "Aadhaar Number" },
  { key: "pan_card_number", label: "PAN Card Number" },
  { key: "passport_number", label: "Passport Number" },
  { key: "passport_expiry", label: "Passport Expiry", type: "date" },
  { key: "former_nationality", label: "Former Nationality" },
  { key: "place_of_current_residence", label: "Place of Current Residence" },
  { key: "residence_since", label: "Residence Since", type: "date" },
  { key: "family_name", label: "Family Name" },
  { key: "children", label: "Number of Children", type: "number" },
  { key: "occupation_learned", label: "Occupation Learned" },
  { key: "current_occupation", label: "Current Occupation" },
  { key: "convicted", label: "Convicted", type: "dropdown" },
  { key: "deported", label: "Deported", type: "dropdown" },
  { key: "visited_germany", label: "Visited Germany", type: "dropdown" },
  {
    key: "last_five_stays_germany",
    label: "Last Five Stays in Germany",
    type: "tags",
  },
  { key: "father_name", label: "Father's Name" },
  { key: "father_email", label: "Father's Email", type: "email" },
  { key: "father_mobile", label: "Father's Mobile Number", type: "number" },
  { key: "mother_name", label: "Mother's Name" },
  { key: "mother_email", label: "Mother's Email", type: "email" },
  { key: "mother_mobile", label: "Mother's Mobile Number", type: "number" },
];
export const PersonalInfomation = ({
  userName,
  getIsApprovedApi,
  modulePermission,
}) => {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({});
  const [editOpen, setEditOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showEditDrawer = () => {
    setEditOpen(true);
  };

  const onEditClose = () => {
    setEditOpen(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    editProfileDetailApi();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getProfileDetailApi = () => {
    getLeadStudentPersonalDetailsService(userName).then((response) => {
      if (response && response.data && response.data.data) {
        setData(response.data.data);
        const initialFormData = {};
        fields.forEach((field) => {
          initialFormData[field.key] = {
            value:
              field.type === "date" && response.data.data[field.key]
                ? dayjs(response.data.data[field.key], "DD-MM-YYYY")
                : response.data.data[field.key] || "",
            errors: [],
          };
        });
        setFormData(initialFormData);
      }
    });
  };

  const handleInputChange = (e, field) => {
    let value = e?.target?.value !== undefined ? e.target.value : e;
    setFormData((prevState) => ({
      ...prevState,
      [field]: { ...prevState[field], value },
    }));
  };

  const handleError = (errors) => {
    setFormData((prevData) => {
      const updatedFormData = {};
      Object.keys(prevData).forEach((field) => {
        updatedFormData[field] = {
          ...prevData[field],
          errors: errors?.[field] || [],
        };
      });
      return updatedFormData;
    });
  };

  const editProfileDetailApi = () => {
    const dataToSubmit = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value.value instanceof dayjs
          ? value.value.format("DD-MM-YYYY") // Format to DD-MM-YYYY
          : value.value,
      ])
    );
    console.log(dataToSubmit, "dataToSubmit");
    editLeadProfileDetailService(dataToSubmit, userName)
      .then((response) => {
        if (response.data.success === "1") {
          getProfileDetailApi();
          message.success(response?.data?.message);
        }
      })
      .catch((error) => {
        if (error) {
          handleError(error?.response?.data?.data);
          message.error(error?.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    getProfileDetailApi();
  }, []);

  return (
    <>
      <div className="relative py-2">
        {/* <div className="absolute right-0">
          <PrimaryButton
            title={"Change Status"}
            type={"primary"}
            onClick={showEditDrawer}
          />
        </div> */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            showModal();
          }}
        >
          <div className="pt-4 m-auto ">
            {data === null || data === undefined ? (
              <LoadSkeleton />
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div>
                    {data?.profile_status === "Approved" ? (
                      <>
                        <strong>Status : </strong>
                        <p className="bg-success inline-flex text-success bg-opacity-10 rounded-full  py-1 px-3 text-sm font-medium">
                          Approved
                        </p>
                      </>
                    ) : data?.profile_status === "Rejected" ? (
                      <>
                        <strong>Status : </strong>
                        <p className="bg-danger inline-flex text-danger rounded-full bg-opacity-10  py-1 px-3 text-sm font-medium">
                          Rejected
                        </p>
                      </>
                    ) : null}
                  </div>
                  {data?.profile_status === "Approved" && (
                    <div>
                      <p className="text-green-500 text-sm">
                        <strong className="text-black">Remarks : </strong>
                        {data?.remarks}
                      </p>
                    </div>
                  )}
                  {data?.profile_status === "Rejected" && (
                    <div>
                      <p className="text-red-500 text-sm">
                        <strong className="text-black">Remarks : </strong>
                        {data?.remarks}
                      </p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {fields.map((field) => (
                    <div className="flex flex-col gap-1" key={field.key}>
                      <label className="text-sm flex items-center gap-1">
                        {field.label}
                      </label>
                      {field.type === "date" ? (
                        <CustomDatePicker
                           required={false}
                          // disabled={data?.is_approved}
                          value={formData[field.key]?.value}
                          errors={formData[field.key]?.errors || []}
                          onChange={(date) =>
                            handleInputChange(date, field.key)
                          }
                        />
                      ) : field.type === "email" ? (
                        <InputWithIcon
                           required={false}
                          type="email"
                          // disabled={data?.is_approved}
                          placeholder={`Please enter ${field.label}`}
                          value={formData[field.key]?.value || ""}
                          errors={formData[field.key]?.errors || []}
                          handler={(e) => handleInputChange(e, field.key)}
                        />
                      ) : field.type === "dropdown" ? (
                        <CustomSelectInput
                           required={false}
                          // disabled={data?.is_approved}
                          placeholder={`Select ${field.label}`}
                          value={formData[field.key]?.value || null}
                          errors={formData[field.key]?.errors || []}
                          handler={(e) => handleInputChange(e, field.key)}
                          options={
                            field.key === "gender"
                              ? [
                                  {
                                    value: "Male",
                                    label: "Male",
                                  },
                                  {
                                    value: "Female",
                                    label: "Female",
                                  },
                                  {
                                    value: "Others",
                                    label: "Others",
                                  },
                                ]
                              : field.key === "marital_status"
                              ? [
                                  {
                                    value: "Single",
                                    label: "Single",
                                  },
                                  {
                                    value: "Married",
                                    label: "Married",
                                  },
                                  {
                                    value: "Divorced",
                                    label: "Divorced",
                                  },
                                ]
                              : [
                                  {
                                    value: "Yes",
                                    label: "Yes",
                                  },
                                  {
                                    value: "No",
                                    label: "No",
                                  },
                                ]
                          }
                        />
                      ) : field.type === "tags" ? (
                        <CustomSelectInput
                           required={false}
                          // disabled={data?.is_approved}
                          mode="tags"
                          placeholder={`Select ${field.label}`}
                          value={formData[field.key]?.value}
                          errors={formData[field.key]?.errors || []}
                          handler={(e) => handleInputChange(e, field.key)}
                        />
                      ) : field.type === "number" ? (
                        <InputWithIcon
                           required={false}
                          type="number"
                          // disabled={data?.is_approved}
                          placeholder={`Please enter ${field.label}`}
                          value={formData[field.key]?.value || ""}
                          errors={formData[field.key]?.errors || []}
                          handler={(e) => handleInputChange(e, field.key)}
                        />
                      ) : (
                        <InputWithIcon
                        required={false}
                          type="text"
                          // disabled={data?.is_approved}f
                          placeholder={`Please enter ${field.label}`}
                          value={formData[field.key]?.value || ""}
                          errors={formData[field.key]?.errors || []}
                          handler={(e) => handleInputChange(e, field.key)}
                        />
                      )}
                    </div>
                  ))}
                </div>
                {/* {data?.is_approved === false && ( */}
                {modulePermission.student_profile_management === "edit" && (
                  <PrimaryButton
                    type="primary"
                    htmlType={"submit"}
                    className="p-4 px-7 mt-4 flex justify-self-center "
                    title={"Submit"}
                    block={false}
                  />
                )}
                {/* )} */}
              </div>
            )}
          </div>
        </form>
      </div>

      <Drawer
        title="Personal Details"
        placement="right"
        width={400}
        onClose={onEditClose}
        open={editOpen}
      >
        <LeadPersonalDataUpdate
          userName={userName}
          setEditOpen={setEditOpen}
          getProfileDetailApi={getProfileDetailApi}
          dataremarks={data?.remarks}
          status={data?.profile_status}
          getIsApprovedApi={getIsApprovedApi}
        />
      </Drawer>

      <Modal
        title="Verify Details"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
      >
        <p>Please verify student details before saving.</p>
      </Modal>
    </>
  );
};
