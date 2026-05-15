import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Space,
  Table,
  Pagination,
  Badge,
  Row,
  Card,
  Modal,
  Checkbox,
  Tooltip,
  Drawer,
  message,
  Grid,
} from "antd";
import { CustomSelectInput } from "../../../Components/CustomComponents/InputWithIcon";
import LoadSkeleton from "../../../Components/CustomComponents/Skeleton";
import { PAGESIZE } from "../../../lib/Constants";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import {
  getEmailTemplateListService,
  patchEmailtemplateListService,
} from "../ApiService";
import { useSelector } from "react-redux";
import { MdOutlineEdit } from "react-icons/md";
import TestEmail from "./TestEmail";
import { GetColumnSearchProps } from "../../../Components/CustomComponents/TableColumnSearch";

const EmailTemplate = ({ isEmailModalOpen, setIsEmailModalOpen }) => {
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [emailData, setEmailData] = useState([]);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});
  const [isEditModalOpen, setIsEDitModalOpen] = useState(false);
  const [builderType, setBuilderType] = useState("basic");
  const [isid, setIsId] = useState();
  const [testOpen, setTestOpen] = useState(false);
  const searchInput = useRef(null);
  const navigate = useNavigate();
  const templateModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  const onShowSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1, newPageSize);
  };

  // Define columns for the email list
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      fixed: screens?.md ? "left" : false,
      key: "name",
      width: "50%",
      ...GetColumnSearchProps("name", setSearchState, searchState),
      render: (text, record) => (
        <p
          className="font-medium"
          onClick={() =>
            templateModulePermission.template_management === "edit" &&
            handleEdit(record.id, record)
          }
        >
          {text}
        </p>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Visible",
      dataIndex: "is_visible",
      key: "is_visible",
      width: "10%",
      render: (is_visible, record) => (
        <p
          onClick={() =>
            templateModulePermission.template_management === "edit" &&
            handleEdit(record.id, record)
          }
        >
          {is_visible === true ? (
            <p className="bg-success text-success inline-flex bg-opacity-10 rounded-full py-1 px-3 text-sm font-medium">
              Yes
            </p>
          ) : (
            <p className="bg-danger text-danger inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium">
              No
            </p>
          )}
        </p>
      ),
    },
    templateModulePermission.template_management === "edit"
      ? {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: "10%",
        render: (status, data) => (
          <div className="flex gap-2">
            {status === "publish" ? (
              <Badge status="success" />
            ) : (
              <Badge status="error" />
            )}
            <CustomSelectInput
              className="w-full min-w-[100px]"
              size="small"
              value={status === "draft" ? "Draft" : "Published"}
              options={[
                {
                  value: "draft",
                  label: <Badge status="error" text="Draft" />,
                },
                {
                  value: "publish",
                  label: <Badge status="success" text="Publish" />,
                },
              ]}
              handler={(e) => {
                handleSelectInput(e, data.id);
              }}
            />
          </div>
        ),
      }
      : {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: "10%",
        render: (status) => (
          <div className="flex gap-2">
            {status === "draft" ? (
              <Badge status="error" text="Draft" />
            ) : (
              <Badge status="success" text="Publish" />
            )}
          </div>
        ),
      },
  ];

  templateModulePermission.template_management === "edit" &&
    columns.push({
      title: "Actions",
      dataIndex: "id",
      key: "id",
      width: "20%",
      render: (id, emailDetailDta) => (
        <>
          {templateModulePermission.template_management === "edit" && (
            <Row className="gap-2 w-[max-content]">
              <Tooltip placement="top" title={"Edit Field"}>
                <MdOutlineEdit
                  onClick={() => handleEdit(id, emailDetailDta)}
                  className="hover:text-orange-500 text-lg"
                />
              </Tooltip>
              <Tooltip placement="top" title={"Test Template"}>
                <p
                  onClick={() => showTestDrawer(id)}
                  className="border px-3 rounded-lg hover:bg-orange-500 hover:text-white"
                >
                  Test
                </p>
              </Tooltip>
            </Row>
          )}
        </>
      ),
    });

  // edit email template start from here
  const handleEdit = (id, emailDetailDta) => {
    setBuilderType(emailDetailDta.email_type);
    setIsId(id);
    setIsEmailModalOpen(true);
    setIsEDitModalOpen(true);
  };

  const handleCancel = () => {
    setIsEmailModalOpen(false);
  };

  const showTestDrawer = (id) => {
    setIsId(id);
    setTestOpen(true);
  };

  const onTestClose = () => {
    setTestOpen(false);
    setIsId(null);
  };

  const onChangeAdvanced = () => {
    setBuilderType("advance");
  };

  const onChangeBasic = () => {
    setBuilderType("basic");
  };

  // Navigate to the appropriate template builder
  const gotoBasicTemplate = () => {
    if (isEditModalOpen) {
      navigate(`/edit-email-template/${isid}`);
    } else {
      navigate("/add-email-template");
    }
  };

  const gotoAdvancedTemplate = () => {
    navigate("/email");
    if (isEditModalOpen) {
      navigate(`/edit-advanced-email-template/${isid}`);
    } else {
      navigate("/add-advanced-email");
    }
  };

  // Fetch email data with the search query
  const getEmail = () => {
    getEmailTemplateListService({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    }).then((response) => {
      setEmailData(response.data.data);
      setData(response.data);
    });
  };

  // Handle status change (publish/draft)
  const handleSelectInput = (e, id) => {
    patchEmailtemplateListService(e, id)
      .then((response) => {
        response.data.success === "1" && getEmail();
        message.success(response?.data?.message);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
  };

  useEffect(() => {
    getEmail();
  }, [searchState, page, pageSize]);

  return (
    <>
      <div className="float-right mb-3">
        <Modal
          title="Select Type of Template Builder"
          open={isEmailModalOpen}
          footer={null}
          onCancel={handleCancel}
          width={800}
        >
          <em>
            <p className="mt-4 mb-4">
              To Create a new template, please choose one of the template
              builders from below options:
            </p>
          </em>

          {/* Advanced Builder Checkbox */}
          <Checkbox
            checked={builderType === "advance"}
            onChange={onChangeAdvanced}
          >
            Advanced Template Builder
          </Checkbox>

          {/* Basic HTML Template Builder Checkbox */}
          <Checkbox checked={builderType === "basic"} onChange={onChangeBasic}>
            Basic HTML Template Builder
          </Checkbox>

          {/* Conditionally Render Content Based on the Selected Builder */}
          {builderType === "advance" && (
            <Card className="mt-4 p-4">
              <h1 className="text-xl mb-2">
                Drag And Drop Email Template Builder
              </h1>
              <ul type="disc" className="list-disc ml-8">
                <li>
                  Drag and drop feature helps in creating different designs with
                  minimum effort
                </li>
                <li>Best fit for creating attractive email templates</li>
                <li>
                  Create professional and mobile responsive email templates fast
                </li>
                <li>Use tokens to add personalization to your emails</li>
              </ul>{" "}
              <Row className="w-full gap-4 mt-2 justify-end">
                <PrimaryButton
                  title="Continue"
                  type="primary"
                  onClick={gotoAdvancedTemplate}
                  className=""
                />
              </Row>
            </Card>
          )}

          {builderType === "basic" && (
            <Card className="mt-4 p-4">
              <h1 className="text-xl mb-2">
                Basic HTML Email Template Builder
              </h1>
              <ul type="disc" className="list-disc ml-8">
                <li>Create quick and simple email templates </li>
                <li>Best fit for plain text mailers</li>
                <li>Format text with numerous formatting options</li>
                <li>Use tokens to add personalization to your emails</li>
              </ul>{" "}
              <Row className="w-full gap-4 mt-2 justify-end">
                <PrimaryButton
                  title="Continue"
                  type="primary"
                  onClick={gotoBasicTemplate}
                  className=""
                />
              </Row>
            </Card>
          )}
        </Modal>

        {/* Test Email Template Drawer section */}
        {isid && (
          <Drawer
            title="Test Email Template"
            placement="right"
            width={400}
            onClose={onTestClose}
            open={testOpen}
          >
            <TestEmail id={isid} setTestOpen={setTestOpen} />
          </Drawer>
        )}
      </div>

      {/* Render Table with email data */}
      {emailData === undefined ? (
        <LoadSkeleton />
      ) : (
        <Table
          columns={columns.map((col) => ({
            ...col,
            className: "whitespace-nowrap",
          }))}
          scroll={{ x: "max-content" }}
          dataSource={emailData}
          pagination={false}
        />
      )}

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <Pagination
          current={page}
          total={data.data_count}
          size="small"
          showQuickJumper
          pageSize={pageSize}
          responsive
          onChange={(page) => {
            setPage(page);
          }}
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
        />
        <div className="text-sm text-black dark:text-yellow-500">
          {data.current_page_data_count} of {data.data_count} records
        </div>
      </div>
    </>
  );
};

export default EmailTemplate;
