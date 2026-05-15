import React, { useEffect, useRef, useState } from "react";
import {
  Badge,
  Drawer,
  Grid,
  message,
  Pagination,
  Row,
  Table,
  Tooltip,
} from "antd";
import AddSms from "./AddSms";
import { CustomSelectInput } from "../../../Components/CustomComponents/InputWithIcon";
import { PAGESIZE } from "../../../lib/Constants";
import {
  getSmsTemplateListservice,
  patchSmstemplateListService,
} from "../ApiService";
import LoadSkeleton from "../../../Components/CustomComponents/Skeleton";
import { MdOutlineEdit } from "react-icons/md";
import EditSms from "./EditSms";
import TestSms from "./TestSms";
import { GetColumnSearchProps } from "../../../Components/CustomComponents/TableColumnSearch";
import { useSelector } from "react-redux";

const SmsTemplate = ({ open, setOpen }) => {
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [smsData, setSmsData] = useState();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});
  const [selectedSmsData, setSelectedSmsData] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [testOpen, setTestOpen] = useState(false);

  const searchInput = useRef(null);
  const templateModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  const onShowSizeChange = (current, newPageSize) => {
    setPageSize(newPageSize);
    setPage(1, newPageSize);
  };

  let columns = [
    {
      title: "Name",
      dataIndex: "name",
      fixed: screens?.md ? "left" : false,
      key: "name",
      width: "20%",
      ...GetColumnSearchProps("name", setSearchState, searchState),
      render: (text, record) => (
        <p
          className="font-medium"
          onClick={() =>
            templateModulePermission.template_management === "edit" &&
            showEditDrawer(record.id)
          }
        >
          {text}
        </p>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Dlt Template Id",
      dataIndex: "dlt_template_id",
      key: "dlt_template_id",
      width: "15%",
      render: (text, record) => (
        <p
          onClick={() =>
            templateModulePermission.template_management === "edit" &&
            showEditDrawer(record.id)
          }
        >
          {text}
        </p>
      ),
      sorter: (a, b) => a.dlt_template_id.length - b.dlt_template_id.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Body",
      dataIndex: "body",
      key: "body",
      width: "20%",
      render: (text, record) => (
        <p
          onClick={() =>
            templateModulePermission.template_management === "edit" &&
            showEditDrawer(record.id)
          }
        >
          {text}
        </p>
      ),
      sorter: (a, b) => a.body.length - b.body.length,
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
            showEditDrawer(record.id)
          }
        >
          {is_visible === true ? (
            <p className="bg-success text-success inline-flex bg-opacity-10 rounded-full  py-1 px-3 text-sm font-medium">
              Yes
            </p>
          ) : (
            <p className="bg-danger text-danger inline-flex rounded-full bg-opacity-10  py-1 px-3 text-sm font-medium">
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
        dataIndex: "is_active",
        key: "is_active",
        width: "10%",
        render: (is_active) => (
          <div className="flex gap-2">
            {is_active === true ? (
              <Badge status="success" text="Active" />
            ) : (
              <Badge status="error" text="Inactive" />
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
      width: "10%",
      render: (id) => (
        <>
          {templateModulePermission.template_management === "edit" && (
            <Row className="gap-2 w-[max-content]">
              <Tooltip placement="top" title={"Edit Field"}>
                <MdOutlineEdit
                  onClick={() => showEditDrawer(id)}
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

  const showEditDrawer = (id) => {
    setSelectedSmsData(id);
    setEditOpen(true);
  };
  const onEditClose = () => {
    setEditOpen(false);
    setSelectedSmsData(null);
  };
  const showTestDrawer = (id) => {
    setSelectedSmsData(id);
    setTestOpen(true);
  };
  const onTestClose = () => {
    setTestOpen(false);
    setSelectedSmsData(null);
  };

  const onClose = () => {
    setOpen(false);
  };

  const getSmsApi = () => {
    getSmsTemplateListservice({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    }).then((response) => {
      setSmsData(response.data.data);
      setData(response.data);
    });
  };

  const handleSelectInput = (e, id) => {
    patchSmstemplateListService(e, id).then((response) => {
      if (response.data.success === "1") {
        getSmsApi();
        message.success(response?.data?.message);
      }
    });
  };

  useEffect(getSmsApi, [
    page,
    searchState,
    templateModulePermission.template_management,
    pageSize,
  ]);

  return (
    <>
      <div className="float-right mb-3">
        {/* Add Sms Template section */}
        <Drawer
          title="Create SMS Template"
          placement="right"
          width={400}
          onClose={onClose}
          open={open}
        >
          <AddSms getSmsApi={getSmsApi} setOpen={setOpen} />
        </Drawer>
        {/* Add Sms Template section */}

        {/* Edit Sms Template Drawer section */}
        {selectedSmsData && (
          <Drawer
            title="Edit Sms Template"
            placement="right"
            width={screens?.md && 400}
            onClose={onEditClose}
            open={editOpen}
          >
            <EditSms
              id={selectedSmsData}
              getSmsApi={getSmsApi}
              setEditOpen={setEditOpen}
            />
          </Drawer>
        )}
        {/* Edit Sms Template Drawer section */}

        {/* Test Sms Template Drawer section */}
        {selectedSmsData && (
          <Drawer
            title="Test Sms Template"
            placement="right"
            width={screens?.md && 400}
            onClose={onTestClose}
            open={testOpen}
          >
            <TestSms
              id={selectedSmsData}
              getSmsApi={getSmsApi}
              setTestOpen={setTestOpen}
            />
          </Drawer>
        )}
        {/* Test Sms Template Drawer section */}
      </div>
      {smsData === undefined ? (
        <LoadSkeleton />
      ) : (
        smsData && (
          <Table
            columns={columns.map((col) => ({
              ...col,
              className: "whitespace-nowrap",
            }))}
            scroll={{ x: "max-content" }}
            dataSource={smsData}
            pagination={false}
          />
        )
      )}
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
export default SmsTemplate;
