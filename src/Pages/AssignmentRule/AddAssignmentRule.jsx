import React, { useEffect, useState } from "react";
import { Form, Input, Select, Switch, Row, Col, message } from "antd";
import { v4 as uuidv4 } from "uuid";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { getCRMTarDropdownData, saveAssignmentRuleService } from "./ApiService";
import { getCityDropdownService } from "../City/ApiService";
import { getStateDropdownService } from "../State/ApiService";

const { Option } = Select;


const USER_GROUP_LIST = [
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "Staff", value: "staff" },
  { label: "Franchise", value: "franchise" },
];

export default function AddAssignmentRule({ initialData, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Dropdown options
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [dropdownData, setDropdownData] = useState({
    allUser: [],
    allBranches: [],
    roles: [],
    leadSources: []
  });

  // Watch for dependent field filtering
  const selectedBranches = Form.useWatch("assignToBranch", form);
  const selectedGroups = Form.useWatch("userGroup", form);
  const selectedRoles = Form.useWatch("role", form);
  const selectedCounsellors = Form.useWatch("counsellor", form);

  // Derived filtered options — matches legacy YG-PORTAL cascading filter logic
  // Branch + UserGroup + Role filter → Counsellors shown

  const filteredCounsellors = dropdownData.allUser.filter(user => {
    // Always include currently selected counsellors so labels are visible
    if (selectedCounsellors?.includes(user.value)) return true;

    const branchMatch = !selectedBranches || selectedBranches.length === 0 || user.branch_ids.some(bid => selectedBranches.includes(bid));
    const groupMatch = !selectedGroups || selectedGroups.length === 0 || selectedGroups.includes(user.user_group);
    const roleMatch = !selectedRoles || selectedRoles.length === 0 || selectedRoles.includes(user.role_id);
    return branchMatch && groupMatch && roleMatch;
  });

  useEffect(() => {
    // Fetch Cities
    getCityDropdownService().then(res => {
      setCities(res.data.data.map(c => ({ label: c.name, value: c.id })));
    }).catch(() => { });

    // Fetch States
    getStateDropdownService().then(res => {
      setStates(res.data.data.map(s => ({ label: s.name, value: s.id })));
    }).catch(() => { });

    // Fetch CRMTar specific data (Users, Branches, Roles, Lead Sources)
    getCRMTarDropdownData().then(res => {
      const data = res.data.data;
      setDropdownData({
        allUser: data.allUser.map(u => ({
          label: `${u.full_name} - ${u.branch || 'No Branch'}`,
          value: u.id,
          role_id: u.role_id,
          branch_ids: Array.isArray(u.branch_ids) ? u.branch_ids : [],
          user_group: u.user_group
        })),
        allBranches: data.allBranches.map(b => ({ label: b.branch, value: b.branch_id })),
        roles: data.roles.map(r => ({ label: r.role, value: r.role_id })),
        leadSources: (data.leadSources || []).map(s => ({ label: s.name, value: s.name }))
      });
    }).catch(() => { });
  }, []);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        uid: initialData.uid,
        name: initialData.name,
        status: initialData.status,
        source: initialData.source?.map(s => s.value || s) || [],
        city: initialData.city?.map(c => c.value || c) || [],
        state: initialData.state?.map(s => s.value || s) || [],
        branch: initialData.branch?.map(b => b.value || b) || [],
        levelOfEducation: initialData.levelOfEducation || '',
        UTMCampaign: initialData.UTMCampaign || '',
        UTMSource: initialData.UTMSource || '',
        UTMMedium: initialData.UTMMedium || '',
        campaign: initialData.campaign || '',
        formName: initialData.formName || '',
        trackingURL: initialData.trackingURL || '',
        role: initialData.role?.map(r => r.value || r) || [],
        userGroup: initialData.userGroup?.map(g => g.value || g) || [],
        assignToBranch: initialData.assignToBranch?.map(b => b.value || b) || [],
        counsellor: initialData.counsellor?.map(c => c.value || c) || [],
      });
    } else {
      form.resetFields();
      form.setFieldValue('uid', uuidv4());
      form.setFieldValue('status', true);
    }
  }, [initialData, form]);

  const onFinish = (values) => {
    setLoading(true);

    // Format selected array values to object [{label, value}] for JSONB fields
    const formatSelection = (selectedValues, optionsList) => {
      if (!selectedValues) return [];
      return selectedValues.map(val => {
        const opt = optionsList.find(o => o.value === val || o.label === val);
        return { label: opt ? opt.label : val, value: val };
      });
    };

    const payload = {
      ...values,
      source: values.source?.map(s => ({ label: s, value: s })) || [],
      city: formatSelection(values.city, cities),
      state: formatSelection(values.state, states),
      branch: formatSelection(values.branch, dropdownData.allBranches),
      role: formatSelection(values.role, dropdownData.roles),
      userGroup: formatSelection(values.userGroup, USER_GROUP_LIST),
      assignToBranch: formatSelection(values.assignToBranch, dropdownData.allBranches),
      counsellor: formatSelection(values.counsellor, dropdownData.allUser),
      updatedBy: { email: "Current User" }, // Ideally replace with real user session if available in Redux
    };

    saveAssignmentRuleService(payload)
      .then(res => {
        message.success(initialData ? "Rule updated" : "Rule created");
        onSuccess();
        onClose();
      })
      .catch(err => {
        message.error(err.response?.data?.message || "Operation failed");
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <style>{`
        .ant-drawer-body {
          padding-top: 0px !important;
          padding-bottom: 0px !important;
        }
      `}</style>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="uid" hidden><Input /></Form.Item>

      <Row gutter={24}>
        {/* Left Column - Rule Filters */}
        <Col xs={24} md={12}>
          <div className="p-4 rounded mb-4">
            <h3 className="font-semibold text-lg mb-3">Filter Criteria</h3>

            <Form.Item name="name" rules={[{ required: true }]}>
              <Input placeholder="Rule Name *" />
            </Form.Item>

            {/* <Form.Item name="status" valuePropName="checked">
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item> */}

            <Form.Item name="source">
              <Select
                mode="multiple"
                showSearch
                filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                placeholder="Source"
                options={dropdownData.leadSources}
              />
            </Form.Item>

            <Form.Item name="city">
              <Select mode="multiple" showSearch filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())} placeholder="City" options={cities} />
            </Form.Item>

            <Form.Item name="state">
              <Select mode="multiple" showSearch filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())} placeholder="State" options={states} />
            </Form.Item>

            <Form.Item name="branch">
              <Select mode="multiple" showSearch filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())} placeholder="Branch Filter" options={dropdownData.allBranches} />
            </Form.Item>

            <Form.Item name="levelOfEducation">
              <Select allowClear placeholder="Level of Education">
                <Option value="">Level of Education</Option>
                <Option value="master">Master</Option>
                <Option value="bachelor">Bachelor</Option>
              </Select>
            </Form.Item>

            <Form.Item name="UTMCampaign">
              <Input placeholder="UTM Campaign" />
            </Form.Item>
            <Form.Item name="UTMSource">
              <Input placeholder="UTM Source" />
            </Form.Item>
            <Form.Item name="UTMMedium">
              <Input placeholder="UTM Medium" />
            </Form.Item>

            <Form.Item name="campaign">
              <Input placeholder="Campaign" />
            </Form.Item>

            <Form.Item name="formName">
              <Input placeholder="Form Name" />
            </Form.Item>

            <Form.Item name="trackingURL">
              <Input placeholder="Tracking URL" />
            </Form.Item>
          </div>
        </Col>

        {/* Right Column - Assignment Targets */}
        <Col xs={24} md={12}>
          <div className="p-4 rounded">
            <h3 className="font-semibold text-lg mb-3">Assign To</h3>

            <Form.Item name="assignToBranch">
              <Select
                mode="multiple"
                showSearch
                filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                placeholder="Target Branches"
                options={dropdownData.allBranches}
              />
            </Form.Item>

            <Form.Item name="userGroup">
              <Select
                mode="multiple"
                placeholder="User Group (Staff / Manager)"
                options={USER_GROUP_LIST}
              />
            </Form.Item>

            <Form.Item name="role">
              <Select
                mode="multiple"
                showSearch
                filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                placeholder="Target Roles"
                options={dropdownData.roles}
              />
            </Form.Item>

            <Form.Item name="counsellor" extra="Leave empty to auto-assign to all matching staff (round-robin)">
              <Select
                mode="multiple"
                showSearch
                filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                placeholder="Select specific users"
                options={filteredCounsellors}
              />
            </Form.Item>
          </div>
        </Col>
      </Row>

      <div className="flex justify-end mt-4 pb-4">
        <PrimaryButton type="primary" htmlType="submit" title={initialData ? "Update Rule" : "Create Rule"} disabled={loading} block={false} />
      </div>
    </Form>
    </>
  );
}
