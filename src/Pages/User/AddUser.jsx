import React, { useEffect, useState, useMemo } from "react";
import { message, Select } from "antd";
import { useNavigate } from "react-router-dom";
import {
  InputPassword,
  InputWithIcon,
} from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { CustomSelectInput } from "../../Components/CustomComponents/InputWithIcon";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../lib/redux/NotificationSlice";
import {
  addUserService,
  getBranchService,
  getCountryCodeService,
  getReportingManagersService,
  getRolesService,
  getStrongPasswordervice,
} from "./ApiService";
import { getDIDNumbersService } from "./DIDNumbersApiService";

const AddUser = ({ mode }) => {
  const [reportingManagers, setReportingManagers] = useState([]);
  const [countryCodes, setCountryCodes] = useState([]);
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeDIDs, setActiveDIDs] = useState([]);

  const [formData, setFormData] = useState({
    full_name: { value: "", errors: [] },
    email: { value: "", errors: [] },
    phone: { value: "+91", errors: [] },
    // country_code: { value: "+91", errors: [] },
    did_number: { value: "", errors: [] },
    password: { value: "", errors: [] },
    is_active: { value: true, errors: [] },
    branch: { value: [], errors: [] },
    role: { value: null, errors: [] },
    user_group: { value: null, errors: [] },
    reporting_manager: { value: [], errors: [] },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: { value: e.target.value, errors: [] },
    });
  };

  const handleSelectInput = (value, name) => {
    setFormData({
      ...formData,
      [name]: { value: value, errors: [] },
    });
  };

  const handleError = (response) => {
    const errorFields = Object.keys(response);
    const updatedErrors = {};
    errorFields.forEach((item) => {
      updatedErrors[item] = {
        ...formData[item],
        errors: response[item],
      };
    });
    setFormData({
      ...formData,
      ...updatedErrors,
    });
  };

  // Prepare the payload
  const payload = {
    full_name: formData.full_name.value,
    is_active: formData.is_active.value === true ? true : false,
    phone: formData.phone.value,
    // country_code: formData.country_code.value,
    email: formData.email.value,
    did_number: formData.did_number.value,
    branch: formData.branch.value,
    role: formData.role.value,
    user_group: formData.user_group.value,
    password: formData.password.value,
    reporting_manager: formData.reporting_manager.value,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions
    setLoading(true); // Disable the button

    addUserService(payload)
      .then((response) => {
        if (response.data.success === "1") {
          navigate("/users");
          setFormData({
            full_name: { value: "", errors: [] },
            email: { value: "", errors: [] },
            phone: { value: "+91", errors: [] },
            // country_code: { value: "+91", errors: [] },
            did_number: { value: "", errors: [] },
            password: { value: "", errors: [] },
            is_active: { value: true, errors: [] },
            branch: { value: [], errors: [] },
            role: { value: null, errors: [] },
            user_group: { value: null, errors: [] },
            reporting_manager: { value: [], errors: [] },
          });
          message.success(response?.data?.message);
        }
      })
      .catch((error) => {
        if (error) {
          handleError(error.response.data.data);
          message.error(error?.response?.data?.message);
        }
      })
      .finally(() => setLoading(false)); // Re-enable the button
  };

  const handlePassword = async () => {
    getStrongPasswordervice().then((response) => {
      // console.log(response.data.data, "password");
      setFormData({
        ...formData,
        password: { value: response.data.data },
      });
    });
  };

  // Fetch reporting managers
  const fetchReportingManagers = () => {
    getReportingManagersService().then((response) => {
      if (response.data && response.data.success === "1") {
        setReportingManagers(response.data.data);
      }
    });
  };

  // Fetch country codes
  const fetchCountryCode = () => {
    getCountryCodeService().then((response) => {
      if (response.data && response.data.success === "1") {
        setCountryCodes(response.data.data);
      }
    });
  };

  // Fetch branches
  const fetchBranches = async () => {
    getBranchService().then((response) => {
      if (response.data && response.data.success === "1") {
        setBranches(response.data.data);
      }
    });
  };

  // Fetch Roles
  const fetchRoles = async () => {
    getRolesService().then((response) => {
      if (response.data && response.data.success === "1") {
        setRoles(response.data.data);
      }
    });
  };

  // Fetch Active DID numbers
  const fetchActiveDIDs = async () => {
    try {
      const response = await getDIDNumbersService({ is_active: true, count_per_page: 200 });
      if (response.data && response.data.success === "1") {
        setActiveDIDs(response.data.data || []);
      }
    } catch (error) {
      console.error("Error loading active DID numbers:", error);
    }
  };

  // Options configuration list for DID number select dropdown
  const didOptions = useMemo(() => {
    const list = [
      { value: "", label: "No DID Number (None)" }
    ];
    activeDIDs.forEach((d) => {
      list.push({
        value: d.did_number,
        label: `${d.did_number} (${d.provider}${d.truecaller_name ? ` - ${d.truecaller_name}` : ""})`
      });
    });
    return list;
  }, [activeDIDs]);

  useEffect(() => {
    fetchReportingManagers();
    fetchCountryCode();
    fetchBranches();
    fetchRoles();
    handlePassword();
    fetchActiveDIDs();
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  console.log({roles});

  return (
    <div className="p-6 mx-6 space-y-6 bg-gray-50 dark:bg-[#0F172A] transition-colors duration-300 rounded-xl">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-yellow-500">Create Staff</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Add a new staff to your organization</p>
        </div>
        <button onClick={() => navigate("/users")} className="text-sm text-black dark:text-white">Back</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="space-y-6">

          {/* USER CARD */}
          <div className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] shadow-sm p-6 rounded-xl flex flex-col items-center pt-10">
            <div className="w-20 h-20 rounded-full bg-yellow-500 flex items-center justify-center text-black text-xl font-bold">
              {getInitials(formData.full_name.value)}
            </div>
            <h2 className="mt-4 font-semibold text-gray-900 dark:text-white">New User</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Not created yet</p>
          </div>

          {/* PERSONAL INFORMATION */}
          <div className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] shadow-sm p-6 rounded-xl">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
            <div className="space-y-4">

              <InputWithIcon name="email" type="email" placeholder="Email" value={formData.email.value} errors={formData.email.errors} handler={handleInput} mode={mode} className="w-full bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] text-gray-900 dark:text-white rounded-lg" />

              <InputWithIcon name="phone" type="text" placeholder="Phone Number" value={formData.phone.value} errors={formData.phone.errors} handler={handleInput} mode={mode} className="w-full bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] text-gray-900 dark:text-white rounded-lg" />

              <InputWithIcon name="full_name" type="text" placeholder="Full Name" value={formData.full_name.value} errors={formData.full_name.errors} handler={handleInput} mode={mode} className="w-full bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] text-gray-900 dark:text-white rounded-lg" />

              <CustomSelectInput
                name="did_number"
                placeholder="Select DID Number"
                value={formData.did_number.value}
                errors={formData.did_number.errors}
                handler={(value) => handleSelectInput(value, "did_number")}
                options={didOptions}
                className="w-full bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] text-gray-900 dark:text-white rounded-lg"
              />

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-6">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ACCOUNT SECURITY */}
            <div className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] shadow-sm p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Account Security</h3>
              <div className="flex items-stretch gap-3">

                <div className="flex-1">
                  <InputPassword
                    name="password"
                    maxLength={12}
                    showCount={true}
                    value={formData.password.value}
                    errors={formData.password.errors}
                    placeholder="Password"
                    handler={handleInput}
                    mode={mode}
                    className="w-full h-[40px] bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] text-gray-900 dark:text-white rounded-lg"
                  />
                </div>

                <PrimaryButton
                  type="primary"
                  className="h-[40px] px-5 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg transition whitespace-nowrap flex items-center justify-center"
                  title="Generate"
                  onClick={handlePassword}
                />

              </div>
            </div>

            {/* PERMISSIONS */}
            <div className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] shadow-sm p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Permissions & Role</h3>
              <div className="grid md:grid-cols-2 gap-5">

                <CustomSelectInput name="user_group" placeholder="User Group" value={formData.user_group.value} errors={formData.user_group.errors} handler={(value) => handleSelectInput(value, "user_group")} options={[{ value: "admin", label: "Admin" }, { value: "manager", label: "Manager" }, { value: "staff", label: "Staff" }]} className="w-full bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] text-gray-900 dark:text-white rounded-lg" />

                <CustomSelectInput name="role" placeholder="Role" value={formData.role.value} errors={formData.role.errors} handler={(value) => handleSelectInput(value, "role")} options={roles.map((r) => ({ value: r.id, label: r.name }))} className="w-full bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] text-gray-900 dark:text-white rounded-lg" />

              </div>
            </div>

            {/* ORGANIZATION */}
            {formData.user_group.value !== "admin" && (
              <div className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] shadow-sm p-6 rounded-xl space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Organization</h3>

                <CustomSelectInput mode="multiple" name="branch" placeholder="Select Branch" value={formData.branch.value} errors={formData.branch.errors} handler={(value) => handleSelectInput(value, "branch")} options={branches.map((b) => ({ value: b.id, label: b.name }))} className="w-full bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] text-gray-900 dark:text-white rounded-lg" />

                <CustomSelectInput mode="multiple" name="reporting_manager" placeholder="Reporting Manager" value={formData.reporting_manager.value} errors={formData.reporting_manager.errors} handler={(value) => handleSelectInput(value, "reporting_manager")} options={reportingManagers.map((m) => ({ value: m.username, label: m.email }))} className="w-full bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] text-gray-900 dark:text-white rounded-lg" />

              </div>
            )}

            {/* ACTION BAR */}
            <div className="sticky bottom-0 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md border-t border-gray-200 dark:border-[#334155] p-4 rounded-xl flex justify-end gap-3">
              <button type="button" onClick={() => navigate("/users")} className="px-4 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition">Cancel</button>
              <PrimaryButton type="primary" htmlType="submit" className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg shadow-sm transition" title={loading ? "Adding..." : "Add Staff"} disabled={loading} />
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
