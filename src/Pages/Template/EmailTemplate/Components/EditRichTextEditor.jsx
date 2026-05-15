import React, { useEffect, useState } from "react";
import JoditEditor from "jodit-react";
import {
  CustomModeSelectInput,
  CustomSelectInput,
  InputWithIcon,
} from "../../../../Components/CustomComponents/InputWithIcon";
import { Button, message, Row, Select, Upload } from "antd";
import {
  OutLineButton,
  PrimaryButton,
} from "../../../../Components/CustomComponents/ButtonUi";
import { UploadOutlined } from "@ant-design/icons";
import {
  editEmailTemplatedDetailService,
  getUserListService,
} from "../ApiService";
import { notificationFun } from "../../../../lib/redux/NotificationSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { baseurl } from "../../../../lib/Constants";
import { split } from "postcss/lib/list";
import { getUserDropdownService } from "../../../User/ApiService";

const editorConfig = {
  readonly: false,
  toolbar: true,
  spellcheck: true,
  language: "en",
  toolbarButtonSize: "medium",
  toolbarAdaptive: false,
  showCharsCounter: true,
  showWordsCounter: true,
  showXPathInStatusbar: false,
  askBeforePasteHTML: true,
  askBeforePasteFromWord: true,
  placeholder: "Typing",
  buttons: [
    "undo",
    "redo",
    "|",
    "bold",
    "strikethrough",
    "underline",
    "italic",
    "|",
    "superscript",
    "subscript",
    "|",
    "align",
    "|",
    "ul",
    "ol",
    "outdent",
    "indent",
    "|",
    "font",
    "fontsize",
    "brush",
    "paragraph",
    "|",
    "image",
    "video",
    "link",
    "table",
    "|",
    "hr",
    "eraser",
    "copyformat",
    "|",
    "selectall",
    "print",
    "|",
    "source",
    "|",
  ],
  uploader: { insertImageAsBase64URI: true },
};

export const EditRichTextEditor = ({ id }) => {
  const [data, setData] = useState();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [visibleTo, setVisibleTo] = useState([]);
  const [userlist, setUserList] = useState([]);
  const [assignTo, setAssignTo] = useState([]);
  const [file, setFile] = useState(null);
  const [fileExtention, setFileExtention] = useState(null);
  const [ispublish, setIspublish] = useState("draft");
  const [feildError, setFeildError] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // error start from here
  const handleError = (response) => {
    setFeildError(response);
  };
  // error close from here

  // Fetch user list for select dropdown
  const fetchUserList = () => {
    getUserDropdownService().then((response) => {
      if (response.data && response.data.success === "1") {
        setUserList(response.data.data);
      }
    });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const parts = selectedFile.name.split(".");
      setFileExtention(parts[parts.length - 1].toLowerCase());
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !subject || !data) {
      alert("Please fill in all required fields.");
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append("name", name);
    formData.append("subject", subject);
    formData.append("is_visible", isVisible);
    // Logic to handle "assignTo" (all or selected users)
    formData.append(
      "visible_to",
      assignTo === "all" ? JSON.stringify([]) : JSON.stringify(visibleTo)
    );
    formData.append("status", ispublish);
    formData.append("body", data);
    formData.append("assign_to", assignTo);
    formData.append("email_type", "basic");

    if (file) {
      formData.append("file", file);
    }

    const token = localStorage.getItem("token");

    // Send the request using axios
    axios
      .put(`${baseurl}/api/v1/template/template/email/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        message.success(response?.data?.message);
        navigate("/template");
      })
      .catch((error) => {
        if (error) {
          handleError(error.response.data.data);
          message.error(error?.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    editEmailTemplatedDetailService(id)
      .then((response) => {
        const emailData = response.data.data;
        if (emailData.file) {
          const parts = emailData.file.split(".");
          const lastPart = parts[parts.length - 1];
          setFileExtention(lastPart);
        }

        setName(emailData.name);
        setSubject(emailData.subject);
        setIsVisible(emailData.is_visible);
        setVisibleTo(emailData.visible_to);
        setData(emailData.body);
        setIspublish(emailData.status);
        setFile(emailData.file);
        setAssignTo(emailData.assign_to);
      })
      .catch((error) => {
        console.error("Error fetching EmailTemplate:", error);
      });
  }, [id]);

  useEffect(() => {
    fetchUserList();
  }, []);

  return (
    <div style={{ maxWidth: editorConfig.width, margin: "0 auto" }}>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label>
              Template Name<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="name"
              value={name}
              errors={feildError?.name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Please enter template name"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>
              Subject<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="subject"
              value={subject}
              errors={feildError?.subject}
              onChange={(e) => setSubject(e.target.value)}
              type="text"
              placeholder="Please enter subject"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>
              Visible<sup className="text-red-500">*</sup>
            </label>
            <Select
              name="isVisible"
              value={isVisible}
              errors={feildError?.is_visible}
              onChange={(e) => setIsVisible(e)}
              size="large"
              placeholder="Select visibility"
              options={[
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ]}
            />
          </div>

          {isVisible && (
            <div className="flex flex-col gap-1">
              <label>
                Assignment Type<sup className="text-red-500">*</sup>
              </label>
              <CustomSelectInput
                size="large"
                name="assign_to"
                value={assignTo}
                errors={feildError?.assign_to}
                onChange={(e) => setAssignTo(e)}
                placeholder="Select type"
                options={[
                  {
                    value: "selected_users",
                    label: "Selected Users",
                  },
                  {
                    value: "all",
                    label: "All",
                  },
                ]}
              />
            </div>
          )}

          {isVisible && assignTo === "selected_users" && (
            <div className="flex flex-col gap-1">
              <label>
                Visible to<sup className="text-red-500">*</sup>
              </label>
              <CustomModeSelectInput
                name="visibleTo"
                mode="multiple"
                value={visibleTo}
                errors={feildError?.visible_to}
                onChange={(e) => setVisibleTo(e)}
                size="large"
                placeholder="Select visible"
                tokenSeparators={[","]}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={userlist?.map((item) => ({
                  value: item.username,
                  label: item.email,
                }))}
              />
            </div>
          )}
        </div>

        <label className="block mt-4 mb-2">
          Compose Email Template<sup className="text-red-500">*</sup>
        </label>
        <JoditEditor
          value={data}
          config={editorConfig}
          onChange={(value) => setData(value)}
          style={{ maxHeight: "300px" }}
        />

        <label className="block mt-4 mt-2">
          Please attach any relevant Documents
          <sup className="text-red-500">*</sup>
        </label>

        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileChange}
        />
        {fileExtention &&
          (fileExtention === "png" ||
          fileExtention === "jpg" ||
          fileExtention === "jpeg" ? (
            <img
              src={`${baseurl}/media${file}`}
              alt="loading"
              height="100%"
              width="100%"
              className="w-[50px] mt-2"
            />
          ) : fileExtention === "pdf" ? (
            <a href="">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
                alt="loading"
                height={"100%"}
                width={"100%"}
                className="w-[50px] mt-2"
              />
            </a>
          ) : null)}

        <Row className="w-full gap-4 mt-4 justify-end">
          <OutLineButton
            title="PUBLISH"
            onclick={() => setIspublish("publish")}
          />
          <PrimaryButton
            title="DRAFT TEMPLATE"
            type="primary"
            onClick={() => setIspublish("draft")}
          />
        </Row>

        <PrimaryButton
          type="primary"
          htmlType="submit"
          className="p-5 mt-5"
          title="Submit"
          block={false}
        />
      </form>
    </div>
  );
};
