import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  NavLink,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Button,
  DatePicker,
  Drawer,
  Grid,
  Input,
  message,
  Modal,
  Space,
  Tooltip,
} from "antd";
import { FaFilter } from "react-icons/fa";
import {
  deleteLeadService,
  getLeadListService,
  getLeadSourceDropdownService,
  refurbishMultipleLeadService,
} from "./ApiService";
import { baseurl, PAGESIZE } from "../../lib/Constants";
import TableWithPagination from "../../Components/CustomComponents/Table";
import { useSelector } from "react-redux";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { FaFilterCircleXmark } from "react-icons/fa6";
import {
  CustomSelectInput,
  InputWithIcon,
} from "../../Components/CustomComponents/InputWithIcon";
import { RxCross1 } from "react-icons/rx";
import dayjs from "dayjs";
import { assignMultipleLeadService } from "../Unassignedlead/ApiService";
import {
  getCounsellorDropdown,
  getManagerlDropdown,
  getTrackingUrlDropdown,
} from "../AssignmentRule/ApiService";
import {
  getLeadStatusDropdownService,
  getLeadSubStatusDropdownService,
} from "../LeadStatus/ApiService";
import { getBranchService } from "../User/ApiService";
import { getProfileService } from "../Profile/ApiService";
import LeadFilters from "./Components/LeadFilters";

const Leads2 = ({ mode }) => {
  const [pageSize, setPageSize] = useState(PAGESIZE);

  const [tableLoading, setTableLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [leadData, setLeadData] = useState([]);
  const [data, setData] = useState({
    data_count: 0,
    data: [],
  });


  const [isSelected, setIsSelected] = useState(false);
  // const [filteredData, setFilteredData] = useState(false);
  const [filters, setFilters] = useState({});
  const initialLoadRef = useRef(true);

  const [counsellorDropdown, setCounsellorDropdown] = useState([]);
  const [counsellor, setCounsellor] = useState([]);
  const [counsellorError, setCounsellorError] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState();
  const [leadSourceDropdown, setLeadSourceDropdown] = useState([]);
  const [trackingUrl, setTrackingUrl] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [manager, setManager] = useState([]);
  const [leadStatusDropdown, setLeadStatusDropdown] = useState([]);
  const [leadSubStatusDropdown, setLeadSubStatusDropdown] = useState([]);
  const [sourceGroupDropdown, setSourceGroupDropdown] = useState([]);
  const [dropdownLoaded, setDropdownLoaded] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(false);

  const { leadstatus } = useParams();

  const headingMap = {
    "0233cefc-fb3e-49d5-9ee1-5f8adadf143a": "Fresh Leads",
    "c8704f97-f12c-47f7-81db-e82b6069ee2f": "Future Leads",
    "4b3428a2-18f5-47ec-a842-ae732ac7c9cb": "Did Not Pick",
  };

  const fromPageMap = {
    "0233cefc-fb3e-49d5-9ee1-5f8adadf143a": "fresh",
    "c8704f97-f12c-47f7-81db-e82b6069ee2f": "Future Lead",
    "4b3428a2-18f5-47ec-a842-ae732ac7c9cb": "Did Not Pick",
  };

  const fromPage = fromPageMap[leadstatus] || "lead";



  // const leadstatus = useSelector(
  //   (state) => state.leadFilter.filters.leads_status
  // );

  const [filterValue, setFilterValue] = useState({
    name: "",
    email: "",
    phone: "",
    assign_to: null,
    interested_course: "",
    interested_degree: "",
    leads_status: null,
    last_sub_status: null,
    tracking_url: null,
    nearest_branch: null,
    manager: null,
    lead_source: null,
    source_group: null,
    interest_count: null,
    vc_count: null,
    interaction_count: "",
    reached_out_count: "",
    visit_count: null,
    lead_category: null,
    branch: null,
    utm_campaign: "",
    utm_source: "",
    utm_medium: "",
  });

  const [dateRange, setDateRange] = useState([]);
  const [modifiedDateRange, setModifiedDateRange] = useState([]);
  const [reEnquiryDateRange, setReEnquiryDateRange] = useState([]);


  // const fromPage = leadstatus ? "fresh" : "lead";


  const { RangePicker } = DatePicker;
  const dateFormat = "DD-MM-YYYY";

  const navigate = useNavigate();
  const leadModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const rangePresets = [
    { label: "Today", value: [dayjs(), dayjs()] },
    {
      label: "Yesterday",
      value: [dayjs().subtract(1, "d"), dayjs().subtract(1, "d")],
    },
    { label: "Last 7 Days", value: [dayjs().subtract(7, "d"), dayjs()] },
    { label: "Last 14 Days", value: [dayjs().subtract(14, "d"), dayjs()] },
    { label: "Last 30 Days", value: [dayjs().subtract(30, "d"), dayjs()] },
    { label: "Last 60 Days", value: [dayjs().subtract(60, "d"), dayjs()] },
    { label: "Last 90 Days", value: [dayjs().subtract(90, "d"), dayjs()] },
  ];

  // console.log(leadstatus, "pp");

  const handleSelectChange = (value, name) => {
    setFilterValue((prev) => ({
      ...prev,
      [name]: value ?? null,
    }));
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFilterValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const columns = useMemo(() => {
    const allColumns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: "5%",
        minWidth: "150px",
        render: (text, record) => (
          <NavLink
            to={`/view-lead/${record.id}`} state={{ from: fromPage }}
            // state={{ from: fromPage }}
            rel="noopener noreferrer"
          >
            <p className="hover:text-orange-500">{text === null ? "-" : text}</p>
          </NavLink>
        ),
      },
      {
        title: "Modified On",
        dataIndex: "last_updated",
        key: "last_updated",
        width: "10%",
        minWidth: "200px",
        sorter: (a, b) =>
          new Date(a.last_updated).getTime() -
          new Date(b.last_updated).getTime(),
        sortDirections: ["descend", "ascend"],
        defaultSortOrder: "descend",
        render: (text, record) => (
          <NavLink
            to={`/view-lead/${record.id}`}
            state={{ from: fromPage }}
            rel="noopener noreferrer"
          >
            <p className="hover:text-orange-500">{dayjs(text).format("DD MMM YY, hh:mma")}</p>
          </NavLink>
        ),
      },
      {
        title: "Lead Status",
        dataIndex: "leads_status",
        key: "leads_status",
        width: "10%",
        minWidth: "150px",
        render: (text, record) => (
          <NavLink
            to={`/view-lead/${record.id}`} state={{ from: fromPage }}
            rel="noopener noreferrer"
          >
            <p className="hover:text-orange-500">
              {text === null || undefined ? "-" : text}
            </p>
          </NavLink>
        ),
      },
      {
        title: "Last Sub Status",
        dataIndex: "last_sub_status",
        key: "last_sub_status",
        width: "10%",
        minWidth: "250px",
        render: (text, record) => (
          <NavLink
            to={`/view-lead/${record.id}`} state={{ from: fromPage }}
            rel="noopener noreferrer"
          >
            <p className="hover:text-orange-500">
              {text === null || undefined ? "-" : text}
            </p>
          </NavLink>
        ),
      },
      {
        title: "Counsellor",
        dataIndex: "assign_to",
        key: "assign_to",
        width: "10%",
        minWidth: "200px",
        render: (text, record) => (
          <NavLink
            to={`/view-lead/${record.id}`} state={{ from: fromPage }}
            rel="noopener noreferrer"
          >
            <p className="hover:text-orange-500">{text === null ? "-" : text}</p>
          </NavLink>
        ),
      },
      {
        title: "Email",
        fixed: screens?.md ? "left" : false,
        dataIndex: "email",
        key: "email",
        width: "10%",
        minWidth: "250px",
        render: (text, record) => (
          <NavLink
            to={`/view-lead/${record.id}`} state={{ from: fromPage }}
            rel="noopener noreferrer"
          >
            <p className="font-medium hover:text-orange-500">
              {text === null ? "-" : text}
            </p>
          </NavLink>
        ),
      },
      {
        title: "Phone Number",
        dataIndex: "phone",
        key: "phone",
        width: "10%",
        minWidth: "150px",
        render: (phone, record) => (
          <NavLink
            to={`/view-lead/${record.id}`} state={{ from: fromPage }}
            rel="noopener noreferrer"
          >
            {phone === null ? (
              "-"
            ) : (
              <p className="hover:text-orange-500">
                {leadModulePermission?.user_group === "admin" ||
                  leadModulePermission?.user_group === "manager"
                  ? phone
                  : "xxxxxx" + phone.slice(-3)}
              </p>
            )}
          </NavLink>
        ),
      },
      {
        title: "Lead Source",
        dataIndex: "lead_source",
        key: "lead_source",
        width: "5%",
        minWidth: "130px",
        render: (text, record) => (
          <NavLink
            to={`/view-lead/${record.id}`} state={{ from: fromPage }}
            rel="noopener noreferrer"
          >
            <p className="hover:text-orange-500">{text === null ? "-" : text}</p>
          </NavLink>
        ),
      },
      {
        title: "Created Date",
        dataIndex: "created_at",
        key: "created_at",
        width: "10%",
        minWidth: "200px",
        render: (text, record) => (
          <NavLink
            to={`/view-lead/${record.id}`} state={{ from: fromPage }}
            rel="noopener noreferrer"
          >
            <p className="hover:text-orange-500">{dayjs(text).format("DD MMM YY, hh:mma")}</p>
          </NavLink>
        ),
      },
      {
        title: "Interested Course",
        dataIndex: "interested_course",
        key: "interested_course",
        width: "10%",
        minWidth: "160px",
        render: (text, record) => (
          <NavLink
            to={`/view-lead/${record.id}`} state={{ from: fromPage }}
            rel="noopener noreferrer"
          >
            <p className="hover:text-orange-500">
              {text === null || undefined ? "-" : text}
            </p>
          </NavLink>
        ),
      },
      {
        title: "Interested Degree",
        dataIndex: "interested_degree",
        key: "interested_degree",
        width: "10%",
        minWidth: "170px",
        render: (text, record) => (
          <NavLink
            to={`/view-lead/${record.id}`} state={{ from: fromPage }}
            rel="noopener noreferrer"
          >
            <p className="hover:text-orange-500">
              {text === null || undefined ? "-" : text}
            </p>
          </NavLink>
        ),
      },
      {
        title: "Re-enquired On",
        dataIndex: "re_enquired_at",
        key: "re_enquired_at",
        width: "10%",
        minWidth: "200px",
        render: (text, record) => (
          <NavLink
            to={`/view-lead/${record.id}`} state={{ from: fromPage }}
            rel="noopener noreferrer"
          >
            <p className="hover:text-orange-500">
              {text === null || undefined ? "-" : text}
            </p>
          </NavLink>
        ),
      },


      {
        title: "Tracking Url",
        dataIndex: "tracking_url",
        key: "tracking_url",
        width: "5%",
        minWidth: "130px",
        render: (text, record) => (
          <NavLink
            to={`/view-lead/${record.id}`} state={{ from: fromPage }}
            rel="noopener noreferrer"
          >
            <p className="hover:text-orange-500">{text === null ? "-" : text}</p>
          </NavLink>
        ),
      },
      {
        title: "Campaign",
        dataIndex: "campaign",
        key: "campaign",
        width: "10%",
        minWidth: "250px",
        render: (text, record) => (
          <NavLink
            to={`/view-lead/${record.id}`} state={{ from: fromPage }}
            rel="noopener noreferrer"
          >
            <p className="hover:text-orange-500">
              {text === null || undefined ? "-" : text}
            </p>
          </NavLink>
        ),
      },
      {
        title: "Facebook Form Name",
        dataIndex: "form_name",
        key: "form_name",
        width: "5%",
        minWidth: "200px",
        render: (text, record) => (
          <NavLink
            to={`/view-lead/${record.id}`} state={{ from: fromPage }}
            rel="noopener noreferrer"
          >
            <p className="hover:text-orange-500">{text === null ? "-" : text}</p>
          </NavLink>
        ),
      },
      {
        title: "Interest Count",
        dataIndex: "interest_count",
        key: "interest_count",
        width: "5%",
        minWidth: "100px",
        sorter: (a, b) => a.interest_count - b.interest_count,
        sortDirections: ["descend", "ascend"],
        render: (text, record) => (
          <NavLink
            to={`/view-lead/${record.id}`} state={{ from: fromPage }}
            rel="noopener noreferrer"
          >
            <p className="hover:text-orange-500">{text === null ? "-" : text}</p>
          </NavLink>
        ),
      },
      {
        title: "VC Count",
        dataIndex: "vc_count",
        key: "vc_count",
        width: "5%",
        minWidth: "110px",
        sorter: (a, b) => a.vc_count - b.vc_count,
        sortDirections: ["descend", "ascend"],
        render: (text, record) => (
          <NavLink
            to={`/view-lead/${record.id}`} state={{ from: fromPage }}
            rel="noopener noreferrer"
          >
            <p className="hover:text-orange-500">{text === null ? "-" : text}</p>
          </NavLink>
        ),
      },
      {
        title: "Visit Count",
        dataIndex: "visit_count",
        key: "visit_count",
        width: "5%",
        minWidth: "110px",
        sorter: (a, b) => a.visit_count - b.visit_count,
        sortDirections: ["descend", "ascend"],
        render: (text, record) => (
          <NavLink
            to={`/view-lead/${record.id}`} state={{ from: fromPage }}
            rel="noopener noreferrer"
          >
            <p className="hover:text-orange-500">{text === null ? "-" : text}</p>
          </NavLink>
        ),
      },
    ];

    const isPrivileged = ["admin", "manager"].includes(
      leadModulePermission?.user_group
    );

    if (!isPrivileged) {
      return allColumns.filter(
        (col) =>
          ![
            "lead_source",
            "tracking_url",
            "campaign",
            "form_name",
            "source_group",
          ].includes(col.dataIndex)
      );
    }

    return allColumns;
  }, [screens, leadModulePermission, fromPage]);

  const handleFilters = () => {
    const willOpen = !isSelected;

    setIsSelected(willOpen);

    if (willOpen && !dropdownLoaded) {
      fetchDropdowns();
      setDropdownLoaded(true);
    }
  };


  const resetTable = () => {
    setLeadData([]);
    setData({
      data_count: 0,
      data: [],
    });
  };

  const handleDelete = (id) => {
    deleteLeadService(id)
      .then((response) => {
        getLeadApi();
        message.success(response?.data?.message);
      })
      .catch(function (error) {
        if (error) {
          message.error(error?.response?.data?.message);
        }
      });
    setIsModalOpen(false);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleAdvFilters = () => {

    let leadSourceIds = filterValue.lead_source;

    if (filterValue.source_group && !filterValue.lead_source) {
      leadSourceIds = leadSourceDropdown
        .filter((item) =>
          filterValue.source_group.includes(item.source_group)
        )
        .map((item) => item.id);
    }

    const newFilters = {
      name: filterValue.name,
      email: filterValue.email,
      phone: filterValue.phone,

      assign_to: Array.isArray(filterValue.assign_to)
        ? filterValue.assign_to.join(",")
        : filterValue.assign_to,

      interested_course: filterValue.interested_course,
      interested_degree: filterValue.interested_degree,

      leads_status: Array.isArray(filterValue.leads_status)
        ? filterValue.leads_status.join(",")
        : filterValue.leads_status,

      last_sub_status: Array.isArray(filterValue.last_sub_status)
        ? filterValue.last_sub_status.join(",")
        : filterValue.last_sub_status,

      tracking_url: Array.isArray(filterValue.tracking_url)
        ? filterValue.tracking_url.join(",")
        : filterValue.tracking_url,

      nearest_branch: Array.isArray(filterValue.nearest_branch)
        ? filterValue.nearest_branch.join(",")
        : filterValue.nearest_branch,

      manager: Array.isArray(filterValue.manager)
        ? filterValue.manager.join(",")
        : filterValue.manager,

      lead_source: Array.isArray(leadSourceIds)
        ? leadSourceIds.join(",")
        : leadSourceIds,

      secondary_source: Array.isArray(filterValue.secondary_source)
        ? filterValue.secondary_source.join(",")
        : filterValue.secondary_source,

      interest_count: filterValue.interest_count,
      vc_count: filterValue.vc_count,

      interaction_count__gte:
        filterValue.interaction_count !== ""
          ? Number(filterValue.interaction_count)
          : null,

      reached_out_count__gte:
        filterValue.reached_out_count !== ""
          ? Number(filterValue.reached_out_count)
          : null,

      visit_count: filterValue.visit_count,
      lead_category: filterValue.lead_category,

      start_date:
        !dateRange || dateRange.length !== 2
          ? null
          : dateRange[0].format(dateFormat),

      end_date:
        !dateRange || dateRange.length !== 2
          ? null
          : dateRange[1].format(dateFormat),

      modified_start_date:
        !modifiedDateRange || modifiedDateRange.length !== 2
          ? null
          : modifiedDateRange[0].format(dateFormat),

      modified_end_date:
        !modifiedDateRange || modifiedDateRange.length !== 2
          ? null
          : modifiedDateRange[1].format(dateFormat),

      re_enquire_start_date:
        !reEnquiryDateRange || reEnquiryDateRange.length !== 2
          ? null
          : reEnquiryDateRange[0].format(dateFormat),

      re_enquire_end_date:
        !reEnquiryDateRange || reEnquiryDateRange.length !== 2
          ? null
          : reEnquiryDateRange[1].format(dateFormat),

      branch: Array.isArray(filterValue.branch)
        ? filterValue.branch.join(",")
        : filterValue.branch,

      utm_campaign: filterValue.utm_campaign,
      utm_source: filterValue.utm_source,
      utm_medium: filterValue.utm_medium,
    };

    const cleanedFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== "" && v !== null)
    );

    setFilters(cleanedFilters);
  };

  const handleResetFilter = () => {
    setDateRange([]);
    setModifiedDateRange([]);
    setReEnquiryDateRange([]);
    // setFilteredData(false);
    setFilters({});
    setFilterValue({
      name: "",
      email: "",
      phone: "",
      assign_to: null,
      interested_course: "",
      interested_degree: "",
      leads_status: null,
      last_sub_status: null,
      tracking_url: null,
      nearest_branch: null,
      manager: null,
      lead_source: null,
      source_group: null,
      secondary_source: null,
      interest_count: null,
      vc_count: null,
      branch: null,
      interaction_count: "",
      reached_out_count: "",
      visit_count: null,
      lead_category: null,
    });
    initialLoadRef.current = true;
  };

  const requestIdRef = useRef(0);

  const getLeadApi = () => {
    const requestId = ++requestIdRef.current;

    const params = {
      ...filters,
      current_page_number: page,
      count_per_page: pageSize,
    };

    // Start loading
    setTableLoading(true);

    // Reset before API
    // resetTable();

    getLeadListService(params)
      .then((response) => {
        if (requestId === requestIdRef.current) {
          setLeadData(response.data.data || []);
          setData(response.data || { data_count: 0, data: [] });
        }
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
        // resetTable(); 
      })
      .finally(() => {
        if (requestId === requestIdRef.current) {
          setTableLoading(false);
        }
      });
  };


  useEffect(() => {
    // Reset when route changes
    setFilters({});
    setPage(1);
    setSelectedRowKeys([]);

    if (leadstatus) {
      setFilters({ leads_status: leadstatus });

      setFilterValue((prev) => ({
        ...prev,
        leads_status: leadstatus,
      }));
    }

  }, [leadstatus]);


  useEffect(() => {
    getLeadApi();
  }, [page, pageSize, filters]);

  useEffect(() => {
    if (leadstatus) {
      document.title = "Fresh Leads";
    } else {
      document.title = "Leads";
    }
  }, [leadstatus]);


  // useEffect(() => {
  //   if (filteredData) {
  //     getLeadApi();
  //   }
  // }, [filteredData]);


  const fetchDropdowns = async () => {
    setTableLoading(true);

    try {
      await Promise.all([
        getCounsellorsDropdownApi(),
        getLeadSourceDropdownApi(),
        getLeadStatusDropdownApi(),
        getLeadSubStatusDropdownApi(),
        getTrackingUrlDropdownApi(),
        getgetManagerDropdownApi(),
        getBranchDropdownApi(),
      ]);
    } catch (err) {
      console.error("Dropdown error", err);
    }

    setTableLoading(false);
  };

  useEffect(() => {
    fetchDropdowns();
  }, [])

  const getCounsellorsDropdownApi = () => {
    getCounsellorDropdown().then((response) => {
      setCounsellorDropdown(response.data.data);
    });
  };

  const getLeadSourceDropdownApi = () => {
    getLeadSourceDropdownService().then((response) => {
      const data = response.data.data || [];

      setLeadSourceDropdown(data);

      const uniqueGroups = [
        ...new Set(data.map((item) => item.source_group).filter(Boolean)),
      ].map((group) => ({
        value: group,
        label: group,
      }));

      setSourceGroupDropdown(uniqueGroups);
    });
  };

  const getTrackingUrlDropdownApi = () => {
    getTrackingUrlDropdown().then((response) => {
      setTrackingUrl(response.data.data);
    });
  };
  const getBranchDropdownApi = () => {
    getBranchService().then((response) => {
      setBranchList(response.data.data);
    });
  };
  const getgetManagerDropdownApi = () => {
    getManagerlDropdown().then((response) => {
      setManager(response.data.data);
    });
  };
  const getLeadStatusDropdownApi = () => {
    getLeadStatusDropdownService().then((response) => {
      setLeadStatusDropdown(response.data.data);
    });
  };
  const getLeadSubStatusDropdownApi = () => {
    getLeadSubStatusDropdownService().then((response) => {
      setLeadSubStatusDropdown(response.data.data);
    });
  };

  // const reinqueryFunction = () => {
  //   // console.log("priti");
  //   // console.log(data)
  //   const startDate = data?.start_date;
  //   const endDate = data?.end_date;
  //   // console.log(reEnquiryDateRange);
  //   setReEnquiryDateRange([dayjs(startDate), dayjs(endDate)]);

  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     re_enquire_start_date: startDate,
  //     re_enquire_end_date: endDate,
  //   }));

  //   setFilteredData(true);
  // };

  const reinqueryFunction = () => {
    const { start_date, end_date } = data;
    const startDate = dayjs(start_date, "DD-MM-YYYY");
    const endDate = dayjs(end_date, "DD-MM-YYYY");

    setReEnquiryDateRange([startDate, endDate]);

    setFilters((prevFilters) => ({
      ...prevFilters,
      re_enquire_start_date: startDate.format("DD-MM-YYYY"),
      re_enquire_end_date: endDate.format("DD-MM-YYYY"),
    }));

    // setFilteredData(true);
  };

  const handleRefurbish = () => {
    if (actionLoading) return;

    setActionLoading(true);

    const payload = {
      lead_id: selectedRowKeys,
    };

    refurbishMultipleLeadService(payload)
      .then((response) => {
        if (response.data.success === "1") {
          getLeadApi();
          message.success(response?.data?.message);
          setSelectedRowKeys([]);
        }
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      })
      .finally(() => setActionLoading(false));
  };


  const assignMultipleLeadApi = async () => {
    if (actionLoading) return;

    setActionLoading(true);

    const myData = await getProfileService();

    const payload = {
      assign_to: counsellor,
      lead_id: selectedRowKeys,
      user_id: myData?.data?.data?.username,
    };

    assignMultipleLeadService(payload)
      .then((response) => {
        if (response.data.success === "1") {
          setOpen(false);
          getLeadApi();
          setCounsellor(null);
          setSelectedRowKeys([]);
          message.success(response?.data?.message);
        }
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
        setCounsellorError(error?.response?.data?.data?.assign_to);
      })
      .finally(() => setActionLoading(false));
  };

  const rowSelection = useMemo(() => ({
    type: "checkbox",
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  }), [selectedRowKeys]);

  return (
    <>
      <div className="mx-6 flex items-center justify-between mb-3">
        <div>
          <h1
            className={`${mode === "dark" ? "text-yellow-500" : "text-black"
              } font-semibold flex items-center gap-2 justify-self-start text-lg rounded`}
          >
            {headingMap[leadstatus] || "Leads"}
          </h1>

        </div>
        <div className="flex gap-4 items-center">
          <div className="text-sm text-black">
            {/* {filteredData && ( */}
            {Object.keys(filters).length > 0 && (
              <PrimaryButton
                title={
                  <>
                    <div className="flex items-center gap-1">
                      <div className="pl-1">
                        <Tooltip placement="top" title={"Reset filters"}>
                          <RxCross1 />
                        </Tooltip>
                      </div>
                      <div>
                        {tableLoading ? 0 : data?.data_count || 0} records found
                      </div>
                    </div>
                  </>
                }
                className={"w-fit p-[18px] px-2 gap-2 "}
                onClick={handleResetFilter}
              />
            )}
          </div>
          <Tooltip placement="top" title={"Filters"}>
            <button onClick={handleFilters}>
              {isSelected === true ? <FaFilterCircleXmark /> : <FaFilter />}
            </button>
          </Tooltip>
          {/* permissions to view */}
          {/* {
            console.log(leadModulePermission) 
          } */}
          {leadModulePermission?.lead_management === "edit" ? (
            <div className="flex flex-wrap gap-1 md:gap-2">
              {leadModulePermission?.user_group === "admin" || leadModulePermission?.refurbishment_management === "edit" ? (
                <button
                  disabled={selectedRowKeys?.length === 0 || actionLoading}
                  onClick={handleRefurbish}
                  className={`${mode === "dark" ? "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 bg-[#ffce00] hover:bg-orange-500 flex items-center gap-1  dark:bg-meta-4 shadow border px-3 py-1  rounded`}
                >
                  Refurbish
                </button>
              ) : ""}
              {leadModulePermission?.user_group !== "staff" && (
                <button
                  disabled={selectedRowKeys?.length === 0 || actionLoading}
                  onClick={showDrawer}
                  className={`${mode === "dark" ? "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 bg-[#ffce00] hover:bg-orange-500 flex items-center gap-1  dark:bg-meta-4 shadow border px-3 py-1  rounded`}
                >
                  Change Owner
                </button>
              )}
              <NavLink to="/add-lead">
                <button className={`${mode === "dark" ? "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 bg-[#ffce00] hover:bg-orange-500 flex items-center gap-1  dark:bg-meta-4 shadow border px-3 py-1  rounded`}>
                  Add Lead
                </button>
              </NavLink>

              <button
                className={`${mode === "dark" ? "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 bg-[#ffce00] hover:bg-orange-500 flex items-center gap-1  dark:bg-meta-4 shadow border px-3 py-1  rounded`}
                disabled={actionLoading}
                onClick={reinqueryFunction}
              >
                Re-Enquire
              </button>
            </div>
          ) : null}
          {/* Delete lead modal */}
          <Modal
            title="Do you want to delete this lead?"
            open={isModalOpen}
            onOk={() => handleDelete(selectedLeadId)}
            onCancel={() => setIsModalOpen(false)}
          >
            <span className="font-medium">Note:</span> Any registered student
            records will also be deleted.
          </Modal>
          {/* Delete lead modal */}

          {/* Assign Multiple lead Drawer */}
          <Drawer
            title="Assign Lead"
            placement="right"
            width={screens?.md && 400}
            onClose={onClose}
            open={open}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                assignMultipleLeadApi();
              }}
              className="w-3/3 space-y-4"
            >
              <div className="flex flex-col gap-1">
                <label className="block">
                  Assign to<sup className="text-red-500">*</sup>
                </label>
                <CustomSelectInput
                  size="large"
                  name="counsellor"
                  placeholder="Select Counsellor"
                  value={counsellor}
                  errors={counsellorError}
                  onChange={(value) => {
                    setCounsellor(value);
                  }}
                  options={counsellorDropdown.map((item) => ({
                    value: item.username,
                    label: item.email,
                  }))}
                />
              </div>
              <PrimaryButton
                type="primary"
                htmlType="submit"
                className="p-4 mt-6 text-black"
                title="Submit"
                block={false}
                disabled={actionLoading}
              />
            </form>
          </Drawer>
          {/* Assign Multiple lead Drawer */}
        </div>
      </div>

      {/* filter start from here */}

      <LeadFilters
        isSelected={isSelected}
        filterValue={filterValue}
        handleInput={handleInput}
        handleSelectChange={handleSelectChange}
        dateRange={dateRange}
        setDateRange={setDateRange}
        modifiedDateRange={modifiedDateRange}
        setModifiedDateRange={setModifiedDateRange}
        reEnquiryDateRange={reEnquiryDateRange}
        setReEnquiryDateRange={setReEnquiryDateRange}
        rangePresets={rangePresets}
        dateFormat={dateFormat}
        handleAdvFilters={handleAdvFilters}
        handleResetFilter={handleResetFilter}
        counsellorDropdown={counsellorDropdown}
        manager={manager}
        leadStatusDropdown={leadStatusDropdown}
        leadSubStatusDropdown={leadSubStatusDropdown}
        branchList={branchList}
        trackingUrl={trackingUrl}
        sourceGroupDropdown={sourceGroupDropdown}
        leadSourceDropdown={leadSourceDropdown}
      />

      {/* filter close from here */}

      <TableWithPagination
        loading={tableLoading}
        pageSize={pageSize}
        setPageSize={setPageSize}
        tableData={leadData}
        rowHoverable={false}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
        islead={leadModulePermission?.lead_management === "edit" && "lead"}
        rowKey="id"
        rowSelection={rowSelection}
      />
    </>
  );
};

export default Leads2;