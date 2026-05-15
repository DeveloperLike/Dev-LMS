import { useEffect, useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import {
  getMappedDocumentDetailService,
  putMappedDocumentService,
} from "./ApiService";
import { message } from "antd";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { CustomSelectInput, InputWithIcon } from "../../../Components/CustomComponents/InputWithIcon";
import { getDocumentDropdownService } from "../Document/ApiService";

const EditDocuments = ({
  categoryId,
  documentId,
  getMappedDocumentsApi,
  setEditOpen,
}) => {
  const [loading, setLoading] = useState(false); // Track API call state
  const [documentDropdown, setDocumentDropdown] = useState([]);
  const [formData, setFormData] = useState({
    document: { value: null, errors: [] },
    position: { value: null, errors: [] },
    is_required: { value: null, errors: [] },
  });

  // Handle input change for all form fields
  const handleInputChange = (field) => (e) => {
    const value = e.target ? e.target.value : e;
    setFormData((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        value,
      },
      errors: [],
    }));
  };

  const handleError = (errors) => {
    setFormData((prevData) => {
      const updatedFormData = {};
      Object.keys(prevData).forEach((field) => {
        updatedFormData[field] = {
          ...prevData[field],
          errors: errors[field] || [], // Use new errors or empty array if not present
        };
      });
      return updatedFormData;
    });
  };
  const payload = {
    document: formData.document.value,
    position: formData.position.value,
    is_required: formData.is_required.value,
  };

  const editMappedDocumentApi = () => {
    setLoading(true); // Disable the button
    if (loading) return; // Prevent multiple submissions

    putMappedDocumentService(categoryId, documentId, payload)
      .then((response) => {
        if (response.data.success === "1") {
          setEditOpen(false);
          getMappedDocumentsApi();
          message.success(response?.data?.message);
        }
      })
      .catch(function (error) {
        if (error) {
          handleError(error.response.data.data);
          message.error(error?.response?.data?.message);
        }
      })
      .finally(() => setLoading(false)); // Re-enable the button
  };

  // Fetch branch data on component mount
  useEffect(() => {
    getMappedDocumentDetailService(categoryId, documentId).then(
      function (response) {
        const jsonResponse = response.data.data;
        setFormData({
          document: {
            value: jsonResponse.document,
            errors: [],
          },
          position: {
            value: jsonResponse.position,
            errors: [],
          },
          is_required: {
            value: jsonResponse.is_required,
            errors: [],
          },
        });
      }
    );
    getDocumentDropdownService().then((response) => {
      setDocumentDropdown(response.data.data);
    });
  }, [documentId]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          editMappedDocumentApi();
        }}
        className="w-3/3 space-y-4"
      >
        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Document<sup className="text-red-500">*</sup>
            </label>
            <CustomSelectInput
              name="document"
              placeholder="Please select document"
              value={formData?.document?.value}
              errors={formData?.document?.errors}
              handler={handleInputChange("document")}
              options={documentDropdown.map((item) => ({
                value: item.id,
                label: item.title,
              }))}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              position<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="position"
              type={"number"}
              placeholder="Please enter position"
              value={formData?.position?.value}
              errors={formData?.position?.errors}
              handler={handleInputChange("position")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Required<sup className="text-red-500">*</sup>
            </label>
            <CustomSelectInput
              name="is_required"
              type="text"
              placeholder="Is it required?"
              value={formData.is_required.value}
              errors={formData.is_required.errors}
              handler={handleInputChange("is_required")}
              options={[
                {
                  value: true,
                  label: "Yes",
                },
                {
                  value: false,
                  label: "No",
                },
              ]}
            />
          </div>
        </FormItem>

        <PrimaryButton
          type="primary"
          htmlType="submit"
          className="p-4"
          title="Submit"
          block={false}
          disabled={loading}
        />
      </form>
    </>
  );
};

export default EditDocuments;
