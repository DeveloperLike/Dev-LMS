import React, { useEffect, useState } from "react";
import { message, Modal } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
    CustomDatePicker,
    CustomSelectInput,
    InputWithIcon,
} from "../../../../Components/CustomComponents/InputWithIcon";
import LoadSkeleton from "../../../../Components/CustomComponents/Skeleton";
import { PrimaryButton } from "../../../../Components/CustomComponents/ButtonUi";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
    editLeadEmploymentDetailService,
    getLeadEmploymentDetailsService,
    createLeadEmploymentDetailService,
} from "../../ApiService";

dayjs.extend(customParseFormat);

const fields = [
    {
        key: "organisation_name",
        label: "Organisation Name",
    },

    {
        key: "designation",
        label: "Designation",
    },

    {
        key: "employment_type",
        label: "Employment Type",
        type: "dropdown",
    },

    {
        key: "start_date",
        label: "Start Date",
        type: "date",
    },

    {
        key: "end_date",
        label: "End Date",
        type: "date",
    },

    {
        key: "location",
        label: "Location",
    },

    {
        key: "company_website",
        label: "Company Website",
    },

    {
        key: "status",
        label: "Status",
        type: "dropdown",
    },

    {
        key: "remarks",
        label: "Remarks",
    },

    {
        key: "description",
        label: "Description",
    },
];

const getDropdownOptions = (fieldKey) => {
    switch (fieldKey) {
        case "employment_type":
            return [
                {
                    value: "Full Time",
                    label: "Full Time",
                },
                {
                    value: "Part Time",
                    label: "Part Time",
                },
                {
                    value: "Internship",
                    label: "Internship",
                },
                {
                    value: "Contract",
                    label: "Contract",
                },
                {
                    value: "Freelance",
                    label: "Freelance",
                },
            ];

        case "status":
            return [
                {
                    value: "Pending",
                    label: "Pending",
                },
                {
                    value: "Approved",
                    label: "Approved",
                },
                {
                    value: "Rejected",
                    label: "Rejected",
                },
            ];

        default:
            return [];
    }
};

const LeadEmployment = ({ userName, modulePermission }) => {
    const [employmentList, setEmploymentList] = useState([]);
    const [activeEmploymentId, setActiveEmploymentId] = useState(null);

    const [formData, setFormData] = useState({});
    const [createFormData, setCreateFormData] = useState({});

    const [showCreateForm, setShowCreateForm] =
        useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const getEmploymentDetailApi = async () => {
        try {
            const response =
                await getLeadEmploymentDetailsService(
                    userName
                );

            if (response?.data?.success) {
                const employments =
                    response?.data?.data || [];

                setEmploymentList(employments);

                if (employments.length > 0) {
                    setActiveEmploymentId(
                        (prev) =>
                            prev || employments[0].id
                    );
                } else {
                    setActiveEmploymentId(null);
                    setFormData({});
                }
            }
        } catch (error) {
            console.error(error);

            message.error(
                "Failed to load employment"
            );
        }
    };

    const handleInputChange = (e, field) => {
        const value =
            e?.target?.value !== undefined
                ? e.target.value
                : e;

        setFormData((prev) => ({
            ...prev,
            [field]: {
                ...prev[field],
                value,
            },
        }));
    };

    const handleCreateInputChange = (
        e,
        field
    ) => {
        const value =
            e?.target?.value !== undefined
                ? e.target.value
                : e;

        setCreateFormData((prev) => ({
            ...prev,
            [field]: {
                ...prev[field],
                value,
            },
        }));
    };

    const handleError = (errors) => {
        setFormData((prevData) => {
            const updated = {};

            Object.keys(prevData).forEach((field) => {
                updated[field] = {
                    ...prevData[field],
                    errors: errors?.[field] || [],
                };
            });

            return updated;
        });
    };

    const editEmploymentApi = async () => {
        try {
            const payload = {};

            Object.keys(formData).forEach((key) => {
                const value = formData[key]?.value;

                payload[key] = dayjs.isDayjs(value)
                    ? value.format("YYYY-MM-DD")
                    : value;
            });

            const response =
                await editLeadEmploymentDetailService(
                    payload,
                    userName
                );

            if (response?.data?.success) {
                message.success(
                    "Employment updated successfully"
                );

                getEmploymentDetailApi();
            }
        } catch (error) {
            handleError(error?.response?.data?.data);

            message.error(
                error?.response?.data?.message ||
                "Failed to update employment"
            );
        }
    };

    const createEmploymentApi = async () => {
        try {
            const payload = {};

            Object.keys(createFormData).forEach(
                (key) => {
                    const value =
                        createFormData[key]?.value;

                    payload[key] =
                        dayjs.isDayjs(value)
                            ? value.format(
                                "YYYY-MM-DD"
                            )
                            : value;
                }
            );

            const response =
                await createLeadEmploymentDetailService(
                    payload,
                    userName
                );

            if (response?.data?.success) {
                message.success(
                    "Employment added successfully"
                );

                setCreateFormData({});
                setShowCreateForm(false);

                getEmploymentDetailApi();
            }
        } catch (error) {
            message.error(
                error?.response?.data?.message ||
                "Failed to add employment"
            );
        }
    };

    useEffect(() => {
        if (userName) {
            getEmploymentDetailApi();
        }
    }, [userName]);

    const selectedEmployment =
        employmentList.find(
            (item) =>
                item.id === activeEmploymentId
        );

    useEffect(() => {
        if (!selectedEmployment) return;

        const initialFormData = {};

        fields.forEach((field) => {
            let value;

            switch (field.type) {
                case "date":
                    value =
                        selectedEmployment[field.key]
                            ? dayjs(
                                selectedEmployment[
                                field.key
                                ]
                            )
                            : null;
                    break;

                default:
                    value =
                        selectedEmployment[field.key] ??
                        "";
            }

            initialFormData[field.key] = {
                value,
                errors: [],
            };
        });

        initialFormData.id = {
            value: selectedEmployment.id,
            errors: [],
        };

        setFormData(initialFormData);
    }, [selectedEmployment]);


    return (
        <>
            {showCreateForm && (
                <div
                    className="
                     mt-6
                     mb-6
                     rounded-xl
                     border
                     border-yellow-500/30
                     bg-slate-200
                     dark:bg-slate-800
                     shadow-sm
                     dark:shadow-none
                     overflow-hidden
                 "
                >
                    {/* Header */}
                    <div
                        className="
                         flex items-center justify-between
                         px-5 py-4
                         border-b
                         border-slate-200
                         dark:border-slate-700
                     "
                    >
                        <div>
                            <h3
                                className="
                                 text-lg
                                 font-semibold
                                 text-slate-900
                                 dark:text-white
                             "
                            >
                                Add New Employment
                            </h3>

                            <p
                                className="
                                 text-sm
                                 text-slate-500
                                 dark:text-slate-400
                             "
                            >
                                Add employment history
                            </p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {fields.map((field) => (
                                <div
                                    key={field.key}
                                    className="flex flex-col gap-1"
                                >
                                    <label
                                        className="
                                         text-sm
                                         font-medium
                                         text-slate-700
                                         dark:text-slate-300
                                     "
                                    >
                                        {field.label}
                                    </label>

                                    {field.type === "date" ? (
                                        <CustomDatePicker
                                            required={false}
                                            placeholder={`Select ${field.label}`}
                                            value={
                                                createFormData[field.key]
                                                    ?.value
                                            }
                                            errors={
                                                createFormData[field.key]
                                                    ?.errors || []
                                            }
                                            onChange={(date) =>
                                                handleCreateInputChange(
                                                    date,
                                                    field.key
                                                )
                                            }
                                        />
                                    ) : field.type ===
                                        "dropdown" ? (
                                        <CustomSelectInput
                                            required={false}
                                            placeholder={`Select ${field.label}`}
                                            value={
                                                createFormData[field.key]
                                                    ?.value ?? null
                                            }
                                            errors={
                                                createFormData[field.key]
                                                    ?.errors || []
                                            }
                                            handler={(e) =>
                                                handleCreateInputChange(
                                                    e,
                                                    field.key
                                                )
                                            }
                                            options={getDropdownOptions(
                                                field.key
                                            )}
                                        />
                                    ) : (
                                        <InputWithIcon
                                            required={false}
                                            type={
                                                field.type || "text"
                                            }
                                            placeholder={`Please enter ${field.label}`}
                                            value={
                                                createFormData[field.key]
                                                    ?.value ?? ""
                                            }
                                            errors={
                                                createFormData[field.key]
                                                    ?.errors || []
                                            }
                                            handler={(e) =>
                                                handleCreateInputChange(
                                                    e,
                                                    field.key
                                                )
                                            }
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() =>
                                    setShowCreateForm(false)
                                }
                                className="
                                 px-4 py-2
                                 rounded-lg
                                 border
                                 border-slate-300
                                 dark:border-slate-600
                                 text-slate-700
                                 dark:text-slate-300
                                 hover:bg-slate-100
                                 dark:hover:bg-slate-800
                                 transition-colors
                             "
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={createEmploymentApi}
                                className="
                                 px-5 py-2
                                 rounded-lg
                                 bg-yellow-500
                                 hover:bg-yellow-400
                                 text-black
                                 font-medium
                                 transition-colors
                             "
                            >
                                Save Employment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    setIsModalVisible(true);
                }}
            >
                <div className="pt-4">
                    {modulePermission.student_profile_management ===
                        "edit" && (
                            <div className="flex items-center justify-between mb-6 border-b dark:border-slate-700 border-slate-300 pb-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-black dark:text-white">
                                        Employment  Details
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        Manage employment history
                                    </p>
                                </div>

                                {modulePermission.student_profile_management ===
                                    "edit" && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const initialFormData = {};

                                                fields.forEach((field) => {
                                                    initialFormData[field.key] = {
                                                        value:
                                                            field.type === "date"
                                                                ? null
                                                                : "",
                                                        errors: [],
                                                    };
                                                });

                                                setCreateFormData(initialFormData);
                                                setShowCreateForm(true);
                                            }}
                                            className="
                                          flex items-center gap-2
                                          px-4 py-2
                                          rounded-lg
                                          bg-yellow-500
                                          hover:bg-yellow-400
                                          text-black
                                          font-medium
                                      "
                                        >
                                            + Add Employment
                                        </button>
                                    )}
                            </div>
                        )}

                    {employmentList.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-5">
                            {employmentList.map((employment) => (
                                <button
                                    key={employment.id}
                                    type="button"
                                    onClick={() =>
                                        setActiveEmploymentId(
                                            employment.id
                                        )
                                    }
                                    className={`
                                   px-4 py-2 rounded-lg
                                   border transition-all
                                   ${activeEmploymentId ===
                                            employment.id
                                            ? "bg-yellow-500 text-black border-yellow-500"
                                            : "border-slate-300 dark:border-slate-600"
                                        }
                               `}
                                >
                                    {employment.organisation_name ||
                                        "Employment"}
                                </button>
                            ))}
                        </div>
                    )}
                    {employmentList.length === 0 ? (
                        <LoadSkeleton />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {fields.map((field) => (
                                    <div
                                        className="flex flex-col gap-1"
                                        key={field.key}
                                    >
                                        <label className="text-sm">
                                            {field.label}
                                        </label>

                                        {field.type === "date" ? (
                                            <CustomDatePicker
                                                required={false}
                                                placeholder={`Select ${field.label}`}
                                                value={formData[field.key]?.value}
                                                errors={formData[field.key]?.errors || []}
                                                onChange={(date) =>
                                                    handleInputChange(
                                                        date,
                                                        field.key
                                                    )
                                                }
                                            />
                                        ) : field.type ===
                                            "dropdown" ? (
                                            <CustomSelectInput
                                                required={false}
                                                placeholder={`Select ${field.label}`}
                                                value={
                                                    formData[field.key]?.value || undefined
                                                }
                                                errors={formData[field.key]?.errors || []}
                                                handler={(e) =>
                                                    handleInputChange(e, field.key)
                                                }
                                                options={getDropdownOptions(field.key)}
                                            />
                                        ) : (
                                            <InputWithIcon
                                                required={false}
                                                type={
                                                    field.type || "text"
                                                }
                                                placeholder={`Please enter ${field.label}`}
                                                value={
                                                    formData[field.key]
                                                        ?.value ?? ""
                                                }
                                                errors={
                                                    formData[field.key]
                                                        ?.errors || []
                                                }
                                                handler={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        field.key
                                                    )
                                                }
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {modulePermission?.student_profile_management ===
                                "edit" && (
                                    <PrimaryButton
                                        type="primary"
                                        htmlType="submit"
                                        className="p-4 px-7 mt-4 flex justify-self-center text-black"
                                        title="Submit"
                                        block={false}
                                    />
                                )}
                        </>
                    )}
                </div>
            </form>

            <Modal
                open={isModalVisible}
                footer={null}
                centered
                onCancel={() =>
                    setIsModalVisible(false)
                }
            >
                <div className="py-2">
                    <div className="flex items-start gap-3 mb-5">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                            <ExclamationCircleOutlined className="text-xl text-yellow-600" />
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold">
                                Verify Employment Details
                            </h3>

                            <p className="text-sm text-slate-500">
                                Please verify employment
                                details before saving.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() =>
                                setIsModalVisible(false)
                            }
                            className="px-5 py-2 rounded-lg border"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => {
                                editEmploymentApi();
                                setIsModalVisible(false);
                            }}
                            className="px-5 py-2 rounded-lg bg-yellow-500 text-black"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default LeadEmployment;