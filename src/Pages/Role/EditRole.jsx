import { useEffect, useState } from "react";
import { FormItem } from "@/Components/Ui/Form"
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { InputWithIcon } from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../lib/redux/NotificationSlice";
import RollTable from "./RollTable";
import {
  editRoleListService,
  getRoleListDetailService,
  getRoleModuleService,
} from "./ApiService";
import { message } from "antd";

export default function EditRole({ mode }) {
  const [loading, setLoading] = useState(false); // Track API call state
  const [selectInputs, setSelectInputs] = useState([]);
  const [formData, setFormData] = useState({
    name: { value: "", errors: [] },
    is_active: { value: true, errors: [] },
    permissions: {},
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  // Handle input changes for name and is_active
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

  // Handle error messages for each form field
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

  // Edit role API service
  const editRoleApiService = () => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true); // Disable the button

    const payload = {
      name: formData.name.value,
      is_active: formData.is_active.value,
      permissions: Object.keys(formData.permissions).map((permissionCode) => {
        return formData.permissions[permissionCode];
      }),
    };

    editRoleListService(id, payload)
      .then((response) => {
        if (response.data.success === "1") {
          navigate("/roles");
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

  // Fetch select modules
  useEffect(() => {
    getRoleModuleService().then((response) => {
      setSelectInputs(response.data.data);
    });
  }, []);

  // Fetch role details
  useEffect(() => {
    if (id) {
      getRoleListDetailService(id).then((response) => {
        const jsonResponse = response.data.data;
        const permissions = {};
        jsonResponse.permissions.forEach((section) => {
          permissions[section.code] = {
            code: section.code,
            permission: section.permission,
          };
        });

        setFormData({
          name: { value: jsonResponse.name, errors: [] },
          is_active: { value: jsonResponse.is_active },
          permissions: permissions,
        });
      });
    }
  }, [id]);

  return (
    <>
      <div className="p-10 rounded-lg mx-6 dark:bg-gray-800 bg-white">
        <div className="flex justify-between w-full">
          <div className="w-fit mb-5">
            <h1 className="text-xl font-semibold dark:text-yellow-500 text-black">
              Edit Role
            </h1>
            <p className="text-sm font-thin dark:text-white text-black">
              Update your roles
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
            editRoleApiService();
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
                value={formData.name.value}
                errors={formData.name.errors}
                type="text"
                placeholder="Please enter role name"
                handler={handleInput}
                mode={mode}
              />
            </div>
          </FormItem>

          <RollTable
            selectInputs={selectInputs}
            formData={formData}
            handleSelectInput={handleSelectInput}
            mode={mode}
          />

          <PrimaryButton
            type="primary"
            htmlType="submit"
            className="p-5 text-black"
            title={"Submit"}
            block={false}
            disabled={loading} // Disable button if loading
          />
        </form>
      </div>
    </>
  );
}
