import { useEffect, useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import {
  CustomModeSelectInput,
  InputWithIcon,
} from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { message } from "antd";
import { getCounsellorDropdown } from "../AssignmentRule/ApiService";
import UploadImage from "./Component/UploadImage";
import { useParams } from "react-router-dom";
import { getTicketCommentDetailsService } from "./ApiService";

const EditComment = ({ setOpenEdit, GetTicketCommentApi, commentId }) => {
  const [loading, setLoading] = useState(false);
  const [counsellor, setCounsellor] = useState();
  const [commentDetailData, setCommentDetailData] = useState();
  const [formData, setFormData] = useState({
    comment: {
      value: "",
      errors: [],
    },
    ticket: {
      value: "",
      errors: [],
    },
    attachment: {
      value: null,
      errors: [],
    },
    tag_user: {
      value: [],
      errors: [],
    },
  });
  const { id } = useParams();

  console.log(commentId,'commentId')

  // Handle input changes and update state
  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: { value: e.target.value, errors: [] },
    });
  };

  // handleSelect value update
  const handleSelect = (e, name) => {
    console.log(e, name);
    setFormData({
      ...formData,
      [name]: { value: e, errors: [] },
    });
  };

  // fetchCounsellorsData start
  const fetchCounsellorsData = () => {
    getCounsellorDropdown().then((response) => {
      setCounsellor(response.data.data);
    });
  };
// fetchCounsellorsData close

// fetching comment Detail start
const GetTicketCommentDetailsApi = () => {
    getTicketCommentDetailsService(id).then((response) => {
        setCommentDetailData(response.data.data);
    });
  };
// fetching comment Detail close

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

  // add branch data here
  const callCreateticketApiService = () => {
    if (loading) return;
    setLoading(true);

    const payload = {
      comment: formData.comment.value,
      ticket: id,
      attachment: formData.attachment.value,
      tag_user: formData.tag_user.value,
    };
    console.log(payload, "payload");
    // EditCommentListService(payload)
    //   .then(function (response) {
    //     if (response.data.success === "1") {
    //       setOpenEdit(false);
    //       setFormData({
    //         comment: {
    //           value: "",
    //           errors: [],
    //         },
    //         attachment: {
    //           value: "",
    //           errors: [],
    //         },
    //         tag_user: {
    //           value: [],
    //           errors: [],
    //         },
    //       });
    //       message.success(response.data.message);
    //       GetTicketCommentApi();
    //     }
    //   })
    //   .catch(function (error) {
    //     if (error) {
    //       handleError(error.response.data.data);
    //       message.error(error.response.data.message);
    //     }
    //   })
    //   .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCounsellorsData();
    GetTicketCommentDetailsApi();
  }, []);

  //   console.log(formData, "formData");
  console.log(commentDetailData,'commentDetailData')

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          callCreateticketApiService();
        }}
        className="w-3/3 space-y-4"
      >
        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
            Comment<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="comment"
              required={true}
              maxLength={35}
              className=""
              value={formData.comment.value}
              errors={formData.comment.errors}
              type="text"
              placeholder="Please enter Title"
              handler={(e) => {
                handleInput(e);
              }}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>Tag User</label>
            <CustomModeSelectInput
              name={"tag_user"}
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
              options={
                counsellor &&
                counsellor.map((item) => ({
                  value: item.username,
                  label: item.email,
                }))
              }
            />
          </div>
        </FormItem>

        <UploadImage />

        <PrimaryButton
          type="primary"
          htmlType={"submit"}
          className="p-4 mt-8"
          title={"Submit"}
          block={false}
          disabled={loading}
        />
      </form>
    </>
  );
};

export default EditComment;
