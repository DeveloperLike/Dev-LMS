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
    getLeadEducationDetailsService,
    editLeadEducationDetailService,
    createLeadEducationDetailService,
} from "../../ApiService";

dayjs.extend(customParseFormat);

const fields = [
    { key: "university", label: "University" },
    { key: "course", label: "Course" },
    { key: "institute", label: "Institute" },

    {
        key: "education_type",
        label: "Education Type",
        type: "dropdown",
    },

    {
        key: "course_type",
        label: "Course Type",
        type: "dropdown",
    },

    {
        key: "started",
        label: "Started Date",
        type: "date",
    },

    {
        key: "ended",
        label: "Ended Date",
        type: "date",
    },

    {
        key: "degree_date",
        label: "Degree Date",
        type: "date",
    },

    {
        key: "cgpa",
        label: "CGPA",
        type: "number",
    },

    {
        key: "scgpa",
        label: "SCGPA",
        type: "number",
    },

    {
        key: "percentage",
        label: "Percentage",
        type: "number",
    },

    {
        key: "german_grade",
        label: "German Grade",
        type: "number",
    },

    { key: "website", label: "Website" },
    { key: "location", label: "Location" },

    {
        key: "professor_email",
        label: "Professor Email",
        type: "email",
    },

    { key: "subjects", label: "Subjects" },
    { key: "description", label: "Description" },
];

const getDropdownOptions = (fieldKey) => {
    switch (fieldKey) {
        case "education_type":
            return [
                { value: "10th", label: "10th" },
                { value: "12th", label: "12th" },
                { value: "Diploma", label: "Diploma" },
                { value: "Bachelor", label: "Bachelor" },
                { value: "Master", label: "Master" },
                { value: "PhD", label: "PhD" },
            ];

        case "course_type":
            return [
                { value: "Full Time", label: "Full Time" },
                { value: "Part Time", label: "Part Time" },
                { value: "Distance", label: "Distance" },
            ];

        default:
            return [];
    }
};

const LeadEducation = ({ userName, modulePermission }) => {
    const [educationList, setEducationList] = useState([]);
    const [activeEducationId, setActiveEducationId] = useState(null);
    const [formData, setFormData] = useState({});
    const [createFormData, setCreateFormData] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const getEducationDetailApi = async () => {
        try {
            const response =
                await getLeadEducationDetailsService(
                    userName
                );

            if (response?.data?.success) {
                const educations =
                    response?.data?.data || [];

                setEducationList(educations);

                // Select first tab by default
                if (educations.length > 0) {
                    setActiveEducationId((prev) =>
                        prev || educations[0].id
                    );
                } else {
                    setActiveEducationId(null);
                    setFormData({});
                }
            }
        } catch (error) {
            console.error(error);

            message.error(
                "Failed to load education"
            );
        }
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

    const editEducationApi = async () => {
        try {
            const payload = {};

            Object.keys(formData).forEach((key) => {
                const value = formData[key]?.value;

                payload[key] = dayjs.isDayjs(value)
                    ? value.format("YYYY-MM-DD")
                    : value;
            });

            const response =
                await editLeadEducationDetailService(
                    payload,
                    userName
                );

            if (response?.data?.success) {
                message.success(
                    "Education updated successfully"
                );

                getEducationDetailApi();
            }
        } catch (error) {
            handleError(error?.response?.data?.data);

            message.error(
                error?.response?.data?.message ||
                "Failed to update education"
            );
        }
    };

    const createEducationApi = async () => {
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
                await createLeadEducationDetailService(
                    payload,
                    userName
                );

            if (response?.data?.success) {
                message.success(
                    "Education added successfully"
                );

                setCreateFormData({});
                setShowCreateForm(false);

                getEducationDetailApi();
            }
        } catch (error) {
            message.error(
                error?.response?.data?.message ||
                "Failed to add education"
            );
        }
    };

    useEffect(() => {
        if (userName) {
            getEducationDetailApi();
        }
    }, [userName]);

    useEffect(() => {
        if (!selectedEducation) return;

        const initialFormData = {};

        fields.forEach((field) => {
            let value;

            switch (field.type) {
                case "date":
                    value =
                        selectedEducation[
                            field.key
                        ]
                            ? dayjs(
                                selectedEducation[
                                field.key
                                ]
                            )
                            : null;
                    break;

                default:
                    value =
                        selectedEducation[
                        field.key
                        ] ?? "";
            }

            initialFormData[field.key] = {
                value,
                errors: [],
            };
        });

        initialFormData.id = {
            value: selectedEducation.id,
            errors: [],
        };

        setFormData(initialFormData);
    }, [activeEducationId]);

    const selectedEducation =
        educationList.find(
            (item) =>
                item.id === activeEducationId
        );

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
                                Add New Education
                            </h3>

                            <p
                                className="
                                text-sm
                                text-slate-500
                                dark:text-slate-400
                            "
                            >
                                Add a new educational qualification
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
                                                createFormData[
                                                    field.key
                                                ]?.value
                                            }
                                            errors={
                                                createFormData[
                                                    field.key
                                                ]?.errors || []
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
                                                createFormData[
                                                    field.key
                                                ]?.value ?? null
                                            }
                                            errors={
                                                createFormData[
                                                    field.key
                                                ]?.errors || []
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
                                                field.type ||
                                                "text"
                                            }
                                            placeholder={`Please enter ${field.label}`}
                                            value={
                                                createFormData[
                                                    field.key
                                                ]?.value ?? ""
                                            }
                                            errors={
                                                createFormData[
                                                    field.key
                                                ]?.errors || []
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
                                onClick={createEducationApi}
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
                                Save Education
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
                                        Education Details
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        Manage educational qualifications
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
                                            + Add Education
                                        </button>
                                    )}
                            </div>
                        )}

                    {educationList.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-5">
                            {educationList.map((education) => (
                                <button
                                    key={education.id}
                                    type="button"
                                    onClick={() =>
                                        setActiveEducationId(
                                            education.id
                                        )
                                    }
                                    className={`
                        px-4 py-2 rounded-lg
                        border transition-all
                        ${activeEducationId ===
                                            education.id
                                            ? "bg-yellow-500 text-black border-yellow-500"
                                            : "border-slate-300 dark:border-slate-600"
                                        }
                    `}
                                >
                                    {education.education_type}
                                </button>
                            ))}
                        </div>
                    )}

                    {educationList.length === 0 ? (
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
                                                value={formData[field.key]?.value ?? null}
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

                            {modulePermission.student_profile_management ===
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
                                Verify Education Details
                            </h3>

                            <p className="text-sm text-slate-500">
                                Please verify education
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
                                editEducationApi();
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

export default LeadEducation;