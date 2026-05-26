import React, { useEffect, useState } from "react";
import { MdOutlineEdit, MdDelete } from "react-icons/md";
import { Badge, Drawer, Grid, message, Modal, Switch, Tooltip, Tag } from "antd";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import TableWithPagination from "../../Components/CustomComponents/Table";
import AddAssignmentRule from "./AddAssignmentRule";
import { PAGESIZE } from "../../lib/Constants";
import {
  deleteLeadAssignmentRuleService,
  getAssignmentRuleService,
  patchAssignmentRuleService,
} from "./ApiService";
import { GetColumnSearchProps } from "../../Components/CustomComponents/TableColumnSearch";

export default function AssignmentRule({ mode }) {
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [assignmentRuleData, setAssignmentRuleData] = useState([]);
  const [searchState, setSearchState] = useState({});

  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null); // Full rule object for editing

  const [isCodeMatch, setCodematch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const leadModulePermission = useSelector((state) => state.permissions.permissionsData);
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const fetchRules = () => {
    getAssignmentRuleService({
      ...searchState,
      page: page,
      pageSize: pageSize,
    }).then((response) => {
      setAssignmentRuleData(response.data.data);
      setData(response.data);
    }).catch(err => {
      message.error("Failed to load rules");
    });
  };

  useEffect(() => {
    fetchRules();
  }, [page, searchState, pageSize]);

  const handleEdit = (record) => {
    setSelectedData(record);
    setOpen(true);
  };

  const handleDelete = (uid) => {
    deleteLeadAssignmentRuleService(uid)
      .then((response) => {
        message.success("Rule deleted successfully");
        setIsModalOpen(false);
        fetchRules();
      })
      .catch((error) => {
        message.error(error?.response?.data?.message || "Delete failed");
      });
  };

  const handleStatusToggle = (checked, uid) => {
    patchAssignmentRuleService(checked, uid).then((response) => {
      message.success("Status updated");
      fetchRules();
    }).catch(err => {
      message.error("Failed to update status");
    });
  };

  const renderArrayTags = (arr) => {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return "-";
    return arr.map(item => (
      <Tag key={item.value || item} color="blue" className="mb-1">
        {item.label || item}
      </Tag>
    ));
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 250,
      fixed: screens?.md ? "left" : false,
      render: (text) => <span className="font-semibold">{text || "-"}</span>,
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      width: 200,
      render: (arr) => renderArrayTags(arr),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      width: 200,
      render: (arr) => renderArrayTags(arr),
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      width: 200,
      render: (arr) => renderArrayTags(arr),
    },
    {
      title: "Branch Filter",
      dataIndex: "branch",
      key: "branch",
      width: 200,
      render: (arr) => renderArrayTags(arr),
    },
    {
      title: "Level of Education",
      dataIndex: "levelOfEducation",
      key: "levelOfEducation",
      width: 150,
      render: (text) => text || "-",
    },
    {
      title: "UTM Campaign",
      dataIndex: "UTMCampaign",
      key: "UTMCampaign",
      width: 150,
    },
    {
      title: "UTM Source",
      dataIndex: "UTMSource",
      key: "UTMSource",
      width: 150,
    },
    {
      title: "UTM Medium",
      dataIndex: "UTMMedium",
      key: "UTMMedium",
      width: 150,
    },
    {
      title: "Campaign",
      dataIndex: "campaign",
      key: "campaign",
      width: 150,
    },
    {
      title: "Form Name",
      dataIndex: "formName",
      key: "formName",
      width: 150,
    },
    {
      title: "Tracking URL",
      dataIndex: "trackingURL",
      key: "trackingURL",
      width: 250,
    },
    {
      title: "Assigned Roles",
      dataIndex: "role",
      key: "role",
      width: 200,
      render: (arr) => renderArrayTags(arr),
    },
    {
      title: "User Group",
      dataIndex: "userGroup",
      key: "userGroup",
      width: 150,
      render: (arr) => renderArrayTags(arr),
    },
    {
      title: "Assigned Branches",
      dataIndex: "assignToBranch",
      key: "assignToBranch",
      width: 200,
      render: (arr) => renderArrayTags(arr),
    },
    {
      title: "Specific Counsellors",
      dataIndex: "counsellor",
      key: "counsellor",
      width: 200,
      render: (arr) => renderArrayTags(arr),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status, record) => (
        <Switch
          checked={status}
          onChange={(checked) => handleStatusToggle(checked, record.uid)}
          disabled={leadModulePermission?.assignment_rule_management !== "edit"}
        />
      ),
    },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
      render: (text) => text ? dayjs(text).format('DD MMM YYYY, hh:mm A') : "-",
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <div className="flex gap-3 text-lg">
          {leadModulePermission?.assignment_rule_management === "edit" ? (
            <>
              <Tooltip title="Edit Rule">
                <MdOutlineEdit
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => handleEdit(record)}
                />
              </Tooltip>
              {/* <Tooltip title="Delete Rule">
                <MdDelete
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => {
                    setCodematch(record.uid);
                    setIsModalOpen(true);
                  }}
                />
              </Tooltip> */}
            </>
          ) : (
            <MdOutlineEdit className="opacity-50 cursor-not-allowed" />
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mx-6 flex items-center justify-between mb-3">
        <div>
          <h1 className={`${mode === "dark" ? "text-yellow-500" : "text-black"} font-semibold text-lg`}>
            CRM Assignment Rules
          </h1>
        </div>
        {leadModulePermission?.assignment_rule_management === "edit" && (
          <button
            onClick={() => {
              setSelectedData(null); // Clear for new
              setOpen(true);
            }}
            className="text-black bg-[#ffce00] hover:bg-orange-500 px-4 py-2 rounded font-medium shadow"
          >
            Add New Rule
          </button>
        )}
      </div>

      <TableWithPagination
        pageSize={pageSize}
        setPageSize={setPageSize}
        tableData={assignmentRuleData}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
        rowKey="uid"
        scroll={{ x: 3000 }} // Wide scroll for many columns
      />

      {/* Unified Add/Edit Drawer */}
      <Drawer
        title={selectedData ? "Edit CRM Rule" : "Add CRM Rule"}
        placement="right"
        width={screens?.md ? 800 : '100%'}
        onClose={() => setOpen(false)}
        open={open}
        destroyOnClose
      >
        <AddAssignmentRule
          initialData={selectedData}
          onClose={() => setOpen(false)}
          onSuccess={fetchRules}
        />
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Rule"
        open={isModalOpen}
        onOk={() => handleDelete(isCodeMatch)}
        onCancel={() => setIsModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this assignment rule?</p>
      </Modal>
    </>
  );
}
