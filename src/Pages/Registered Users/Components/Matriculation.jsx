import React, { useEffect, useState } from "react";
import {
  CustomDatePicker,
  InputWithIcon,
} from "../../../Components/CustomComponents/InputWithIcon";
import {
  editMatriculationDetailService,
  getStudentMatriculationDetailsService,
} from "../ApiService";
import { message, Drawer, Modal } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import LoadSkeleton from "../../../Components/CustomComponents/Skeleton";
import MatriculationDataUpdate from "./MatriculationDataUpdate";
dayjs.extend(customParseFormat);

const fields = [
  {
    key: "tenth_completed_on",
    label: (
      <>
        10<sup>th</sup>/Matriculation Completed On
      </>
    ),
    type: "date",
  },
  {
    key: "tenth_school_college",
    label: (
      <>
        10<sup>th</sup>/Matriculation School/College
      </>
    ),
  },
  {
    key: "tenth_board_university",
    label: (
      <>
        10<sup>th</sup>/Matriculation Board/University
      </>
    ),
  },
  {
    key: "tenth_marks_cgpa",
    label: (
      <>
        10<sup>th</sup>/Matriculation Marks/CGPA
      </>
    ),
    type: "number",
  },
];

export const Matriculation = ({
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
    editMatriculationDetailApi();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getMatriculationDetailApi = () => {
    getStudentMatriculationDetailsService(userName).then((response) => {
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

  const editMatriculationDetailApi = () => {
    const dataToSubmit = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value.value instanceof dayjs
          ? value.value.format("DD-MM-YYYY") // Format to DD-MM-YYYY
          : value.value,
      ])
    );
    editMatriculationDetailService(dataToSubmit, userName)
      .then((response) => {
        if (response.data.success === "1") {
          getMatriculationDetailApi();
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
    getMatriculationDetailApi();
  }, []);

  return (
    <>
      <div className="relative py-2">
        <div className="absolute right-0">
          <PrimaryButton
            title={"Change Status"}
            type={"primary"}
            onClick={showEditDrawer}
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
                      ) : field.type === "number" ? (
                        <InputWithIcon
                          type="number"
                          // disabled={data?.is_approved}
                          placeholder={`Please enter Marks`}
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
      </div>

      <Drawer
        title="Matriculation Details"
        placement="right"
        width={400}
        onClose={onEditClose}
        open={editOpen}
      >
        <MatriculationDataUpdate
          userName={userName}
          setEditOpen={setEditOpen}
          getProfileDetailApi={getMatriculationDetailApi}
          dataremarks={data?.remarks}
          status={data?.status}
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
