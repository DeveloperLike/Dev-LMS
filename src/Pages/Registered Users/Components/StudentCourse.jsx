import React, { useEffect, useState } from "react";
import { Drawer, message, Table, Tooltip, Modal } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import LoadSkeleton from "../../../Components/CustomComponents/Skeleton";
import {
  getStudentCourseListService,
  postPreferredCourseService,
} from "../ApiService";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { MdOutlineEdit } from "react-icons/md";
import { ApplyStudentCourse } from "./ApplyStudentCourse";
import { ApplyEditCourse } from "./ApplyEditCourse";
import axios from "axios";
import { baseurl } from "../../../lib/Constants";

dayjs.extend(customParseFormat);

export const StudentCourse = ({ userName }) => {
  const [data, setData] = useState();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState();
  const [selectedSopCourse, setSelectedSopCourse] = useState();
  const [applicationId, setApplicationId] = useState();

  const getListApi = () => {
    getStudentCourseListService(userName).then((response) => {
      setData(response.data.data);
    });
  };

  const handleEdit = (id, courseId) => {
    setApplicationId(id);
    setSelectedCourse(courseId);
    setEditOpen(true);
  };

  const handleApply = (id) => {
    setSelectedCourse(id);
    setOpen(true);
  };

  const handleUpload = (applicationId, courseId) => {
    setApplicationId(applicationId);
    // setSelectedCourse(courseId);
    setUploadDrawerOpen(true);
    setSelectedSopCourse(courseId);
  };

  const handleViewFile = (url) => {
    setFileUrl(url);
    setViewModalOpen(true);
  };

  const preferredCourse = (id) => {
    const payload = {
      student: userName,
      course: id,
    };

    postPreferredCourseService(payload)
      .then(function (response) {
        if (response.data.success === "1") {
          getListApi();
          message.success(response?.data?.message);
        }
      })
      .catch(function (error) {
        if (error) {
          message.error(error?.response?.data?.data.course);
        }
      });
  };

  let columns = [
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
      minWidth: "160px",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Student",
      dataIndex: "student",
      key: "student",
      minWidth: "100px",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Suggested by",
      dataIndex: "suggested_by",
      key: "suggested_by",
      minWidth: "100px",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Suggestion",
      dataIndex: "is_suggested",
      key: "is_suggested",
      minWidth: "120px",
      render: (text, record) => (
        <PrimaryButton
          type={record.is_suggested === true && `primary`}
          title={`${
            record.is_suggested === false ? "Suggest this course" : "Suggested"
          } `}
          onClick={() => preferredCourse(record.course_id)}
        />
      ),
    },
    {
      title: "Student Preference",
      dataIndex: "is_preferred",
      key: "is_preferred",
      minWidth: "120px",
      render: (text) =>
        text === true ? (
          <p className="bg-success inline-flex text-success bg-opacity-10 rounded-full py-1 px-3 text-sm font-medium">
            Yes
          </p>
        ) : (
          <p className="bg-danger inline-flex text-danger rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium">
            No
          </p>
        ),
    },
    {
      title: "SOP/Content File",
      dataIndex: "content_file",
      key: "content_file",
      minWidth: "150px",
      render: (text, record) => (
        <>
          {record.is_preferred === true && (text ? (
            <div className="flex gap-2">
            <Tooltip title="View File">
              <PrimaryButton
                title="View"
                onClick={() => handleViewFile(text)}
                type="primary"
              />
            </Tooltip>
            <Tooltip title="Replace File">
              <PrimaryButton
                title="Replace"
                onClick={() =>
                  handleUpload(record.application_id, record.preference_id)
                }
                type="default"
              />
            </Tooltip>
            </div>
          ) : (
            <Tooltip title="Upload File">
              <PrimaryButton
                title="Upload"
                onClick={() =>
                  handleUpload(record.application_id, record.preference_id)
                }
                type="default"
              />
            </Tooltip>
          ))}
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "is_applied",
      key: "is_applied",
      minWidth: "120px",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          {text === true ? (
            <Tooltip placement="top" title={"Edit Details"}>
              <MdOutlineEdit
                onClick={() =>
                  handleEdit(record.application_id, record.course_id)
                }
                className="hover:text-orange-500 text-lg"
              />
            </Tooltip>
          ) : (
            <Tooltip placement="top" title={"Apply"}>
              <PrimaryButton
                title={"Apply"}
                onClick={() => handleApply(record.course_id)}
                type={"primary"}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  useEffect(getListApi, []);

  return (
    <>
      <div className="relative py-2">
        <div className="overflow-x-auto mt-10">
          {data === undefined || data === null ? (
            <LoadSkeleton />
          ) : (
            <Table
              dataSource={data}
              columns={columns}
              pagination={false}
              scroll={{ x: "max-content" }}
              rowKey="id"
            />
          )}
        </div>
      </div>

      {/* Drawer for Apply Course */}
      <Drawer
        title="Apply Course"
        placement="right"
        width={400}
        onClose={() => setOpen(false)}
        open={open}
      >
        <ApplyStudentCourse
          userName={userName}
          selectedCourse={selectedCourse}
          setOpen={setOpen}
          getListApi={getListApi}
        />
      </Drawer>

      {/* Drawer for Edit Course */}
      <Drawer
        title="Edit Course"
        placement="right"
        width={400}
        onClose={() => setEditOpen(false)}
        open={editOpen}
      >
        <ApplyEditCourse
          userName={userName}
          selectedCourse={selectedCourse}
          setEditOpen={setEditOpen}
          applicationId={applicationId}
          getListApi={getListApi}
        />
      </Drawer>

      {/* Drawer for Upload File */}
      <Drawer
        title="Upload SOP/Content File"
        placement="right"
        width={400}
        onClose={() => setUploadDrawerOpen(false)}
        open={uploadDrawerOpen}
      >
        {/* Replace below with real upload form */}
        <div>
          <AopContentFile
            selectedSopCourse={selectedSopCourse}
            getListApi={getListApi}
            setUploadDrawerOpen={setUploadDrawerOpen}
          />
        </div>
      </Drawer>

      {/* Modal to View File */}
      <Modal
        title="View Content File"
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
        width={800}
      >
        {fileUrl ? (
          <iframe
            src={fileUrl}
            title="Course File"
            width="100%"
            height="600px"
            frameBorder="0"
          />
        ) : (
          <p>No file to display.</p>
        )}
      </Modal>
    </>
  );
};

const AopContentFile = ({
  selectedSopCourse,
  getListApi,
  setUploadDrawerOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const [importedFile, setImportedFile] = useState(null);

  const handleInputFile = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setImportedFile(selectedFile);
    }
  };

  const postImportApi = () => {
    setLoading(true);
    if (loading) return;

    const formData = new FormData();
    if (importedFile) {
      formData.append("file", importedFile);
    }

    const token = localStorage.getItem("token");
    axios
      .put(
        `${baseurl}/api/v1/university-and-course-management/preferred-course-content/${selectedSopCourse}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.success === "1") {
          setUploadDrawerOpen(false);
          getListApi();
          message.success(response?.data?.message);
        }
      })
      .catch((error) => {
        if (error) {
          message.error(error?.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postImportApi();
  };

  return (
    <>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label className="block mb-2">
          Please attach relevant SOP
          <sup className="text-red-500">*</sup>
        </label>
        <input
          type="file"
          accept=".pdf, .docx, .doc"
          className="block border p-4"
          required
          onChange={handleInputFile}
        />

        <PrimaryButton
          title={"Import"}
          className={"mt-5"}
          htmlType="submit"
          disabled={loading}
        />
      </form>
    </>
  );
};

export default AopContentFile;
