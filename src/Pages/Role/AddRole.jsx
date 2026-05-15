import { useEffect, useState } from "react";
import { FormItem } from "@/Components/Ui/Form"
import { NavLink, useNavigate } from "react-router-dom";
import { InputWithIcon } from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../lib/redux/NotificationSlice";
import RollTable from "./RollTable";
import { addRoleListService, getRoleModuleService } from "./ApiService";
import { message } from "antd";

export default function AddRole({ mode }) {
  const [loading, setLoading] = useState(false);
  const [selectInputs, setSelectInputs] = useState([]);
  const [formData, setFormData] = useState({
    name: { value: "", errors: [] },
    is_active: { value: true, errors: [] },
    permissions: {},
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle input changes for name and active status
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: {
        ...prevFormData[name],
        value,
      },
    }));
  };

  // Handle permission changes
  const handleSelectInput = (permissionCode, permissionValue) => {
    setFormData((prevFormData) => {
      const updatedPermissions = {
        ...prevFormData.permissions,
        [permissionCode]: {
          ...prevFormData.permissions[permissionCode],
          permission: permissionValue,
        },
      };

      return {
        ...prevFormData,
        permissions: updatedPermissions,
      };
    });
  };

  // Handle error responses from the API
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

  // Prepare data for API request
  const callLoginApiService = () => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true); // Disable the button

    const token = localStorage.getItem("token");
    // Transform permissions object to an array format
    const permissionsArray = Object.keys(formData.permissions).map(
      (permissionCode) => ({
        code: permissionCode,
        permission:
          formData.permissions[permissionCode].permission === undefined
            ? "no_access"
            : formData.permissions[permissionCode].permission,
      })
    );

    const payload = {
      name: formData.name.value,
      is_active: formData.is_active.value,
      permissions: permissionsArray,
    };

    addRoleListService(payload)
      .then((response) => {
        if (response.data.success === "1") {
          navigate("/roles");
          setFormData({
            name: { value: "", errors: [] },
            is_active: { value: true, errors: [] },
            permissions: {},
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
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getRoleModuleService().then((response) => {
      setSelectInputs(response.data.data);

      let initialPermissions = {};
      response.data.data.forEach((item) => {
        initialPermissions[item.code] = { value: "no_access" };
      });

      setFormData((prevFormData) => ({
        ...prevFormData,
        permissions: initialPermissions,
      }));
    });
  }, []);

  return (
    <>
      <div className="p-10 rounded-lg mx-6 dark:bg-gray-800 bg-white">
        <div className="flex justify-between w-full ">
          <div className="w-fit mb-5">
            <h1 className="text-xl font-semibold dark:text-yellow-500 text-black">
              Create Role
            </h1>
            <p className="text-sm font-thin dark:text-white text-black">
              Manage your permissions
            </p>
          </div>

          <NavLink to="/roles">
            <button className="underline block dark:text-gray-300 dark:hover:text-white text-gray-700 hover:text-black">
              Back
            </button>
          </NavLink>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            callLoginApiService();
          }}
          className="w-3/3 space-y-6"
        >
          <FormItem>
            <div className="flex flex-col gap-1">
              <label className="dark:text-white text-black">
                Role Name<sup className="text-red-500">*</sup>
              </label>
              <InputWithIcon
                name="name"
                type="text"
                placeholder="Please enter role name"
                required={true}
                errors={formData.name.errors}
                handler={(e) => handleInput(e)}
                mode={mode}
              />
            </div>
          </FormItem>

          {/* RollTable component to handle permissions */}
          <RollTable
            selectInputs={selectInputs}
            formData={formData}
            handleSelectInput={handleSelectInput}
            mode={mode}
          />

          <PrimaryButton
            type="primary"
            htmlType={"submit"}
            className="p-5 text-black"
            title={"Submit"}
            block={false}
            disabled={loading}
          />
        </form>
      </div>
    </>
  );
}
