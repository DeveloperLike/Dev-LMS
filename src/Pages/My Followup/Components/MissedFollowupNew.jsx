import React, { useEffect, useState } from "react";
import { Grid, message, Pagination, Table } from "antd";
import { NavLink } from "react-router-dom";
import { followupPostService } from "../ApiService";
import { PAGESIZE } from "../../../lib/Constants";
import LoadSkeleton from "../../../Components/CustomComponents/Skeleton";
import { GetColumnSearchProps } from "../../../Components/CustomComponents/TableColumnSearch";

const MissedFollowUpNew = ({
  missedFollowupDateRange,
  dateFormat,
  counsellor,
  selectedLeadStatus
}) => {
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [followupData, setFollowupData] = useState();
  const [data, setData] = useState({});
  const [page, setPage] = useState(1);
  const [searchState, setSearchState] = useState({});
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  const onShowSizeChange = (current, newPageSize) => {
    setPageSize(newPageSize);
    setPage(1, newPageSize);
  };

  let columns = [
    {
      title: "Email",
      fixed: screens?.md ? "left" : false,
      dataIndex: "lead",
      key: "lead",
      width: "25%",
      ...GetColumnSearchProps("lead", setSearchState, searchState),
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.lead_id}`}>
          <p className="font-medium hover:text-orange-500">{text}</p>
        </NavLink>
      ),
    },
    {
      title: "Created By",
      dataIndex: "user_name",
      key: "user_name",
      width: "20%",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.lead_id}`}>
          <p className=" hover:text-orange-500">{text}</p>
        </NavLink>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remark",
      key: "remark",
      width: "20%",
      minWidth: "200px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.lead_id}`}>
          <p className=" hover:text-orange-500">{text}</p>
        </NavLink>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: "20%",
      minWidth: "200px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.lead_id}`}>
          <p className=" hover:text-orange-500">{text}</p>
        </NavLink>
      ),
    },
    {
      title: "Date",
      dataIndex: "datetime",
      key: "date",
      width: "15%",
      minWidth: "200px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.lead_id}`}>
          <p className="hover:text-orange-500">{text}</p>
        </NavLink>
      ),
    },
    {
      title: "Lead Status",
      dataIndex: "lead_status",
      key: "date",
      width: "10%",
      minWidth: "200px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.lead_id}`}>
          <p className="hover:text-orange-500">{text}</p>
        </NavLink>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (text, record) => (
        <>
          <p
            className={`inline-flex py-1 px-3 bg-opacity-10 rounded-full text-sm font-medium ${
              text === true
                ? "bg-success text-success    "
                : "bg-danger text-danger "
            }`}
          >
            {text === true ? "Done" : "Pending"}
          </p>
        </>
      ),
    },
  ];

  const getFollowupApi = () => {
    const payload = {
      type: "missed",
      assign_to: counsellor,
      lead_status:selectedLeadStatus,
      start_date:
        !missedFollowupDateRange || missedFollowupDateRange.length !== 2
          ? null
          : missedFollowupDateRange[0].format(dateFormat),
      end_date:
        !missedFollowupDateRange || missedFollowupDateRange.length !== 2
          ? null
          : missedFollowupDateRange[1].format(dateFormat),
    };
    followupPostService(payload, {
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    })
      .then((response) => {
        if (response.data.success === "1") {
          // console.log(response.data.data)
          setFollowupData(response.data.data);
          setData(response.data);
          // message.success(response?.data?.message);
        }
      })
      .catch(function (error) {
        if (error) {
          message.error(error?.response?.data?.message);
        }
      });
  };

  useEffect(getFollowupApi, [
    page,
    searchState,
    missedFollowupDateRange,
    counsellor,
    selectedLeadStatus,
    pageSize,
  ]);

  return (
    <div className="xs:mt-40 sm:mt-36 md:mt-30 lg:mt-20">
      {followupData === undefined || followupData === null ? (
        <LoadSkeleton />
      ) : (
        followupData && (
          <Table
            columns={columns.map((col) => ({
              ...col,
              className: "whitespace-nowrap",
            }))}
            scroll={{ x: "max-content" }}
            dataSource={followupData}
            pagination={false}
            className="mt-4 max-w-full overflow-x-auto"
          />
        )
      )}

      <div className="flex justify-between items-center mt-4">
        <Pagination
          current={page}
          total={data.data_count}
          size="small"
          showQuickJumper
          pageSize={pageSize}
          responsive
          onChange={(page) => {
            setPage(page);
          }}
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
        />
        <div className="text-sm text-black">
          {data.current_page_data_count} of {data.data_count} records
        </div>
                
      </div>
    </div>
  );
};

export default MissedFollowUpNew;
