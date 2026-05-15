import { useEffect, useState, useRef } from "react";
import { FormItem } from "@/Components/Ui/Form";
import { CustomModeSelectInput } from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { message } from "antd";
import { getAdminDropdown } from "./ApiService";
import { useParams } from "react-router-dom";
import { addCommentListService } from "./ApiService";
import TextArea from "antd/es/input/TextArea";

const AddComment = ({ GetTicketCommentApi, GetTicketDetailsApi }) => {
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState([]);
  const [formData, setFormData] = useState({
    comment: { value: "", errors: [] },
    attachment: { value: null, errors: [] },
    tag_user: { value: [], errors: [] },
  });
  const { id } = useParams();

  // Ref for file input
  const fileInputRef = useRef(null);

  // Handle input changes
  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: { value: e.target.value, errors: [] },
    });
  };

  // Handle select value update
  const handleSelect = (e, name) => {
    setFormData({
      ...formData,
      [name]: { value: e, errors: [] },
    });
  };

  // Fetch admin data for tag_user dropdown
  const fetchCounsellorsData = () => {
    getAdminDropdown().then((response) => {
      setAdmin(response.data.data);
    });
  };

  // Handle errors
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

  // Create comment api call
  const callCreateticketApiService = () => {
    if (loading) return;
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("comment", formData.comment.value);

    // Only append attachment if it is not null
    if (formData.attachment.value) {
      formDataToSend.append("attachment", formData.attachment.value);
    }

    formData.tag_user.value.forEach((username) => {
      formDataToSend.append("tag_user", username);
    });

    addCommentListService(formDataToSend, id, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        if (response.data.success === "1") {
          // Reset form data, including tag_user and clear file input
          setFormData({
            comment: { value: "", errors: [] },
            attachment: { value: null, errors: [] },
            tag_user: { value: [], errors: [] },
          });

          // Clear file input by resetting the value using ref
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }

          message.success(response.data.message);
          GetTicketCommentApi();
          GetTicketDetailsApi();
        }
      })
      .catch(function (error) {
        if (error) {
          handleError(error.response.data.data);
          message.error(error.response.data.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCounsellorsData();
  }, []);

  return (
    <>
      <p className="text-black font-semibold text-sm mb-4">
        Please Enter Your Reply:
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          callCreateticketApiService();
        }}
        className="w-3/3 space-y-4"
      >
        <FormItem>
          <div className="flex flex-col gap-1">
            <label>Tag User</label>
            <CustomModeSelectInput
              name={"tag_user"}
              errors={formData.tag_user.errors}
              placeholder="Please select Assigned to User"
              mode="multiple"
              size="medium"
              tokenSeparators={[","]}
              showSearch
              required={true}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              handler={(e) => handleSelect(e, "tag_user")}
              value={formData.tag_user.value}
              options={
                admin &&
                admin.map((item) => ({
                  value: item.username,
                  label: item.email,
                }))
              }
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Comment<sup className="text-red-500">*</sup>
            </label>
            <TextArea
              name="comment"
              required={true}
              maxLength={2000}
              rows={8}
              value={formData.comment.value}
              onChange={(e) => handleInput(e)}
              placeholder="Please enter Comment"
            />
          </div>
        </FormItem>

        <div className=" w-[max-content]">
          <label className="block">Attachment</label>
          <UploadImage
            fileInputRef={fileInputRef}
            setAttachment={(file) => {
              setFormData({
                ...formData,
                attachment: { value: file, errors: [] },
              });
            }}
          />
          <p className="text-red-500 text-md">{formData?.attachment?.errors}</p>
          <br />
          <br />
          <PrimaryButton
            type="primary"
            htmlType={"submit"}
            className="p-4"
            title={"Submit"}
            disabled={loading}
          />
        </div>
      </form>
    </>
  );
};

export default AddComment;

const UploadImage = ({ setAttachment, fileInputRef }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment(file);
    }
  };

  return <input ref={fileInputRef} type="file" onChange={handleFileChange} />;
};
