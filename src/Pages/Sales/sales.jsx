import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { PAGESIZE } from "../../lib/Constants";
import TableWithPagination from "../../Components/CustomComponents/Table";
import { useSelector } from "react-redux";
import {
    getRegisteredUserExportService,
    getRegisteredUserService,
} from "../Registered Users/ApiService";
import { Button, DatePicker, Grid, Input, Space, Spin, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import {
    CustomSelectInput,
    InputWithIcon,
} from "../../Components/CustomComponents/InputWithIcon";
import dayjs from "dayjs";
import { getPackageDropdownService } from "../Package/ApiService";
import { TabTables } from "../../Components/CustomComponents/TabTables";
import { getProfileService } from "../Profile/ApiService";

const Sales = () => {
    const [loginUser, setLoginUser] = useState(null);
    const [tableLoading, setTableLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const [searchState, setSearchState] = useState({});
    const [pageSize, setPageSize] = useState(PAGESIZE);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [registeredUserData, setRegisteredUserData] = useState();
    const [page, setPage] = useState(1);
    const [data, setData] = useState({});
    const [isSelected, setIsSelected] = useState(false);
    const [filteredData, setFilteredData] = useState(false);
    const [filters, setFilters] = useState({});
    const [formData, setFormData] = useState({});
    const [dateRange, setDateRange] = useState([]);
    const [packageDropdown, setPackageDropdown] = useState([]);
    const [sampleFile, setSampleFile] = useState();
    const { RangePicker } = DatePicker;
    const dateFormat = "DD-MM-YYYY";
    const { useBreakPoint } = Grid;
    const screens = useBreakPoint;
    const rangePresets = [
        {
            label: "Today",
            value: [dayjs(), dayjs()],
        },
        {
            label: "Yesterday",
            value: [dayjs().subtract(1, "d"), dayjs().subtract(1, "d")],
        },
        {
            label: "Last 7 Days",
            value: [dayjs().subtract(7, "d"), dayjs()],
        },
        {
            label: "Last 14 Days",
            value: [dayjs().subtract(14, "d"), dayjs()],
        },
        {
            label: "Last 30 Days",
            value: [dayjs().subtract(30, "d"), dayjs()],
        },
        {
            label: "Last 60 Days",
            value: [dayjs().subtract(60, "d"), dayjs()],
        },
        {
            label: "Last 90 Days",
            value: [dayjs().subtract(90, "d"), dayjs()],
        },
    ];

    const modulePermission = useSelector(
        (state) => state.permissions.permissionsData
    );

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setPage(1);
        setTableLoading(true);

        setFilters((prev) => {
            const updated = {
                ...prev,
                [dataIndex]: selectedKeys[0] || null,
            };

            if (modulePermission?.user_group !== "admin") {
                updated.sales_person = loginUser;
            } else {
                delete updated.sales_person;
            }

            return updated;
        });
    };

    const handleReset = (clearFilters, dataIndex) => {
        clearFilters();
        setTableLoading(true);

        setFilters((prev) => {
            const updated = { ...prev };
            delete updated[dataIndex];
            return updated;
        });

        setPage(1);
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters, dataIndex)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1677ff" : undefined,
                }}
            />
        ),
        // onFilter: (value, record) =>
        //     record[dataIndex] === null ||
        //     (record[dataIndex] !== undefined &&
        //         record[dataIndex]
        //             .toString()
        //             .toLowerCase()
        //             .includes(value.toLowerCase())),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: "#ffc069",
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    let columns = [
        {
            title: "Email",
            fixed: "left",
            dataIndex: "email",
            key: "email",
            minWidth: "150px",
            ...getColumnSearchProps("email"),
            render: (email, record) => (
                <NavLink to={`/view-lead/${record.lead}`}>
                    <p className="font-medium hover:text-orange-500 cursor-pointer">
                        {email}
                    </p>
                </NavLink>
            ),
        },
        {
            title: "Name",
            dataIndex: "full_name",
            key: "full_name",
            minWidth: "180px",
            ...getColumnSearchProps("full_name"),
            render: (name, record) => (
                <NavLink to={`/view-lead/${record.lead}`}>
                    <p className="hover:text-orange-500 cursor-pointer">{name}</p>
                </NavLink>
            ),
        },
        {
            title: "Phone Number",
            dataIndex: "phone",
            key: "phone",
            minWidth: "150px",
            ...getColumnSearchProps("phone"),
            render: (phone, record) => (
                <NavLink to={`/view-lead/${record.lead}`}>
                    {phone === null ? (
                        "-"
                    ) : (
                        <p className="hover:text-orange-500 cursor-pointer">
                            {modulePermission.user_group === "admin" ||
                                modulePermission.user_group === "manager"
                                ? phone
                                : "xxxxxx" + phone.slice(-3)}
                        </p>
                    )}
                </NavLink>
            ),
        },
        {
            title: "Sales Person",
            dataIndex: "sales_person",
            key: "sales_person",
            minWidth: "120px",
            ...getColumnSearchProps("sales_person"),
            render: (text, record) => (
                <NavLink to={`/view-lead/${record.lead}`}>
                    <p className="hover:text-orange-500 cursor-pointer">{text}</p>
                </NavLink>
            ),
        },
        {
            title: "Registration Date",
            dataIndex: "date_joined",
            key: "date_joined",
            minWidth: "180px",
            sorter: (a, b) =>
                new Date(a.date_joined).getTime() -
                new Date(b.date_joined).getTime(),
            sortDirections: ["descend", "ascend"],
            render: (text, record) => (
                <NavLink to={`/view-lead/${record.lead}`}>
                    <p className="hover:text-orange-500 cursor-pointer">{text}</p>
                </NavLink>
            ),
        },
        {
            title: "Lead Source",
            dataIndex: "lead_source",
            key: "lead_source",
            minWidth: "180px",
            render: (text, record) => (
                <NavLink to={`/view-lead/${record.lead}`}>
                    <p className="hover:text-orange-500 cursor-pointer">{text}</p>
                </NavLink>
            ),
        },
        {
            title: "Packages",
            dataIndex: "packages",
            key: "packages",
            minWidth: "250px",
            render: (text, record) => (
                <NavLink to={`/view-lead/${record.lead}`}>
                    <p className="hover:text-orange-500 cursor-pointer">{text}</p>
                </NavLink>
            ),
        },
        {
            title: "Pending Amount",
            dataIndex: "pending_amount",
            key: "pending_amount",
            minWidth: "160px",
            sorter: (a, b) =>
                Number(a.pending_amount || 0) - Number(b.pending_amount || 0),
            sortDirections: ["descend", "ascend"],
            render: (text, record) => (
                <NavLink to={`/view-lead/${record.lead}`}>
                    <p className="hover:text-orange-500 cursor-pointer">
                        ₹ {text}
                    </p>
                </NavLink>
            ),
        },
    ];

    const fields = [
        {
            key: "email",
            label: "Email",
        },
        { key: "full_name", label: "Name" },
        {
            key: "phone",
            label: "Phone Number",
            type: "number",
        },
        {
            key: "sales_person",
            label: "Sales Person",
        },
        { key: "date_joined", label: "Registration Date", type: "dateRange" },
        // { key: "packages", label: "Packages", type: "dropdown" },
        // { key: "passport_number", label: "Passport Number" },
        // { key: "aps_number", label: "APS Number" },
    ];

    const handleInputChange = (e, field) => {
        let value = e?.target?.value !== undefined ? e.target.value : e;
        setFormData((prevState) => ({
            ...prevState,
            [field]: { ...prevState[field], value },
        }));
    };
    const handleFilters = () => {
        isSelected ? setIsSelected(false) : setIsSelected(true);
    };
    const handleAdvFilters = () => {
        setTableLoading(true);
        setFilteredData(true);
        setPage(1);

        let dataToSubmit = Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [key, value.value])
        );

        Object.assign(dataToSubmit, {
            start_date:
                dateRange?.length === 2 ? dateRange[0].format(dateFormat) : null,
            end_date:
                dateRange?.length === 2 ? dateRange[1].format(dateFormat) : null,
        });

        if (modulePermission?.user_group !== "admin") {
            dataToSubmit.sales_person = loginUser;
        } else {
            delete dataToSubmit.sales_person;
        }

        setFilters(dataToSubmit);
    };

    const handleResetFilter = () => {
        setDateRange([]);
        setFilteredData(false);
        setFormData({});
        setFilters({});
        setPage(1);
    };

    const getRegisteredStudentApi = () => {
        setTableLoading(true);

        const payload = {
            ...filters,
            current_page_number: page,
            count_per_page: pageSize,
        };

        if (modulePermission?.user_group !== "admin") {
            payload.sales_person = loginUser;
        } else {
            delete payload.sales_person;
        }

        getRegisteredUserService(payload)
            .then((response) => {
                setRegisteredUserData(response.data.data);
                setData(response.data);
            })
            .finally(() => {
                setTableLoading(false);
            });
    };


    // const exportFunction = () =>{
    //   getRegisteredUserExportService().then((response)=>{
    //     console.log(response.data.data);
    //   })
    // }
    useEffect(() => {
        getPackageDropdownService().then((response) => {
            setPackageDropdown(response.data.data);
        });
        getRegisteredUserExportService().then((response) => {
            console.log(response.data.data);
            setSampleFile(response.data.data);
        });
    }, []);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await getProfileService();
                setLoginUser(res?.data?.data?.email);
            } catch (err) {
                console.error("Profile Fetch Error:", err);
            }
        };

        getUser();
    }, []);

    useEffect(() => {
        if (modulePermission?.user_group !== "admin" && !loginUser) {
            return;
        }
        getRegisteredStudentApi();

    }, [page, pageSize, filters, loginUser, modulePermission?.user_group]);

    if (modulePermission?.user_group !== "admin" && !loginUser) {
        return (
            <div className="flex justify-center items-center h-[400px]">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            <div className="mx-6 flex items-center justify-between mb-3 pt-1">
                <div>
                    <h1 className="dark:text-yellow-500 text-black font-semibold flex items-center gap-2 justify-self-start text-lg rounded">
                        Sales
                    </h1>
                </div>
                <div className="flex gap-2">
                    <div className="text-sm text-black">
                        {filteredData && (
                            <PrimaryButton
                                title={
                                    <>
                                        <div className="flex items-center gap-1">
                                            <div className="pl-1">
                                                <Tooltip placement="top" title={"Reset filters"}>
                                                    <RxCross1 />
                                                </Tooltip>
                                            </div>
                                            <div>{data.data_count} records found</div>
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
                            {isSelected ? <FaFilterCircleXmark /> : <FaFilter />}
                        </button>
                    </Tooltip>
                    {/* <a href={sampleFile} download={sampleFile}>
                        <button
                            className={`${mode === "dark" ?
                                "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 bg-[#ffce00] text-white hover:bg-orange-500 dark:bg-meta-4 shadow border px-3 py-1 rounded`}
                        // onClick={exportFunction}
                        >
                            Export
                        </button>
                    </a> */}
                </div>
            </div>

            {/* filter start from here */}
            {isSelected && (
                <div className="mb-3 mx-6 rounded-lg border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <form>
                        <div className="grid md:grid-cols-4 gap-4">
                            {fields.map((field) => (
                                <div className="flex flex-col gap-1" key={field.key}>
                                    <label className="text-sm flex items-center gap-1">
                                        {field.label}
                                    </label>
                                    {field.type === "dateRange" ? (
                                        <RangePicker
                                            format={dateFormat}
                                            size="large"
                                            onChange={(v) => setDateRange(v)}
                                            presets={rangePresets}
                                            value={dateRange && [dateRange[0], dateRange[1]]}
                                        />
                                    ) : field.type === "dropdown" ? (
                                        <CustomSelectInput
                                            placeholder="Select Packages"
                                            value={formData.packages?.value || null}
                                            handler={(e) => handleInputChange(e, "packages")}
                                            options={packageDropdown.map((item) => ({
                                                value: {
                                                    id: item.id,
                                                    name: item.name,
                                                },
                                                label: item.name,
                                            }))}
                                        />
                                    ) : field.type === "number" ? (
                                        <InputWithIcon
                                            type="number"
                                            placeholder={`Please enter ${field.label}`}
                                            value={formData[field.key]?.value || ""}
                                            handler={(e) => handleInputChange(e, field.key)}
                                        />
                                    ) : field.key === "sales_person" &&
                                        modulePermission?.user_group !== "admin" ? (
                                        <InputWithIcon
                                            type="text"
                                            placeholder={`Please enter ${field.label}`}
                                            value={modulePermission?.email || ""}
                                            handler={() => { }}
                                            disabled
                                        />
                                    ) : (
                                        <InputWithIcon
                                            type="text"
                                            placeholder={`Please enter ${field.label}`}
                                            value={formData[field.key]?.value || ""}
                                            handler={(e) => handleInputChange(e, field.key)}
                                        />
                                    )}
                                </div>
                            ))}

                            <div className=" flex gap-1 items-center pt-5 ">
                                <PrimaryButton
                                    type={"primary"}
                                    title={"Search"}
                                    onClick={handleAdvFilters}
                                    className={"w-fit p-[18px] px-6 mx-1 text-black"}
                                />
                                <PrimaryButton
                                    title={"Reset"}
                                    className={"w-fit p-[18px] px-6 mx-2"}
                                    onClick={handleResetFilter}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            )}
            {/* filter close from here */}

            <TabTables
                loading={tableLoading}
                pageSize={pageSize}
                setPageSize={setPageSize}
                tableData={registeredUserData || []}
                rowHoverable={false}
                tableColumns={columns}
                paginationData={{
                    page: data?.page || page,
                    data_count: data?.data_count || 0,
                    current_page_data_count: data?.current_page_data_count || 0,
                }}
                paginationHandler={setPage}
                islead={modulePermission.lead_management === "edit" && "lead"}
                rowKey="username"
            />
        </>
    );
};

export default Sales;
