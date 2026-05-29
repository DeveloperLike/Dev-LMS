
import React, { useEffect, useState } from "react";
import {
  Grid,
  Tag,
  Tooltip,
  Select,
  message,
  Modal,
  Input,
} from "antd";

import { FaFilter } from "react-icons/fa";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { FiPlus } from "react-icons/fi";
import { getProfileService } from '../../Pages/Profile/ApiService.js';
import TableWithPagination from "../../Components/CustomComponents/Table";
import { GetColumnSearchProps } from "../../Components/CustomComponents/TableColumnSearch";

import { PAGESIZE } from "../../lib/Constants";

import {
  getAllBranchCommissionService,
  createBranchCommissionService,
  updateBranchCommissionService,
  
} from "../Reports/ApiService";
import { getBranchService } from "../User/ApiService";

const BranchCommissionSettings = () => {

  // =====================================================
  // STATES
  // =====================================================

  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [tableLoading, setTableLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [tableData, setTableData] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({});

  const [searchState, setSearchState] = useState({});

  const [isSelected, setIsSelected] = useState(false);

  const [filters, setFilters] = useState({});

  const [branchOptions, setBranchOptions] = useState([]);
  const [profileData, setProfileData] =
  useState(null);

  const [filterValue, setFilterValue] = useState({
    branch_name: "",
    status: null,
  });

  const [openModal, setOpenModal] = useState(false);

  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    branch_id: "",
    branch_name: "",
    gateway_key: "",
    sharing_percentage: "",
    status: "active",
    created_by: "",
  });

  const { useBreakpoint } = Grid;

  const screens = useBreakpoint();

  // =====================================================
  // FETCH BRANCH COMMISSION
  // =====================================================
const fetchProfile = async () => {

  try {

    const response =
      await getProfileService();

    setProfileData(
      response?.data?.data
    );

  } catch (error) {

    console.log(
      "PROFILE ERROR",
      error
    );
  }
};
  const fetchBranchCommission = async () => {

    try {

      setTableLoading(true);

      const response =
        await getAllBranchCommissionService({
          ...filters,
          page,
          limit: pageSize,
        });

      if (response?.data?.success === "1") {

        setTableData(response.data.data);

        setPaginationInfo(response.data);
      }

    } catch (error) {

      message.error(
        "Failed to fetch branch commission"
      );

    } finally {

      setTableLoading(false);
    }
  };

  // =====================================================
  // FETCH BRANCHES
  // =====================================================

  const fetchBranches = async () => {

    try {


      const response =
        await getBranchService({
          current_page_number: 1,
          count_per_page: 100,
        });
     console.log("data................................",response);

      const branchData =
        response?.data?.data || [];

        console.log("data................................",branchData);

      const formattedData =
        branchData.map((item) => ({
          label: item.name,
          value: item.id,
          branch_name: item.name,
        }));

      setBranchOptions(formattedData);

    } catch (error) {

      message.error(
        "Failed to fetch branches"
      );
    }
  };

  useEffect(() => {

    fetchBranchCommission();
     fetchProfile();

  }, [page, pageSize, filters, searchState]);

  useEffect(() => {

    fetchBranches();

  }, []);

  // =====================================================
  // FILTERS
  // =====================================================

  const handleApplyFilters = () => {

    const payload = {};

    if (filterValue.branch_name) {

      payload.branch_name__icontains =
        filterValue.branch_name;
    }

    if (filterValue.status) {

      payload.status = filterValue.status;
    }

    setFilters(payload);

    setPage(1);
  };

  const handleResetFilter = () => {

    setFilterValue({
      branch_name: "",
      status: null,
    });

    setFilters({});

    setPage(1);
  };

  // =====================================================
  // FORM INPUT
  // =====================================================

  const handleInput = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value, name) => {

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async () => {

  try {

    if (!formData.branch_id) {

      return message.error(
        "Branch required"
      );
    }

    if (!formData.sharing_percentage) {

      return message.error(
        "Sharing percentage required"
      );
    }

    // FINAL PAYLOAD

    const finalPayload = {

      ...formData,

      created_by:
        profileData?.username ||
        profileData?.id ||
        "",

      status: "active",
    };

    console.log(
      "FINAL PAYLOAD =>",
      finalPayload
    );

    let response;

    if (editId) {

      response =
        await updateBranchCommissionService(
          editId,
          finalPayload
        );

    } else {

      response =
        await createBranchCommissionService(
          finalPayload
        );
    }

    if (response?.data?.success === "1") {

      message.success(
        response.data.message
      );

      setOpenModal(false);

      resetForm();

      fetchBranchCommission();
    }

  } catch (error) {

    console.log(error);

    message.error(
      error?.response?.data?.message ||
      "Something went wrong"
    );
  }
};

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {

  setEditId(null);

  setFormData({

    branch_id: "",
    branch_name: "",
    gateway_key: "",
    sharing_percentage: "",
    status: "active",
    created_by: "",
  });
};

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (record) => {

  setEditId(record.id);

  setFormData({

    branch_id: record.branch_id,
    branch_name: record.branch_name,
    gateway_key: record.gateway_key,
    sharing_percentage:
      record.sharing_percentage,
    status: record.status,
    created_by:
      record.created_by || "",
  });

  setOpenModal(true);
};
  // =====================================================
  // TABLE COLUMNS
  // =====================================================

  const columns = [
    {
      title: "Branch Name",
      dataIndex: "branch_name",
      key: "branch_name",
      minWidth: "180px",
      fixed: screens?.md ? "left" : false,

      ...GetColumnSearchProps(
        "branch_name",
        setSearchState,
        searchState
      ),

      render: (text) => (
        <p className="font-medium">
          {text}
        </p>
      ),
    },

    {
      title: "Branch ID",
      dataIndex: "branch_id",
      key: "branch_id",
      minWidth: "220px",
    },

    {
      title: "Gateway Key",
      dataIndex: "gateway_key",
      key: "gateway_key",
      minWidth: "200px",
    },

    {
      title: "Sharing %",
      dataIndex: "sharing_percentage",
      key: "sharing_percentage",
      minWidth: "120px",

      render: (text) => (
        <b>{text}%</b>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,

      render: (status) => {

        const s =
          (status || "").toLowerCase();

        const color =
          s === "active"
            ? "green"
            : "red";

        return (
          <Tag
            color={color}
            className="capitalize m-0"
          >
            {s}
          </Tag>
        );
      },
    },

    {
      title: "Action",
      key: "action",
      width: 120,
      align: "center",

      render: (_, record) => {

        return (
          <div className="flex items-center justify-center gap-2">

            <button
              onClick={() => handleEdit(record)}
              className="
                px-3 py-1
                rounded
                bg-[#ffce00]
                hover:bg-orange-500
                text-black
                text-sm
                font-medium
                transition-all
              "
            >
              Edit
            </button>

          </div>
        );
      },
    },
  ];

  return (
    <>

      {/* HEADER */}

      <div className="mx-6 flex items-center justify-between mb-3 mt-4">

        <h1 className="text-black font-semibold text-lg">
          Branch Commission Settings
        </h1>

        <div className="flex gap-3 items-center">

          

          <button
            onClick={() => {
              resetForm();
              setOpenModal(true);
            }}
            className="
              px-4 py-2
              rounded
              border
              shadow
              text-black
              bg-[#ffce00]
              hover:bg-orange-500
              transition-colors
              flex items-center
              gap-2
              text-sm
              font-medium
            "
          >
            <FiPlus />
            Add Branch Commission
          </button>

        </div>
      </div>

      {/* TABLE */}

      <TableWithPagination
        loading={tableLoading}
        pageSize={pageSize}
        setPageSize={setPageSize}
        tableData={tableData}
        rowHoverable={true}
        tableColumns={columns}
        paginationData={paginationInfo}
        paginationHandler={setPage}
      />

      {/* MODAL */}

      <Modal
        open={openModal}
        title={
          editId
            ? "Update Branch Commission"
            : "Add Branch Commission"
        }
        onCancel={() => {
          setOpenModal(false);
          resetForm();
        }}
        footer={null}
      >

        <div className="space-y-4 mt-4">

          {/* BRANCH DROPDOWN */}

          <div>

            <label className="text-xs">
              Branch Name
            </label>

            <Select
              className="w-full"
              placeholder="Select Branch"
              showSearch
              optionFilterProp="label"
              value={
                formData.branch_id || undefined
              }
              options={branchOptions}
              onChange={(value, option) => {

                setFormData((prev) => ({
                  ...prev,
                  branch_id: value,
                  branch_name:
                    option.branch_name,
                }));
              }}
            />

          </div>

          {/* GATEWAY KEY */}

          <div>

            <label className="text-xs">
              Gateway Key
            </label>

            <Input
              placeholder="Enter gateway key"
              name="gateway_key"
              value={formData.gateway_key}
              onChange={handleInput}
            />

          </div>

          {/* SHARING PERCENTAGE */}

          <div>

            <label className="text-xs">
              Sharing Percentage
            </label>

            <Input
              placeholder="Enter sharing percentage"
              name="sharing_percentage"
              value={
                formData.sharing_percentage
              }
              onChange={handleInput}
              type="number"
            />

          </div>

          {/* STATUS */}

          

          {/* SUBMIT */}

          <button
            onClick={handleSubmit}
            className="
              w-full py-2 rounded
              bg-[#ffce00]
              hover:bg-orange-500
              text-black font-semibold
            "
          >
            {editId
              ? "Update"
              : "Create"}
          </button>

        </div>

      </Modal>

    </>
  );
};

export default BranchCommissionSettings;