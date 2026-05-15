import React, { useEffect, useState } from "react";
import { Checkbox, Divider, Table, Button, notification, message } from "antd";
import { getLeadFormFeildService } from "./ApiService";
import { getCityDropdownService } from "../City/ApiService";
import { baseurl } from "../../lib/Constants";

const CustomiseWidget = ({ mode }) => {
  const [formData, setFormData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [htmlCode, setHtmlCode] = useState();
  const [previewFields, setPreviewFields] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  // Define columns for the Table
  const columns = [
    {
      title: "Field",
      dataIndex: "label",
      key: "code",
      render: (text) => <a>{text}</a>,
    },
  ];

  // Fetch form data
  const leadformfieldGetApi = () => {
    getLeadFormFeildService().then((response) => {
      const data = response.data.data.map((item) => ({
        ...item,
        key: item.code,
      }));
      setFormData(data);
      // Pri selected first four fields
      setSelectedRowKeys(data.slice(0, 4).map((item) => item.code));
    });
  };

  const getCityDropdownApi = async () => {
    const response = await getCityDropdownService();
    setCityOptions(response.data.data);
  };

  const generateHtmlAndPreview = (selectedKeys) => {
    let htmlString = "<form id='leadForm' >";
    let previewItems = [];

    // <input type="hidden" name="tracking_url" value="" ></input>
    htmlString += `<div>
    <input type="hidden" name="source" value="" >
    <input type="hidden" name="redirect_url" value="" >
</div>`;

    formData.forEach((item) => {
      if (selectedKeys.includes(item.code)) {
        // Generate HTML code for each selected field
        htmlString += generateFieldHtml(item);
      }
    });
    htmlString +=
      '\n <button type="submit" id="submitButton" class="btn-submit">Submit</button>';
    htmlString += "</form>";

    htmlString += `<div>
    <script src="https://yesgermany.org/CRMLeadGen.js"></script>
</div>`;

    setHtmlCode(htmlString);
    setPreviewFields(previewItems);
  };

  // Function to render field HTML
  const generateFieldHtml = (field) => {
    switch (field.type) {
      case "select":
        return `\n
       <div id="${field.code}" > 
       <label for="${field.code}">${field.label}</label>
        <select name="${field.code}" required >${field.options
            .map((option) => `<option value="${option}">${option}</option>`)
            .join("")}
        </select>
        </div>`;
      case "city":
        return `
    <div id="${field.code}">
      <label for="${field.code}">${field.label}</label>
      <select id="citySelect" name="${field.code}"  required >
        <option value="" disabled selected>Select a city</option>
      </select>
    </div>`;
      case "state":
        return `
    <div id="${field.code}">
      <label for="${field.code}">${field.label}</label>
      <select id="stateSelect" name="${field.code}"  required >
        <option value="" disabled selected>Select a state</option>
      </select>
    </div>`;

      case "radio":
        return `
          <label>${field.label}</label>
          <div>${field.options
            .map(
              (option) =>
                `<label>
          <input type="radio" name="${field.code}" value="${option}" required > ${option}</label>`
            )
            .join("")}
          </div><br/>`;
      case "lead_source":
        return `\n<div id="${field.code}" style="display:none;" >
        <label for="${field.code}">${field.label}</label>
        <input type="text" name="${field.code}" value="ivr" required >
        </div>`;
      case "text":
      default:
        return `\n<div id="${field.code}" >
        <label for="${field.code}">${field.label}</label>
        <input type="text" name="${field.code}" required >
        </div>`;
    }
  };

  // Function to copy HTML code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(htmlCode).then(
      () => {
        message.success("HTML Code Copied!");
      },
      (err) => {
        message.error("There was an error copying the HTML code.");
      }
    );
  };

  useEffect(() => {
    leadformfieldGetApi();
    getCityDropdownApi();
  }, []);

  useEffect(() => {
    //  render html for first 4 feild
    if (formData.length > 0) {
      generateHtmlAndPreview(selectedRowKeys);
    }
  }, [formData, selectedRowKeys]);

  return (
    <>
      <div className="mx-6 flex items-center justify-between mb-3">
        <h1 className={`${mode === "dark" ? "text-yellow-500" : "text-black"} font-semibold text-lg`}>Customise Widget</h1>
      </div>
      <div className="mx-6 rounded-lg border grid grid-cols-2 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-4">
          <h1 className={`${mode === "dark" ? "text-yellow-500" : "text-black"} font-semibold text-md `}>Select Fields</h1>
          <Divider />
          <Table
            rowSelection={{
              type: "checkbox",
              selectedRowKeys,
              onChange: (newSelectedRowKeys) => {
                setSelectedRowKeys(newSelectedRowKeys);
                generateHtmlAndPreview(newSelectedRowKeys);
              },
            }}
            columns={columns}
            dataSource={formData}
            pagination={{ hideOnSinglePage: true }}
            rowKey="code"
            scroll={{ x: "max-content" }}

            onRow={(record) => ({
              onClick: () => {
                const key = record.code;

                let newSelectedKeys = [...selectedRowKeys];

                if (newSelectedKeys.includes(key)) {
                  // remove if already selected
                  newSelectedKeys = newSelectedKeys.filter(
                    (item) => item !== key
                  );
                } else {
                  // add if not selected
                  newSelectedKeys.push(key);
                }

                setSelectedRowKeys(newSelectedKeys);
                generateHtmlAndPreview(newSelectedKeys);
              },
            })}
          />

        </div>
        <div className="p-4 border-x border-slate-200 ">
          <div className="w-full py-[10px] border-b flex justify-between">
            <h1 className={`${mode === "dark" ? "text-yellow-500" : "text-black"} font-semibold text-md `}>Html Code</h1>
            <Button
              type="primary"
              className={` ${mode === "dark"
                ? "text-yellow-500 border-yellow-500 dark:hover:text-black bg-meta-4"
                : "text-black"} text-xs h-[max-content] w-[max-content]`}
              onClick={copyToClipboard}
            >
              Copy
            </Button>
          </div>
          <div className={` ${mode === "dark" ? "text-white-500" : "text-black"} font-semibold text-md flex justify-between pt-2 `}>
            <textarea
              value={htmlCode}
              rows={26}
              style={{
                background: mode === "dark" ? "#141414" : "#ffffff",
                width: "100%",
                fontSize: "14px",
              }}
              className="focus:outline-none "
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomiseWidget;
