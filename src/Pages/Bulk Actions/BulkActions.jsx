import React, { useEffect, useState } from "react";
import { message, Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import BulkUpload from "./BulkUpload";
import DataDownloads from "./DataDownloads";
import {
  getExportService,
  getImportService,
  getSampleFileService,
} from "./ApiService";
import { IoReload } from "react-icons/io5";
import { PAGESIZE } from "../../lib/Constants";

const BulkActions = ({ mode }) => {
  const [btnName, setBtnName] = useState("Import");
  const [openImport, setOpenImport] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [sampleFile, setSampleFile] = useState();
  const [importData, setImportData] = useState();
  const [exportData, setExportData] = useState();
  const [importPage, setImportPage] = useState(1);
  const [exportPage, setExportPage] = useState(1);
  const dispatch = useDispatch();

  const templateModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );

  const items = [
    {
      key: "1",
      label: "Upload",
      children: (
        <BulkUpload
          importData={importData}
          setImportData={setImportData}
          openImport={openImport}
          setOpenImport={setOpenImport}
          importPage={importPage}
          setImportPage={setImportPage}
        />
      ),
    },
    {
      key: "2",
      label: " Downloads",
      children: (
        <DataDownloads
          exportData={exportData}
          setExportData={setExportData}
          openExport={openExport}
          setOpenExport={setOpenExport}
          exportPage={exportPage}
          setExportPage={setExportPage}
        />
      ),
    },
    // {
    //   key: '3',
    //   label: 'Schedule meeting upload',
    // },
  ];

  const handleBtnName = (activeKey) => {
    activeKey === "1" && setBtnName("Import");
    activeKey === "2" && setBtnName("Export");
  };

  // import module function starts here
  const showImportDrawer = () => {
    setOpenImport(true);
  };
  const handleImportDataReload = () => {
    getImportService({
      current_page_number: importPage,
      count_per_page: PAGESIZE,
    }).then((response) => {
      setImportData(response.data.data);
      message.success(response?.data?.message);
    });
  };
  // import module function ends here

  // export module function starts here
  const showExportDrawer = () => {
    setOpenExport(true);
  };
  const handleExportDataReload = () => {
    getExportService({
      current_page_number: exportPage,
      count_per_page: PAGESIZE,
    }).then((response) => {
      setExportData(response.data.data);
      message.success(response?.data?.message);
    });
  };
  // export module function ends here

  useEffect(() => {
    getSampleFileService().then((response) => {
      // console.log(response.data.data);
      setSampleFile(response.data.data);
    });
  }, []);

  return (
    <>
      <div className="mx-6 mb-3">
        <div className="justify-self-end">
          {templateModulePermission.lead_management === "edit" &&
            btnName === "Import" && (
              <div className="flex gap-2">
                <button
                  className={` ${mode === "dark" ? "text-yellow-500 border-yellow-500 hover:text-black" : "text-black"} dark:hover:bg-yellow-500 bg-[#ffce00] hover:bg-orange-500 dark:bg-meta-4 shadow border px-3 py-1 rounded`}
                  onClick={handleImportDataReload}
                >
                  <IoReload />
                </button>
                <a href={sampleFile} download={sampleFile}>
                  <button className={` ${mode === "dark" ? "text-yellow-500 border-yellow-500 hover:text-black" : "text-black"} dark:hover:bg-yellow-500 bg-[#ffce00] hover:bg-orange-500 dark:bg-meta-4 shadow border px-3 py-1 rounded`}>
                    Download Sample File
                  </button>
                </a>
                <button
                  className={` ${mode === "dark" ? "text-yellow-500 border-yellow-500 hover:text-black" : "text-black"} dark:hover:bg-yellow-500 bg-[#ffce00] hover:bg-orange-500 dark:bg-meta-4 shadow border px-3 py-1 rounded`}
                  onClick={showImportDrawer}
                >
                  Import
                </button>
              </div>
            )}

          {templateModulePermission.lead_management === "edit" &&
            btnName === "Export" && (
              <div className="flex gap-2">
                <button
                  className={` ${mode === "dark" ? "text-yellow-500 border-yellow-500 hover:text-black" : "text-black"} dark:hover:bg-yellow-500 bg-[#ffce00] hover:bg-orange-500 dark:bg-meta-4 shadow border px-3 py-1 rounded`}
                  onClick={handleExportDataReload}
                >
                  <IoReload />
                </button>

                <button
                  className={` ${mode === "dark" ? "text-yellow-500 border-yellow-500 hover:text-black" : "text-black"} dark:hover:bg-yellow-500 bg-[#ffce00] hover:bg-orange-500 dark:bg-meta-4 shadow border px-3 py-1 rounded`}
                  onClick={showExportDrawer}
                >
                  Export
                </button>
              </div>
            )}
        </div>
      </div>
      <div className="mx-6 rounded-lg border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <Tabs
          className="w-full"
          defaultActiveKey="1"
          items={items}
          onChange={(activeKey) => handleBtnName(activeKey)}
        />
      </div>
    </>
  );
};

export default BulkActions;
