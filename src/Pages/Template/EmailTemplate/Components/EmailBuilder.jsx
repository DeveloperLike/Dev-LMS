import React, { useEffect, useRef, useState } from "react";
import {
  CustomModeSelectInput,
  CustomSelectInput,
  InputWithIcon,
} from "../../../../Components/CustomComponents/InputWithIcon";
import { Button, Card, message, Row, Select, Upload } from "antd";
import {
  OutLineButton,
  PrimaryButton,
} from "../../../../Components/CustomComponents/ButtonUi";
import { UploadOutlined } from "@ant-design/icons";
import { getUserListService } from "../ApiService";
import { notificationFun } from "../../../../lib/redux/NotificationSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import EmailEditor from "react-email-editor";
import axios from "axios";
import { baseurl } from "../../../../lib/Constants";
import { getUserDropdownService } from "../../../User/ApiService";

export const EmailBuilder = () => {
  const [data, setData] = useState();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [visibleTo, setVisibleTo] = useState([]);
  const [assignTo, setAssignTo] = useState("");
  const [userlist, setUserList] = useState([]);
  const [file, setFile] = useState(null);
  const [ispublish, setIspublish] = useState("draft");
  const [editorError, setEditorError] = useState(false);
  const emailEditorRef = useRef(null);
  const [htmlOutput, setHtmlOutput] = useState("");
  const [feildError, setFeildError] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const exportHtml = () => {
    const unlayer = emailEditorRef.current.editor;

    if (unlayer) {
      unlayer.exportHtml((data) => {
        const { html } = data;
        setHtmlOutput(html);
      });
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    exportHtml();
    if (assignTo === "all") setVisibleTo([]);
    // Check if email content is empty (EmailEditor required validation)
    if (!htmlOutput) {
      setEditorError(true);
      return;
    } else {
      setEditorError(false);
    }

    // Create FormData
    const formData = new FormData();
    formData.append("name", name);
    formData.append("subject", subject);
    formData.append("is_visible", isVisible);
    formData.append("assign_to", assignTo);
    formData.append(
      "visible_to",
      assignTo === "all" ? JSON.stringify([]) : JSON.stringify(visibleTo)
    );
    formData.append("status", ispublish);
    formData.append("assign_to", assignTo);
    formData.append("body", htmlOutput);
    formData.append("email_type", "advance");

    if (file) {
      formData.append("file", file);
    }

    const token = localStorage.getItem("token");

    // Send request via axios
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
    fetchUserList();
  }, []);

  return (
    <>
      <div className="mx-6 bg-white p-10 rounded-lg">
        <div className="flex justify-between w-full">
          <div className="w-fit mb-5">
            <h1 className="text-xl text-black font-semibold ">
              Create Email Template
            </h1>
            <p className="text-sm font-thin">Manage your Email Template</p>
          </div>
          <div>
            <button
              onClick={() => navigate("/template")}
              className="underline block"
            >
              Back
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label>
                Template Name<sup className="text-red-500">*</sup>
              </label>
              <InputWithIcon
                name="name"
                value={name}
                errors={feildError.name}
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
                errors={feildError.subject}
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
                errors={feildError.is_visible}
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
                  name="assign_to"
                  value={assignTo}
                  onChange={(e) => setAssignTo(e)}
                  errors={feildError.assign_to}
                  size="large"
                  placeholder="Select type"
                  options={[
                    { value: "selected_users", label: "Selected Users" },
                    { value: "all", label: "All" },
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
                  options={userlist.map((item) => ({
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
          <Card className="overflow-x-scroll">
            <EmailEditor ref={emailEditorRef} onChange={exportHtml} />
          </Card>
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
    </>
  );
};
