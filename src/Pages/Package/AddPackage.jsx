import { useEffect, useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import { useNavigate } from "react-router-dom";
import { InputWithIcon } from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../lib/redux/NotificationSlice";
import { addPackageListService, getPackageSectionService } from "./ApiService";
import PackageTable from "./PackageTable";
import { TextEditor } from "../../Components/CustomComponents/TextEditor";
import { message } from "antd";

export default function AddPackage() {
  const [selectInputs, setSelectInputs] = useState([]);
  const [description, setDescription] = useState();
  const [loading, setLoading] = useState(false); // Track API call state
  const [formData, setFormData] = useState({
    name: { value: "", errors: [] },
    code: { value: "", errors: [] },
    amount: { value: null, errors: [] },
    gst: { value: null, errors: [] },
    is_active: { value: true },
    permissions: {},
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: { value, errors: [] },
    });
  };

  // Handle dynamic permissions
  const handleSelectInput = (sectionCode, accessGranted) => {
    setFormData((prevFormData) => {
      const updatedSections = {
        ...prevFormData.permissions,
        [sectionCode]: {
          access_granted: accessGranted,
        },
      };
      return {
        ...prevFormData,
        permissions: updatedSections,
      };
    });
  };

  // Handle API error responses
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

  // Post data to API for creating package
  const branchPostApi = () => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true); // Disable the button

    const permissions = selectInputs.map((section) => ({
      code: section.code,
      name: section.name,
      access_granted:
        formData.permissions[section.code]?.access_granted || false,
    }));

    const payload = {
      name: formData.name.value,
      code: formData.code.value,
      amount: formData.amount.value,
      gst: formData.gst.value,
      is_active: formData.is_active.value,
      permissions: permissions,
      description: description,
    };

    addPackageListService(payload)
      .then(function (response) {
        if (response.data.success === "1") {
          navigate("/package");
          setFormData({
            name: { value: "", errors: [] },
            code: { value: "", errors: [] },
            amount: { value: null, errors: [] },
            gst: { value: null, errors: [] },
            is_active: { value: true },
            permissions: {},
          });
          message.success(response?.data?.message);
        }
      })
      .catch(function (error) {
        if (error) {
          handleError(error.response.data.data);
          message.error(error?.response?.data?.message);
        }
      })
      .finally(setLoading(false)); // Re-enable the button
  };

  // Fetch sections from the API
  useEffect(() => {
    getPackageSectionService()
      .then((response) => {
        const sections = response.data.data;
        setSelectInputs(sections);
        const initialSections = {};
        sections.forEach((section) => {
          initialSections[section.code] = {
            access_granted: false,
            errors: [],
          };
        });
        setFormData((prevFormData) => ({
          ...prevFormData,
          permissions: initialSections,
        }));
      })
      .catch((error) => {
        console.error("Error fetching sections:", error);
      });
  }, []);

  console.log(description, "description");
  return (
    <>
      <div className="dark:bg-[#1e293b] p-5 rounded-lg mx-6">
        <div className="flex justify-between w-full">
          <div className="w-fit mb-5">
            <h1 className="text-xl text-black dark:text-yellow-500 font-semibold">
              Create Package
            </h1>
          </div>
          <div>
            <button
              onClick={() => navigate("/package")}
              className="underline block text-blue-400 hover:text-blue-300"
            >
              Back
            </button>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            branchPostApi();
          }}
          className="w-3/3 space-y-6"
        >
          <FormItem>
            <div className="flex flex-col gap-1">
              <label className="text-black dark:text-white">
                Package Name<sup className="text-red-500">*</sup>
              </label>
              <InputWithIcon
                name="name"
                className=""
                value={formData.name.value}
                errors={formData.name.errors}
                type="text"
                placeholder="Please enter package name"
                handler={handleInput}
              />
            </div>
          </FormItem>

          <FormItem>
            <div className="flex flex-col gap-1">
              <label className="text-black dark:text-white">
                Package Code<sup className="text-red-500">*</sup>
              </label>
              <InputWithIcon
                name="code"
                className=""
                value={formData.code.value}
                errors={formData.code.errors}
                type="text"
                placeholder="Please enter package code"
                handler={handleInput}
              />
            </div>
          </FormItem>

          <FormItem>
            <div className="flex flex-col gap-1">
              <label className="text-black dark:text-white">
                Package Amount<sup className="text-red-500">*</sup>
              </label>
              <InputWithIcon
                name="amount"
                className=""
                value={formData.amount.value}
                errors={formData.amount.errors}
                type="number"
                placeholder="Please enter package amount"
                handler={handleInput}
              />
            </div>
          </FormItem>

          <FormItem>
            <div className="flex flex-col gap-1">
              <label className="text-black dark:text-white">
                GST<sup className="text-red-500">*</sup>
              </label>
              <InputWithIcon
                name="gst"
                className=""
                value={formData.gst.value}
                errors={formData.gst.errors}
                type="number"
                placeholder="Please enter gst percentage"
                handler={handleInput}
              />
            </div>
          </FormItem>

          <FormItem>
            <TextEditor setDescription={setDescription} />
          </FormItem>

          <PackageTable
            selectInputs={selectInputs}
            formData={formData}
            handleSelectInput={handleSelectInput}
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
