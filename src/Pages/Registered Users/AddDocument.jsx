import React, { useState } from "react";
import { Button, Drawer, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadMyDocumentsService } from "./ApiService";
import { InputWithIcon } from "../../Components/CustomComponents/InputWithIcon";


export const DocumentUploadForm = ({
  onClose,
  open,
  documentTitle,
  categoryId,
  documentId,
  GetDocumentsListApi,
  userName
}) => {
  const [fileList, setFileList] = useState([]);
  const [label, setLabel] = useState("");
  const [labelError, setLabelError] = useState(null);
  const [fileError, setFileError] = useState(null);

  const handleChange = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);
    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(newFileList);
    setFileError(null);
  };

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
    setLabelError(null);
  };


    const beforeUpload = (file) => {
      const isJpgPngJpegPdf =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "application/pdf";
      if (!isJpgPngJpegPdf) {
        message.error("You can only upload JPG/PNG/JPEG/PDF file!");
      }
      return isJpgPngJpegPdf;
    };



  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("file", file.originFileObj);
    });
    formData.append("label", label);
    formData.append("document", documentId);

    uploadMyDocumentsService(formData, userName,categoryId)
      .then((response) => {
        setFileList([]);
        setLabel("");
        onClose();
        setLabelError(null);
        setFileError(null);
        GetDocumentsListApi();
        message.success("Document uploaded successfully.");
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.data) {
          const errorData = error.response.data.data;
          if (errorData.label) {
            setLabelError(errorData.label[0]);
          } else {
            setLabelError(null);
          }
          if (errorData.file) {
            setFileError(errorData.file[0]);
          } else {
            setFileError(null);
          }
        } else {
          message.error("Failed to upload document.");
        }
      });
  };

  return (
    <Drawer
      title={`Add Document: ${documentTitle}`}
      onClose={onClose}
      open={open}
    >
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Document:
        </label>
        <InputWithIcon type="text" value={documentTitle} disabled />
      </div>
      <div className="mt-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Upload File:
        </label>
        <Upload
          onChange={handleChange}
          fileList={fileList}
          beforeUpload={beforeUpload}
          listType="picture"
          accept="image/jpeg,image/png,application/pdf"
        >
          {fileList.length < 1 && (
            <Button icon={<UploadOutlined />}>Select File</Button>
          )}
        </Upload>
        {fileError && <p className="text-red-500 text-xs mt-1">{fileError}</p>}
      </div>
      
      <div className="mt-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Label<sup className="text-red-500">*</sup>
        </label>
        <InputWithIcon
          placeholder="Enter label for the document"
          value={label}
          handler={handleLabelChange}
          error={labelError}
        />
        {labelError && (
          <p className="text-red-500 text-xs mt-1">{labelError}</p>
        )}
      </div>
      <div className="mt-6">
        <Button type="primary" onClick={handleUpload}>
          Add Document
        </Button>
      </div>
    </Drawer>
  );
};