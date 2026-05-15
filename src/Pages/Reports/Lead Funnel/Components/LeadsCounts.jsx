import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Empty, Pagination, Spin, Table } from "antd";
import { useSelector } from "react-redux";
import { getLeadCounsellorDropdownService } from "../../ApiService";
import { getLeadsStatusCountQuery } from "../Queries/LeadFunnelQueries";
import { AlignCenter } from "lucide-react";
import { YgApi } from "../../../../lib/Constants";


function LeadsCounts({ startDate, endDate, counsellor, leadSource, sourceGroup, branch, role }) {

    const BASE_URL = YgApi;

    const [loading, setLoading] = useState(false);
    const [statusWiseLeads, setStatusWiseLeads] = useState([]);
    const [allowedUsernames, setAllowedUsernames] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const leadModulePermission = useSelector(
        (state) => state.permissions.permissionsData
    );

    const isAdmin = leadModulePermission?.user_group === "admin";
    const loginUser = leadModulePermission?.username;

    const fetchCounsellors = async () => {
        try {
            const res = await getLeadCounsellorDropdownService();
            const usernames = (res?.data?.data || []).map(item => item.username);
            setAllowedUsernames(usernames);
        } catch (err) {
            console.error("Counsellor fetch error", err);
        }
    };

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

    const fetchTotalLeadsStatusCount = useCallback(async () => {

        let branchCondition = "";
        if (branch?.length > 0) {
            const values = branch.map(b => `'${b}'`).join(",");
            branchCondition = `
             AND lml_statuslog.updated_by_id IN (
                 SELECT user_id 
                 FROM user_management_user_branch
                 WHERE branch_id IN (${values})
             )
         `;
        }

        let dateCondition = "";
        if (startDate && endDate) {
            dateCondition = `
             AND lml_statuslog.created_at::date 
             BETWEEN '${startDate}' AND '${endDate}'
         `;
        }

        let counsellorCondition = "";
        if (counsellor?.length > 0) {
            const list = counsellor.map(c => `'${c}'`).join(",");
            counsellorCondition = `
             AND lml_statuslog.updated_by_id IN (${list})
         `;
        }

        let leadSourceCondition = "";
        if (leadSource?.length > 0) {
            const list = leadSource.map(s => `'${s}'`).join(",");
            leadSourceCondition = `
             AND lml.lead_source_id IN (${list})
         `;
        }

        let sourceGroupCondition = "";
        if (sourceGroup?.length > 0) {
            const list = sourceGroup.map(g => `'${g}'`).join(",");
            sourceGroupCondition = `
             AND lmls.source_group IN (${list})
         `;
        }

        let userCondition = "";

        if (counsellor?.length > 0) {
            const values = counsellor.map(u => `'${u}'`).join(",");
            userCondition = `
             AND lml_statuslog.updated_by_id IN (${values})
         `;
        }
        else if (role?.length > 0) {
            const values = role.map(r => `'${r}'`).join(",");
            userCondition = `
             AND lml_statuslog.updated_by_id IN (
                 SELECT username 
                 FROM user_management_user
                 WHERE role_id IN (${values})
             )
         `;
        }
        else if (allowedUsernames.length > 0) {
            const values = allowedUsernames.map(u => `'${u}'`).join(",");
            userCondition = `
             AND lml_statuslog.updated_by_id IN (${values})
         `;
        }
        else if (!isAdmin && loginUser) {
            userCondition = `
             AND lml_statuslog.updated_by_id = '${loginUser}'
         `;
        }

        const query = getLeadsStatusCountQuery({
            startDate,
            endDate,
            counsellorCondition,
            leadSourceCondition,
            sourceGroupCondition,
            userCondition,
            branchCondition
        });

        const result = await fetchCrmQuery(query);

        setStatusWiseLeads(result || []);

    }, [
        fetchCrmQuery,
        startDate,
        endDate,
        counsellor,
        leadSource,
        sourceGroup,
        branch,
        role,
        allowedUsernames,
        isAdmin,
        loginUser
    ]);

    useEffect(() => {
        fetchCounsellors();
    }, []);

    useEffect(() => {
        if (allowedUsernames.length > 0) {
            fetchTotalLeadsStatusCount();
        }
    }, [allowedUsernames, fetchTotalLeadsStatusCount]);

    const paginatedData = useMemo(
        () => statusWiseLeads.slice((page - 1) * pageSize, page * pageSize),
        [statusWiseLeads, page, pageSize]
    );

    const baseColumns = [
        { title: "Total Lead Updated", dataIndex: "total_leads", align: "center" },
        { title: "Counselled", dataIndex: "counselled", align: "center" },
        { title: "VC Scheduled", dataIndex: "vc_schedule", align: "center" },
        { title: "VC Re-Scheduled", dataIndex: "vc_reschedule", align: "center" },
        { title: "VC Conducted", dataIndex: "vc_condcted", align: "center" },
        { title: "Visit Schedule", dataIndex: "visit_schedule", align: "center" },
        { title: "Visit Re-Schedule", dataIndex: "visit_reschedule", align: "center" },
        { title: "Visit Done", dataIndex: "visit_done", align: "center" },
        { title: "Future Lead", dataIndex: "future_leads", align: "center" },
        { title: "Registered", dataIndex: "registered", align: "center" },
    ];

    const columnTotals = useMemo(() => {
        if (!statusWiseLeads.length) return {};

        const totals = {};

        baseColumns.forEach(({ dataIndex }) => {
            totals[dataIndex] = statusWiseLeads.reduce((sum, row) => {
                const value = Number(row[dataIndex]);
                return sum + (isNaN(value) ? 0 : value);
            }, 0);
        });

        return totals;
    }, [statusWiseLeads]);


    const sortedColumns = useMemo(() => {
        const others = baseColumns.filter(c => c.dataIndex !== "total_leads");

        const sorted = [...others].sort(
            (a, b) => (columnTotals[b.dataIndex] || 0) - (columnTotals[a.dataIndex] || 0)
        );

        return [
            baseColumns.find(c => c.dataIndex === "total_leads"),
            ...sorted
        ];
    }, [columnTotals]);

    const columns = [
        {
            title: "Counsellor",
            dataIndex: "user_name",
            fixed: "left",
            width: 200
        },
        ...sortedColumns
    ];

    const totalRow = useMemo(() => {
        if (!statusWiseLeads.length) return null;

        const total = { user_name: "Grand Total" };

        const keys = baseColumns.map(col => col.dataIndex);

        keys.forEach(key => {
            total[key] = statusWiseLeads.reduce(
                (sum, row) => sum + Number(row[key] || 0),
                0
            );
        });

        return total;
    }, [statusWiseLeads]);

    return (
        <div className="rounded-lg p-4 shadow-default bg-white dark:bg-boxdark transition-colors duration-200">

            <div className="card border-0 bg-light">

                <div className="card-body">
                    <Spin spinning={loading}>

                        <Table
                            size="small"
                            rowKey="user_name"
                            columns={columns}
                            dataSource={paginatedData}
                            pagination={false}
                            scroll={{ x: "max-content" }}
                            locale={{
                                emptyText: <Empty description="No Leads Counts data available" />
                            }}
                            summary={() => {
                                if (!totalRow) return null;

                                return (
                                    <Table.Summary fixed="bottom">
                                        <Table.Summary.Row>

                                            {columns.map((col, index) => {

                                                if (col.dataIndex === "user_name") {
                                                    return (
                                                        <Table.Summary.Cell key={index} index={index}>
                                                            <b>Grand Total</b>
                                                        </Table.Summary.Cell>
                                                    );
                                                }

                                                return (
                                                    <Table.Summary.Cell key={index} index={index} align="center">
                                                        <b>{totalRow[col.dataIndex] || 0}</b>
                                                    </Table.Summary.Cell>
                                                );
                                            })}

                                        </Table.Summary.Row>
                                    </Table.Summary>
                                );
                            }}
                        />

                        <div className="flex justify-between mt-3">
                            <Pagination
                                current={page}
                                pageSize={pageSize}
                                total={statusWiseLeads.length}
                                showSizeChanger
                                showQuickJumper
                                size="small"
                                onChange={(p, s) => {
                                    setPage(p);
                                    setPageSize(s);
                                }}
                            />
                            <div className="text-sm dark:text-yellow-500 text-black">
                                {Math.min(page * pageSize, statusWiseLeads.length)} of {statusWiseLeads.length} records
                            </div>
                        </div>

                    </Spin>
                </div>
            </div>
        </div>
    );
}

export default LeadsCounts;