import axios from "axios";
import { Empty, Spin, Table, Pagination, message } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { buildCondition } from "../../hook";
import { getProfileService } from "../../../Profile/ApiService";
import { useSelector } from "react-redux";
import { getLeadCounsellorDropdownService } from "../../ApiService";
import { useLeadConversion } from "../../hook";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
    getCombinedSourceLeadQuery,
    getRegDateCountsQuery
} from "../Queries/MarketingPerfomanceQueries";

import { YgApi } from "../../../../lib/Constants";

dayjs.extend(utc);
dayjs.extend(timezone);

const BASE_URL = YgApi;

const calcPercent = (num, den) => {
    if (!num || !den) return 0;
    const value = (num / den) * 100;
    return isFinite(value) ? value : 0;
};

function SourceLeadPerformance({
    startDate,
    endDate,
    counsellor,
    sourceGroup,
    leadSource,
    branch,
    role,
    onDataLoad
}) {

    const { getMqlColor, getSqlColor } = useLeadConversion();

    const permissions = useSelector((state) => state.permissions.permissionsData);
    const isAdmin = permissions?.user_group === "admin";

    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [loginUser, setLoginUser] = useState(null);
    const [allowedUsers, setAllowedUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [grandTotal, setGrandTotal] = useState({});
    const [subtotals, setSubtotals] = useState([]);

    const startUTC = startDate
        ? dayjs(startDate).tz("Asia/Kolkata").startOf("day").utc().format("YYYY-MM-DD HH:mm:ss")
        : dayjs().tz("Asia/Kolkata").startOf("day").utc().format("YYYY-MM-DD HH:mm:ss");

    const endUTC = endDate
        ? dayjs(endDate).tz("Asia/Kolkata").endOf("day").utc().format("YYYY-MM-DD HH:mm:ss")
        : dayjs().tz("Asia/Kolkata").endOf("day").utc().format("YYYY-MM-DD HH:mm:ss");

    const regStartDate = startDate
        ? dayjs(startDate)
            .tz("Asia/Kolkata")
            .startOf("day")
            .format("YYYY-MM-DD")
        : dayjs()
            .tz("Asia/Kolkata")
            .startOf("day")
            .format("YYYY-MM-DD");

    const regEndDate = endDate
        ? dayjs(endDate)
            .tz("Asia/Kolkata")
            .endOf("day")
            .format("YYYY-MM-DD")
        : dayjs()
            .tz("Asia/Kolkata")
            .endOf("day")
            .format("YYYY-MM-DD");

    const fetchCrmQuery = async (query) => {
        try {
            const { data } = await axios.post(
                `${BASE_URL}/mondayMeetings/get-crm-records`,
                { query }
            );
            return data || [];
        } catch (error) {
            console.error("CRM Query Error:", error);
            return [];
        }
    };

    const fetchCounsellors = async () => {
        try {
            const res = await getLeadCounsellorDropdownService();
            const usernames = (res?.data?.data || []).map((i) => i.username);
            setAllowedUsers(usernames);
        } catch (error) {
            console.error("Fetch Data Error:", error);
            message.error("Unable to fetch performance data");
        }
    };

    const fetchData = useCallback(async () => {

        if (!loginUser || (!counsellor?.length && allowedUsers.length === 0)) return;

        setLoading(true);

        try {

            let branchCondition = "";

            if (Array.isArray(branch) && branch.length > 0) {
                const values = branch.map(b => `'${b}'`).join(",");
                branchCondition = `
                    lml.assign_to_id IN (
                        SELECT user_id FROM user_management_user_branch
                        WHERE branch_id IN (${values})
                    )
                `;
            }

            let conditions = [];

            conditions.push(`lml.created_at BETWEEN '${startUTC}' AND '${endUTC}'`);

            if (role?.length) {
                const values = role.map(r => `'${r}'`).join(",");

                conditions.push(`
                    lml.assign_to_id IN (
                        SELECT username 
                        FROM user_management_user
                        WHERE role_id IN (${values})
                    )
                `);
            }

            if (leadSource?.length) {
                conditions.push(buildCondition("lml.lead_source_id", leadSource, false));
            }

            if (sourceGroup?.length) {
                conditions.push(buildCondition("lmls.source_group", sourceGroup, false));
            }

            if (branchCondition) {
                conditions.push(branchCondition);
            }

            const users = counsellor?.length ? counsellor : allowedUsers;

            if (users?.length) {
                conditions.push(buildCondition("lml.assign_to_id", users, false));
            } else if (!isAdmin && loginUser) {
                conditions.push(`lml.assign_to_id='${loginUser}'`);
            }

            const whereClause =
                conditions.length > 0
                    ? "WHERE " + conditions.join(" AND ")
                    : "";

            const regConditions = conditions.filter(
                c => !c.includes("lml.created_at")
            );

            const whereClauseWithoutDate =
                regConditions.length > 0
                    ? "WHERE " + regConditions.join(" AND ")
                    : "";

            const offset = (page - 1) * pageSize;

            const query = getCombinedSourceLeadQuery({
                whereClause,
                whereClauseWithoutDate,
                pageSize,
                offset,
                startUTC,
                endUTC
            });

            const result = await fetchCrmQuery(query);

            const regQuery = getRegDateCountsQuery({
                whereClauseWithoutDate,
                regStartDate,
                regEndDate,
            });

            console.log("FINAL QUERY", regQuery);

            const regResult = await fetchCrmQuery(regQuery);

            console.log("RAW REG RESULT", regResult);

            const regData = Array.isArray(regResult)
                ? regResult
                : regResult?.data || [];

            const data = Array.isArray(result) ? result : result?.data || [];

            const regMap = {};

            regData.forEach((r) => {
                let key;

                if (r.row_type === "row") {
                    key = r.lead_source_id;
                } else if (r.row_type === "subtotal") {
                    key = `${r.source_group}-subtotal`;
                } else if (r.row_type === "grand") {
                    key = "grand-total";
                }

                regMap[key] = r.reg_from_date;
            });

            const normalRows = data
                .filter(r => r.row_type === "row")
                .map(r => ({
                    ...r,
                    reg_from_date:
                        regMap[r.lead_source_id] || 0
                }));

            const subtotalRows = data
                .filter(r => r.row_type === "subtotal")
                .map(r => ({
                    ...r,
                    reg_from_date:
                        regMap[`${r.source_group}-subtotal`] || 0
                }));

            const grandBase = data.find(r => r.row_type === "grand");

            const grandRow = {
                row_type: "grand",
                source_group: "Grand Total",
                lead_source_id: null,

                ...grandBase,

                reg_from_date: parseInt(regMap["grand-total"] || 0, 10)
            };
            console.log("FINAL GRAND", grandRow.reg_from_date);
            console.log("GRAND MAP", regMap["grand-total"]);
            console.log("GRAND ROW", grandRow);

            setRows(normalRows);
            setSubtotals(subtotalRows);
            setGrandTotal(grandRow || {});
            setTotalRows(data?.[0]?.total_count || 0);

            if (onDataLoad) {
                onDataLoad({
                    rows: normalRows,
                    grandTotal: grandRow
                });
            }

        } catch (error) {
            console.error("Full error:", error);

            if (error?.response) {
                console.error("API Error:", error.response.data);
            }

            message.error("Data fetch failed");
        }

        setLoading(false);

    }, [
        startUTC,
        endUTC,
        leadSource,
        sourceGroup,
        counsellor,
        branch,
        role,
        allowedUsers,
        loginUser,
        isAdmin,
        page,
        pageSize
    ]);

    const columns = useMemo(() => [
        { title: "Source Group", dataIndex: "source_group", fixed: "left" },
        { title: "Lead Source", dataIndex: "lead_source_id", fixed: "left" },
        { title: "Total Leads", dataIndex: "totalleads", align: "center" },
        { title: "Re-Enquired", dataIndex: "re_enquired_after", align: "center" },
        { title: "MQL", dataIndex: "mql", align: "center" },

        {
            title: "Lead → MQL %",
            align: "center",
            render: (_, r) => {
                const p = calcPercent(r.mql, r.totalleads);
                return <span className={getMqlColor(p)}>{Math.round(p)}%</span>;
            }
        },

        { title: "SQL", dataIndex: "sql", align: "center" },

        {
            title: "MQL → SQL %",
            align: "center",
            render: (_, r) => {
                const p = calcPercent(r.sql, r.mql);
                return <span className={getSqlColor(p)}>{Math.round(p)}%</span>;
            }
        },

        {
            title: "Lead → SQL %",
            align: "center",
            render: (_, r) => {
                const p = calcPercent(r.sql, r.totalleads);
                return <span className={getSqlColor(p)}>{Math.round(p)}%</span>;
            }
        },

        { title: "Reg From", dataIndex: "registered", align: "center" },

        {
            title: "Reg At",
            dataIndex: "reg_from_date",
            align: "center"
        },

        {
            title: "SQL → Reg %",
            align: "center",
            render: (_, r) => {
                const p = calcPercent(r.registered, r.sql);
                return <span className={getSqlColor(p)}>{Math.round(p)}%</span>;
            }
        },

        {
            title: "Lead → Reg %",
            align: "center",
            render: (_, r) => {
                const p = calcPercent(r.registered, r.totalleads);

                const value = isFinite(p) ? p : 0;

                return (
                    <span className={getSqlColor(value)}>
                        {value.toFixed(2)}%
                    </span>
                );
            }
        },

        { title: "0-1 Week", dataIndex: "week_0_1", align: "center" },
        { title: "1-2 Week", dataIndex: "week_1_2", align: "center" },
        { title: "2-4 Week", dataIndex: "week_2_4", align: "center" },
        { title: "4+ Week", dataIndex: "week_4_plus", align: "center" }
    ], []);

    const finalRows = useMemo(() => {
        const map = {};
        const result = [];

        rows.forEach((item) => {
            const group = item.source_group || "Others";
            if (!map[group]) map[group] = [];
            map[group].push(item);
        });

        const subtotalMap = {};
        subtotals.forEach(item => {
            subtotalMap[item.source_group] = item;
        });

        Object.keys(map)
            .sort((a, b) => (map[b][0]?.totalleads || 0) - (map[a][0]?.totalleads || 0))
            .forEach((group) => {

                const groupData = map[group].sort((a, b) => b.totalleads - a.totalleads);

                groupData.forEach((row) => {
                    result.push({ ...row, isTotal: false });
                });

                const subtotal = subtotalMap[group] || {};

                result.push({
                    ...subtotal,
                    source_group: `${group} Total`,
                    lead_source_id: "",
                    isTotal: true
                });
            });

        if (grandTotal && Object.keys(grandTotal).length > 0) {
            result.push({
                ...grandTotal,
                source_group: "Grand Total",
                lead_source_id: "",
                isGrand: true
            });
        }

        return result;

    }, [rows, grandTotal, subtotals]);

    useEffect(() => {
        fetchCounsellors();
    }, []);

    useEffect(() => {
        getProfileService().then((res) =>
            setLoginUser(res?.data?.data?.username || null)
        );
    }, []);

    useEffect(() => {
        if (!loginUser) return;
        fetchData();
    }, [fetchData, loginUser]);

    return (
        <div className="p-4">
            <Spin spinning={loading}>
                <Table
                    columns={columns}
                    dataSource={finalRows}
                    pagination={false}
                    size="small"
                    scroll={{ x: "max-content" }}
                    rowKey={(r) => `${r.source_group}-${r.lead_source_id}`}
                    locale={{
                        emptyText: <Empty description="No source leads data available" />
                    }}
                    rowClassName={(record) => (record.isTotal ? "total-row" : "")}
                />
                <div className="flex justify-between items-center mt-3">
                    <Pagination
                        current={page}
                        pageSize={pageSize}
                        total={totalRows}
                        showSizeChanger
                        showQuickJumper
                        size="small"
                        onChange={(p, s) => {
                            setPage(p);
                            setPageSize(s);
                        }}
                    />
                    <span className="text-sm text-black dark:text-yellow-500">
                        {Math.min(page * pageSize, totalRows)} of {totalRows} records
                    </span>
                </div>
            </Spin>
        </div>
    );
}

export default SourceLeadPerformance;