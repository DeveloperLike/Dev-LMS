import React, { useState } from "react";
import { Tabs } from "antd";
import SmsTemplate from "./SmsTemplate/SmsTemplate";
import EmailTemplate from "./EmailTemplate/EmailTemplate";
import { useSelector } from "react-redux";
import WhatsappTemplate from "./WhatsappTemplate/WhatsappTemplate";

// 🔥 Feature Toggle
const ENABLE_SMS = false;

const Template = ({ mode }) => {
  const [btnName, setBtnName] = useState(
    ENABLE_SMS ? "Add SMS Template" : "Add Whatsapp Template"
  );

  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const templateModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );

  // ✅ Tabs dynamically build
  const items = [
    ...(ENABLE_SMS
      ? [
          {
            key: "1",
            label: "SMS",
            children: <SmsTemplate open={open} setOpen={setOpen} />,
          },
        ]
      : []),

    {
      key: "2",
      label: "Whatsapp",
      children: (
        <WhatsappTemplate
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      ),
    },
    {
      key: "3",
      label: "Email",
      children: (
        <EmailTemplate
          isEmailModalOpen={isEmailModalOpen}
          setIsEmailModalOpen={setIsEmailModalOpen}
        />
      ),
    },
  ];

  const handleBtnName = (activeKey) => {
    if (activeKey === "1" && ENABLE_SMS) {
      setBtnName("Add SMS Template");
    } else if (activeKey === "2") {
      setBtnName("Add Whatsapp Template");
    } else if (activeKey === "3") {
      setBtnName("Add Email Template");
    }
  };

  // SMS
  const showDrawer = () => {
    setOpen(true);
  };

  // WhatsApp
  const showWhatsappDrawer = () => {
    setIsModalOpen(true);
  };

  // Email
  const showModal = () => {
    setIsEmailModalOpen(true);
  };

  return (
    <>
      <div className="mx-6 mb-3">
        <div className="justify-self-end">

          {/* ✅ SMS Button (controlled) */}
          {ENABLE_SMS &&
            templateModulePermission.template_management === "edit" &&
            btnName === "Add SMS Template" && (
              <button
                className={`${mode === "dark"
                  ? "text-yellow-500 border-yellow-500 hover:text-white"
                  : "text-black"} dark:hover:bg-yellow-500 bg-[#ffce00] hover:bg-orange-500 dark:bg-meta-4 shadow border px-3 py-1 rounded`}
                onClick={showDrawer}
              >
                Add SMS Template
              </button>
            )}

          {/* WhatsApp */}
          {templateModulePermission.template_management === "edit" &&
            btnName === "Add Whatsapp Template" && (
              <button
                className={`${mode === "dark"
                  ? "text-yellow-500 border-yellow-500 hover:text-white"
                  : "text-black"} dark:hover:bg-yellow-500 bg-[#ffce00] hover:bg-orange-500 dark:bg-meta-4 shadow border px-3 py-1 rounded`}
                onClick={showWhatsappDrawer}
              >
                Add Whatsapp Template
              </button>
            )}

          {/* Email */}
          {templateModulePermission.template_management === "edit" &&
            btnName === "Add Email Template" && (
              <button
                className={`${mode === "dark"
                  ? "text-yellow-500 border-yellow-500 hover:text-white"
                  : "text-black"} dark:hover:bg-yellow-500 bg-[#ffce00] hover:bg-orange-500 dark:bg-meta-4 shadow border px-3 py-1 rounded`}
                onClick={showModal}
              >
                Add Email Template
              </button>
            )}
        </div>
      </div>

      <div className="mx-6 rounded-lg border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <Tabs
          className="w-full"
          defaultActiveKey={ENABLE_SMS ? "1" : "2"}
          items={items}
          onChange={(activeKey) => handleBtnName(activeKey)}
        />
      </div>
    </>
  );
};

export default Template;