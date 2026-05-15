import axios from "axios";
import { Empty, Pagination, Spin, Table } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { buildCondition } from "../../hook";
import { getProfileService } from "../../../Profile/ApiService";
import { useSelector } from "react-redux";
import { getLeadCounsellorDropdownService } from "../../ApiService";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getDistributedSourceLeadsQuery } from "../Queries/LeadFunnelQueries";
import { useReversePercentageColor } from "../../hook";
import { YgApi } from "../../../../lib/Constants";


dayjs.extend(utc);
dayjs.extend(timezone);

function DistributedSourceLeads({ startDate, endDate, counsellor, sourceGroup, leadSource, branch, role }) {

    const BASE_URL = YgApi;

    const [sourceLeadLoading, setSourceLeadLoading] = useState(false);
    const [sourceLeads, setSourceLeads] = useState([]);
    const [loginUser, setLoginUser] = useState(null);
    const [allowedUsernames, setAllowedUsernames] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { renderPercent } = useReversePercentageColor();

    const paginatedData = useMemo(() => {
        return sourceLeads.slice((page - 1) * pageSize, page * pageSize);
    }, [sourceLeads, page, pageSize]);

    const fetchCounsellors = async () => {

        try {

            const res = await getLeadCounsellorDropdownService();

            const usernames = (res?.data?.data || []).map(
                item => item.username
            );

            setAllowedUsernames(usernames);

        } catch (err) {

            console.error("Counsellor fetch error", err);

        }

    };

    /* ---------------------- FETCH CRM QUERY ---------------------- */

    const fetchCrmQuery = useCallback(async (query) => {
        try {
            const { data } = await axios.post(
                `${BASE_URL}/mondayMeetings/get-crm-records`,
                { query }
            );
            return data || [];
        } catch (err) {
            console.error("CRM Query Error:", err);
            return [];
        }
    }, []);

    /* ---------------------- TABLE COLUMNS ---------------------- */

    const sourceLeadsColumns = useMemo(() => [
        {
            title: "Source Group",
            dataIndex: "source_group",
            render: (text, record) => record.isTotal ? <b>{text}</b> : text,
            onCell: (record) => ({
                colSpan: record.isTotal ? 2 : 1,
            }),
        },
        {
            title: "Lead Source",
            dataIndex: "lead_source_id",
            render: (text, record) => record.isTotal ? null : text,
            onCell: (record) => ({
                colSpan: record.isTotal ? 0 : 1,
            }),
        },
        { title: "Total Leads", align: "center", dataIndex: "totalleads" },
        { title: "Junk", align: "center", dataIndex: "junk" },

        {
            title: "Junk %",
            align: "center",
            render: (_, record) => {
                const total = Number(record.totalleads || 0);
                const junk = Number(record.junk || 0);
                const percent = total ? (junk / total) * 100 : 0;

                return renderPercent(percent);
            }
        },

        { title: "Marketing Junk", align: "center", dataIndex: "marketing_junk" },

        {
            title: "Marketing Junk %",
            align: "center",
            render: (_, record) => {
                const junk = Number(record.junk || 0);
                const marketing = Number(record.marketing_junk || 0);
                const percent = junk ? (marketing / junk) * 100 : 0;

                return renderPercent(percent);
            }
        },

        { title: "Same day", align: "center", dataIndex: "junk_one_day" },
        { title: "2 to 5", align: "center", dataIndex: "diff_2_to_5_days" },
        { title: "5 to 7", align: "center", dataIndex: "diff_5_to_7_days" },
        { title: "7+", align: "center", dataIndex: "more_7days" },
        { title: "DNP", align: "center", dataIndex: "dnp" },

        {
            title: "DNP %",
            align: "center",
            render: (_, record) => {
                const total = Number(record.totalleads || 0);
                const dnp = Number(record.dnp || 0);
                const percent = total ? (dnp / total) * 100 : 0;

                return renderPercent(percent);
            }
        },

        { title: "DNP 0-3", align: "center", dataIndex: "dnp_0_3" },
        { title: "DNP 4+", align: "center", dataIndex: "dnp_4_plus" }

    ], [renderPercent]);

    const leadModulePermission = useSelector(
        (state) => state.permissions.permissionsData
    );

    const isAdmin =
        leadModulePermission?.user_group === "admin";

    /* ---------------------- FETCH DISTRIBUTED SOURCE DATA ---------------------- */

    const fetchDistributedSourceCount = useCallback(async (where = "") => {

        if (!loginUser) return;

        setSourceLeadLoading(true);

        try {

            let leadSourceCondition = "";
            let sourceGroupCondition = "";

            let branchCondition = "";

            if (branch?.length > 0) {
                const values = branch.map(b => `'${b}'`).join(",");

                branchCondition = `
               AND lml.assign_to_id IN (
                   SELECT user_id FROM user_management_user_branch
                   WHERE branch_id IN (${values})
               )
               `;
            }

            if (leadSource?.length > 0) {
                const condition = buildCondition(
                    "bl.lead_source_id",
                    leadSource,
                    false
                );
                leadSourceCondition = `AND ${condition}`;
            }

            if (sourceGroup?.length > 0) {
                const groupCondition = buildCondition(
                    "lmls.source_group",
                    sourceGroup,
                    false
                );
                sourceGroupCondition = `AND ${groupCondition}`;
            }

            const startUTC = startDate
                ? dayjs(startDate)
                    .tz("Asia/Kolkata")
                    .startOf("day")
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss")
                : null;

            const endUTC = endDate
                ? dayjs(endDate)
                    .tz("Asia/Kolkata")
                    .endOf("day")
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss")
                : null;

            const datetimeCondition =
                startUTC && endUTC
                    ? `AND lml.created_at BETWEEN '${startUTC}' AND '${endUTC}'`
                    : "";

            let userCondition = "";

            if (counsellor?.length > 0) {
                const values = counsellor.map(u => `'${u}'`).join(",");
                userCondition = `AND lml.assign_to_id IN (${values})`;
            }

            else if (role?.length > 0) {
                const values = role.map(r => `'${r}'`).join(",");
                userCondition = `
                  AND lml.assign_to_id IN (
                      SELECT username 
                      FROM user_management_user
                      WHERE role_id IN (${values})
                  )
              `;
            }

            else if (allowedUsernames.length > 0) {
                const values = allowedUsernames.map(u => `'${u}'`).join(",");
                userCondition = `AND lml.assign_to_id IN (${values})`;
            }

            else if (!isAdmin && loginUser) {
                userCondition = `AND lml.assign_to_id = '${loginUser}'`;
            }
            /* ---------------------- Query ---------------------- */
            const query = getDistributedSourceLeadsQuery({
                startUTC,
                endUTC,
                userCondition,
                branchCondition,
                sourceGroupCondition,
                leadSourceCondition
            });

            const result = await fetchCrmQuery(query);

            setSourceLeads(
                Array.isArray(result) ? result :
                    Array.isArray(result?.data) ? result.data :
                        []
            );

        } catch (err) {

            console.error("Distributed Source Leads Error:", err);

        } finally {

            setSourceLeadLoading(false);

        }

    }, [fetchCrmQuery, startDate, endDate, leadSource, sourceGroup, branch, role, loginUser, counsellor, allowedUsernames, isAdmin]);

    /* ---------------------- GET LOGIN USER ---------------------- */

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await getProfileService();
                setLoginUser(res?.data?.data?.username || null);
            } catch (err) {
                console.error("Profile Fetch Error:", err);
            }
        };

        getUser();
    }, []);

    /* ---------------------- FETCH DATA ---------------------- */

    useEffect(() => {
        if (loginUser && allowedUsernames.length > 0) {
            fetchDistributedSourceCount();
        }
    }, [
        loginUser,
        startDate,
        endDate,
        counsellor,
        leadSource,
        sourceGroup,
        branch,
        role,
        fetchDistributedSourceCount
    ]);

    const sortedData = useMemo(() => {
        const groupTotals = {};

        sourceLeads.forEach((item) => {
            const group = item.source_group || "Others";
            groupTotals[group] =
                (groupTotals[group] || 0) + Number(item.totalleads || 0);
        });

        const sortedGroups = Object.keys(groupTotals).sort(
            (a, b) => groupTotals[b] - groupTotals[a]
        );

        const result = [];

        sortedGroups.forEach((group) => {
            const rows = sourceLeads
                .filter((item) => (item.source_group || "Others") === group)
                .sort((a, b) => b.totalleads - a.totalleads);

            result.push(...rows);
        });

        return result;
    }, [sourceLeads]);

    const paginatedBase = useMemo(() => {
        return sortedData.slice(
            (page - 1) * pageSize,
            page * pageSize
        );
    }, [sortedData, page, pageSize]);

    const groupedData = useMemo(() => {
        const map = {};
        const result = [];

        paginatedBase.forEach((item) => {
            const key = item.source_group || "Others";

            if (!map[key]) {
                map[key] = {
                    rows: [],
                };
            }

            map[key].rows.push(item);
        });

        Object.keys(map).forEach((group) => {
            const rows = map[group].rows;

            rows.forEach((row) => {
                result.push({
                    ...row,
                    isTotal: false,
                });
            });

            const totalRow = rows.reduce((acc, curr) => {
                Object.keys(curr).forEach((key) => {
                    const value = Number(curr[key]);

                    if (!isNaN(value)) {
                        acc[key] = (acc[key] || 0) + value;
                    }
                });
                return acc;
            }, {});

            result.push({
                ...totalRow,
                source_group: `${group} Total`,
                lead_source_id: "",
                isTotal: true,
            });
        });

        return result;
    }, [paginatedBase]);

    const totals = useMemo(() => {
        const totalObj = {};

        sourceLeadsColumns.forEach(col => {
            if (!["source_group", "lead_source_id"].includes(col.dataIndex)) {
                totalObj[col.dataIndex] = sourceLeads.reduce(
                    (sum, row) => sum + Number(row[col.dataIndex] || 0),
                    0
                );
            }
        });

        return totalObj;
    }, [sourceLeads, sourceLeadsColumns]);

    useEffect(() => {

        fetchCounsellors();

    }, []);
    /* ---------------------- UI ---------------------- */

    return (
        <div className="rounded-lg p-4 shadow-default bg-white dark:bg-boxdark transition-colors duration-200">

            <div className="card border-0 bg-light">

                <div className="card-body">

                    <Spin spinning={sourceLeadLoading}>

                        <Table
                            rowKey={(record) => `${record.source_group}-${record.lead_source_id}`}
                            columns={sourceLeadsColumns}
                            dataSource={groupedData}
                            rowClassName={(record) => (record.isTotal ? "total-row" : "")}
                            scroll={{ x: "max-content" }}
                            pagination={false}
                            locale={{
                                emptyText: (
                                    <Empty description="No source leads data available" />
                                ),
                            }}
                            className="mb-0"
                            size="small"
                            summary={() => (
                                <Table.Summary fixed="bottom">
                                    <Table.Summary.Row>

                                        {sourceLeadsColumns.map((col, index) => {

                                            if (col.dataIndex === "source_group") {
                                                return (
                                                    <Table.Summary.Cell key="grand" index={index} colSpan={2}>
                                                        <b>Grand Total</b>
                                                    </Table.Summary.Cell>
                                                );
                                            }

                                            if (col.dataIndex === "lead_source_id") {
                                                return <Table.Summary.Cell key="empty" index={index} colSpan={0} />;
                                            }

                                            let value = totals[col.dataIndex] || 0;

                                            if (col.title === "Junk %") {
                                                const total = Number(totals.totalleads || 0);
                                                const junk = Number(totals.junk || 0);
                                                const percent = total ? (junk / total) * 100 : 0;

                                                return (
                                                    <Table.Summary.Cell key={index} index={index} align="center">
                                                        {renderPercent(percent)}
                                                    </Table.Summary.Cell>
                                                );
                                            }

                                            if (col.title === "Marketing Junk %") {
                                                const junk = Number(totals.junk || 0);
                                                const marketing = Number(totals.marketing_junk || 0);
                                                const percent = junk ? (marketing / junk) * 100 : 0;

                                                return (
                                                    <Table.Summary.Cell key={index} index={index} align="center">
                                                        {renderPercent(percent)}
                                                    </Table.Summary.Cell>
                                                );
                                            }

                                            if (col.title === "DNP %") {
                                                const total = Number(totals.totalleads || 0);
                                                const dnp = Number(totals.dnp || 0);
                                                const percent = total ? (dnp / total) * 100 : 0;

                                                return (
                                                    <Table.Summary.Cell key={index} index={index} align="center">
                                                        {renderPercent(percent)}
                                                    </Table.Summary.Cell>
                                                );
                                            }

                                            return (
                                                <Table.Summary.Cell
                                                    key={index}
                                                    index={index}
                                                    align={col.align || "center"}
                                                >
                                                    <b>{value}</b>
                                                </Table.Summary.Cell>
                                            );

                                        })}

                                    </Table.Summary.Row>
                                </Table.Summary>
                            )}
                        />
                        <div className="flex justify-between items-center mt-4">

                            <Pagination
                                current={page}
                                pageSize={pageSize}
                                total={sortedData.length}
                                showSizeChanger
                                showQuickJumper
                                size="small"
                                onChange={(p, s) => {
                                    setPage(p);
                                    setPageSize(s);
                                }}
                            />

                            <div className="text-sm dark:text-yellow-500 text-black">
                                {Math.min(page * pageSize, sortedData.length)} of {sortedData.length} records
                            </div>

                        </div>

                    </Spin>

                </div>

            </div>
        </div>
    );
}

export default DistributedSourceLeads;