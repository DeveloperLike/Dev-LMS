import React, { useEffect, useState } from "react";
import { Drawer, message, Modal } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import LoadSkeleton from "../../../Components/CustomComponents/Skeleton";
import {
  CustomSelectInput,
  InputWithIcon,
} from "../../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import {
  editPreferenceDetailService,
  getStudentPreferenceDetailsService,
} from "../ApiService";
import PreferenceStatusChange from "./PreferenceStatusChange";
dayjs.extend(customParseFormat);

const fields = [
  { key: "degree_applied_for", label: "Degree Applied For", type: "dropdown" },
  { key: "category", label: "Category", type: "dropdown" },
  {
    key: "medium_of_study",
    label: "Medium of Study",
    type: "dropdown",
  },
  {
    key: "intake",
    label: "Intake",
  },
  { key: "interested_study_field", label: "Interested Study Field" },
  { key: "specific_study_field", label: "Specific Study Field" },
  {
    key: "university_fee_budget",
    label: "University Fee Budget",
    type: "number",
  },
  {
    key: "living_budget_germany",
    label: "Living Budget Germany",
    type: "number",
  },
  { key: "comments", label: "Comments" },
];

export const Preference = ({
  userName,
  getIsApprovedApi,
  modulePermission,
}) => {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({});
  const [open, setOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    editDetailApi();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getDetailApi = () => {
    getStudentPreferenceDetailsService(userName).then((response) => {
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
    const value = e instanceof dayjs ? e : e?.target?.value;
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
          errors: errors[field] || [],
        };
      });
      return updatedFormData;
    });
  };

  const editDetailApi = () => {
    const dataToSubmit = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value.value instanceof dayjs
          ? value.value.format("DD-MM-YYYY") // Format to DD-MM-YYYY
          : value.value,
      ])
    );
    editPreferenceDetailService(dataToSubmit, userName)
      .then((response) => {
        if (response.data.success === "1") {
          getDetailApi();
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
    getDetailApi();
  }, []);

  return (
    <>
      <div className="relative py-2">
        <div className="absolute right-0">
          <PrimaryButton
            title={"Change Status"}
            type={"primary"}
            onClick={() => setOpen(true)}
          />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            showModal();
          }}
        >
          <div className="pt-4">
            {data === null || data === undefined ? (
              <LoadSkeleton />
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div>
                    {data?.status === "Approved" ? (
                      <>
                        <strong>Status : </strong>
                        <p className="bg-success inline-flex text-success bg-opacity-10 rounded-full  py-1 px-3 text-sm font-medium">
                          Approved
                        </p>
                      </>
                    ) : data?.status === "Rejected" ? (
                      <>
                        <strong>Status : </strong>
                        <p className="bg-danger inline-flex text-danger rounded-full bg-opacity-10  py-1 px-3 text-sm font-medium">
                          Rejected
                        </p>
                      </>
                    ) : null}
                  </div>
                  {data?.status === "Approved" && (
                    <div>
                      <p className="text-green-500 text-sm">
                        <strong className="text-black">Remarks : </strong>
                        {data?.remarks}
                      </p>
                    </div>
                  )}
                  {data?.status === "Rejected" && (
                    <div>
                      <p className="text-red-500 text-sm">
                        <strong className="text-black">Remarks : </strong>
                        {data?.remarks}
                      </p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field) => (
                    <div className="flex flex-col gap-1" key={field.key}>
                      <label className="text-sm flex items-center gap-1">
                        {field.label}
                      </label>
                      {field.type === "date" ? (
                        <CustomDatePicker
                          // disabled={data?.is_approved}
                          value={formData[field.key]?.value}
                          errors={formData[field.key]?.errors || []}
                          onChange={(date) =>
                            handleInputChange(date, field.key)
                          }
                        />
                      ) : field.type === "email" ? (
                        <InputWithIcon
                          type="email"
                          // disabled={data?.is_approved}
                          placeholder={`Please enter ${field.label}`}
                          value={formData[field.key]?.value || ""}
                          errors={formData[field.key]?.errors || []}
                          handler={(e) => handleInputChange(e, field.key)}
                        />
                      ) : field.type === "dropdown" ? (
                        <CustomSelectInput
                          placeholder={`Select ${field.label}`}
                          value={formData[field.key]?.value || null}
                          errors={formData[field.key]?.errors || []}
                          handler={(e) => handleInputChange(e, field.key)}
                          options={
                            field.key === "degree_applied_for"
                              ? [
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
                                ]
                              : field.key === "category"
                              ? [
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
                                ]
                              : [
                                  {
                                    value: "english",
                                    label: "English",
                                  },
                                  {
                                    value: "german",
                                    label: "German",
                                  },
                                ]
                          }
                        />
                      ) : field.type === "number" ? (
                        <InputWithIcon
                          type="number"
                          // disabled={data?.is_approved}
                          placeholder={`Please enter ${field.label}`}
                          value={formData[field.key]?.value || ""}
                          errors={formData[field.key]?.errors || []}
                          handler={(e) => handleInputChange(e, field.key)}
                        />
                      ) : (
                        <InputWithIcon
                          type="text"
                          // disabled={data?.is_approved}
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
                    className="p-4 px-6 mt-4 flex justify-self-center "
                    title={"Submit"}
                    block={false}
                  />
                )}
                {/* )} */}
              </div>
            )}
          </div>
        </form>
        <Drawer
          title="Change Status"
          placement="right"
          width={400}
          onClose={() => setOpen(false)}
          open={open}
        >
          <PreferenceStatusChange
            userName={userName}
            setOpen={setOpen}
            getDetailApi={getDetailApi}
            dataremarks={data?.remarks}
            status={data?.status}
            getIsApprovedApi={getIsApprovedApi}
          />
        </Drawer>
      </div>

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
