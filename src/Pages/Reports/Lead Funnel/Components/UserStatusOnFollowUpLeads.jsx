import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getLeadCounsellorDropdownService } from "../../ApiService";
import dayjs from "dayjs";
import { Empty, Spin, Table, Pagination } from "antd";
import axios from "axios";
import { getFollowupTotalCountQuery, getFollowupLeadsQuery, getFollowupSummaryQuery } from "../Queries/LeadFunnelQueries";
import { YgApi } from "../../../../lib/Constants";

const UserStatusOnFollowUpLeads = ({ counsellor = [], branch = [], role = [] }) => {

    const BASE_URL = YgApi;
    const [pageSize, setPageSize] = useState(10);
    const [followUpCurrentPage, setFollowUpCurrentPage] = useState(1);
    const [followUploading, setFollowUpLoading] = useState(false);
    const [followupStatusKeys, setFollowupStatusKeys] = useState([]);
    const [followupLeadsData, setFollowupLeadsData] = useState([]);
    const [totalFollowupLeadsCount, setTotalFollowupLeadsCount] = useState(0);
    const [allowedUsernames, setAllowedUsernames] = useState([]);
    const [globalSummary, setGlobalSummary] = useState({});

    const columnTotals = useMemo(() => {
        const totals = {};

        followupLeadsData.forEach(row => {
            Object.entries(row.status_summary || {}).forEach(([key, val]) => {
                totals[key] = (totals[key] || 0) + Number(val || 0);
            });
        });

        return totals;
    }, [followupLeadsData]);

    const sortedStatusKeys = useMemo(() => {
        return [...followupStatusKeys].sort(
            (a, b) => (columnTotals[b] || 0) - (columnTotals[a] || 0)
        );
    }, [followupStatusKeys, columnTotals]);

    const statusColumns = useMemo(() => {
        return sortedStatusKeys.map(status => ({
            title: status,
            align: "center",
            render: (_, record) => record.status_summary?.[status] ?? 0
        }));
    }, [sortedStatusKeys]);

    const followupLeadsColumns = useMemo(() => [
        {
            title: "Name",
            dataIndex: "user_name",
            key: "user_name",
            fixed: "left",
            width: 200
        },
        {
            title: "Total Over Due",
            key: "total_leads",
            align: "center",
            sorter: true,
            defaultSortOrder: "descend",
            render: (_, record) => {
                return Object.values(record.status_summary || {}).reduce(
                    (sum, val) => sum + val,
                    0
                );
            }
        },
        ...statusColumns
    ], [statusColumns]);

    const fetchCrmQuery = useCallback(async (query) => {
        try {
            const { data } = await axios.post(
                `${BASE_URL}/mondayMeetings/get-crm-records`,
                { query }
            );
            return data || [];
        } catch (err) {
            console.error("CRM Query Error", err);
            return [];
        }
    }, []);

    const fetchCounsellors = async () => {
        const res = await getLeadCounsellorDropdownService();
        const data = res?.data?.data || [];
        setAllowedUsernames(data);
    };

    useEffect(() => {
        fetchCounsellors();
    }, []);

    useEffect(() => {
        if (allowedUsernames.length > 0) {
            fetchLeadsFollowupData(followUpCurrentPage);
        }
    }, [followUpCurrentPage, pageSize, allowedUsernames, counsellor, branch, role]);

    const fetchLeadsFollowupData = useCallback(async (page = 1, where = "") => {

        setFollowUpLoading(true);

        const offset = (page - 1) * pageSize;

        let branchCondition = "";

        if (Array.isArray(branch) && branch.length > 0) {
            const values = (branch || [])
                .filter(Boolean)
                .map(b => `'${b}'`)
                .join(",");

            branchCondition = `
            AND s.assign_to_id IN (
                SELECT user_id FROM user_management_user_branch
                WHERE branch_id IN (${values})
            )
            `;
        }

        let totalBranchCondition = "";

        if (Array.isArray(branch) && branch.length > 0) {
            const values = branch.map(b => `'${b}'`).join(",");

            totalBranchCondition = `
            AND lml.assign_to_id IN (
                SELECT user_id FROM user_management_user_branch
                WHERE branch_id IN (${values})
            )
            `;
        }

        let usersList = [];

        if (counsellor.length > 0) {
            usersList = counsellor;
        }

        else if (role.length > 0) {
            usersList = allowedUsernames
                .filter(item => role.includes(item.role_id))
                .map(item => item.username);
        }

        else {
            usersList = allowedUsernames.map(item => item.username);
        }

        const users = usersList.map(u => `'${u}'`).join(",");

        const totalQuery = getFollowupTotalCountQuery({ users, totalBranchCondition });

        const countQuery = getFollowupLeadsQuery({ users, branchCondition, where, offset, pageSize });

        const summaryQuery = getFollowupSummaryQuery({ users, totalBranchCondition });

        const [count, rows, summary] = await Promise.all([
            fetchCrmQuery(totalQuery),
            fetchCrmQuery(countQuery),
            fetchCrmQuery(summaryQuery)
        ]);

        const statusSet = new Set();

        rows?.forEach(item => {
            Object.keys(item.status_summary || {}).forEach(status => {
                statusSet.add(status);
            });
        });

        setFollowupStatusKeys([...statusSet]);
        setFollowupLeadsData(rows || []);
        setTotalFollowupLeadsCount(Number(count?.[0]?.total || 0));

        setGlobalSummary(summary?.[0]?.status_summary || {});

        setFollowUpLoading(false);

    }, [fetchCrmQuery, allowedUsernames, counsellor, branch, role, pageSize]);

    const sortedFollowups = followupLeadsData;


    return (
        <div className="rounded-lg p-4 shadow-default bg-white dark:bg-boxdark transition-colors duration-200">

            {allowedUsernames.length > 0 && (

                <div className="card border-0 bg-light">

                    <div className="card-body">

                        <Spin spinning={followUploading}>

                            <div className="table-responsive overflow-auto" style={{ maxHeight: '60vh' }}>

                                <Table
                                    rowKey={(record) => record.user_id || record.user_name}
                                    columns={followupLeadsColumns}
                                    dataSource={sortedFollowups}
                                    pagination={false}
                                    scroll={{ x: "max-content" }}
                                    locale={{ emptyText: <Empty description="No over due Follow-up available" /> }}
                                    className="yellow-header-table mb-0"
                                    size="small"

                                    summary={() => {
                                        if (!globalSummary) return null;

                                        return (
                                            <Table.Summary fixed="bottom">
                                                <Table.Summary.Row>

                                                    <Table.Summary.Cell index={0}>
                                                        <b>Grand Total</b>
                                                    </Table.Summary.Cell>

                                                    <Table.Summary.Cell index={1} align="center">
                                                        <b>
                                                            {Object.values(globalSummary || {}).reduce(
                                                                (sum, val) => sum + val,
                                                                0
                                                            )}
                                                        </b>
                                                    </Table.Summary.Cell>

                                                    {sortedStatusKeys.map((status, i) => (
                                                        <Table.Summary.Cell
                                                            key={status}
                                                            index={i + 2}
                                                            align="center"
                                                        >
                                                            <b>{globalSummary?.[status] || 0}</b>
                                                        </Table.Summary.Cell>
                                                    ))}

                                                </Table.Summary.Row>
                                            </Table.Summary>
                                        );
                                    }}
                                />

                            </div>

                        </Spin>

                    </div>

                    {totalFollowupLeadsCount > 0 && (

                        <div className="flex justify-between items-center mt-4">

                            <Pagination
                                current={followUpCurrentPage}
                                total={totalFollowupLeadsCount}
                                showQuickJumper
                                size="small"
                                showSizeChanger
                                pageSize={pageSize}
                                onChange={(page, size) => {
                                    if (size !== pageSize) {
                                        setFollowUpCurrentPage(1);
                                    } else {
                                        setFollowUpCurrentPage(page);
                                    }
                                    setPageSize(size);
                                }}
                            />

                            <div className="text-sm text-black dark:text-yellow-500">

                                <small className="dark:text-yellow-500 text-black text-sm">
                                    {Math.min(followUpCurrentPage * pageSize, totalFollowupLeadsCount)} of {totalFollowupLeadsCount} records
                                </small>

                            </div>

                        </div>

                    )}

                </div>

            )}

        </div>
    );
};

export default UserStatusOnFollowUpLeads;