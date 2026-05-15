import React, { useState, useEffect } from "react";
import { baseurl, PAGESIZE } from "../../lib/Constants";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import {
  getDocumentsListService,
  sendDocumentReminderService,
} from "./ApiService";
import { TabTables } from "../../Components/CustomComponents/TabTables";
import { Button, Drawer, message, Modal } from "antd";
import UpdateDocumentStatus from "./UpdateDocumentStatus";
import { useParams } from "react-router-dom";
import { DocumentUploadForm } from "./AddDocument";
import { DocumentEditForm } from "./EditDocument";
import TextArea from "antd/es/input/TextArea";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export const SubmittedDocuments = ({ categoryId, userName }) => {
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [documentData, setDocumentData] = useState([]);
  const [page, setPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});
  const [initialDocumentsJson, setInitialDocumentsJson] = useState(null);
  // const [open, setOpen] = useState(false);
  const [documentId, setDocumentId] = useState();
  const [submitionId, setSubmitionId] = useState();
  const [newDocumentRecord, setNewDocumentRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedDocumentTitle, setSelectedDocumentTitle] = useState("");
  const [selectedLabel, setSelectedLable] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [remarks, setRemarks] = useState();
  const [sendReminderDrawer, setSendReminderDrawer] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const { id } = useParams();

  // const showDrawer = (record) => {
  //   console.log("document id", record.document_id);
  //   setDocumentId(record.document_id);
  //   setOpen(true);
  // };
  // const onClose = () => {
  //   setOpen(false);
  // };

  const GetDocumentsListApi = () => {
    getDocumentsListService(userName, categoryId, {
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    })
      .then((response) => {
        setInitialDocumentsJson(response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  };

  useEffect(() => {
    GetDocumentsListApi();
  }, [categoryId, page, pageSize, searchState]);

  useEffect(() => {
    if (initialDocumentsJson && initialDocumentsJson.success === "1") {
      setDocumentData(initialDocumentsJson.data);
      setPaginationInfo({
        current: initialDocumentsJson.current_page_number,
        total: initialDocumentsJson.total_number_of_pages,
        pageSize: initialDocumentsJson.count_per_page,
        totalCount: initialDocumentsJson.data_count,
      });
    } else if (initialDocumentsJson) {
      setDocumentData([]);
      setPaginationInfo({});
    }
  }, [initialDocumentsJson]);

  const openDrawer = (record = null) => {
    console.log(record.document_id);
    if (record) {
      setDocumentId(record.document_id);
      setSelectedDocumentTitle(record.document);
      setNewDocumentRecord(null);
    } else {
      setSelectedDocumentTitle("");
      setDocumentId(null);
      setNewDocumentRecord({});
    }
    setIsDrawerOpen(true);
  };
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDocumentTitle("");
    setNewDocumentRecord(null);
  };

  const openEditDrawer = (record) => {
    setSubmitionId(record?.submission_id);
    setDocumentId(record?.document_id);
    setSelectedDocumentTitle(record.document);
    setSelectedLable(record.label);
    setEditingRecord(record);
    setIsEditDrawerOpen(true);
    setNewDocumentRecord(null);
  };
  const closeEditDrawer = () => {
    setIsEditDrawerOpen(false);
    setSelectedDocumentTitle("");
    setSelectedLable("");
    setNewDocumentRecord(null);
    setEditingRecord(null);
  };

  const handleAddMore = (record) => {
    openDrawer(record);
  };

  const handleReplace = (record) => {
    openEditDrawer(record);
  };

  const showModal = (file) => {
    setModalContent(file);
    setModalVisible(true);
  };

  const handleCancelModal = () => {
    setModalVisible(false);
    setModalContent(null);
  };

  let columns = [
    {
      title: "Document Type",
      dataIndex: "title",
      fixed: "title",
      key: "title",
      width: "25%",
      minWidth: "160px",
    },
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
      width: "25%",
    },
    {
      title: "File View",
      dataIndex: "submitted_file",
      fixed: "submitted_file",
      key: "submitted_file",
      width: "25%",
      render: (text, record) => (
        <>
          {text && (
            <PrimaryButton
              title={"View"}
              onClick={() => {
                showModal(text);
                setDocumentId(record.submission_id);
              }}
            />
          )}
        </>
      ),
    },
    // {
    //   title: "User",
    //   dataIndex: "user",
    //   key: "user",
    //   width: "25%",
    // },
    // {
    //   title: "File View",
    //   dataIndex: "file",
    //   key: "file",
    //   width: "25%",
    //   render: (text, record) => (
    //     <>
    //       {text && (
    //         <PrimaryButton
    //           title={"View"}
    //           onClick={() => {
    //             showModal(text);
    //             setDocumentId(record.id);
    //           }}
    //         />
    //       )}
    //     </>
    //   ),
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "15%",
      filters: [
        {
          text: "Pending",
          value: "Pending",
        },
        {
          text: "Approved",
          value: "Approved",
        },
        {
          text: "Rejected",
          value: "Rejected",
        },
        {
          text: "Uploaded",
          value: "Uploaded",
        },
      ],
      onFilter: (value, record) => record.status === value,
      render: (text) => {
        if (typeof text === "string" && text.length > 0) {
          if (text === "Approved") {
            return (
              <p className="bg-green-100 text-green-700 rounded-full py-1 px-3 text-sm font-medium">
                Approved
              </p>
            );
          } else if (text === "Rejected") {
            return (
              <p className="bg-red-100 text-red-700 rounded-full py-1 px-3 text-sm font-medium">
                Rejected
              </p>
            );
          } else if (text === "Uploaded") {
            return (
              <p className="bg-blue-100 text-blue-700 rounded-full py-1 px-3 text-sm font-medium">
                Uploaded
              </p>
            );
          } else if (text === "Pending") {
            return (
              <p className="bg-yellow-100 text-yellow-700 rounded-full py-1 px-3 text-sm font-medium">
                Pending
              </p>
            );
          } else {
            return text.charAt(0).toUpperCase() + text.slice(1);
          }
        }
        return text;
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      // width: "25%",
      minWidth: "120px",
    },
    // {
    //   title: <p className="text-center">Action</p>,
    //   key: "action",
    //   width: "20%",
    //   render: (_, record) => (
    //     <PrimaryButton
    //       type={"primary"}
    //       title={"Manage Status"}
    //       onClick={() => showDrawer(record)}
    //     />
    //   ),
    // },
    // {
    //   title: <p className="text-center">Upload</p>,
    //   key: "upload",
    //   width: "35%",
    //   render: (_, record) => (
    //     <div className="px-4 flex gap-4">
    //       {record?.file !== null &&
    //       record?.file !== undefined &&
    //       record.status !== "Approved" &&
    //       record.status !== "Pending" ? (
    //         <PrimaryButton
    //           type={"primary"}
    //           title={"Replace"}
    //           onClick={() => handleReplace(record)}
    //         />
    //       ) : (
    //         <div className="w-[90px]">
    //           <Button disabled>Replace</Button>
    //         </div>
    //       )}
    //       {record.status !== "Rejected" ? (
    //         <PrimaryButton
    //           type={"primary"}
    //           title={record.status === "Pending" ? "Upload" : "Add More"}
    //           onClick={() => handleAddMore(record)}
    //         />
    //       ) : (
    //         <div className="w-[90px]">
    //           <Button disabled>Add More</Button>
    //         </div>
    //       )}
    //     </div>
    //   ),
    // },
    {
      title: <p className="text-center">Upload</p>,
      key: "upload",
      width: "35%",
      render: (_, record) => (
        <div className="px-4 flex gap-4">
          {record?.submitted_file !== null &&
          record?.submitted_file !== undefined &&
          record.status !== "Approved" &&
          record.status !== "Uploaded" &&
          record.status !== "Pending" ? (
            <PrimaryButton
              type={"primary"}
              title={"Replace"}
              onClick={() => handleReplace(record)}
            />
          ) : (
            <div className="w-[90px]">
              <Button disabled>Replace</Button>
            </div>
          )}
          {record.status !== "Rejected" ? (
            <PrimaryButton
              type={"primary"}
              title={record.status === "Pending" ? "Upload" : "Add More"}
              onClick={() => handleAddMore(record)}
            />
          ) : (
            <div className="w-[90px]">
              <Button disabled>Add More</Button>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Uploaded on",
      dataIndex: "created_at",
      key: "created_at",
      // width: "25%",
      minWidth: "200px",
    },
    {
      title: "Updated on",
      dataIndex: "updated_at",
      key: "updated_at",
      // width: "25%",
      minWidth: "200px",
    },
    // {
    //   title: "Updated by",
    //   dataIndex: "last_updated_by",
    //   key: "last_updated_by",
    //   minWidth: "200px",
    // },
  ];

  const handleDocumentSubmit = (newlyUploadedDocument) => {
    if (newDocumentRecord) {
      setDocumentData((prevData) => [...prevData, newlyUploadedDocument]);
    } else {
      setDocumentData((prevData) => {
        const index = prevData.findIndex(
          (item) => item.document_id === newlyUploadedDocument.document_id
        );
        if (index !== -1) {
          const newData = [...prevData];
          newData.splice(index + 1, 0, newlyUploadedDocument);
          return newData;
        }
        return [...prevData, newlyUploadedDocument];
      });
    }
    closeDrawer();
    GetDocumentsListApi();
  };

  const handleDocumentUpdate = (updatedDocument) => {
    setDocumentData((prevData) =>
      prevData.map((doc) =>
        doc?.submission_id === updatedDocument?.submission_id
          ? updatedDocument
          : doc
      )
    );
    closeEditDrawer();
    GetDocumentsListApi();
  };

  const handleInputChange = (e) => {
    const value = e.target ? e.target.value : e;
    setRemarks(value);
  };

  function sendReminderApi() {
    let payload = {
      document: selectedRowKeys,
      custom_remarks: remarks,
    };
    sendDocumentReminderService(payload, id).then((response) => {
      if (response.data.success === "1") {
        setSendReminderDrawer(false);
        message.success(response?.data?.message);
      }
    });
  }

  // const downloadSelectedAsZip = async () => {
  //   if (selectedRowKeys.length === 0) {
  //     message.warning("Please select at least one file to download.");
  //     return;
  //   }

  //   setDownloadingZip(true);
  //   const zip = new JSZip();

  //   try {
  //     await Promise.all(
  //       documentData
  //         .filter((doc) => selectedRowKeys.includes(doc.document_id))
  //         .map(async (doc) => {
  //           if (doc.submitted_file) {
  //             try {
  //               const response = await fetch(doc.submitted_file);
  //               if (!response.ok) {
  //                 console.error(`Failed to fetch: ${doc.submitted_file}`, response.status, response.statusText);
  //                 return; // Skip to the next file on fetch failure
  //               }
  //               try {
  //                 const fileBlob = await response.blob();
  //                 const filename = doc.submitted_file.substring(doc.submitted_file.lastIndexOf('/') + 1);
  //                 zip.file(filename, fileBlob);
  //               } catch (blobError) {
  //                 console.error(`Error converting to blob for ${doc.submitted_file}:`, blobError);
  //               }
  //             } catch (fetchError) {
  //               console.error(`Error during fetch for ${doc.submitted_file}:`, fetchError);
  //             }
  //           } else {
  //             console.warn(`No file URL found for document ID: ${doc.document_id}`);
  //           }
  //         })
  //     );

  //     if (!zip.file()) {
  //       message.warning(
  //         "No files were available for download in the selected items."
  //       );
  //       setDownloadingZip(false);
  //       return;
  //     }

  //     const zipBlob = await zip.generateAsync({ type: "blob" });
  //     saveAs(zipBlob, "selected_documents.zip");
  //     message.success("Selected documents downloaded as ZIP!");
  //   } catch (error) {
  //     console.error("Error creating zip file:", error);
  //     message.error("Failed to create ZIP file.");
  //   } finally {
  //     setDownloadingZip(false);
  //   }
  // };
  const downloadSelectedAsZip = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select at least one file to download.");
      return;
    }

    setDownloadingZip(true);
    const zip = new JSZip();
    console.log("Starting ZIP creation...");
    console.log("Selected Row Keys:", selectedRowKeys); // ADD THIS LINE
    console.log(
      "Document Data before filter:",
      documentData.map((doc) => doc.document_id)
    ); // ADD THIS LINE

    try {
      const filteredDocuments = documentData.filter((doc) => {
        const shouldInclude = selectedRowKeys.includes(doc.document_id);
        console.log(
          `Checking doc ID: ${doc.document_id}, Include: ${shouldInclude}`
        ); // ADD THIS LINE
        return shouldInclude;
      });

      console.log(
        "Filtered Documents:",
        filteredDocuments.map((doc) => doc.document_id)
      ); // ADD THIS LINE

      await Promise.all(
        filteredDocuments.map(async (doc) => {
          if (doc.submitted_file) {
            const fileUrl = doc.submitted_file;
            const filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            console.log(`Fetching: ${fileUrl}`);
            try {
              const response = await fetch(fileUrl);
              console.log(`Fetch response for ${filename}:`, response);
              if (!response.ok) {
                console.error(
                  `Failed to fetch ${filename}:`,
                  response.status,
                  response.statusText
                );
                return; // Skip to the next file on fetch failure
              }
              console.log(`Converting ${filename} to blob...`);
              const fileBlob = await response.blob();
              console.log(`Blob created for ${filename}:`, fileBlob);
              zip.file(filename, fileBlob);
              console.log(`${filename} added to ZIP.`);
            } catch (error) {
              console.error(`Error processing ${filename}:`, error);
            }
          } else {
            console.warn(
              `No file URL found for document ID: ${doc.document_id}`
            );
          }
        })
      );

      console.log("Files in ZIP before generation:", Object.keys(zip.files));
      if (Object.keys(zip.files).length === 0) {
        message.warning("No files added to the ZIP.");
        setDownloadingZip(false);
        return;
      }

      console.log("Generating ZIP...");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      console.log("ZIP Blob created:", zipBlob);
      saveAs(zipBlob, "selected_documents.zip");
      message.success("Selected documents downloaded as ZIP!");
    } catch (error) {
      console.error("Error during ZIP creation:", error);
      message.error("Failed to create ZIP file.");
    } finally {
      setDownloadingZip(false);
      console.log("ZIP process finished.");
    }
  };
  return (
    <>
      <div className="">
        <div className="flex gap-2 justify-end">
          <Drawer
            title="Send Reminder"
            placement="right"
            width={400}
            onClose={() => setSendReminderDrawer(false)}
            open={sendReminderDrawer}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendReminderApi();
              }}
            >
              <label>Remarks</label>
              <TextArea
                placeholder="Please enter remarks"
                rows={4}
                maxLength={500}
                required={false}
                value={remarks}
                onChange={handleInputChange}
              />

              <PrimaryButton
                type="primary"
                htmlType={"submit"}
                className="p-4 mt-3"
                title={"Submit"}
                block={false}
              />
            </form>
          </Drawer>
          <PrimaryButton
            title={"Send Reminder"}
            type={"primary"}
            className={"my-2 flex justify-self-end"}
            onClick={() => setSendReminderDrawer(true)}
            disabled={selectedRowKeys?.length === 0}
            block={false}
          />
          <PrimaryButton
            title={downloadingZip ? "Downloading..." : "Download"}
            type={"primary"}
            className={"my-2 flex justify-self-end"}
            onClick={downloadSelectedAsZip}
            disabled={selectedRowKeys?.length === 0 || downloadingZip}
            block={false}
          />
          {/* <PrimaryButton
            title={"Download"}
            type={"primary"}
            className={"my-2 flex justify-self-end"}
            onClick={() => message.success("File Downloaded Successfully")}
            disabled={selectedRowKeys?.length === 0}
            block={false}
          /> */}
        </div>
        <TabTables
          tableData={documentData}
          tableColumns={columns}
          //   paginationData={paginationInfo}
          paginationData={data}
          paginationHandler={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          rowKey="document_id"
          rowSelection={{
            type: "checkbox",
            selectedRowKeys,
            onChange: (newSelectedRowKeys) => {
              setSelectedRowKeys(newSelectedRowKeys);
              console.log(newSelectedRowKeys, "rowKeys");
            },
          }}
        />
      </div>

      {/* Update Status section */}
      {/* <Drawer
        title="Update Status"
        placement="right"
        width={400}
        onClose={onClose}
        open={open}
      >
        <UpdateDocumentStatus
          userName={id}
          categoryId={categoryId}
          documentId={documentId}
          getCourseApi={GetDocumentsListApi}
          setOpen={setOpen}
        />
      </Drawer> */}
      {/* Update Status section */}

      <DocumentUploadForm
        open={isDrawerOpen}
        onClose={closeDrawer}
        documentTitle={selectedDocumentTitle}
        categoryId={categoryId}
        documentId={documentId}
        GetDocumentsListApi={GetDocumentsListApi}
        onDocumentSubmit={handleDocumentSubmit}
        isNewDocument={newDocumentRecord !== null}
        userName={userName}
      />

      <DocumentEditForm
        open={isEditDrawerOpen}
        onClose={closeEditDrawer}
        documentTitle={selectedDocumentTitle}
        initialLabel={editingRecord?.label}
        categoryId={categoryId}
        documentId={documentId}
        GetDocumentsListApi={GetDocumentsListApi}
        submitionId={submitionId}
        onDocumentUpdate={handleDocumentUpdate}
        initialFile={editingRecord?.file}
        userName={userName}
      />
      <Modal
        title="File View"
        open={modalVisible}
        onCancel={handleCancelModal}
        footer={null}
        width={"50%"}
      >
        {modalContent && (
          <>
            <iframe
              src={modalContent}
              style={{ width: "100%", height: "500px" }}
              title="Document Viewer"
            />
            <a
              href={modalContent}
              download={modalContent}
              target="_blank"
              className="flex justify-self-center"
            >
              <PrimaryButton
                title={"Download"}
                type={"primary"}
                className={"mt-6"}
                block={false}
              />
            </a>

            <UpdateDocumentStatus
              userName={id}
              categoryId={categoryId}
              documentId={documentId}
              getCourseApi={GetDocumentsListApi}
              setModalVisible={setModalVisible}
            />
          </>
        )}
      </Modal>
    </>
  );
};
