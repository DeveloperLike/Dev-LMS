import React, { useEffect, useState } from "react";
import JoditEditor from "jodit-react";
import {
  CustomModeSelectInput,
  CustomSelectInput,
  InputWithIcon,
} from "../../../../Components/CustomComponents/InputWithIcon";
import { message, Row, Select } from "antd";
import {
  OutLineButton,
  PrimaryButton,
} from "../../../../Components/CustomComponents/ButtonUi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseurl } from "../../../../lib/Constants";
import { getUserDropdownService } from "../../../User/ApiService";
import FormItem from "antd/es/form/FormItem";
import { getWhatsappTemplateVariableListService } from "../../ApiService";

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
    "link",
    "table",
    "|",
    "hr",
  ],
  uploader: { insertImageAsBase64URI: true },
};

export const RichTextEditor = () => {
  const [data, setData] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [userlist, setUserList] = useState([]);
  const [visibleTo, setVisibleTo] = useState([]);
  const [assignTo, setAssignTo] = useState([]);
  const [file, setFile] = useState(null);
  const [imageurl, setImage] = useState();
  const [ispublish, setIspublish] = useState("draft");
  const [editorError, setEditorError] = useState(false);
  const [feildError, setFeildError] = useState([]);
  const [variablesList, setVariablesList] = useState([]);

  const navigate = useNavigate();

  // error start from here
  const handleError = (response) => {
    setFeildError(response);
  };
  // error close from here

  const fetchUserList = () => {
    getUserDropdownService().then((response) => {
      if (response.data && response.data.success === "1") {
        setUserList(response.data.data);
      }
    });
  };

  // UPDATED: This function now appends the selected variable to the editor's content.
  const handleVariable = (selectedValue) => {
    setData(data + selectedValue);
  };

  console.log(data, "data");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if JoditEditor content is empty
    if (!data.trim()) {
      setEditorError(true);
      return;
    } else {
      setEditorError(false);
    }

    // If "Assign to all", reset visibleTo
    if (assignTo === "all") setVisibleTo([]);

    // Create FormData
    const formData = new FormData();
    formData.append("name", name);
    formData.append("subject", subject);
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

    // console.log(formData, "formData file")
    const token = localStorage.getItem("token");

    axios
      .post(`${baseurl}/api/v1/template/template/email`, formData, {
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
    getWhatsappTemplateVariableListService().then((response) => {
      if (response?.data?.success === "1") {
        setVariablesList(
          response.data.data.map((item) => ({
            value: item.code,
            label: item.name,
          }))
        );
      }
    });
  }, []);

  useEffect(() => {
    fetchUserList();
  }, []);

  return (
    <div style={{ maxWidth: editorConfig.width, margin: "0 auto" }}>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid md:grid-cols-3 gap-x-4 gap-y-[-1rem]">
          <div className="flex flex-col gap-1">
            <label>
              Template Name<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="name"
              type="text"
              placeholder="Please enter template name"
              value={name}
              errors={feildError.name}
              handler={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>
              Subject<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="subject"
              type="text"
              placeholder="Please enter subject"
              value={subject}
              errors={feildError.subject}
              handler={(e) => setSubject(e.target.value)}
            />
          </div>

          <FormItem>
            <div className="flex flex-col gap-1">
              <label className="block">
                Visible to<sup className="text-red-500">*</sup>
              </label>
              <CustomSelectInput
                size="large"
                name="assign_to"
                placeholder="Select Visible to"
                onChange={(e) => setAssignTo(e)}
                value={assignTo}
                errors={feildError.assign_to}
                options={[
                  {
                    value: "selected_users",
                    label: "Selected Users",
                  },
                  {
                    value: "all",
                    label: "All Users",
                  },
                ]}
              />
            </div>
          </FormItem>

          {assignTo === "selected_users" && (
            <div className="flex flex-col gap-1">
              <label>
                Users<sup className="text-red-500">*</sup>
              </label>
              <CustomModeSelectInput
                name="visibleTo"
                mode="multiple"
                value={visibleTo}
                errors={feildError.visible_to}
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
                options={userlist.map((item, index) => ({
                  key: index,
                  value: item.username,
                  label: item.email,
                }))}
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label>Variable</label>
            <CustomSelectInput
              placeholder="Please select Variable"
              name="variable"
              handler={(e) => handleVariable(e)}
              options={variablesList}
            />
          </div>
        </div>

        <label className="block mt-4 mb-2">
          Compose Email Template<sup className="text-red-500">*</sup>
        </label>
        <div
          className={`editor-container ${editorError ? "border-red-500" : ""}`}
          style={{ border: editorError ? "1px solid red" : "none" }}
        >
          <JoditEditor
            value={data}
            config={editorConfig}
            onChange={(value) => setData(value)}
            style={{ maxHeight: "300px" }}

          />
        </div>
        {editorError && (
          <p className="text-red-500 text-sm">Template content is required</p>
        )}

        <label className="block mt-4 mb-2">
          Please attach any relevant Documents
          <sup className="text-red-500">*</sup>
        </label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileChange}
        />

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
