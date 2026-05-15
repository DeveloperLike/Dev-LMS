import { useEffect, useState } from "react";
import { PAGESIZE , baseurl} from "../../lib/Constants";
import { useSelector } from "react-redux";
import {
    Badge,
    Grid,
    Pagination,
    Tooltip,
    message,
    Table,
    Empty,
    Drawer,
    Input,
    Button,
    Select
} from "antd";
import { MdOutlineEdit } from "react-icons/md";
import { GetColumnSearchProps } from "../../Components/CustomComponents/TableColumnSearch";
import axios from "axios";

const LeadSource = () => {
    const [tableLoading, setTableLoading] = useState(false);
    const [leadSourceData, setLeadSourceData] = useState([]);
    const [searchState, setSearchState] = useState({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGESIZE);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [updatedGroup, setUpdatedGroup] = useState("");

    const handleEdit = (record) => {
        setSelectedRow(record);
        setUpdatedGroup(record.source_group);
        setDrawerOpen(true);
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.patch(
                `${baseurl}/api/v1/lead-management/lead-source/${selectedRow.id}`,
                {
                    source_group: updatedGroup,
                },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            message.success("Updated successfully");
            setDrawerOpen(false);
            getLeadSourceApi();
        } catch (error) {
            message.error("Update failed");
        }
    };

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const columns = [
        {
            title: "Lead Source",
            dataIndex: "name",
            key: "name",
            fixed: "left",
            ...GetColumnSearchProps("name", setSearchState, searchState),
        },
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            fixed: "left",
            ...GetColumnSearchProps("id", setSearchState, searchState),
        },
        {
            title: "Source Group",
            dataIndex: "source_group",
            key: "source_group",
            fixed: "left",
            ...GetColumnSearchProps("source_group", setSearchState, searchState),
        },
        {
            title: "Actions",
            dataIndex: "id",
            key: "actions",
            fixed: "right",
            render: (_, record) => (
                <Tooltip title="Edit Details">
                    <MdOutlineEdit
                        onClick={() => handleEdit(record)}
                        className="hover:text-orange-500 text-lg cursor-pointer"
                    />
                </Tooltip>
            ),
        },
    ];

    const getLeadSourceApi = async () => {
        try {
            setTableLoading(true);
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${baseurl}/api/v1/lead-management/lead-source-dropdown`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            const fullData = response.data?.data || [];

            const sorted = fullData.sort((a, b) =>
                a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
            );

            setLeadSourceData(sorted);
        } catch (error) {
            message.error("Failed to load lead sources");
        } finally {
            setTableLoading(false);
        }
    };

    useEffect(() => {
        getLeadSourceApi();
    }, []);

    const paginatedData = leadSourceData.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const sourceGroupOptions = [
        ...new Set(leadSourceData.map(item => item.source_group).filter(Boolean))
    ].map(group => ({
        label: group,
        value: group
    }));

    return (
        <>
            <div className="mx-6 flex items-center justify-between mb-3">
                <h1 className="dark:text-yellow-500 text-black font-semibold text-lg">
                    Lead Source
                </h1>
            </div>

            <div className="rounded-lg p-4 shadow-default bg-white dark:bg-boxdark mx-6">
                <Table
                    columns={columns}
                    dataSource={paginatedData}
                    pagination={false}
                    scroll={{ x: "max-content" }}
                    rowKey="id"
                    loading={tableLoading}
                    size="small"
                    locale={{
                        emptyText: <Empty description="No Lead Source data available" />
                    }}
                />

                <div className="flex justify-between items-center mt-3">
                    <Pagination
                        current={page}
                        pageSize={pageSize}
                        total={leadSourceData.length}
                        showSizeChanger
                        showQuickJumper
                        size="small"
                        onChange={(p, s) => {
                            setPage(p);
                            setPageSize(s);
                        }}
                    />

                    <span className="text-sm text-black dark:text-yellow-500">
                        {Math.min(page * pageSize, leadSourceData.length)} of {leadSourceData.length} records
                    </span>
                </div>
            </div>

            <Drawer
                title="Edit Lead Source"
                placement="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                width={400}
            >
                <div className="flex flex-col gap-4">

                    <div>
                        <label className="text-sm font-medium">
                            Lead Source
                        </label>
                        <Input value={selectedRow?.name} disabled />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Source Group <span className="text-red-500">*</span>
                        </label>
                        <Select
                            value={updatedGroup}
                            onChange={(val) => setUpdatedGroup(val)}
                            style={{ width: "100%" }}
                            options={sourceGroupOptions}
                            placeholder="Select Source Group"
                            showSearch
                            optionFilterProp="label"
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </div>

                    <Button
                        type="primary"
                        onClick={handleSave}
                        className="text-black"
                    >
                        Submit
                    </Button>

                </div>
            </Drawer>
        </>
    );
};

export default LeadSource;