import { Button, Drawer, Grid, message, Modal, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { patchTransactionStatusService } from "./ApiService";
import TransactionDiscount from "../Lead/Components/TransactionDiscount";
import { useSelector } from "react-redux";

export const RegisteredUserTransactions = ({
  transactionList,
  setIsModalOpenTransactionFun,
  isRegistered,
  leadTransactionListGetApi,
  transactionPaymentDetails,
  userData,
  mode
}) => {
  const [isProofViewModal, setIsProofViewModal] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [transactionId, setTransactionId] = useState();
  const [proofImgUrl, setProofImgUrl] = useState("");
  const [openDiscount, setOpenDiscount] = useState(false);
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  const modulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );

  const handleCancel = () => {
    setIsProofViewModal(false);
  };
  const handleTransactionVerification = (status) => {
    const payload = { status: status };
    console.log(status);
    patchTransactionStatusService(transactionId, payload).then((response) => {
      leadTransactionListGetApi();
      message.success(response?.data?.message);
    });
    setIsVerifyModalOpen(false);
  };



  const columns = [
    {
      title: "Transaction Id",
      dataIndex: "transaction_id",
      fixed: screens?.md ? "left" : false,
      key: "name",
      minWidth: "130px",
      render: (text, record) => <p className="font-medium">{text}</p>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      minWidth: "100px",
      render: (text, record) => <p>{text}</p>,
    },
    {
      title: "Transaction Type",
      dataIndex: "transaction_type",
      key: "type",
      minWidth: "140px",
      render: (text, record) => (
        <p>{text === "discount" ? "Discount" : "Paid"}</p>
      ),
    },
    {
      title: "Amount paid for",
      dataIndex: "amount_paid_for",
      key: "amount_paid_for",
      minWidth: "150px",
      render: (text, record) => <p>{text}</p>,
    },
    {
      title: "Verified By",
      dataIndex: "verified_by",
      key: "verified_by",
      minWidth: "140px",
      render: (text, record) => <>{text === null ? "-" : text}</>,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      minWidth: "150px",
      render: (text, record) => <p>{text}</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      minWidth: "190px",
      render: (text, record) => (
        <>
          {text === "verified" ? (
            <p className="bg-success text-success inline-flex bg-opacity-10 rounded-full  py-1 px-3 text-sm font-medium">
              Verified
            </p>
          ) : text === "not_verified" ? (
            <p className="bg-danger text-danger inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium">
              Not Verified
            </p>
          ) : (
            <p className="bg-danger text-danger inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium">
              Verification Pending
            </p>
          )}
        </>
      ),
    },
    {
      title: "Verify Payment",
      dataIndex: "status",
      key: "status",
      minWidth: "100px",
      render: (text, record) => (
        <>
          {
            modulePermission.payment_verification_management === "edit" ? <Button
              onClick={() => {
                setIsVerifyModalOpen(true);
                setTransactionId(record.id);
                console.log("modal opened...");
              }}
            >
              Change Status
            </Button> : <p className="text-center" >-</p>
          }
        </>
      ),
    },
    {
      title: "Proof",
      dataIndex: "payment_proof",
      key: "payment_proof",
      minWidth: "100px",
      render: (text, record) => (
        <>
          {text && (
            <Button
              onClick={() => {
                setProofImgUrl(text);
                setIsProofViewModal(true);
              }}
            >
              View/Download
            </Button>
          )}
        </>
      ),
    },
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   key: "description",
    //   minWidth: "150px",
    //   render: (text, record) => <p>{text}</p>,
    // },
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
      minWidth: "100px",
      render: (text, record) => <p>{text}</p>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      minWidth: "100px",
      render: (text, record) => <p>{text}</p>,
    },
    {
      title: "Degree Applied for",
      dataIndex: "degree_applied_for",
      key: "degree_applied_for",
      minWidth: "160px",
      render: (text, record) => <p>{text}</p>,
    },
    {
      title: "Medium of Study",
      dataIndex: "medium_of_study",
      key: "code",
      minWidth: "150px",
      render: (text, record) => <p>{text}</p>,
    },
  ];

  useEffect(() => {
    leadTransactionListGetApi();
  }, []);

  return (
    <>
      <Modal
        title="View Payment Proof"
        open={isProofViewModal}
        footer={null}
        onCancel={handleCancel}
        width={500}
      >
        <img
          src={proofImgUrl}
          alt="Payment Proof"
          style={{ width: "100%", height: "auto" }}
        />

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

      <Modal
        title={<>Do you want to verify this transaction?</>}
        open={isVerifyModalOpen}
        onCancel={() => setIsVerifyModalOpen(false)}
        footer={[
          <Button
            key="reject"
            type="default"
            danger
            onClick={() => handleTransactionVerification("not_verified")}
          >
            Mark as not verified
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={() => handleTransactionVerification("verified")}
          >
            Mark as verified
          </Button>,
        ]}
      >
        <span className="font-medium">Note:</span> This action cannot be undone.
      </Modal>
      <Drawer
        title="Add Discount"
        placement="right"
        width={400}
        onClose={() => setOpenDiscount(false)}
        open={openDiscount}
      >
        <TransactionDiscount
          leadTransactionListGetApi={leadTransactionListGetApi}
          userData={userData}
          setOpenDiscount={setOpenDiscount}
        />
      </Drawer>

      {isRegistered === "registered" && (
        <div className="flex flex-wrap justify-between pt-3 items-center">
          <div className="flex gap-6">
            <h1 className="text-xs md:text-sm">
              <span className="font-semibold">Total Amount :</span> ₹
              {transactionPaymentDetails?.total_amount}
            </h1>
            <h1 className="text-xs md:text-sm">
              <span className="font-semibold">Paid Amount :</span> ₹
              {transactionPaymentDetails?.paid_amount}
            </h1>
            <h1 className="text-xs md:text-sm">
              <span className="font-semibold"> Pending Amount :</span> ₹
              {transactionPaymentDetails?.remaining_amount}
            </h1>
            <h1 className="text-xs md:text-sm">
              <span className="font-semibold">Discounted Amount :</span> ₹
              {transactionPaymentDetails?.discounted_amount}
            </h1>
          </div>
          <div className="flex gap-3 pt-3 md:pt-0">
            <PrimaryButton
              type="primary"
              className={`${mode === "dark" ?
                "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 dark:bg-meta-4 p-2`}
              title={"Add Discount"}
              block={false}
              onClick={() => setOpenDiscount(true)}
            />

            <PrimaryButton
              type="primary"
              className={`${mode === "dark" ?
                "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 dark:bg-meta-4 p-2`}
              title={"Add Transaction"}
              block={false}
              onClick={() => setIsModalOpenTransactionFun(true)}
            />
          </div>
        </div>
      )}
      <div className="h-4"></div>
      <div className="bg-white dark:bg-boxdark rounded-lg transition-colors duration-200">
        <Table
          footer={null}
          rowHoverable={false}
          columns={columns.map((col) => ({
            ...col,
            className: "whitespace-nowrap",
          }))}
          scroll={{ x: "max-content" }}
          dataSource={transactionList}
          pagination={false}
          bordered={false}
          className="
            bg-white dark:bg-boxdark
            [&_.ant-table-tbody>tr>td]:bg-white
            dark:[&_.ant-table-tbody>tr>td]:bg-boxdark
            [&_.ant-table-empty]:bg-white
            dark:[&_.ant-table-empty]:bg-boxdark
          "
        />
      </div>
    </>
  );
};
