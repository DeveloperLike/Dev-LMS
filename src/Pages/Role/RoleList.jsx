import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Badge, Grid, message, Tooltip } from "antd";
import { MdOutlineEdit } from "react-icons/md";
import { CustomSelectInput } from "../../Components/CustomComponents/InputWithIcon";
import { useSelector } from "react-redux";
import { getRoleListService, patchRoleListService } from "./ApiService";
import TableWithPagination from "../../Components/CustomComponents/Table";
import { PAGESIZE } from "../../lib/Constants";
import { GetColumnSearchProps } from "../../Components/CustomComponents/TableColumnSearch";

const RoleList = ({ mode }) => {
  const [pageSize, setPageSize] = useState(PAGESIZE);

  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [roleData, setRoleData] = useState();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});
  const navigate = useNavigate();

  const roleModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  const handleEdit = (id) => {
    navigate(`/roles/edit-role/${id}`);
  };

  let columns = [
    {
      title: "Role",
      dataIndex: "name",
      fixed: screens?.md ? "left" : false,
      key: "name",
      width: "70%",
      ...GetColumnSearchProps("name", setSearchState, searchState),
      render: (text, record) => (
        <p
          className="font-medium"
          onClick={() =>
            roleModulePermission.role_management === "edit" &&
            record.is_editable &&
            handleEdit(record.id)
          }
        >
          {text}
        </p>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      width: "10%",
      render: (is_active, data) =>
        roleModulePermission.role_management === "edit" &&
          data.is_editable === true ? (
          <div className="flex gap-2">
            {is_active === true ? (
              <Badge status="success" />
            ) : (
              <Badge status="error" />
            )}

            <CustomSelectInput
              className="w-full min-w-[100px]"
              size="small"
              value={is_active === true ? "Active" : "Inactive"}
              options={[
                {
                  value: true,
                  label: <Badge status="success" text="Active" />,
                },
                {
                  value: false,
                  label: <Badge status="error" text="Inactive" />,
                },
              ]}
              disabled={data.is_editable === false ? true : false}
              handler={(e) => {
                handleSelectInput(e, data.id);
              }}
            />
          </div>
        ) : (
          <div className="flex gap-2">
            {is_active === true ? (
              <Badge status="success" text="Active" />
            ) : (
              <Badge status="error" text="Inactive" />
            )}
          </div>
        ),
    },
    {
      title: "Actions",
      dataIndex: "id",
      key: "id",
      width: "15%",
      render: (id, data) => (
        <>
          {(roleModulePermission.role_management === "edit" &&
            data.is_editable) === true ? (
            <Tooltip placement="top" title={"Edit Role Details"}>
              <MdOutlineEdit
                onClick={() => handleEdit(id)}
                className="hover:text-orange-500 text-lg"
              />
            </Tooltip>
          ) : null}
        </>
      ),
    },
  ];

  roleModulePermission.role_management === "edit" && columns.push();

  const roleGetApi = () => {
    setRoleData(null);       // clear old data
    setTableLoading(true);  // start loader

    getRoleListService({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    })
      .then((response) => {
        setRoleData(response.data.data);
        setData(response.data);
      })
      .catch(() => {
        message.error("Failed to load roles");
      })
      .finally(() => {
        setTableLoading(false); // stop loader
      });
  };


  useEffect(() => {
    roleGetApi();
  }, [
    page,
    searchState,
    roleModulePermission.role_management,
    pageSize,
  ]);

  return (
    <>
      <div className="flex items-center justify-between mb-3 mx-6">
        <div>
          <h1 className={` ${mode === "dark" ? "text-yellow-500" : "text-black"} font-semibold flex items-center gap-2 justify-self-start text-lg rounded `}>
            Roles & Permissions
          </h1>
        </div>
        {roleModulePermission.role_management === "edit" ? (
          <NavLink to="/roles/add-role">
            <button className={`${mode === "dark" ?
              "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 bg-[#ffce00] hover:bg-orange-500 flex items-center gap-1  dark:bg-meta-4 shadow border px-3 py-1  rounded`}>
              Add Role
            </button>
          </NavLink>
        ) : null}
      </div>
      <TableWithPagination
        loading={tableLoading}
        pageSize={pageSize}
        setPageSize={setPageSize}
        tableData={roleData}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
      />
    </>
  );
};

export default RoleList;
