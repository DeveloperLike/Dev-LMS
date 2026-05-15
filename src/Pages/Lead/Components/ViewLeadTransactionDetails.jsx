import { Button, Drawer, Grid, Modal, Table } from "antd";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import ViewPackage from "../../Package/ViewPackage";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import TransactionDiscount from "./TransactionDiscount";
import { useSelector } from "react-redux";
import { getTransactionListByLead } from './helperFunctions';

export const ViewLeadTransactionDetails = ({
  transactionList,
  packageData,
  setIsModalOpenTransactionFun,
  isRegistered,
  leadTransactionListGetApi,
  transactionPaymentDetails,
  userData,
  mode
}) => {

  const { id } = useParams();

  const [transactions, setTransactions] = useState([]);

  const [isProofViewModal, setIsProofViewModal] = useState(false);
  const [proofImgUrl, setProofImgUrl] = useState("");
  const [openDiscount, setOpenDiscount] = useState(false);
  const leadModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  const handleCancel = () => {
    setIsProofViewModal(false);
  };

  useEffect(async () => {
    console.log('transaction list api trigger');
    const res = await getTransactionListByLead(id);
    console.log({res});
    if (res.success) {
      setTransactions(res.data);
    }

    // console.log(proofImgUrl, "proofImgUrl");
  }, []);

  const columns = [
    {
      title: "Transaction Id",
      dataIndex: "transaction_id",
      fixed: screens?.md ? "left" : false,
      key: "transaction_id",
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
      key: "transaction_type",
      minWidth: "140px",
      render: (text, record) => (
        <p>{text === "discount" ? "Discount" : record.transaction_type}</p>
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
      dataIndex: "verified_by_name",
      key: "verified_by_name",
      minWidth: "120px",
      render: (text, record) => <>{text}</>,
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
      render: (text) => (
        <>
          {text}
        </>
      ),
    },
    {
      title: " Proof",
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
      key: "medium_of_study",
      minWidth: "150px",
      render: (text, record) => <p>{text}</p>,
    },
  ];

  return (
    <>
      <Modal
        title="View Payment Proof"
        open={isProofViewModal}
        footer={null}
        onCancel={handleCancel}
        width={500}
      >
        {proofImgUrl !== null ? (
          <img
            src={proofImgUrl}
            alt="Payment Proof"
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
      {/* Add Discount Drawer */}
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
      {/* Add Discount Drawer */}
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
          {leadModulePermission.lead_management === "edit" && (
            <div className="flex gap-3 pt-3 md:pt-0">
              <PrimaryButton
                type="primary"
                className="p-2"
                title={"Add Discount"}
                block={false}
                onClick={() => setOpenDiscount(true)}
              />
              <PrimaryButton
                type="primary"
                className="p-2"
                title={"Add Transaction"}
                block={false}
                onClick={() => setIsModalOpenTransactionFun(true)}
              />
            </div>
          )}
        </div>
      )}
      <div className="h-4"></div>
      <div className="max-w-full overflow-x-auto">
        <Table
          footer={null}
          rowHoverable={false}
          columns={columns}
          // dataSource={transactionList}
          dataSource={transactions}
          pagination={false}
          bordered
          scroll={{ x: "max-content" }}
        />
      </div>
    </>
  );
};
