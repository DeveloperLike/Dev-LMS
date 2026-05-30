import React, { useState, useEffect } from "react";
import { Grid, Tag, message, Tooltip, Select, DatePicker,AutoComplete } from "antd";
import { FaFilter } from "react-icons/fa";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { PAGESIZE } from "../../lib/Constants";
import TableWithPagination from "../../Components/CustomComponents/Table";
import { GetColumnSearchProps } from "../../Components/CustomComponents/TableColumnSearch";
import { getPaymentDashboardService, retryPaymentService, syncPendingPaymentsService,getTransactionSuggestionsService } from "../Reports/ApiService";

const TransactionsList = () => {
    // --- 1. State Management ---
    const [pageSize, setPageSize] = useState(PAGESIZE);
    const [tableLoading, setTableLoading] = useState(false);
    const [transactionsData, setTransactionsData] = useState([]);
    const [page, setPage] = useState(1);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [searchState, setSearchState] = useState({});
    const [dateRange, setDateRange] = useState([]);
    const [statusDropdown, setStatusDropdown] = useState([]);
    const [studentOptions, setStudentOptions] = useState([]);
    const [studentSearchLoading, setStudentSearchLoading] = useState(false);

    // Filter UI State
    const [isSelected, setIsSelected] = useState(false);
    const [filters, setFilters] = useState({});
    const [filterValue, setFilterValue] = useState({
        student_name: "",
        status: null,
        payment_mode: null,
        date_range: [],
    });

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    // --- 2. Handlers & Logic ---
    const handleInput = (e) => {
        const { name, value } = e.target;
        setFilterValue((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value, name) => {
        setFilterValue((prev) => ({ ...prev, [name]: value ?? null }));
    };

    const handleApplyFilters = () => {
        const payload = {};

        if (filterValue.student_name) {
            payload.search = filterValue.student_name;
        }

        // Handle status case-insensitive
        if (filterValue.status) {
            payload.status = filterValue.status.toLowerCase();
        }

        if (filterValue.payment_mode) {
            payload.payment_mode = filterValue.payment_mode.toLowerCase();
        }

        if (filterValue.date_range && filterValue.date_range.length === 2) {
            payload.start_date =
                filterValue.date_range[0].format("YYYY-MM-DD 00:00:00");

            payload.end_date =
                filterValue.date_range[1].format("YYYY-MM-DD 23:59:59");
        }

        setFilters(payload);
        setPage(1);
    };

    const handleResetFilter = () => {
        setFilterValue({
            student_name: "",
            status: null,
            payment_mode: null,
            date_range: [],
        });

        setDateRange([]);
        setFilters({});
        setPage(1);
    };
    useEffect(() => {

  if (!filterValue.student_name?.trim()) {
    setStudentOptions([]);
    return;
  }

  const timer = setTimeout(async () => {

    try {

      setStudentSearchLoading(true);

      const response =
        await getTransactionSuggestionsService({
          type: "student",
          search: filterValue.student_name,
        });

      if (response?.data?.success) {

        setStudentOptions(
          response.data.data || []
        );

      }

    } catch (error) {

      console.error(
        "Student suggestion error:",
        error
      );

    } finally {

      setStudentSearchLoading(false);

    }

  }, 500); // debounce

  return () => clearTimeout(timer);

}, [filterValue.student_name]);

    useEffect(() => {
        if (transactionsData?.length) {

            const map = new Map();

            transactionsData.forEach((item) => {
                if (!item.status) return;

                const key = item.status.toLowerCase(); // normalize

                if (!map.has(key)) {
                    map.set(key, item.status);
                }
            });

            const formatted = Array.from(map.values()).map((status) => ({
                label:
                    status.charAt(0).toUpperCase() +
                    status.slice(1).toLowerCase(),
                value: status,
            }));

            setStatusDropdown(formatted);
        }
    }, [transactionsData]);

const fetchTransactions = async () => {

    try {

        setTableLoading(true);

        const response =
            await getPaymentDashboardService({
                ...filters,
                page,
                limit: pageSize,
            });

        if (response?.data?.success === "1") {

            const responseData = response.data;

            setTransactionsData(
                responseData.data || []
            );

            // IMPORTANT
            setPaginationInfo({

                // REQUIRED FOR TABLE PAGINATION
                total:
                    responseData.total ||
                    responseData.data_count ||
                    0,

                current_page_number:
                    responseData.current_page_number ||
                    responseData.current_page ||
                    page,

                count_per_page:
                    responseData.count_per_page ||
                    responseData.per_page ||
                    pageSize,

                total_number_of_pages:
                    responseData.total_number_of_pages ||
                    responseData.total_pages ||
                    1,

                // OPTIONAL
                current_page_data_count:
                    responseData.current_page_data_count ||
                    responseData.data?.length ||
                    0,

                data_count:
                    responseData.data_count ||
                    responseData.total ||
                    0,
            });
        }

    } catch (err) {

        console.error("API Error:", err);

        message.error(
            "Failed to fetch dashboard data"
        );

    } finally {

        setTableLoading(false);
    }
};
    useEffect(() => {
        fetchTransactions();
    }, [page, pageSize, searchState, filters]);

    // --- 3. Payment Actions ---
    const handleSyncPayments = async () => {
        try {
            setTableLoading(true);
            const response = await syncPendingPaymentsService();
            if (response.data.success) {
                message.success(response.data.message || "Payment sync completed");
                fetchTransactions();
            }
        } catch (error) {
            message.error("Payment sync failed");
        } finally {
            setTableLoading(false);
        }
    };

    const handleRetryPayment = async (record) => {
        try {
            setTableLoading(true);
            const response = await retryPaymentService({ payment_id: record.payment_id || record.id });
            if (response?.data?.success) {
                message.success("Retry payment initiated");
                if (response.data.data?.payment_link) window.open(response.data.data.payment_link, "_blank");
                fetchTransactions();
            }
        } catch (error) {
            message.error("Retry failed");
        } finally {
            setTableLoading(false);
        }
    };

    const handleSyncIndividual = async (record) => {
        try {
            setTableLoading(true);
            const response = await syncPendingPaymentsService(record.transaction_reference_id);
            if (response.data.success) {
                message.success(`Updated: ${record.transaction_reference_id}`);
                fetchTransactions();
            }
        } catch (error) {
            message.error("Sync failed");
        } finally {
            setTableLoading(false);
        }
    };

    // --- 4. Table Columns (All preserved) ---
    const columns = [
        {
            title: "Student Name",
            dataIndex: "student_name",
            key: "student_name",
            fixed: screens?.md ? "left" : false,
            minWidth: "150px",
            ...GetColumnSearchProps("student_name", setSearchState, searchState),
            render: (text) => <p className="font-medium">{text}</p>,
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            minWidth: "100px",
            render: (text) => <b>₹{text}</b>,
        },
        {
    title: "Branch Amount",
    dataIndex: "branch_amount",
    key: "branch_amount",
    minWidth: "120px",
    render: (text) => <b>₹{text || 0}</b>,
},

{
    title: "Branch %",
    dataIndex: "branch_sharing_percentage",
    key: "branch_sharing_percentage",
    minWidth: "100px",
    render: (text) => <b>{text || 0}%</b>,
},
        {
            title: "Payment Mode",
            dataIndex: "payment_mode",
            key: "payment_mode",
            minWidth: "120px",
            ...GetColumnSearchProps("payment_mode", setSearchState, searchState),
            render: (text) => <span className="capitalize">{text}</span>,
        },
        {
            title: "Transaction ID",
            dataIndex: "transaction_reference_id",
            key: "transaction_reference_id",
            minWidth: "200px",
            ...GetColumnSearchProps("transaction_reference_id", setSearchState, searchState),
        },
        {
            title: "Date & Time",
            dataIndex: "date_time",
            key: "date_time",
            minWidth: "180px",
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 90,
            minWidth: "90px",
            ...GetColumnSearchProps("status", setSearchState, searchState),
            render: (status) => {
                const s = (status || "").toLowerCase();
                const color = s === "paid" || s === "verified" ? "green" : s === "pending" ? "orange" : s === "failed" || s === "rejected" ? "red" : "default";
                return <Tag color={color} className="capitalize m-0">{s}</Tag>;
            },
        },
        {
    title: "Action",
    key: "action",
    width: 140,
    align: "center",
    render: (_, record) => {

        const status = (record?.status || "").toLowerCase();
        const mode = (record?.payment_mode || "").toLowerCase();

        if (mode !== "online") return null;

        return (
            <div className="flex items-center justify-center gap-2">

                {/* RETRY PAYMENT */}
                {status === "failed" && (
                    <Tooltip title="Retry Payment">
                        <button
                            onClick={() => handleRetryPayment(record)}
                            className="
                                w-9 h-9
                                rounded-full
                                flex items-center justify-center
                                bg-red-50
                                text-red-500
                                border border-red-200
                                hover:bg-red-500
                                hover:text-white
                                hover:scale-105
                                transition-all duration-200
                                shadow-sm
                            "
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 12a9 9 0 1 1-3-6.7" />
                                <path d="M21 3v6h-6" />
                            </svg>
                        </button>
                    </Tooltip>
                )}

                {/* SYNC STATUS */}
                {status === "pending" && (
                    <Tooltip title="Sync Status">
                        <button
                            onClick={() => handleSyncIndividual(record)}
                            className="
                                w-9 h-9
                                rounded-full
                                flex items-center justify-center
                                bg-green-50
                                text-green-600
                                border border-green-200
                                hover:bg-green-500
                                hover:text-white
                                hover:scale-105
                                transition-all duration-200
                                shadow-sm
                            "
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 2v6h-6" />
                                <path d="M3 22v-6h6" />
                                <path d="M20 8A9 9 0 0 0 5 5l-2 3" />
                                <path d="M4 16a9 9 0 0 0 15 3l2-3" />
                            </svg>
                        </button>
                    </Tooltip>
                )}

            </div>
        );
    },
}
    ];

    return (
        <>
            {/* Header Section */}
            <div className="mx-6 flex items-center justify-between mb-3 mt-4">
                <h1 className="dark:text-yellow-500 text-black font-semibold text-lg">Transaction History</h1>
                <div className="flex gap-4 items-center">
                    {Object.keys(filters).length > 0 && (
                        <button onClick={handleResetFilter} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-md border text-sm">
                           <RxCross1 />
{
    paginationInfo?.data_count ||
    paginationInfo?.total ||
    0
}
Records Found
                        </button>
                    )}
                    <Tooltip title="Toggle Filters">
                        <button onClick={() => setIsSelected(!isSelected)} className="text-xl">
                            {isSelected ? <FaFilterCircleXmark /> : <FaFilter />}
                        </button>
                    </Tooltip>
                    <button
                        onClick={handleSyncPayments}
                        disabled={tableLoading}
                        className="px-3 py-1 rounded border shadow text-black bg-[#ffce00] hover:bg-orange-500 hover:text-black transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                        Sync All Pending
                    </button>

                </div>
            </div>

            {/* Filter Panel */}
            {isSelected && (
                <div className="mx-6 mb-4 p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                       <div className="relative">
<div>
    <label className="block text-xs mb-1 opacity-70">
        Student Name
    </label>

    <AutoComplete
        className="w-full"
        options={studentOptions}
        value={filterValue.student_name}
        onSelect={(value) => {
            setFilterValue((prev) => ({
                ...prev,
                student_name: value,
            }));
        }}
        onSearch={(value) => {
            setFilterValue((prev) => ({
                ...prev,
                student_name: value,
            }));
        }}
        onChange={(value) => {
            setFilterValue((prev) => ({
                ...prev,
                student_name: value,
            }));

            if (!value) {
                setStudentOptions([]);
            }
        }}
    >
        <input
            placeholder="Search student..."
            className="
                w-full
                border
                border-gray-300
                dark:border-gray-600
                rounded-md
                px-3
                h-9
                text-sm
                dark:bg-gray-900
                focus:outline-none
                focus:ring-2
                focus:ring-yellow-400
            "
        />
    </AutoComplete>

    {studentSearchLoading && (
        <p className="text-xs text-gray-500 mt-1">
            Searching...
        </p>
    )}
</div>

</div>

                        <div>
                            <label className="block text-xs mb-1 opacity-70">Status</label>
                            <Select className="w-full" placeholder="Status" value={filterValue.status} onChange={(val) => handleSelectChange(val, "status")} options={statusDropdown} />
                        </div>
                        <div>
                            <label className="block text-xs mb-1 opacity-70">Mode</label>
                            <Select className="w-full" placeholder="Mode" value={filterValue.payment_mode} onChange={(val) => handleSelectChange(val, "payment_mode")} allowClear options={[{ label: 'Online', value: 'online' }, { label: 'Offline', value: 'offline' }]} />
                        </div>
                        <div>
                            <label className="block text-xs mb-1 opacity-70">Date Range</label>

                            <DatePicker.RangePicker
                                className="w-full"
                                value={dateRange}
                                onChange={(dates) => {
                                    setDateRange(dates);

                                    setFilterValue((prev) => ({
                                        ...prev,
                                        date_range: dates,
                                    }));
                                }}
                                format="DD-MM-YYYY"
                                allowClear
                            />
                        </div>

                        <div className="flex items-end gap-2">
                            {/* Replaced bg-blue-600 with custom Yellow style */}
                            <button
                                onClick={handleApplyFilters}
                                className="px-4 py-2 rounded flex-1 text-sm font-semibold transition-all hover:opacity-80"
                                style={{ backgroundColor: '#ffce00', color: '#000000' }}
                            >
                                Apply
                            </button>
                            <button onClick={handleResetFilter} className="bg-gray-400 text-white px-4 py-2 rounded flex-1 text-sm font-medium hover:bg-gray-500">
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <TableWithPagination
                loading={tableLoading}
                pageSize={pageSize}
                setPageSize={setPageSize}
                tableData={transactionsData}
                rowHoverable={true}
                tableColumns={columns}
                paginationData={paginationInfo}
                paginationHandler={setPage}
            />
        </>
    );
};

export default TransactionsList;