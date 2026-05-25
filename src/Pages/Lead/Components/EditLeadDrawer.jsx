import React, { useEffect, useRef, useState } from "react";
import { Drawer, Form, Input, Select, DatePicker, Button, message, Radio } from "antd";
import dayjs from "dayjs";

import { editLeadListService, getLeadDetailsService, getLeadSourceDropdownService } from "../ApiService";
import { getCityDropdownService } from "../../City/ApiService";
import { getBranchService } from "../../User/ApiService";
import { getStateDropdownService } from "../../State/ApiService";

const { Option } = Select;

export const EditLeadDrawer = ({
    open,
    onClose,
    leadId,
    refreshData,
}) => {
    const [form] = Form.useForm();

    const [cityOptions, setCityOptions] = useState([]);
    const [branchOptions, setBranchOptions] = useState([]);
    const [fieldOptions, setFieldOptions] = useState({});
    const [assignTo, setAssignTo] = useState(null);
    const [formData, setFormData] = useState(null);
    const [leadSource, setLeadSource] = useState(null);
    const hasFetched = useRef(false);
    const [leadSourceId, setLeadSourceId] = useState(null);
    const [leadSourceOptions, setLeadSourceOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);

    const mapLeadSource = (leadSourceName) => {
        const match = leadSourceOptions.find(
            (item) => item.name === leadSourceName
        );

        setLeadSourceId(match?.id);
    };

    const loadDropdowns = async () => {
        const [cityRes, branchRes, stateRes] = await Promise.all([
            getCityDropdownService(),
            getBranchService(),
            getStateDropdownService(),
        ]);

        setCityOptions(cityRes.data.data);
        setBranchOptions(branchRes.data.data);
        setStateOptions(stateRes.data.data);
    };
    const getLeadData = async () => {
        const res = await getLeadDetailsService(leadId);
        const data = res.data.data;

        setFormData(data);
        setLeadSource(data.lead_source?.toLowerCase().replace(/\s+/g, "_"));
        setAssignTo(data.assign_to);

        const values = {};
        const optionsMap = {};

        data.lead_fields.forEach((f) => {
            let val = f.value;

            // Normalize invalid or string-represented undefined/null values
            if (
                val === undefined ||
                val === null ||
                val === "" ||
                val === "undefined" ||
                val === "null" ||
                val === "Invalid Date"
            ) {
                val = undefined;
            }

            if (f.code === "preferred_intake_of_pursuing" && val) {
                const parsed = dayjs(val);
                values[f.code] = parsed.isValid() ? parsed : undefined;
            } else {
                values[f.code] = val;
            }

            if (f.options?.length) {
                optionsMap[f.code] = f.options;
            }
        });

        setFieldOptions(optionsMap);

        if (values.nearest_branch === "") {
            values.nearest_branch = undefined;
        }

        form.setFieldsValue(values);
    };

    useEffect(() => {
        if (!formData || leadSourceOptions.length === 0) return;

        const normalize = (str) =>
            str?.toLowerCase().replace(/\s+/g, "_");

        const match = leadSourceOptions.find(
            (item) =>
                normalize(item.name) === normalize(formData.lead_source)
        );

        if (match) {
            setLeadSourceId(match.id);
        }
    }, [leadSourceOptions, formData]);

    useEffect(() => {
        if (open && !hasFetched.current) {
            hasFetched.current = true;

            loadDropdowns();
            getLeadData();
        }
    }, [open]);

    useEffect(() => {
        if (!open) {
            hasFetched.current = false;
        }
    }, [open]);

    const generatePayload = (values) => {
        const dynamicFields = formData?.lead_fields?.map((field) => {
            let inputValue = values?.[field.code];
            let fallbackValue = field.value;

            const isInvalidInput =
                inputValue === undefined ||
                inputValue === null ||
                inputValue === "" ||
                inputValue === "undefined";

            const isInvalidFallback =
                fallbackValue === undefined ||
                fallbackValue === null ||
                fallbackValue === "" ||
                fallbackValue === "undefined";

            let fieldValue;

            if (!isInvalidInput) {
                fieldValue = inputValue;
            } else if (!isInvalidFallback) {
                fieldValue = fallbackValue;
            } else {
                return null;
            }

            if (field.code === "preferred_intake_of_pursuing") {
                if (fieldValue) {
                    const parsed = dayjs(fieldValue);
                    fieldValue = parsed.isValid() ? parsed.format("YYYY-MM-DD") : null;
                } else {
                    fieldValue = null;
                }
            }

            if (
                fieldValue === null ||
                fieldValue === undefined ||
                fieldValue === "" ||
                fieldValue === "undefined" ||
                fieldValue === "Invalid Date"
            ) {
                return null;
            }

            return {
                code: field.code,
                value: fieldValue,
            };
        }).filter(Boolean);

        const staticFields = [
            "full_name",
            "email",
            "city",
            "nearest_branch",
        ]
            .filter((key) => values[key] !== undefined)
            .map((key) => ({
                code: key,
                value: values[key],
            }));

        return {
            assign_to: assignTo?.username || assignTo,
            field_data: [...dynamicFields, ...staticFields],
        };
    };

    const handleSubmit = async (values) => {
        try {
            if (!leadSourceId) {
                message.error("Lead source not loaded yet");
                return;
            }

            const payload = generatePayload(values);

            await editLeadListService(leadSourceId, leadId, payload);

            message.success("Lead updated");
            onClose();
            refreshData();
        } catch (err) {
            console.error(err);
            message.error("Update failed");
        }
    };

    useEffect(() => {
        getLeadSourceDropdownService().then((res) => {
            setLeadSourceOptions(res.data.data);
        });
    }, []);

    return (
        <Drawer
            title={<strong style={{ fontSize: "20px", fontWeight: 600 }}>Edit Lead</strong>}
            placement="right"
            width={700}
            open={open}
            onClose={onClose}
            destroyOnClose
            footer={
                <Button
                    type="primary"
                    htmlType="submit"
                    form="editLeadForm"
                    className="text-black"
                    block
                    disabled={!formData || !leadSourceId}
                >
                    Update Lead
                </Button>
            }
        >
            <Form
                id="editLeadForm"
                layout="vertical"
                size="small"
                form={form}
                onFinish={handleSubmit}
                style={{ marginBottom: 0 }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 30,
                    }}
                >
                    <Form.Item name="full_name" label="Full Name" style={{ marginBottom: 5 }}>
                        <Input size="large" placeholder="Enter full name" />
                    </Form.Item>

                    <Form.Item name="email" label="Email" style={{ marginBottom: 5 }}>
                        <Input size="large" placeholder="Enter email address" />
                    </Form.Item>

                    <Form.Item name="state" label="State" style={{ marginBottom: 5 }}>
                        <Select
                            showSearch
                            size="large"
                            placeholder="Select state"
                            optionFilterProp="children"
                        >
                            {stateOptions.map((state) => (
                                <Option key={state.name} value={state.name}>
                                    {state.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="city" label="City" style={{ marginBottom: 5 }}>
                        <Select showSearch size="large" placeholder="Select city">
                            {cityOptions.map((c) => (
                                <Option key={c.name} value={c.name}>
                                    {c.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="nearest_branch"
                        label="Nearest Branch"
                        style={{ marginBottom: 5 }}
                    >
                        <Select
                            showSearch
                            size="large"
                            placeholder="Select nearest branch"
                            allowClear
                            optionFilterProp="children"
                        >
                            {branchOptions.map((b) => (
                                <Option key={b.name} value={b.name}>
                                    {b.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="level_of_education" label="Level" style={{ marginBottom: 5 }}>
                        <Select size="large" placeholder="Select education level">
                            {fieldOptions["level_of_education"]?.map((opt) => (
                                <Option key={opt} value={opt}>{opt}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="budget" label="Budget" style={{ marginBottom: 5 }}>
                        <Select size="large" placeholder="Select budget">
                            {fieldOptions["budget"]?.map((opt) => (
                                <Option key={opt} value={opt}>{opt}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="service_looking_for" label="Service" style={{ marginBottom: 5 }}>
                        <Select size="large" placeholder="Select service">
                            {fieldOptions["service_looking_for"]?.map((opt) => (
                                <Option key={opt} value={opt}>{opt}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="preferred_intake_of_pursuing" label="Intake" style={{ marginBottom: 5 }}>
                        <DatePicker style={{ width: "100%" }} size="large" placeholder="Select intake date" />
                    </Form.Item>

                    <Form.Item name="fund_mode" label="Fund Mode" style={{ marginBottom: 5 }}>
                        <Select size="large" placeholder="Select fund mode">
                            {fieldOptions["fund_mode"]?.map((opt) => (
                                <Option key={opt} value={opt}>{opt}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="learnt_IELTS" label="IELTS" style={{ marginBottom: 5 }}>
                        <Radio.Group>
                            {fieldOptions["learnt_IELTS"]?.map((opt) => (
                                <Radio key={opt} value={opt}>{opt}</Radio>
                            ))}
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        name="interested_course"
                        label="Interested Course"
                        style={{ marginBottom: 5 }}
                    >
                        {fieldOptions["interested_course"]?.length ? (
                            <Select
                                size="large"
                                placeholder="Select interested course"
                            >
                                {fieldOptions["interested_course"]?.map((opt) => (
                                    <Option key={opt} value={opt}>
                                        {opt}
                                    </Option>
                                ))}
                            </Select>
                        ) : (
                            <Input
                                size="large"
                                placeholder="Enter interested course"
                            />
                        )}
                    </Form.Item>

                    <Form.Item
                        name="other_english_proficiency_test"
                        label="Other English Proficiency Test"
                        style={{ marginBottom: 5 }}
                    >
                        {fieldOptions["other_english_proficiency_test"]?.length ? (
                            <Radio.Group>
                                {fieldOptions["other_english_proficiency_test"]?.map((opt) => (
                                    <Radio key={opt} value={opt}>
                                        {opt}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        ) : (
                            <Input
                                size="large"
                                placeholder="Enter other english proficiency test"
                            />
                        )}
                    </Form.Item>

                    <Form.Item
                        name="learnt_german_language"
                        label="Learnt German Language"
                        style={{ marginBottom: 5 }}
                    >
                        {fieldOptions["learnt_german_language"]?.length ? (
                            <Radio.Group>
                                {fieldOptions["learnt_german_language"]?.map(
                                    (opt) => (
                                        <Radio key={opt} value={opt}>
                                            {opt}
                                        </Radio>
                                    )
                                )}
                            </Radio.Group>
                        ) : (
                            <Input
                                size="large"
                                placeholder="Enter learnt german language"
                            />
                        )}
                    </Form.Item>
                </div>
            </Form>
        </Drawer>
    );
};