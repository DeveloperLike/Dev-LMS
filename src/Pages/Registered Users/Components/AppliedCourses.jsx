import React, { useEffect, useState } from "react";
import { Drawer, Modal, Table, Tooltip } from "antd";
import LoadSkeleton from "../../../Components/CustomComponents/Skeleton";
import {
  getAppliedCourseService,
  getStudentCourseListService,
} from "../ApiService";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { MdOutlineEdit } from "react-icons/md";
import { ApplyEditCourse } from "./ApplyEditCourse";

const AppliedCourses = ({ userName }) => {
  const [data, setData] = useState();
  const [fileUrl, setFileUrl] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [applicationId, setApplicationId] = useState();
  const [selectedCourse, setSelectedCourse] = useState();
  const [editOpen, setEditOpen] = useState(false);

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
      title: "SOP/Content File",
      dataIndex: "content_file",
      key: "content_file",
      minWidth: "150px",
      render: (text, record) => (
        <>
          {record.is_preferred === true && (
            <div className="flex gap-2">
              <Tooltip title="View File">
                <PrimaryButton
                  title="View"
                  onClick={() => handleViewFile(text)}
                  type="primary"
                />
              </Tooltip>
            </div>
          )}
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
          {
            <Tooltip placement="top" title={"Edit Details"}>
              <MdOutlineEdit
                onClick={() =>
                  handleEdit(record.application_id, record.course_id)
                }
                className="hover:text-orange-500 text-lg"
              />
            </Tooltip>
          }
        </div>
      ),
    },
  ];

  const handleViewFile = (url) => {
    setFileUrl(url);
    setViewModalOpen(true);
  };

  const getAppliedCourseApi = () => {
    getAppliedCourseService(userName).then((response) => {
      setData(response.data.data);
    });
  };

  const handleEdit = (id, courseId) => {
    setApplicationId(id);
    // console.log("application id: ",id);
    setSelectedCourse(courseId);
    setEditOpen(true);
  };

  useEffect(() => {
    getAppliedCourseApi();
  }, []);

  return (
    <>
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
      {/* Modal to View File */}

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
          getListApi={getAppliedCourseApi}
        />
      </Drawer>
      {/* Drawer for Edit Course */}

      <div className="mx-6 flex items-center justify-between mb-3">
        <div className="flex gap-3"></div>
      </div>
      <div className="rounded-lg border border-stroke bg-white dark:bg-boxdark dark:border-strokedark p-4 max-w-full overflow-x-auto">
        {data === undefined || null ? (
          <LoadSkeleton />
        ) : (
          <Table
            dataSource={data}
            columns={columns}
            pagination={false}
            scroll={{ x: "max-content" }}
          />
        )}
      </div>
    </>
  );
};

export default AppliedCourses;
