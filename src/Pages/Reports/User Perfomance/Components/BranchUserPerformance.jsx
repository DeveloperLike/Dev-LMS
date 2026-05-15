import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Table, Spin, Empty, Pagination } from "antd";
import { useSelector } from "react-redux";
import { getProfileService } from "../../../Profile/ApiService";
import { getLeadCounsellorDropdownService } from "../../ApiService";
import { removeZeroColumns, sortColumnsByTotal } from "../../hook";
import { YgApi } from "../../../../lib/Constants";
function BranchUserPerformance({ startDate, endDate, counsellor, leadSource, sourceGroup, branch }) {

    const BASE_URL = YgApi;

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [expandedData, setExpandedData] = useState({});

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loginUser, setLoginUser] = useState(null);
    const [allowedUsernames, setAllowedUsernames] = useState([]);
    const [expandedLoading, setExpandedLoading] = useState({});
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    const leadModulePermission = useSelector(
        (state) => state.permissions.permissionsData
    );

    const userGroup = leadModulePermission?.user_group;

    const isAdmin = userGroup === "admin";
    const isManager = userGroup === "manager";

    const isPrivileged = isAdmin || isManager;

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

    const fetchCounsellors = async () => {
        try {
            const res = await getLeadCounsellorDropdownService();
            const usernames = (res?.data?.data || []).map(item => item.username);
            setAllowedUsernames(usernames);
        } catch (err) {
            console.error("Counsellor fetch error", err);
        }
    };

    const fetchBranchUsers = async (branchName) => {

        setExpandedLoading(prev => ({
            ...prev,
            [branchName]: true
        }));

        try {

            const statusQuery = `
            SELECT name
            FROM lead_management_leadstatus
            ORDER BY name
        `;

            const statusRes = await axios.post(
                `${BASE_URL}/mondayMeetings/get-crm-records`,
                { query: statusQuery }
            );

            const statuses =
                Array.isArray(statusRes?.data)
                    ? statusRes.data
                    : Array.isArray(statusRes?.data?.data)
                        ? statusRes.data.data
                        : [];

            const statusFilters = statuses
                .map((s) => {

                    const key = s.name
                        .replace(/\s+/g, "_")
                        .replace(/[^a-zA-Z0-9_]/g, "");

                    return `COUNT(*) FILTER (WHERE lms.name='${s.name}') AS "${key}"`;

                })
                .join(",");

            let dateCondition = "";
            let counsellorCondition = "";
            let sourceCondition = "";
            let sourceGroupCondition = "";

            if (startDate && endDate) {
                dateCondition = `AND lml.created_at::date BETWEEN '${startDate}' AND '${endDate}'`;
            }

            if (counsellor?.length > 0) {
                const values = counsellor.map(c => `'${c}'`).join(",");
                counsellorCondition = `AND lml.assign_to_id IN (${values})`;
            }

            if (leadSource?.length > 0) {
                const values = leadSource.map(id => `'${id}'`).join(",");
                sourceCondition = `AND lml.lead_source_id IN (${values})`;
            }

            if (sourceGroup?.length > 0) {
                const values = sourceGroup.map(g => `'${g}'`).join(",");
                sourceGroupCondition = `AND lmls.source_group IN (${values})`;
            }
            let userCondition = "";

            if (!isPrivileged && loginUser) {
                userCondition = `AND lml.assign_to_id = '${loginUser.replace(/'/g, "''")}'`;
            }

            const query = `
        SELECT
            COALESCE(umu.full_name,'Others') AS user_name,
            COUNT(lml.id) AS total_lead,
            ${statusFilters}

        FROM lead_management_lead lml

        LEFT JOIN user_management_user umu
        ON lml.assign_to_id = umu.username

        LEFT JOIN user_management_user_branch umub
        ON umub.user_id = umu.username

        LEFT JOIN branch_management_branch bmb
        ON umub.branch_id = bmb.id

        LEFT JOIN lead_management_leadstatus lms
        ON lml.lead_status_id = lms.id

        LEFT JOIN lead_management_leadsource lmls
        ON lml.lead_source_id = lmls.id

        WHERE COALESCE(bmb.name,'Others')='${branchName}'
        ${userCondition}
        ${dateCondition}
        ${counsellorCondition}
        ${sourceCondition}
        ${sourceGroupCondition}

        GROUP BY umu.full_name

        ORDER BY COUNT(lml.id) DESC
        `;

            const res = await axios.post(
                `${BASE_URL}/mondayMeetings/get-crm-records`,
                { query }
            );

            const result =
                Array.isArray(res?.data)
                    ? res.data
                    : Array.isArray(res?.data?.data)
                        ? res.data.data
                        : [];

            setExpandedData(prev => ({
                ...prev,
                [branchName]: result
            }));

        } catch (err) {

            console.error("Branch Users Fetch Error:", err);

        } finally {

            setExpandedLoading(prev => ({
                ...prev,
                [branchName]: false
            }));

        }
    };

    const fetchData = async () => {

        setLoading(true);

        setPage(1);
        setExpandedData({});
        setExpandedData({});

        try {

            const statusQuery = `
        SELECT name
        FROM lead_management_leadstatus
        ORDER BY name
      `;

            const statusRes = await axios.post(
                `${BASE_URL}/mondayMeetings/get-crm-records`,
                { query: statusQuery }
            );

            const statuses =
                Array.isArray(statusRes?.data)
                    ? statusRes.data
                    : Array.isArray(statusRes?.data?.data)
                        ? statusRes.data.data
                        : [];

            let branchCondition = "";
            let userCondition = "";
            let dateCondition = "";
            let counsellorCondition = "";
            let sourceCondition = "";
            let sourceGroupCondition = "";

            if (branch?.length > 0) {
                const values = branch.map(b => `'${b}'`).join(",");
                branchCondition = `AND bmb.id IN (${values})`;
            }

            const users = counsellor?.length ? counsellor : allowedUsernames;

            if (users.length > 0) {
                const values = users.map(u => `'${u}'`).join(",");
                userCondition = `AND lml.assign_to_id IN (${values})`;
            }
            else if (!isPrivileged && loginUser) {
                userCondition = `AND lml.assign_to_id = '${loginUser.replace(/'/g, "''")}'`;
            }

            if (startDate && endDate) {
                dateCondition = `AND lml.created_at::date BETWEEN '${startDate}' AND '${endDate}'`;
            }
            if (counsellor?.length > 0) {
                const values = counsellor.map(c => `'${c}'`).join(",");
                counsellorCondition = `AND lml.assign_to_id IN (${values})`;
            }
            if (leadSource?.length > 0) {
                const values = leadSource.map(id => `'${id}'`).join(",");
                sourceCondition = `AND lml.lead_source_id IN (${values})`;
            }
            if (sourceGroup?.length > 0) {
                const values = sourceGroup.map(g => `'${g}'`).join(",");
                sourceGroupCondition = `AND lmls.source_group IN (${values})`;
            }

            const statusFilters = statuses
                .map((s) => {
                    const key = s.name
                        .replace(/\s+/g, "_")
                        .replace(/[^a-zA-Z0-9_]/g, "");

                    return `COUNT(*) FILTER (WHERE lms.name='${s.name}') AS "${key}"`;
                })
                .join(",");

            const query = `
        SELECT
          COALESCE(bmb.name,'Others') AS branch_name,
          COUNT(lml.id) AS total_lead,
          ${statusFilters}

        FROM lead_management_lead lml

        LEFT JOIN user_management_user umu
        ON lml.assign_to_id = umu.username

        LEFT JOIN user_management_user_branch umub
        ON umub.user_id = umu.username

        LEFT JOIN branch_management_branch bmb
        ON umub.branch_id = bmb.id

        LEFT JOIN lead_management_leadstatus lms
        ON lml.lead_status_id = lms.id

        LEFT JOIN lead_management_leadsource lmls
        ON lml.lead_source_id = lmls.id

   WHERE 1=1
   ${userCondition}
   ${dateCondition}
   ${counsellorCondition}
   ${sourceCondition}
   ${sourceGroupCondition}
   ${branchCondition}

        GROUP BY COALESCE(bmb.name,'Others')
        
        ORDER BY COUNT(lml.id) DESC
      `;

            const res = await axios.post(
                `${BASE_URL}/mondayMeetings/get-crm-records`,
                { query }
            );

            const result =
                Array.isArray(res?.data)
                    ? res.data
                    : Array.isArray(res?.data?.data)
                        ? res.data.data
                        : [];

            setData(result);

            expandedRowKeys.forEach(branchName => {
                fetchBranchUsers(branchName);
            });

            const dynamicColumns = [
                {
                    title: "Branch",
                    dataIndex: "branch_name",
                    key: "branch_name",
                    fixed: "left",
                    width: 250,
                },
                {
                    title: "Total Lead",
                    dataIndex: "total_lead",
                    key: "total_lead",
                    align: "center",
                    fixed: "left",
                    width: 150,
                }
            ];

            statuses.forEach((status) => {

                const key = status.name
                    .replace(/\s+/g, "_")
                    .replace(/[^a-zA-Z0-9_]/g, "");

                dynamicColumns.push({
                    title: status.name,
                    dataIndex: key,
                    key,
                    align: "center",
                });

            });

            const filteredColumns = removeZeroColumns(dynamicColumns, result);

            const sortedColumns = sortColumnsByTotal(
                filteredColumns,
                result,
                ["branch_name", "total_lead", "Junk", "Fresh_Lead"]
            );

            setColumns(sortedColumns);
        } catch (err) {

            console.error("Branch Lead Performance Error:", err);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        if (loginUser !== null && allowedUsernames.length > 0) {
            fetchData();
        }
    }, [
        loginUser,
        startDate,
        endDate,
        counsellor,
        leadSource,
        sourceGroup,
        branch,
        allowedUsernames
    ]);

    const handlePagination = (page, size) => {
        setPage(page);
        setPageSize(size);
    };

    const paginatedData = useMemo(
        () => data.slice((page - 1) * pageSize, page * pageSize),
        [data, page, pageSize]
    );

    const totals = useMemo(() => {
        const totalObj = {};

        columns.forEach(col => {
            if (col.dataIndex !== "branch_name") {
                totalObj[col.dataIndex] = data.reduce(
                    (sum, row) => sum + Number(row[col.dataIndex] || 0),
                    0
                );
            }
        });

        return totalObj;
    }, [data, columns]);

    useEffect(() => {
        fetchCounsellors();
    }, []);

    return (
        <div className=" rounded-lg p-4 shadow-default bg-white dark:bg-boxdark transition-colors duration-200">

            <div className="card border-0 bg-light">

                <div className="card-body">

                    <Spin spinning={loading}>

                        <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-slate-700 overflow-hidden">
                            <table className="min-w-full font-semibold border-collapse whitespace-nowrap">
                                <thead className="bg-gray-200 font-semibold dark:bg-black text-black dark:text-white rounded-t-lg">
                                    <tr>

                                        {columns.map((col, index) => (
                                            <th
                                                key={col.key}
                                                className={`px-4 py-2 border-b border-gray-300 dark:border-slate-600 ${index === 0 ? "text-left" : "text-center"}`}
                                            >
                                                {col.title}
                                            </th>
                                        ))}

                                    </tr>
                                </thead>

                                <tbody>

                                    {paginatedData.map((row) => {

                                        const isExpanded = expandedRowKeys.includes(row.branch_name);

                                        return (

                                            <React.Fragment key={row.branch_name}>

                                                {/* Branch Row */}

                                                <tr
                                                    className={`cursor-pointer transition-colors ${isExpanded ? "bg-yellow-400 text-gray-900" : "hover:bg-gray-100 dark:hover:bg-slate-700 text-black dark:text-white"}`}
                                                    onClick={() => {

                                                        if (isExpanded) {

                                                            setExpandedRowKeys(prev =>
                                                                prev.filter(k => k !== row.branch_name)
                                                            );

                                                        } else {

                                                            setExpandedRowKeys(prev => [...prev, row.branch_name]);

                                                            if (!expandedData[row.branch_name]) {
                                                                fetchBranchUsers(row.branch_name);
                                                            }

                                                        }

                                                    }}
                                                >

                                                    {columns.map((col, index) => (

                                                        <td
                                                            key={col.key}
                                                            className={`px-4 py-2 border-b border-gray-200 dark:border-slate-600 ${index === 0 ? "text-left" : "text-center"}`}
                                                        >
                                                            {row[col.dataIndex] || 0}
                                                        </td>

                                                    ))}

                                                </tr>

                                                {/* Expanded Section */}

                                                {/* Expanded Section */}

                                                {isExpanded && (

                                                    <>

                                                        {/* Users Header */}
                                                        <tr className="bg-yellow-200 text-gray-900 dark:text-gray-900">
                                                            <td className="px-4 py-2 border-b border-yellow-400 text-left">
                                                                Users
                                                            </td>

                                                            {columns.slice(1).map((col) => (
                                                                <td
                                                                    key={col.key}
                                                                    className="px-4 py-2 border-b border-yellow-400 text-center"
                                                                >
                                                                    {col.title}
                                                                </td>
                                                            ))}
                                                        </tr>

                                                        {/* Loader Row */}
                                                        {expandedLoading[row.branch_name] && (
                                                            <tr>
                                                                <td
                                                                    colSpan={columns.length}
                                                                    className="text-center py-6 bg-yellow-50"
                                                                >
                                                                    <Spin />
                                                                </td>
                                                            </tr>
                                                        )}

                                                        {/* User Rows */}
                                                        {!expandedLoading[row.branch_name] &&
                                                            (expandedData[row.branch_name] || []).map((user) => (
                                                                <tr
                                                                    key={user.user_name}
                                                                    className="bg-yellow-50 hover:bg-yellow-100 text-gray-900 dark:text-gray-900"
                                                                >
                                                                    <td className="px-4 py-2 border-b border-gray-200 dark:border-slate-600 text-left">
                                                                        {user.user_name}
                                                                    </td>

                                                                    {columns.slice(1).map((col) => (
                                                                        <td
                                                                            key={col.key}
                                                                            className="px-4 py-2 border-b border-gray-200 dark:border-slate-600 text-center"
                                                                        >
                                                                            {user[col.dataIndex] || 0}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                    </>
                                                )}

                                            </React.Fragment>

                                        );

                                    })}

                                </tbody>

                            </table>

                        </div>

                        <div className="flex justify-between items-center mt-3">

                            <Pagination
                                current={page}
                                pageSize={pageSize}
                                total={data.length}
                                showSizeChanger
                                showQuickJumper
                                size="small"
                                onChange={handlePagination}
                                onShowSizeChange={handlePagination}
                            />

                            <div className="text-sm dark:text-yellow-500 text-black">
                                {Math.min(page * pageSize, data.length)} of {data.length} records
                            </div>

                        </div>

                    </Spin>

                </div>

            </div>

        </div>
    );
}

export default BranchUserPerformance;