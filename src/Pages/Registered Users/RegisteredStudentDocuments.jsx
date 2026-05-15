import { Card, Drawer, message, Modal, Table, Tabs, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import {
  deleteUserMappedDocumentService,
  getUserMappedDocumentService,
  postUserMappedDocumentService,
} from "./ApiService";
import { PAGESIZE } from "../../lib/Constants";
import { useSelector } from "react-redux";
import {
  OutLineButton,
  PrimaryButton,
} from "../../Components/CustomComponents/ButtonUi";
import { CustomSelectInput } from "../../Components/CustomComponents/InputWithIcon";
import { getDocumentCategoryService } from "../Document Management/Document Category/ApiService";
import { GoPackage } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { RegisteredDocumentTabs } from "./RegisteredDocumentTabs";

const RegisteredStudentDocuments = ({ userData, mode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mappedDocumentId, setMappedDocumentId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [data, setData] = useState({});
  const [userMappedDocumentData, setUserMappedDocumentData] = useState([]);
  const [openDocument, setOpenDocument] = useState(false);
  const [documentCategoryDropdown, setDocumentCategoryDropdown] = useState([]);
  const [formData, setFormData] = useState({
    document_category: { value: null, errors: [] },
  });

  const modulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );

  const columns = [
    {
      title: "Document Category",
      dataIndex: "category",
      fixed: "left",
      key: "category",
      minWidth: "130px",
      render: (text, record) => <p className="font-medium">{text}</p>,
    },
    {
      title: "Actions",
      dataIndex: "id",
      key: "id",
      width: "10%",
      minWidth: "60px",
      render: (id, data) => (
        <>
          {modulePermission.lead_management === "edit" && (
            <Tooltip placement="top" title={"Delete Field"}>
              <MdDeleteOutline
                onClick={() => {
                  setIsModalOpen(true);
                  setMappedDocumentId(id);
                }}
                className="hover:text-orange-500 text-lg"
              />
            </Tooltip>
          )}
        </>
      ),
    },
  ];
  // Handle input change for all form fields
  const handleInputChange = (field) => (e) => {
    const value = e.target ? e.target.value : e;
    setFormData((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        value,
      },
      errors: [],
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
  const getUserMappedDocumentsApi = () => {
    getUserMappedDocumentService(userData, {
      current_page_number: page,
      count_per_page: pageSize,
    }).then((response) => {
      setUserMappedDocumentData(response.data.data);
      // console.log(response.data.data);
      setData(response.data);
    });
  };
  const handleDelete = (documentId) => {
    deleteUserMappedDocumentService(userData, documentId)
      .then((response) => {
        getUserMappedDocumentsApi();
        message.success(response?.data?.message);
      })
      .catch(function (error) {
        if (error) {
          message.error(error?.response?.data?.message);
        }
      });
    setIsModalOpen(false);
  };
  const addUserMappedDocumentApi = () => {
    const payload = {
      document_category: formData.document_category.value,
    };
    postUserMappedDocumentService(userData, payload)
      .then(function (response) {
        if (response.data.success === "1") {
          setOpenDocument(false);
          getUserMappedDocumentsApi();
          setFormData({
            document_category: { value: null, errors: [] },
          });
          message.success(response?.data?.message);
        }
      })
      .catch(function (error) {
        if (error) {
          handleError(error?.response?.data?.data);
          message.error(error?.response?.data?.message);
          // console.log(error?.response?.data);
        }
      });
  };

  useEffect(() => {
    getUserMappedDocumentsApi();
    getDocumentCategoryService().then((response) => {
      setDocumentCategoryDropdown(response.data.data);
    });
  }, [page, pageSize, modulePermission.lead_management]);

  return (
    <>
      <div className="relative">
        <PrimaryButton
          type="primary"
          className={`${mode === "dark" ?
            "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 dark:bg-meta-4 p-2 mt-2 absolute end-0 z-10`}
          title={"Assign Document Category"}
          block={false}
          onClick={() => setOpenDocument(true)}
        />

        <RegisteredDocumentTabs userData={userData} />
      </div>

      {/* Add Documents section */}
      <Drawer
        title="Add Document Category"
        placement="right"
        width={400}
        onClose={() => setOpenDocument(false)}
        open={openDocument}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addUserMappedDocumentApi();
          }}
          className="w-3/3 space-y-4"
        >
          <div className="flex flex-col gap-1">
            <label>
              Document Category<sup className="text-red-500">*</sup>
            </label>
            <CustomSelectInput
              name="document_category"
              placeholder="Please select category"
              value={formData?.document_category?.value}
              errors={formData?.document_category?.errors}
              handler={handleInputChange("document_category")}
              options={documentCategoryDropdown.map((item) => ({
                value: item.id,
                label: item.title,
              }))}
            />
          </div>

          <PrimaryButton
            type="primary"
            htmlType={"submit"}
            className="p-4"
            title={"Add Document Category"}
            block={false}
          />
        </form>
      </Drawer>
      {/* Add Documents section */}
    </>
  );
};

export default RegisteredStudentDocuments;
