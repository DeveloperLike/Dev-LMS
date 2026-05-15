import React, { useEffect, useState, useRef } from "react";
import { Grid, message, Tooltip, Spin, Badge, Tabs } from "antd";
import { MdOutlineEdit } from "react-icons/md";
import { PAGESIZE } from "../../lib/Constants";
import { CustomSelectInput } from "../../Components/CustomComponents/InputWithIcon";
import { useSelector } from "react-redux";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { getUserDetailsService, getUserListService } from "./ApiService";
import { RxCross1 } from "react-icons/rx";
import { NavLink, useNavigate } from "react-router-dom";
import InputWithSelect from "../../Components/CustomComponents/InputWIthSelect";
import TableWithPagination from "../../Components/CustomComponents/Table";
import { GetColumnSearchProps } from "../../Components/CustomComponents/TableColumnSearch";

const UserList = ({ mode }) => {
  const [pageSize, setPageSize] = useState(PAGESIZE);

  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [userData, setUserData] = useState(undefined);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});
  const [isSelected, setIsSelected] = useState(false);
  const [filteredData, setFilteredData] = useState(false);
  const [statusTab, setStatusTab] = useState("active");

  const [dropdownValue, setDropdownValue] = useState({
    phone: "phone",
    full_name: "full_name",
    email: "email",
    did_number: "did_number",
  });

  const [inputValue, setInputValue] = useState({
    phone: "",
    full_name: "",
    email: "",
    did_number: "",
    user_group: "",
  });

  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  const userModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  let columns = [
    {
      title: "Email",
      dataIndex: "email",
      fixed: "left",
      key: "email",
      width: "25%",
      minWidth: "150px",
      ...GetColumnSearchProps("email", setSearchState, searchState),
      render: (text, record) => (
        <p
          className="font-medium"
          onClick={() =>
            userModulePermission.staff_management === "edit" &&
            handleEdit(record.username)
          }
        >
          {text}
        </p>
      ),
      sorter: (a, b) => a.email.length - b.email.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Name",
      dataIndex: "full_name",
      key: "full_name",
      width: "15%",
      minWidth: "100px",
      ...GetColumnSearchProps("full_name", setSearchState, searchState),
      render: (text, record) => (
        <p
          onClick={() =>
            userModulePermission.staff_management === "edit" &&
            handleEdit(record.username)
          }
        >
          {text}
        </p>
      ),
      sorter: (a, b) => a.full_name.length - b.full_name.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Manager",
      dataIndex: "branch_manager",
      key: "branch_manager",
      width: "15%",
      minWidth: "100px",

      ...GetColumnSearchProps("branch_manager", setSearchState, searchState),

      render: (text, record) => (
        <p
          onClick={() =>
            userModulePermission.staff_management === "edit" &&
            handleEdit(record.username)
          }
        >
          {text}
        </p>
      ),

      sorter: (a, b) =>
        (a.branch_manager || "").length -
        (b.branch_manager || "").length,

      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      width: "15%",
      minWidth: "100px",

      ...GetColumnSearchProps("branch", setSearchState, searchState),

      render: (text, record) => (
        <p
          onClick={() =>
            userModulePermission.staff_management === "edit" &&
            handleEdit(record.username)
          }
        >
          {text}
        </p>
      ),

      sorter: (a, b) =>
        (a.branch || "").length -
        (b.branch || "").length,

      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "15%",
      minWidth: "100px",
      ...GetColumnSearchProps("role", setSearchState, searchState),
      render: (text, record) => (
        <p
          onClick={() =>
            userModulePermission.staff_management === "edit" &&
            handleEdit(record.username)
          }
        >
          {text}
        </p>
      ),
      sorter: (a, b) => a.full_name.length - b.full_name.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      width: "15%",
      minWidth: "100px",
      ...GetColumnSearchProps("phone", setSearchState, searchState),
      render: (phone, record) => (
        <p
          onClick={() =>
            userModulePermission.staff_management === "edit" &&
            handleEdit(record.username)
          }
        >
          {userModulePermission.user_group === "admin" ||
            userModulePermission.user_group === "manager"
            ? phone !== null && <>{phone}</>
            : "xxxxxx" + phone?.slice(-3)}
        </p>
      ),
    },
    {
      title: "DID Number",
      dataIndex: "did_number",
      key: "did_number",
      width: "15%",
      minWidth: "100px",
      render: (text, record) => (
        <p
          onClick={() =>
            userModulePermission.staff_management === "edit" &&
            handleEdit(record.username)
          }
        >
          {text}
        </p>
      ),
    },
    userModulePermission.staff_management === "edit"
      ? {
        title: "Status",
        dataIndex: "is_active",
        key: "is_active",
        width: "10%",
        minWidth: "100px",

        // This makes Active first, Inactive last
        sorter: (a, b) => {
          return Number(b.is_active) - Number(a.is_active);
        },
        defaultSortOrder: "ascend",

        render: (is_active, data) => (
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
              handler={(e) => {
                handleSelectInput(e, data.username);
              }}
            />
          </div>
        ),
      }

      : {
        title: "Status",
        dataIndex: "is_active",
        key: "is_active",
        width: "10%",
        minWidth: "100px",

        // Active first, Inactive last
        sorter: (a, b) => {
          return Number(b.is_active) - Number(a.is_active);
        },
        defaultSortOrder: "ascend",

        render: (is_active) => (
          <div className="flex gap-2">
            {is_active === true ? (
              <Badge status="success" text="Active" />
            ) : (
              <Badge status="error" text="Inactive" />
            )}
          </div>
        ),
      }

  ];

  userModulePermission.staff_management === "edit" &&
    columns.push({
      title: "Actions",
      dataIndex: "username",
      key: "username",
      width: "15%",
      render: (username) => (
        <>
          {userModulePermission.staff_management === "edit" ? (
            <Tooltip placement="top" title={"Edit Details"}>
              <MdOutlineEdit
                onClick={() => handleEdit(username)}
                className="hover:text-orange-500 text-lg"
              />
            </Tooltip>
          ) : (
            <MdOutlineEdit className="opacity-60 cursor-not-allowed text-lg" />
          )}
        </>
      ),
    });

  const handleEdit = (id) => {
    navigate(`/users/edit-user/${id}`);
  };

  const userGetApi = () => {
    setUserData(null);
    setTableLoading(true);

    getUserListService({
      ...searchState,
      ...filters,
      is_active: statusTab === "active" ? true : false,
      order_by: "-is_active",
      current_page_number: page,
      count_per_page: pageSize,
    })
      .then((response) => {
        setUserData(response.data.data);
        setData(response.data);
      })
      .catch(() => {
        message.error("Failed to load users");
      })
      .finally(() => {
        setTableLoading(false);
      });
  };

  const handleSelectInput = (e, id) => {
    getUserDetailsService(e, id).then((response) => {
      if (response.data.success === "1") {
        userGetApi();
        message.success(response?.data?.message);
      }
    });
  };

  const handleFilters = () => {
    if (isSelected === false) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  };

  const optionsFields = [
    {
      label: "exact",
      value: "exact",
    },
    {
      label: "iexact",
      value: "iexact",
    },
    {
      label: "contains",
      value: "contains",
    },
    {
      label: "icontains",
      value: "icontains",
    },
  ];

  const handleInput = (e) => {
    setInputValue({
      ...inputValue,
      [e.target.name]: e.target.value,
    });
  };

  const handleNameSelect = (value) => {
    setDropdownValue({
      ...dropdownValue,
      full_name: "full_name__" + value,
    });
  };
  const handleEmailSelect = (value) => {
    setDropdownValue({
      ...dropdownValue,
      email: "email__" + value,
    });
  };
  const handlePhoneSelect = (value) => {
    setDropdownValue({
      ...dropdownValue,
      phone: "phone__" + value,
    });
  };
  const handleDidSelect = (value) => {
    setDropdownValue({
      ...dropdownValue,
      did_number: "did_number__" + value,
    });
  };
  const handleUserGroup = (value) => {
    setDropdownValue({
      ...dropdownValue,
      user_group: value,
    });
  };

  let phoneKey = dropdownValue.phone;
  let phoneValue = inputValue.phone;
  let emailKey = dropdownValue.email;
  let emailValue = inputValue.email;
  let fullNameKey = dropdownValue.full_name;
  let fullNameValue = inputValue.full_name;
  let didNumberKey = dropdownValue.did_number;
  let didNumberValue = inputValue.did_number;
  let userGroupValue = dropdownValue.user_group;

  const handleAdvFilters = () => {
    setFilteredData(true);
    setFilters({
      ...filters,
      [phoneKey]: phoneValue,
      [emailKey]: emailValue,
      [fullNameKey]: fullNameValue,
      [didNumberKey]: didNumberValue,
      user_group: userGroupValue,
    });
  };

  const handleResetFilter = () => {
    setFilteredData(false);
    setDropdownValue({
      phone: "phone",
      full_name: "full_name",
      email: "email",
      did_number: "did_number",
      user_group: "user_group",
    });
    setInputValue({
      phone: "",
      full_name: "",
      email: "",
      did_number: "",
      user_group: "",
    });
    getUserListService({
      current_page_number: page,
      count_per_page: PAGESIZE,
    }).then((response) => {
      setUserData(response.data.data);
      setData(response.data);
    });
  };

  useEffect(() => {
    userGetApi();
  }, [
    page,
    searchState,
    filters,
    pageSize,
    statusTab,
  ]);

  return (
    <>
      <div className="mx-6 flex items-center justify-between mb-3">
        <div className="mx-6 mb-3">
          <h1
            className={`${mode === "dark" ? "text-yellow-500" : "text-black"
              } font-semibold text-lg`}
          >
            Staff
          </h1>

          <Tabs
            activeKey={statusTab}
            onChange={(key) => {
              setStatusTab(key);
              setPage(1);
            }}
            items={[
              {
                key: "active",
                label: "Active",
              },
              {
                key: "inactive",
                label: "Inactive",
              },
            ]}
          />
        </div>
        <div className="flex gap-4 items-center">
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
                      <div>{data.current_page_data_count} records found</div>
                    </div>
                  </>
                }
                className={"w-fit p-[18px] px-2 gap-2 "}
                onClick={handleResetFilter}
              />
            )}
          </div>
          {/* <Tooltip placement="top" title={"Filters"}>
            <button onClick={handleFilters}>
              {isSelected === true ? <FaFilterCircleXmark /> : <FaFilter />}
            </button>
          </Tooltip> */}
          {userModulePermission.staff_management === "edit" ? (
            <NavLink to="/users/add-user">
              <button
                className={`${mode === "dark" ?
                  "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 dark:bg-meta-4 bg-[#ffce00]  hover:bg-orange-500 flex items-center gap-1 shadow border px-3 py-1  rounded`}
              >
                Add Staff
              </button>

            </NavLink>
          ) : null}
        </div>
      </div>

      {isSelected && (
        <div className="mb-3 mx-6 rounded-lg border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <form>
            <div className="grid grid-cols-4 gap-5">
              <InputWithSelect
                options={optionsFields}
                selectHandler={handleEmailSelect}
                inputName="email"
                defaultValue="exact"
                inputValue={inputValue.email}
                inputHandler={handleInput}
                title={<span className="text-xs">Email</span>}
                placeholder={"Enter your email"}
              />
              <InputWithSelect
                options={optionsFields}
                selectHandler={handleNameSelect}
                inputName="full_name"
                defaultValue="exact"
                inputValue={inputValue.full_name}
                inputHandler={handleInput}
                title={<span className="text-xs">Full Name</span>}
                placeholder={"Enter your full name"}
              />
              <InputWithSelect
                selectHandler={handlePhoneSelect}
                options={optionsFields}
                inputName="phone"
                defaultValue="exact"
                inputValue={inputValue.phone}
                inputHandler={handleInput}
                title={<span className="text-xs">Phone</span>}
                placeholder={"Enter your phone"}
              />
              <InputWithSelect
                selectHandler={handleDidSelect}
                options={optionsFields}
                inputName="did_number"
                defaultValue="exact"
                inputValue={inputValue.did_number}
                inputHandler={handleInput}
                title={<span className="text-xs">DID Number</span>}
                placeholder={"Enter your did number"}
              />
              {/* <InputWithSelect
                selectHandler={handleUserSelect}
                inputName="user_group"
                defaultValue="exact"
                inputValue={inputValue.user_group}
                inputHandler={handleInput}
                title={<span className="text-xs">User Group</span>}
                placeholder={'Enter your user group'}
                options={null}
              /> */}
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-xs">User Group</label>
                <CustomSelectInput
                  className="w-full"
                  name="user_group"
                  placeholder="Select user group"
                  options={[
                    {
                      value: "admin",
                      label: "Admin",
                    },
                    {
                      value: "manager",
                      label: "Manager",
                    },
                    {
                      value: "executive",
                      label: "Executive",
                    },
                  ]}
                  handler={handleUserGroup}
                />
              </div>
              <div className="flex items-end">
                <PrimaryButton
                  type={"primary"}
                  title={"Search"}
                  onClick={handleAdvFilters}
                  className={"w-fit p-[18px] px-6 mx-1"}
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
        // <Filters
        //   filterOptions={optionsFields}
        //   handleEmail={handleEmailSelect}
        //   handleName={handleNameSelect}
        //   handlePhone={handlePhoneSelect}
        //   handleDidNumber={handleDidSelect}
        //   handleUserGroup={handleUserSelect}
        //   handleInput={handleInput}
        //   handleSearch={handleAdvFilters}
        //   handleReset={handleResetFilter}
        //   inputValue={inputValue}
        // />
      )}

      <TableWithPagination
        loading={tableLoading}
        pageSize={pageSize}
        setPageSize={setPageSize}
        tableData={userData}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
      />
    </>
  );
};

export default UserList;
