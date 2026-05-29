import React, { useEffect, useState } from "react";
import { Drawer, message, Modal } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { editLeadProfileDetailService, getLeadStudentPersonalDetailsService } from "../../ApiService";
import {
  CustomDatePicker, CustomSelectInput,
  InputWithIcon,
} from "../../../../Components/CustomComponents/InputWithIcon";
import LoadSkeleton from "../../../../Components/CustomComponents/Skeleton";
import { PrimaryButton } from "../../../../Components/CustomComponents/ButtonUi";
import { LeadPersonalDataUpdate } from "./PersonalDataUpdate";
import { ExclamationCircleOutlined } from "@ant-design/icons";

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

const germanyStateOptions = [
  { label: "Baden-Württemberg", value: "Baden-Württemberg" },
  { label: "Bavaria", value: "Bavaria" },
  { label: "Berlin", value: "Berlin" },
  { label: "Brandenburg", value: "Brandenburg" },
  { label: "Bremen", value: "Bremen" },
  { label: "Hamburg", value: "Hamburg" },
  { label: "Hesse", value: "Hesse" },
  { label: "Lower Saxony", value: "Lower Saxony" },
  { label: "Mecklenburg-Vorpommern", value: "Mecklenburg-Vorpommern" },
  { label: "North Rhine-Westphalia", value: "North Rhine-Westphalia" },
  { label: "Rhineland-Palatinate", value: "Rhineland-Palatinate" },
  { label: "Saarland", value: "Saarland" },
  { label: "Saxony", value: "Saxony" },
  { label: "Saxony-Anhalt", value: "Saxony-Anhalt" },
  { label: "Schleswig-Holstein", value: "Schleswig-Holstein" },
  { label: "Thuringia", value: "Thuringia" },
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

  const getProfileDetailApi = async () => {
    try {
      const response = await getLeadStudentPersonalDetailsService(userName);

      if (response?.data?.success && response?.data?.data) {
        const profile = response.data.data;

        setData(profile);

        const initialFormData = {};

        fields.forEach((field) => {
          let value;

          switch (field.type) {
            case "date":
              value = profile?.[field.key]
                ? dayjs(profile[field.key])
                : null;
              break;

            case "tags":
              value = Array.isArray(profile?.[field.key])
                ? profile[field.key]
                : [];
              break;

            default:
              value = profile?.[field.key] ?? "";
              break;
          }

          initialFormData[field.key] = {
            value,
            errors: [],
          };
        });

        setFormData(initialFormData);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to load profile");
    }
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

  const editProfileDetailApi = async () => {
    try {
      const dataToSubmit = {};

      Object.keys(formData).forEach((key) => {
        const value = formData[key]?.value;

        dataToSubmit[key] = dayjs.isDayjs(value)
          ? value.format("YYYY-MM-DD")
          : value;
      });

      const response = await editLeadProfileDetailService(
        dataToSubmit,
        userName
      );

      if (response?.data?.success) {
        message.success("Profile updated successfully");
        getProfileDetailApi();
      }
    } catch (error) {
      handleError(error?.response?.data?.data);

      message.error(
        error?.response?.data?.message ||
        "Failed to update profile"
      );
    }
  };

  useEffect(() => {
    if (userName) {
      getProfileDetailApi();
    }
  }, [userName]);

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
                          value={formData[field.key]?.value ?? ""}
                          errors={formData[field.key]?.errors || []}
                          handler={(e) => handleInputChange(e, field.key)}
                        />
                      ) : field.type === "dropdown" ? (
                        <CustomSelectInput
                          required={false}
                          // disabled={data?.is_approved}
                          placeholder={`Select ${field.label}`}
                          value={formData[field.key]?.value ?? null}
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
                          mode="multiple"
                          placeholder={`Select ${field.label}`}
                          value={formData[field.key]?.value ?? []}
                          errors={formData[field.key]?.errors || []}
                          handler={(e) => handleInputChange(e, field.key)}
                          options={germanyStateOptions}
                        />
                      ) : field.type === "number" ? (
                        <InputWithIcon
                          required={false}
                          type="number"
                          placeholder={`Please enter ${field.label}`}
                          value={formData[field.key]?.value ?? ""}
                          errors={formData[field.key]?.errors || []}
                          handler={(e) => handleInputChange(e, field.key)}
                        />
                      ) : (
                        <InputWithIcon
                          required={false}
                          type="text"
                          placeholder={`Please enter ${field.label}`}
                          value={formData[field.key]?.value ?? ""}
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
                    className="p-4 px-7 mt-4 flex justify-self-center text-black"
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
        open={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        centered
        width={500}
      >
        <div className="py-2">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-500/15 flex items-center justify-center shrink-0">
              <ExclamationCircleOutlined className="text-xl text-yellow-600 dark:text-yellow-400" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Verify Details
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Please verify student details before saving.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-yellow-200 dark:border-yellow-500/20 bg-yellow-50 dark:bg-yellow-500/10 p-3 mb-6">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Once saved, the profile information will be updated and reflected in
              the student's record.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="
               px-5 py-2 rounded-lg
               border border-slate-300 dark:border-slate-600
               text-slate-700 dark:text-slate-300
               bg-white dark:bg-slate-800
               hover:bg-slate-50 dark:hover:bg-slate-700
               transition-all
             "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleOk}
              className="
               px-5 py-2 rounded-lg
               bg-yellow-500 hover:bg-yellow-400
               text-black font-medium
               transition-all
             "
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
