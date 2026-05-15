import { Drawer, message } from "antd";
import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import {
  editApsApplicationService,
  getApsApplicationService,
} from "./ApiService";
import {
  CustomDatePicker,
  CustomSelectInput,
  InputWithIcon,
} from "../../Components/CustomComponents/InputWithIcon";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import LoadSkeleton from "../../Components/CustomComponents/Skeleton";
dayjs.extend(customParseFormat);

const fields = [
  { key: "aps_payment_date", label: "APS Payment Date", type: "date" },
  { key: "aps_submission_date", label: "APS Submission Date", type: "date" },
  { key: "aps_received_on", label: "APS Received On", type: "date" },
  { key: "payment_status", label: "Payment status", type: "dropdown" },
  { key: "aps_loginid", label: "APS Login id" },
  { key: "aps_password", label: "APS Password" },
  { key: "aps_status", label: "APS Status", type: "dropdown" },
  { key: "aps_payment", label: "APS Payment" },
  { key: "aps_number", label: "APS Number" },
  { key: "aps_copy", label: "APS Copy" },
  { key: "name_of_payer", label: "Name Of Payer" },
  { key: "payment_method", label: "Payment Method", type: "dropdown" },
  { key: "bank_name", label: "Bank Name" },
  { key: "ifsc_code", label: "IFSC Code" },
  {
    key: "transaction_reference_number",
    label: "Transaction Reference Number",
  },
  { key: "visa_apply_status", label: "Visa Apply Status", type: "dropdown" },
];

// export const ApsApplication = ({ userData }) => {
//   const [open, setOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [selectedData, setSelectedData] = useState(null);
//   const [data, setData] = useState();
//   const modulePermission = useSelector(
//     (state) => state.permissions.permissionsData
//   );

//   let columns = [
//     {
//       title: "APS Payment Date",
//       dataIndex: "aps_payment_date",
//       fixed: "left",
//       key: "aps_payment_date",
//       width: "20%",
//       minWidth: "160px",
//       render: (text, record) => (
//         <p className="font-medium" onClick={() => showEditDrawer(record.id)}>
//           {text}
//         </p>
//       ),
//     },
//     {
//       title: "APS Submission Date",
//       dataIndex: "aps_submission_date",
//       key: "aps_submission_date",
//       width: "10%",
//       minWidth: "170px",
//       render: (text, record) => (
//         <p onClick={() => showEditDrawer(record.id)}>{text}</p>
//       ),
//     },
//     {
//       title: "APS Received On",
//       dataIndex: "aps_received_on",
//       key: "aps_received_on",
//       minWidth: "150px",
//       render: (text, record) => (
//         <p onClick={() => showEditDrawer(record.id)}>{text}</p>
//       ),
//     },
//     {
//       title: "Payment Status",
//       dataIndex: "payment_status",
//       key: "payment_status",
//       minWidth: "140px",
//       render: (text, record) => (
//         <p onClick={() => showEditDrawer(record.id)}>{text}</p>
//       ),
//     },
//     {
//       title: "APS Login id",
//       dataIndex: "aps_loginid",
//       key: "aps_loginid",
//       minWidth: "120px",
//       render: (text, record) => (
//         <p onClick={() => showEditDrawer(record.id)}>{text}</p>
//       ),
//     },
//     {
//       title: "APS Password",
//       dataIndex: "aps_password",
//       key: "aps_password",
//       minWidth: "130px",
//       render: (text, record) => (
//         <p onClick={() => showEditDrawer(record.id)}>{text}</p>
//       ),
//     },
//     {
//       title: "APS Status",
//       dataIndex: "aps_status",
//       key: "aps_status",
//       minWidth: "110px",
//       render: (text, record) => (
//         <p onClick={() => showEditDrawer(record.id)}>{text}</p>
//       ),
//     },
//     {
//       title: "APS Payment",
//       dataIndex: "aps_payment",
//       key: "aps_payment",
//       minWidth: "120px",
//       render: (text, record) => (
//         <p onClick={() => showEditDrawer(record.id)}>{text}</p>
//       ),
//     },
//     {
//       title: "APS Number",
//       dataIndex: "aps_number",
//       key: "aps_number",
//       minWidth: "120px",
//       render: (text, record) => (
//         <p onClick={() => showEditDrawer(record.id)}>{text}</p>
//       ),
//     },
//     {
//       title: "APS Copy",
//       dataIndex: "aps_copy",
//       key: "aps_copy",
//       minWidth: "100px",
//       render: (text, record) => (
//         <p onClick={() => showEditDrawer(record.id)}>{text}</p>
//       ),
//     },
//     {
//       title: "Name Of Payer",
//       dataIndex: "name_of_payer",
//       key: "name_of_payer",
//       minWidth: "130px",
//       render: (text, record) => (
//         <p onClick={() => showEditDrawer(record.id)}>{text}</p>
//       ),
//     },
//     {
//       title: "Payment Method",
//       dataIndex: "payment_method",
//       key: "payment_method",
//       minWidth: "150px",
//       render: (text, record) => (
//         <p onClick={() => showEditDrawer(record.id)}>{text}</p>
//       ),
//     },
//     {
//       title: "Bank Name",
//       dataIndex: "bank_name",
//       key: "bank_name",
//       minWidth: "120px",
//       render: (text, record) => (
//         <p onClick={() => showEditDrawer(record.id)}>{text}</p>
//       ),
//     },
//     {
//       title: "IFSC Code",
//       dataIndex: "ifsc_code",
//       key: "ifsc_code",
//       minWidth: "100px",
//       render: (text, record) => (
//         <p onClick={() => showEditDrawer(record.id)}>{text}</p>
//       ),
//     },
//     {
//       title: "Transaction Reference Number",
//       dataIndex: "transaction_reference_number",
//       key: "transaction_reference_number",
//       minWidth: "230px",
//       render: (text, record) => (
//         <p onClick={() => showEditDrawer(record.id)}>{text}</p>
//       ),
//     },
//     {
//       title: "Visa Apply Status",
//       dataIndex: "visa_apply_status",
//       key: "visa_apply_status",
//       minWidth: "150px",
//       render: (text, record) => (
//         <p onClick={() => showEditDrawer(record.id)}>{text}</p>
//       ),
//     },
//   ];
//   const showDrawer = () => {
//     setOpen(true);
//   };
//   const onClose = () => {
//     setOpen(false);
//   };
//   const showEditDrawer = (id) => {
//     setSelectedData(id);
//     setEditOpen(true);
//   };
//   const onEditClose = () => {
//     setEditOpen(false);
//     setSelectedData(null);
//   };

//   const getApplicationsApi = () => {
//     getApsApplicationService(userData).then((response) => {
//       setData(response.data.data);
//     });
//   };

//   useEffect(getApplicationsApi, [modulePermission.lead_management]);
//   return (
//     <>
//       {/* Add Aps Application section */}
//       <Drawer
//         title="Add Aps Application"
//         placement="right"
//         width={400}
//         onClose={onClose}
//         open={open}
//       >
//         <AddApsApplication
//           getApplicationsApi={getApplicationsApi}
//           setOpen={setOpen}
//           userData={userData}
//         />
//       </Drawer>
//       {/* Add Aps Application section */}

//       {/* Edit Aps Application section */}
//       {selectedData && (
//         <Drawer
//           title="Edit Aps Application"
//           placement="right"
//           width={400}
//           onClose={onEditClose}
//           open={editOpen}
//         >
//           <EditApsApplication
//             id={selectedData}
//             setEditOpen={setEditOpen}
//             getApplicationsApi={getApplicationsApi}
//             userData={userData}
//           />
//         </Drawer>
//       )}
//       {/* Edit Aps Application section */}

//       <div className="flex justify-self-end pt-2">
//         <PrimaryButton
//           type="primary"
//           className="p-2"
//           title={"Add Aps Application"}
//           block={false}
//           onClick={showDrawer}
//         />
//       </div>
//       <div className="h-2"></div>
//       <div className="max-w-full overflow-x-auto">
//         <Table
//           footer={null}
//           rowHoverable={false}
//           columns={columns}
//           dataSource={data}
//           pagination={false}
//           scroll={{ x: "max-content" }}
//         />
//       </div>
//     </>
//   );
// };

// export const AddApsApplication = ({
//   getApplicationsApi,
//   setOpen,
//   userData,
// }) => {
//   const [formData, setFormData] = useState({});

//   const handleInputChange = (e, field) => {
//     const value = e instanceof dayjs ? e : e?.target?.value;
//     setFormData((prevState) => ({
//       ...prevState,
//       [field]: { ...prevState[field], value },
//     }));
//   };

//   const handleError = (errors) => {
//     setFormData((prevData) => {
//       const updatedFormData = {};
//       Object.keys(prevData).forEach((field) => {
//         updatedFormData[field] = {
//           ...prevData[field],
//           errors: errors[field] || [],
//         };
//       });
//       return updatedFormData;
//     });
//   };

//   const addApplicationApi = () => {
//     const dataToSubmit = Object.fromEntries(
//       Object.entries(formData).map(([key, value]) => [
//         key,
//         value.value instanceof dayjs
//           ? value.value.format("DD-MM-YYYY") // Format to DD-MM-YYYY
//           : value.value,
//       ])
//     );
//     addApsApplicationService(dataToSubmit, userData)
//       .then((response) => {
//         if (response.data.success === "1") {
//           getApplicationsApi();
//           setOpen(false);
//           message.success(response?.data?.message);
//         }
//       })
//       .catch((error) => {
//         if (error) {
//           handleError(error?.response?.data?.data);
//           message.error(error?.response?.data?.message);
//         }
//       });
//   };

//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         addApplicationApi();
//       }}
//       className="w-3/3"
//     >
//       <div>
//         <div className="grid grid-cols-1 gap-4">
//           {fields.map((field) => (
//             <div className="flex flex-col gap-1" key={field.key}>
//               <label className="text-sm flex items-center gap-1">
//                 {field.label}
//               </label>
//               {field.type === "date" ? (
//                 <CustomDatePicker
//                   value={formData[field.key]?.value}
//                   errors={formData[field.key]?.errors || []}
//                   onChange={(date) => handleInputChange(date, field.key)}
//                 />
//               ) : field.type === "email" ? (
//                 <InputWithIcon
//                   type="email"
//                   placeholder={`Please enter ${field.label}`}
//                   value={formData[field.key]?.value || ""}
//                   errors={formData[field.key]?.errors || []}
//                   handler={(e) => handleInputChange(e, field.key)}
//                 />
//               ) : (
//                 <InputWithIcon
//                   type="text"
//                   placeholder={`Please enter ${field.label}`}
//                   value={formData[field.key]?.value || ""}
//                   errors={formData[field.key]?.errors || []}
//                   handler={(e) => handleInputChange(e, field.key)}
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//         <PrimaryButton
//           type="primary"
//           htmlType={"submit"}
//           className="p-4 px-7 mt-4 flex justify-self-center "
//           title={"Submit"}
//           block={false}
//         />
//       </div>
//     </form>
//   );
// };

// export const EditApsApplication = ({
//   id,
//   getApplicationsApi,
//   setEditOpen,
//   userData,
// }) => {
//   const [formData, setFormData] = useState({});

//   const handleInputChange = (e, field) => {
//     const value = e instanceof dayjs ? e : e?.target?.value;
//     setFormData((prevState) => ({
//       ...prevState,
//       [field]: { ...prevState[field], value },
//     }));
//   };

//   const handleError = (errors) => {
//     setFormData((prevData) => {
//       const updatedFormData = {};
//       Object.keys(prevData).forEach((field) => {
//         updatedFormData[field] = {
//           ...prevData[field],
//           errors: errors[field] || [],
//         };
//       });
//       return updatedFormData;
//     });
//   };

//   const getApplicationApi = () => {
//     getApsApplicationDetailService(userData, id).then((response) => {
//       if (response && response.data && response.data.data) {
//         const initialFormData = {};
//         fields.forEach((field) => {
//           initialFormData[field.key] = {
//             value:
//               field.type === "date" && response.data.data[field.key]
//                 ? dayjs(response.data.data[field.key])
//                 : response.data.data[field.key] || "",
//             errors: [],
//           };
//         });
//         setFormData(initialFormData);
//       }
//     });
//   };

//   const editApplicationApi = () => {
//     const dataToSubmit = Object.fromEntries(
//       Object.entries(formData).map(([key, value]) => [
//         key,
//         value.value instanceof dayjs
//           ? value.value.format("DD-MM-YYYY") // Format to DD-MM-YYYY
//           : value.value,
//       ])
//     );
//     editApsApplicationService(dataToSubmit, userData, id)
//       .then((response) => {
//         if (response.data.success === "1") {
//           getApplicationsApi();
//           setEditOpen(false);
//           message.success(response?.data?.message);
//         }
//       })
//       .catch((error) => {
//         if (error?.response) {
//           handleError(error?.response?.data?.data);
//           message.error(error?.response?.data?.message);
//         }
//       });
//   };

//   useEffect(() => {
//     getApplicationApi();
//   }, [id]);

//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         editApplicationApi();
//       }}
//       className="w-3/3"
//     >
//       <div>
//         <div className="grid grid-cols-1 gap-4">
//           {fields.map((field) => (
//             <div className="flex flex-col gap-1" key={field.key}>
//               <label className="text-sm flex items-center gap-1">
//                 {field.label}
//               </label>
//               {field.type === "date" ? (
//                 <CustomDatePicker
//                   value={formData[field.key]?.value}
//                   errors={formData[field.key]?.errors || []}
//                   onChange={(date) => handleInputChange(date, field.key)}
//                 />
//               ) : field.type === "email" ? (
//                 <InputWithIcon
//                   type="email"
//                   placeholder={`Please enter ${field.label}`}
//                   value={formData[field.key]?.value || ""}
//                   errors={formData[field.key]?.errors || []}
//                   handler={(e) => handleInputChange(e, field.key)}
//                 />
//               ) : (
//                 <InputWithIcon
//                   type="text"
//                   placeholder={`Please enter ${field.label}`}
//                   value={formData[field.key]?.value || ""}
//                   errors={formData[field.key]?.errors || []}
//                   handler={(e) => handleInputChange(e, field.key)}
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//         <PrimaryButton
//           type="primary"
//           htmlType={"submit"}
//           className="p-4 px-7 mt-4 flex justify-self-center "
//           title={"Submit"}
//           block={false}
//         />
//       </div>
//     </form>
//   );
// };
export const ApsApplication = ({ userData }) => {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({});

  const getDetailApi = () => {
    getApsApplicationService(userData).then((response) => {
      if (response && response.data && response.data.data) {
        setData(response.data.data);
        const initialFormData = {};
        fields.forEach((field) => {
          initialFormData[field.key] = {
            value:
              field.type === "date" && response.data.data[field.key]
                ? dayjs(response.data.data[field.key], "DD-MM-YYYY")
                : response.data.data[field.key] || "",
            errors: [],
          };
        });
        setFormData(initialFormData);
      }
    });
  };

  const handleInputChange = (e, field) => {
    // const value = e instanceof dayjs ? e : e?.target?.value;
    let value = e?.target?.value !== undefined ? e.target.value : e;
    setFormData((prevState) => ({
      ...prevState,
      [field]: { ...prevState[field], value },
    }));
  };

  const handleError = (errors) => {
    setFormData((prevData) => {
      const updatedFormData = {};
      Object.keys(prevData).forEach((field) => {
        updatedFormData[field] = {
          ...prevData[field],
          errors: errors[field] || [],
        };
      });
      return updatedFormData;
    });
  };

  const editDetailApi = () => {
    const dataToSubmit = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value.value instanceof dayjs
          ? value.value.format("DD-MM-YYYY") // Format to DD-MM-YYYY
          : value.value,
      ])
    );
    editApsApplicationService(dataToSubmit, userData)
      .then((response) => {
        if (response.data.success === "1") {
          getDetailApi();
          message.success(response?.data?.message);
        }
      })
      .catch((error) => {
        if (error) {
          handleError(error?.response?.data?.data);
          message.error(error?.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    getDetailApi();
  }, []);

  return (
    <div className="relative py-2">
      {/* <div className="absolute right-0">
        <PrimaryButton
          title={"Change Status"}
          type={"primary"}
          onClick={() => setOpen(true)}
        />
      </div> */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          editDetailApi();
        }}
      >
        <div className="pt-4">
          {data === null || data === undefined ? (
            <LoadSkeleton />
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div>
                  {data?.status === "Approved" ? (
                    <>
                      <strong>Status : </strong>
                      <p className="bg-success inline-flex text-success bg-opacity-10 rounded-full  py-1 px-3 text-sm font-medium">
                        Approved
                      </p>
                    </>
                  ) : data?.status === "Rejected" ? (
                    <>
                      <strong>Status : </strong>
                      <p className="bg-danger inline-flex text-danger rounded-full bg-opacity-10  py-1 px-3 text-sm font-medium">
                        Rejected
                      </p>
                    </>
                  ) : null}
                </div>
                {data?.status === "Approved" && (
                  <div>
                    <p className="text-green-500 text-sm">
                      <strong className="text-black">Remarks : </strong>
                      {data?.remarks}
                    </p>
                  </div>
                )}
                {data?.status === "Rejected" && (
                  <div>
                    <p className="text-red-500 text-sm">
                      <strong className="text-black">Remarks : </strong>
                      {data?.remarks}
                    </p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div className="flex flex-col gap-1" key={field.key}>
                    <label className="text-sm flex items-center gap-1">
                      {field.label}
                    </label>
                    {field.type === "date" ? (
                      <CustomDatePicker
                        disabled={data?.is_approved}
                        value={formData[field.key]?.value}
                        errors={formData[field.key]?.errors || []}
                        onChange={(date) => handleInputChange(date, field.key)}
                      />
                    ) : field.type === "email" ? (
                      <InputWithIcon
                        type="email"
                        disabled={data?.is_approved}
                        placeholder={`Please enter ${field.label}`}
                        value={formData[field.key]?.value || ""}
                        errors={formData[field.key]?.errors || []}
                        handler={(e) => handleInputChange(e, field.key)}
                      />
                    ) : field.type === "number" ? (
                      <InputWithIcon
                        type="number"
                        disabled={data?.is_approved}
                        placeholder={`Please enter ${field.label}`}
                        value={formData[field.key]?.value || ""}
                        errors={formData[field.key]?.errors || []}
                        handler={(e) => handleInputChange(e, field.key)}
                      />
                    ) : field.type === "dropdown" ? (
                      <CustomSelectInput
                        placeholder={`Select ${field.label}`}
                        value={formData[field.key]?.value || null}
                        errors={formData[field.key]?.errors || []}
                        handler={(e) => handleInputChange(e, field.key)}
                        options={
                          field.key === "payment_status"
                            ? [
                                {
                                  value: "Pending",
                                  label: "Pending",
                                },
                                {
                                  value: "Paid",
                                  label: "Paid",
                                },
                                {
                                  value: "Successful",
                                  label: "Successful",
                                },
                              ]
                            : field.key === "aps_status"
                            ? [
                                {
                                  value: "Pending",
                                  label: "Pending",
                                },
                                {
                                  value: "Submitted",
                                  label: "Submitted",
                                },
                                {
                                  value: "Approved",
                                  label: "Approved",
                                },
                                {
                                  value: "Rejected",
                                  label: "Rejected",
                                },
                              ]
                            : field.key === "payment_method"
                            ? [
                                {
                                  value: "Online",
                                  label: "Online",
                                },
                                {
                                  value: "Offline",
                                  label: "Offline",
                                },
                              ]
                            : [
                                {
                                  value: "Applied",
                                  label: "Applied",
                                },
                                {
                                  value: "Not Applied",
                                  label: "Not Applied",
                                },
                              ]
                        }
                      />
                    ) : (
                      <InputWithIcon
                        type="text"
                        disabled={data?.is_approved}
                        placeholder={`Please enter ${field.label}`}
                        value={formData[field.key]?.value || ""}
                        errors={formData[field.key]?.errors || []}
                        handler={(e) => handleInputChange(e, field.key)}
                      />
                    )}
                  </div>
                ))}
              </div>
              {/* {data?.is_approved === false && ( */}
              <PrimaryButton
                type="primary"
                htmlType={"submit"}
                className="p-4 px-6 mt-4 flex justify-self-center "
                title={"Submit"}
                block={false}
              />
              {/* )} */}
            </div>
          )}
        </div>
      </form>
      {/* <Drawer
        title="Change Status"
        placement="right"
        width={400}
        onClose={() => setOpen(false)}
        open={open}
      >
        <PreferenceStatusChange
          userName={userName}
          setOpen={setOpen}
          getDetailApi={getDetailApi}
          dataremarks={data?.remarks}
          status={data?.status}
        />
      </Drawer> */}
    </div>
  );
};
