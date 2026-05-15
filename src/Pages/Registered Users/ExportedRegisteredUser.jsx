import React, { useEffect, useState } from "react";
import { Button, Grid, message, Modal } from "antd";
import { TabTables } from "../../Components/CustomComponents/TabTables";
import { patchCityService, getCityListService } from "../City/ApiService";
import { PAGESIZE } from "../../lib/Constants";
import { useSelector } from "react-redux";
import { GetColumnSearchProps } from "../../Components/CustomComponents/TableColumnSearch";
import { getExportedRegisteredUsersService } from "./ApiService";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";

const ExportedRegisteredUser = () => {
  const [tableLoading, setTableLoading] = useState(false);
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [cityData, setCityData] = useState();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});
  const [isProofViewModal, setIsProofViewModal] = useState(false);
  const [proofImgUrl, setProofImgUrl] = useState("");

  const cityModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  const handleCancel = () => {
    setIsProofViewModal(false);
  };

  const columns = [
    {
      title: "Export by",
      dataIndex: "export_by",
      key: "export_by",
      fixed: "left",
      minWidth: "200px",
      render: (text) => <p className="font-medium">{text || "-"}</p>,
      sorter: (a, b) =>
        (a.export_by || "").localeCompare(b.export_by || ""),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Export From",
      dataIndex: "export_from",
      key: "export_from",
      minWidth: "200px",
      render: (text) => <p>{text || "-"}</p>,
      sorter: (a, b) =>
        (a.export_from || "").localeCompare(b.export_from || ""),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Media",
      dataIndex: "media",
      key: "media",
      minWidth: "200px",
      render: (text) =>
        text ? (
          <Button
            onClick={() => {
              setProofImgUrl(text);
              setIsProofViewModal(true);
            }}
          >
            View / Download
          </Button>
        ) : (
          "-"
        ),
    },
    {
      title: "Total Records",
      dataIndex: "total_records",
      key: "total_records",
      minWidth: "200px",
      render: (text) => <p>{text ?? 0}</p>,
      sorter: (a, b) =>
        Number(a.total_records || 0) - Number(b.total_records || 0),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      minWidth: "200px",
      render: (text) => <p>{text || "-"}</p>,
      sorter: (a, b) =>
        (a.status || "").localeCompare(b.status || ""),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Datetime",
      dataIndex: "datetime",
      key: "datetime",
      minWidth: "220px",
      render: (text) => <p>{text || "-"}</p>,
      sorter: (a, b) =>
        new Date(a.datetime).getTime() -
        new Date(b.datetime).getTime(),
      sortDirections: ["descend", "ascend"],
    },
  ];

  const cityGetApi = () => {
    setTableLoading(true);

    getExportedRegisteredUsersService({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    }).then((response) => {
      setCityData(response.data.data);
      setData(response.data);
    })
      .finally(() => {
        setTableLoading(false);
      });
  };

  useEffect(cityGetApi, [
    page,
    searchState,
    cityModulePermission.city_management,
    pageSize,
  ]);

  return (
    <>
      <div className="mt-6">
        <TabTables
          loading={tableLoading}
          tableData={cityData}
          tableColumns={columns}
          paginationData={data}
          paginationHandler={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      </div>

      <Modal
        title="Media"
        open={isProofViewModal}
        footer={null}
        onCancel={handleCancel}
        width={500}
      >
        {proofImgUrl !== null ? (
          <img
            src={proofImgUrl}
            alt="Media"
            style={{ width: "100%", height: "auto" }}
          />
        ) : (
          <p>No image found</p>
        )}

        <a
          href={proofImgUrl}
          download={proofImgUrl}
          target="_blank"
          className="flex justify-self-end"
        >
          <PrimaryButton
            title={"Download"}
            type={"primary"}
            className={"mt-6"}
          ></PrimaryButton>
        </a>
      </Modal>
    </>
  );
};

export default ExportedRegisteredUser;
