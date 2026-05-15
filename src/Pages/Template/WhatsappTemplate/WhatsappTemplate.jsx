import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined, ToolFilled } from "@ant-design/icons";
import {
  Button,
  Input,
  Space,
  Table,
  Modal,
  Pagination,
  message,
  Badge,
  Row,
  Tooltip,
  Drawer,
  Grid,
} from "antd";
import Highlighter from "react-highlight-words";
import { baseurl, PAGESIZE } from "../../../lib/Constants";
import AddWhatsapp from "./AddWhatsapp";
import { CustomSelectInput } from "../../../Components/CustomComponents/InputWithIcon";
import { useDispatch, useSelector } from "react-redux";
import { notificationFun } from "../../../lib/redux/NotificationSlice";
import {
  getWhatsappTemplateListService,
  patchWhatsapptemplateListService,
} from "../ApiService";
import LoadSkeleton from "../../../Components/CustomComponents/Skeleton";
import { MdOutlineEdit } from "react-icons/md";
import EditWhatsapp from "./EditWhatsapp";
import TestWhatsapp from "./TestWhatsapp";
import { GetColumnSearchProps } from "../../../Components/CustomComponents/TableColumnSearch";

const WhatsappTemplate = ({ isModalOpen, setIsModalOpen }) => {
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [whatsappData, setWhatsappData] = useState();
  const [editOpen, setEditOpen] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [dataid, setDataId] = useState();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});

  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const templateModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  const onShowSizeChange = (current, newPageSize) => {
    setPageSize(newPageSize);
    setPage(1, newPageSize);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      fixed: screens?.md ? "left" : false,
      key: "name",
      width: "25%",
      ...GetColumnSearchProps("name", setSearchState, searchState),
      render: (text, record) => (
        <p
          className="font-medium"
          onClick={() =>
            templateModulePermission.template_management === "edit" &&
            handleEdit(record.id)
          }
        >
          {text}
        </p>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Body",
      dataIndex: "body",
      key: "body",
      width: "30%",
      render: (text, record) => (
        <p
          onClick={() =>
            templateModulePermission.template_management === "edit" &&
            handleEdit(record.id)
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
      width: "15%",
      render: (is_visible, record) => (
        <p
          onClick={() =>
            templateModulePermission.template_management === "edit" &&
            handleEdit(record.id)
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
      width: "15%",
      render: (id) => (
        <>
          {templateModulePermission.template_management === "edit" && (
            <Row className="gap-2 w-[max-content]">
              <Tooltip placement="top" title={"Edit Field"}>
                <MdOutlineEdit
                  onClick={() => handleEdit(id)}
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

  const handleEdit = (id) => {
    setDataId(id);
    setEditOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditOpen(false);
  };
  const showTestDrawer = (id) => {
    setDataId(id);
    setTestOpen(true);
  };
  const onTestClose = () => {
    setTestOpen(false);
    setDataId(null);
  };

  const getWhatsappApi = () => {
    getWhatsappTemplateListService({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    }).then((response) => {
      setWhatsappData(response.data.data);
      setData(response.data);
    });
  };

  const handleSelectInput = (e, id) => {
    patchWhatsapptemplateListService(e, id).then((response) => {
      response.data.success === "1" && getWhatsappApi();
      message.success(response?.data?.message);
    });
  };

  useEffect(getWhatsappApi, [
    page,
    searchState,
    templateModulePermission.template_management,
    pageSize,
  ]);

  return (
    <>
      <div className="float-right mb-3">
        {/* add whatsapp template close from here */}
        <Drawer
          title="Create Whatsapp Template"
          placement="right"
          width={400}
          onClose={handleCancel}
          open={isModalOpen}
        >
          <AddWhatsapp
            setIsModalOpen={setIsModalOpen}
            getWhatsappApi={getWhatsappApi}
          />{" "}
        </Drawer>
        {/* add whatsapp template close from here */}

        {/* edit whatsapp template start from here */}
        {dataid && (
          <Drawer
            title="Edit Whatsapp Template"
            placement="right"
            width={screens?.md && 400}
            onClose={handleCancel}
            open={editOpen}
          >
            <EditWhatsapp
              dataid={dataid}
              setEditOpen={setEditOpen}
              getWhatsappApi={getWhatsappApi}
            />
          </Drawer>
        )}
        {/* edit whatsapp template close from here */}

        {/* Test whatsapp template Drawer section */}
        {dataid && (
          <Drawer
            title="Test Whatsapp Template"
            placement="right"
            width={screens?.md && 400}
            onClose={onTestClose}
            open={testOpen}
          >
            <TestWhatsapp
              id={dataid}
              getWhatsappApi={getWhatsappApi}
              setTestOpen={setTestOpen}
            />
          </Drawer>
        )}
        {/* Test whatsapp template Drawer section */}
      </div>
      {whatsappData === undefined ? (
        <LoadSkeleton />
      ) : (
        whatsappData && (
          <Table
            columns={columns.map((col) => ({
              ...col,
              className: "whitespace-nowrap",
            }))}
            scroll={{ x: "max-content" }}
            dataSource={whatsappData}
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
          pageSize={PAGESIZE}
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

export default WhatsappTemplate;
