import React, { useEffect, useState } from "react";
import { Grid, message } from "antd";
import axios from "axios";
import TableWithPagination from "../../Components/CustomComponents/Table";
import { PAGESIZE , baseurl } from "../../lib/Constants";
import { useSelector } from "react-redux";
import authenticatedAxiosInstance from "../../lib/AxiosInstance";

const LeadStatusAnalytics = () => {
    const screens = Grid.useBreakpoint();

    // const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [pageSize, setPageSize] = useState(PAGESIZE);
    const [page, setPage] = useState(1);

    const [tableData, setTableData] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);
    const [paginationData, setPaginationData] = useState({});

    const user = useSelector(
        (state) => state.profile?.profileData?.data
    );

    const username = user?.username;

    useEffect(() => {
        if (username) {
            fetchAnalytics();
        }
    }, [username]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);

            const payload = {
                skip: 0,
                limit: 100,
                username,
                start_date: "2023-01-01",
                end_date: "2026-12-31",
            };

            const res = await authenticatedAxiosInstance.post(
                `${baseurl}/api/v1/lead-management/actionabale-followup-leads`,
                payload,
                {
                    withCredentials: true,
                }
            );

            const records = res?.data?.records || [];
            console.log("BACKEND RECORDS:", records);

            if (!records.length) {
                setTableColumns([
                    { title: "Message", dataIndex: "message", key: "message" },
                ]);
                setTableData([
                    {
                        id: 1,
                        message: "No pending follow-ups found for this user.",
                    },
                ]);
                setPaginationData({
                    current_page: 1,
                    data_count: 1,
                    current_page_data_count: 1,
                });
                return;
            }

            buildAnalytics(records);
        } catch (err) {
            console.error(err);
            message.error("Failed to load Lead Status Analytics");
        } finally {
            setLoading(false);
        }
    };

    const buildAnalytics = (records) => {

        const userMap = {};
        const statusSet = new Set();

        records.forEach((item) => {
            const counsellor = item.full_name || "Unknown";
            const status = item.lead_status_name || "Unknown";

            statusSet.add(status);

            if (!userMap[counsellor]) {
                userMap[counsellor] = { name: counsellor };
            }

            userMap[counsellor][status] =
                (userMap[counsellor][status] || 0) + 1;
        });

        const statuses = Array.from(statusSet);

        const columns = [
            {
                title: "Students",
                dataIndex: "name",
                key: "name",
                fixed: screens?.md ? "left" : false,
                width: 220,
            },
            ...statuses.map((status) => ({
                title: status,
                dataIndex: status,
                key: status,
                align: "center",
                width: 140,
                render: (value) => value || 0,
            })),
        ];

        const rows = Object.values(userMap).map((row, index) => ({
            id: index,
            ...row,
        }));

        setTableColumns(columns);
        setTableData(rows);

        setPaginationData({
            current_page: 1,
            data_count: rows.length,
            current_page_data_count: rows.length,
        });
    };

    return (
        <>
            <div className="mx-6 mb-3">
                <h1 className="dark:text-yellow-500 font-semibold text-lg">
                    Lead Status Analytics
                </h1>
            </div>

            <TableWithPagination
                loading={tableLoading}
                pageSize={pageSize}
                setPageSize={setPageSize}
                tableData={tableData}
                tableColumns={tableColumns}
                paginationData={paginationData}
                paginationHandler={setPage}
                rowKey="id"
            />
        </>
    );
};

export default LeadStatusAnalytics;