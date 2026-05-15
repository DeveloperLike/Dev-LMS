import React, { useEffect, useState } from "react";
import { Tabs, message, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import {
  getWhatsappTemplateListService,
  templateApplyTemplateService,
} from "../../Template/ApiService";
import { getLeadRealPhoneService , updateActivityLog } from "../ApiService";
import ChatWindow from "../../NewWhatsapp/ChatWindow";
import { baseurl } from "../../../lib/Constants";

const { TabPane } = Tabs;

const Whatsapp = ({ id, phoneNumber, fieldsWithValues }) => {
  const [whatsappData, setWhatsappData] = useState([]);
  const [whatsappPreview, setWhatsappPreview] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loadingChat, setLoadingChat] = useState(true);

  // ================= SEND TEMPLATE =================
  const handleSubmit = async () => {
    if (!whatsappPreview) {
      message.error("Please select a WhatsApp template first.");
      return;
    }

    try {
      const realPhone = await getLeadRealPhoneService(id);

      if (!realPhone) {
        message.error("Phone number not available for this lead.");
        return;
      }
      // await updateActivityLog(id, "whatsapp", `Sent WhatsApp message using template Name: ${whatsappData.find((t) => t.id === selectedTemplateId)?.name || selectedTemplateId}`, "");
      const formattedPhone = realPhone.replace(/\D/g, "");
      const encodedMessage = encodeURIComponent(whatsappPreview);

      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

      window.open(whatsappUrl, "_blank");
    } catch (error) {
      message.error("Failed to open WhatsApp");
    }
  };

  // ================= GET TEMPLATES =================
  const getWhatsappTemplates = () => {
    getWhatsappTemplateListService()
      .then((response) => {
        setWhatsappData(response.data.data || []);
      })
      .catch(() => { });
  };

  const handleSelectChange = (value) => {
    const selectedTemplate = whatsappData.find(
      (option) => option.id === value
    );

    if (!selectedTemplate) return;

    const variableMap = buildVariableMap(fieldsWithValues);

    const finalBody = replaceVariables(
      selectedTemplate.body,
      variableMap
    );

    setWhatsappPreview(finalBody);
    setSelectedTemplateId(selectedTemplate.id);

    templateApplyTemplateService({ template_id: value }, id);
  };

  const buildVariableMap = (fields) => {
    return (fields || []).reduce((acc, item) => {
      acc[item.code] = item.value;
      return acc;
    }, {});
  };

  const replaceVariables = (template, variables) => {
    return template.replace(/{{(.*?)}}/g, (_, key) => {
      return variables[key.trim()] ?? "";
    });
  };

  // ================= FETCH CHAT =================
  useEffect(() => {
    if (!phoneNumber) return;

    const fetchConversationId = async () => {
      setLoadingChat(true);

      try {
        const cleanPhone = String(phoneNumber).replace(/\D/g, "");

        const res = await fetch(
          baseurl + "/wati/getConversation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
            body: JSON.stringify({
              skip: 0,
              limit: 1,
              filter: {
                "other.phone": cleanPhone,
              },
            }),
          }
        );

        const data = await res.json();

        const list =
          data?.conversations ||
          data?.data ||
          (Array.isArray(data) ? data : []);

        if (!list.length) {
          const cleanPhone = String(phoneNumber).replace(/\D/g, "");

          const leadName =
            fieldsWithValues?.find((f) =>
              ["name", "full_name"].includes(f.code)
            )?.value || "Lead";

          setActiveChat({
            id: id,
            phone: cleanPhone,
            name: leadName,
            conversationId: cleanPhone,
            leadId: id,
          });

          return;
        }

        const conv = list[0];

        const conversationId =
          conv?.other?.conversationId || cleanPhone;

        const leadName =
          fieldsWithValues?.find((f) =>
            ["name", "full_name"].includes(f.code)
          )?.value ||
          conv?.full_name ||
          conv?.other?.full_name ||
          "Lead";

        setActiveChat({
          id: id,
          phone: cleanPhone,
          name: leadName,
          conversationId: conversationId,
          leadId: id,
        });

      } catch (err) {
        setActiveChat(null);
      } finally {
        setLoadingChat(false);
      }
    };

    fetchConversationId();
  }, [phoneNumber, id, fieldsWithValues]);

  useEffect(() => {
    getWhatsappTemplates();
  }, []);

  // ================= UI =================
  return (
    <div className="sticky">
      <Tabs defaultActiveKey="Message" size="small" destroyInactiveTabPane>

        {/* MESSAGE TAB */}
        <TabPane key="Message" tab="Message">
          {loadingChat ? (
            <div className="flex justify-center items-center h-[70vh]">
              <div className="animate-spin h-10 w-10 border-b-2 border-yellow-500 rounded-full"></div>
            </div>
          ) : !activeChat ? (
            <div className="flex items-center justify-center h-[70vh] text-gray-400">
              No conversation found for this lead
            </div>
          ) : (
            <div className="mt-6">
              <ChatWindow
                activeChat={activeChat}
                setChats={setChats}
                setActiveChat={setActiveChat}
                drafts={drafts}
                setDrafts={setDrafts}
              />
            </div>
          )}
        </TabPane>

        {/* SEND TAB */}
        <TabPane key="send" tab="Send">
          <div className="space-y-4 mt-6">

            <Select
              onChange={handleSelectChange}
              size="large"
              style={{ width: "100%" }}
              placeholder="Select Template"
              value={selectedTemplateId || undefined}
            >
              {whatsappData.map((option) => (
                <Select.Option key={option.id} value={option.id}>
                  {option.name}
                </Select.Option>
              ))}
            </Select>

            {whatsappPreview && (
              <>
                <TextArea disabled value={whatsappPreview} rows={12} />

                <PrimaryButton
                  onClick={handleSubmit}
                  title="Send"
                />
              </>
            )}

          </div>
        </TabPane>

      </Tabs>
    </div>
  );
};

export default Whatsapp;