import { useEffect, useState } from "react";
import { message, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  CustomSelectInput,
  InputPassword,
  InputWithIcon,
} from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../lib/redux/NotificationSlice";
import {
  editUserService,
  getBranchService,
  getCountryCodeService,
  geteditUserService,
  getReportingManagersService,
  getRolesService,
  getStrongPasswordervice,
} from "./ApiService";

export default function EditUser({ mode }) {
  const [reportingManagers, setReportingManagers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [countryCodes, setCountryCodes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false); // Track API call state

  const [formData, setFormData] = useState({
    full_name: { value: "", errors: [] },
    email: { value: "", errors: [] },
    phone: { value: "", errors: [] },
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
  const { id } = useParams();

  // Handle input changes
  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: { value: e.target.value },
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

  const payload = {
    full_name: formData.full_name.value,
    is_active: formData.is_active.value === true ? true : false,
    phone: formData.phone.value,
    email: formData.email.value,
    did_number: formData.did_number.value,
    branch: formData.branch.value,
    role: formData.role.value,
    user_group: formData.user_group.value,
    reporting_manager: formData.reporting_manager.value,
    ...(formData.password.value?.trim() && {
      password: formData.password.value.trim(),
    }),
  };

  const handleSubmit = () => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true); // Disable the button

    editUserService(payload, id)
      .then((response) => {
        navigate("/users");
        message.success(response?.data?.message);
      })
      .catch((error) => {
        if (error.response) {
          handleError(error.response.data.data);
          message.error(error?.response?.data?.message);
        }
      })
      .finally(() => setLoading(false)); // Re-enable the button
  };

  const handlePassword = () => {
    getStrongPasswordervice().then((response) => {
      setFormData({
        ...formData,
        password: { value: response.data.data },
      });
    });
  };

  const fetcheditUserService = (id) => {
    geteditUserService(id).then((response) => {
      const userData = response.data.data;
      setFormData({
        username: { value: userData.username || "" },
        email: { value: userData.email || "" },
        full_name: { value: userData.full_name || "" },
        branch: {
          value:
            userData.branch.length > 0
              ? userData.branch.map((element) => element.id)
              : [],
        },
        role: { value: userData.role ? userData.role.id : null },
        reporting_manager: {
          value:
            userData.reporting_manager.length > 0
              ? userData.reporting_manager.map((element) => element.username)
              : [],
        },
        phone: { value: userData.phone || "" },
        // country_code: { value: userData.country_code || "" },
        user_group: { value: userData.user_group || "" },
        is_active: { value: userData.is_active },
        password: { value: userData.password || "" },
        did_number: { value: userData.did_number || "" },
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

  // Fetch dropdown list
  useEffect(() => {
    fetcheditUserService(id);
    fetchReportingManagers();
    fetchCountryCode();
    fetchBranches();
    fetchRoles();
  }, [id]);

  return (
    <div className="p-6 mx-6 space-y-6 bg-gray-50 dark:bg-[#0F172A] transition-colors duration-300 rounded-xl">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-yellow-500">Edit Staff</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Update user details & permissions</p>
        </div>
        <button onClick={() => navigate("/users")} className="text-sm text-black dark:text-white">Back</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="space-y-6">

          {/* USER CARD */}
          <div className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] shadow-sm p-6 rounded-xl flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-yellow-500 flex items-center justify-center text-black text-xl font-bold">
              {formData.full_name.value?.charAt(0) || "U"}
            </div>
            <h2 className="mt-4 font-semibold text-gray-900 dark:text-white">{formData.full_name.value || "User Name"}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formData.email.value}</p>
            <div className="mt-4">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${formData.is_active.value
                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                }`}>
                <span className={`w-2 h-2 rounded-full ${formData.is_active.value ? "bg-green-500" : "bg-red-500"
                  }`}></span>
                {formData.is_active.value ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* PERSONAL INFORMATION */}
          <div className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] shadow-sm p-6 rounded-xl">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
            <div className="space-y-4">
              <InputWithIcon name="email" type="email" placeholder="Email" value={formData.email.value} errors={formData.email.errors} handler={handleInput} mode={mode} className="w-full bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] text-gray-900 dark:text-white rounded-lg" />
              <InputWithIcon name="phone" type="text" placeholder="Phone Number" value={formData.phone.value} errors={formData.phone.errors} handler={handleInput} mode={mode} className="w-full bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] text-gray-900 dark:text-white rounded-lg" />
              <InputWithIcon name="full_name" type="text" placeholder="Full Name" value={formData.full_name.value} errors={formData.full_name.errors} handler={handleInput} mode={mode} className="w-full bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] text-gray-900 dark:text-white rounded-lg" />
              <InputWithIcon name="did_number" type="text" placeholder="DID Number" value={formData.did_number.value} errors={formData.did_number.errors} handler={handleInput} mode={mode} className="w-full bg-white dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] text-gray-900 dark:text-white rounded-lg" />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-6">

          <form noValidate onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }} className="space-y-6">

            {/* ACCOUNT SECURITY */}
            <div className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] shadow-sm p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Account Security</h3>
              <div className="flex items-stretch gap-3">

                <div className="flex-1">
                  <InputPassword
                    name="password"
                    maxLength={12}
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
              <PrimaryButton type="primary" htmlType="submit" className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg shadow-sm transition" title={loading ? "Updating..." : "Update Staff"} disabled={loading} />
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
