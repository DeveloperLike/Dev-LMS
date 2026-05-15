import { useEffect, useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import { useNavigate, useParams } from "react-router-dom";
import { InputWithIcon } from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../lib/redux/NotificationSlice";
import {
  editPackageListService,
  getPackageDetailslistservice,
  getPackageSectionService,
} from "./ApiService";
import PackageTable from "./PackageTable";
import { TextEditor } from "../../Components/CustomComponents/TextEditor";
import { message } from "antd";

const EditPackage = () => {
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
    description: null,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  // Handle input changes and update state
  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: {
        value: e.target.value,
        errors: [],
      },
    });
  };

  // Handle Sections
  const handleSelectInput = (sectionName, sectionsValue) => {
    setFormData((prevFormData) => {
      const updatedSection = {
        ...prevFormData.permissions,
        [sectionName]: {
          access_granted: sectionsValue,
          errors: [],
        },
      };

      return {
        ...prevFormData,
        permissions: updatedSection,
      };
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

  // API call to update package
  const branchEditApi = () => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true); // Disable the button

    const payload = {
      name: formData.name.value,
      code: formData.code.value,
      amount: formData.amount.value,
      gst: formData.gst.value,
      is_active: formData.is_active.value,
      permissions: Object.keys(formData.permissions).map((sectionCode) => ({
        code: sectionCode,
        access_granted:
          formData.permissions[sectionCode]?.access_granted || false,
      })),
      description: description,
    };

    // Send form data to update package
    editPackageListService(id, payload)
      .then((response) => {
        if (response.data.success === "1") {
          navigate("/package");
          message.success(response?.data?.message);

        }
      })
      .catch((error) => {
        if (error) {
          handleError(error.response.data.data);
          message.error(error?.response?.data?.message);
        }
      })
      .finally(setLoading(false)); // Re-enable the button
  };

  // Fetch package data
  useEffect(() => {
    getPackageDetailslistservice(id)
      .then((response) => {
        const jsonResponse = response.data.data;
        console.log(jsonResponse, "jsonResponse");
        const permissions = {};
        jsonResponse.permissions.forEach((section) => {
          permissions[section.code] = {
            access_granted: section.access_granted,
            errors: [],
          };
        });

        setFormData({
          name: { value: jsonResponse.name, errors: [] },
          code: { value: jsonResponse.code, errors: [] },
          amount: { value: jsonResponse.amount },
          gst: { value: jsonResponse.gst },
          is_active: { value: jsonResponse.is_active },
          permissions: permissions,
          description: jsonResponse.description,
        });
        setDescription(jsonResponse.description);
      })
      .catch((error) => {
        console.error("Error fetching package details:", error);
      });

    // Fetch available permissions for the package
    getPackageSectionService()
      .then((response) => {
        setSelectInputs(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching package permissions:", error);
      });
  }, [id]);

  console.log(formData, "formData 232");

  return (
    <>
      <div className="p-5 rounded-lg mx-6 dark:bg-[#1e293b]">
        <div className="flex justify-between w-full">
          <div className="w-fit mb-5">
            <h1 className="text-xl text-black dark:text-yellow-500 font-semibold">Edit Package</h1>
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
            branchEditApi();
          }}
          className="w-3/3 space-y-4"
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
                handler={(e) => {
                  handleInput(e);
                }}
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
                handler={(e) => {
                  handleInput(e);
                }}
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
                handler={(e) => {
                  handleInput(e);
                }}
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
            <TextEditor
              description={description}
              setDescription={setDescription}
            />
          </FormItem>

          <PackageTable
            selectInputs={selectInputs}
            formData={formData}
            handleSelectInput={handleSelectInput}
          />

          <PrimaryButton
            type="primary"
            htmlType="submit"
            className="p-5 text-black"
            title="Submit"
            block={false}
            disabled={loading}
          />
        </form>
      </div>
    </>
  );
};

export default EditPackage;
