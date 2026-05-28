import React, { useEffect, useMemo, useState } from "react";
import {
  getSMTPSettingsService,
  getSMTPSettingDetailsService,
  createSMTPSettingService,
  updateSMTPSettingService,
  deleteSMTPSettingService,
  activateSMTPSettingService,
  toggleSMTPActiveService,
  setSMTPPrimaryService,
  testSMTPConnectionService,
} from "./ApiService";
import { Badge, message, Drawer, Tooltip } from "antd";
import { CustomSelectInput } from "../../../Components/CustomComponents/InputWithIcon";
import { MdDeleteOutline, MdOutlineEdit, MdOutlineFactCheck } from "react-icons/md";
import { color } from "framer-motion";

const PRIMARY_COLOR = "rgb(255 206 0)";

const MailSettings = () => {
  const [smtpList, setSmtpList] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const colors = {
    background: isDark ? "rgb(26 34 44)" : "#f1f5f9",
    card: isDark ? "rgb(26 34 44)" : "hsl(var(--card))",
    foreground: "hsl(var(--foreground))",
    border: "hsl(var(--border))",
    muted: "hsl(var(--muted))",
    mutedForeground: "hsl(var(--muted-foreground))",
    input: isDark
      ? "rgba(255,255,255,0.05)"
      : "hsl(var(--background))",
  };

  const initialForm = {
    smtp_name: "",
    smtp_host: "",
    smtp_port: "",
    smtp_user: "",
    smtp_password: "",
    from_name: "",
    from_email: "",
    status: true,
    is_primary: false,
  };

  const [form, setForm] = useState(initialForm);

  const mapBEToFE = (item) => ({
    id: item.id,
    smtp_name: item.provider_name,
    smtp_host: item.host,
    smtp_port: String(item.port),
    smtp_user: item.username,
    smtp_password: item.password || "",
    from_name: item.from_name || "",
    from_email: item.from_email || "",
    status: item.is_active,
    is_primary: item.is_primary,
  });

  const mapFEToBE = (form) => ({
    provider_name: form.smtp_name,
    host: form.smtp_host,
    port: parseInt(form.smtp_port, 10),
    username: form.smtp_user,
    password: form.smtp_password,
    from_name: form.from_name,
    from_email: form.from_email,
    is_active: form.status,
    is_primary: form.is_primary,
  });

  const fetchSMTPs = async () => {
    try {
      const response = await getSMTPSettingsService();
      if (response.data && response.data.success === "1") {
        const mapped = response.data.data.map(mapBEToFE);
        setSmtpList(mapped);
      } else {
        console.error("Failed to fetch SMTP records:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching SMTPs:", error);
    }
  };

  useEffect(() => {
    fetchSMTPs();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.smtp_name ||
      !form.smtp_host ||
      !form.smtp_port ||
      !form.smtp_user ||
      !form.smtp_password ||
      !form.from_name ||
      !form.from_email
    ) {
      message.warning("Please fill all fields");
      return;
    }

    setSubmitting(true);
    try {
      const payload = mapFEToBE(form);
      if (editingId) {
        const response = await updateSMTPSettingService(payload, editingId);
        if (response.data && response.data.success === "1") {
          message.success("SMTP Updated Successfully");
          await fetchSMTPs();
          closeModal();
        } else {
          message.error("Failed to update SMTP: " + response.data.message);
        }
      } else {
        const response = await createSMTPSettingService(payload);
        if (response.data && response.data.success === "1") {
          message.success("SMTP Added Successfully");
          await fetchSMTPs();
          closeModal();
        } else {
          message.error("Failed to add SMTP: " + response.data.message);
        }
      }
    } catch (error) {
      console.error("Submit SMTP error:", error);
      message.error("Error saving SMTP: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      smtp_name: item.smtp_name,
      smtp_host: item.smtp_host,
      smtp_port: item.smtp_port,
      smtp_user: item.smtp_user,
      smtp_password: item.smtp_password,
      from_name: item.from_name,
      from_email: item.from_email,
      status: item.status,
      is_primary: item.is_primary,
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (actionLoadingId) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this SMTP?"
    );

    if (!confirmDelete) return;

    setActionLoadingId(id);
    try {
      const response = await deleteSMTPSettingService(id);
      if (response.data && response.data.success === "1") {
        message.success("SMTP Deleted Successfully");
        await fetchSMTPs();
      } else {
        message.error("Failed to delete SMTP: " + response.data.message);
      }
    } catch (error) {
      console.error("Delete SMTP error:", error);
      message.error("Error deleting SMTP: " + (error.response?.data?.message || error.message));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleActivate = async (item) => {
    if (actionLoadingId) return;
    const confirmToggle = window.confirm(
      `Are you sure you want to ${item.status ? "deactivate" : "activate"} "${item.smtp_name}"?`
    );
    if (!confirmToggle) return;

    setActionLoadingId(item.id);
    try {
      const response = await toggleSMTPActiveService(item.id);
      if (response.data && response.data.success === "1") {
        message.success(`"${item.smtp_name}" status updated successfully!`);
        await fetchSMTPs();
      } else {
        message.error("Failed to update SMTP status: " + response.data.message);
      }
    } catch (error) {
      console.error("Toggle active SMTP error:", error);
      message.error("Error toggling SMTP status: " + (error.response?.data?.message || error.message));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSetPrimary = async (item) => {
    if (actionLoadingId) return;
    if (item.is_primary) return;

    const confirmPrimary = window.confirm(
      `Are you sure you want to make "${item.smtp_name}" the default primary SMTP? Common website emails will be routed through it.`
    );
    if (!confirmPrimary) return;

    setActionLoadingId(item.id);
    try {
      const response = await setSMTPPrimaryService(item.id);
      if (response.data && response.data.success === "1") {
        message.success(`"${item.smtp_name}" is now the primary SMTP!`);
        await fetchSMTPs();
      } else {
        message.error("Failed to set primary SMTP: " + response.data.message);
      }
    } catch (error) {
      console.error("Set primary SMTP error:", error);
      message.error("Error setting primary SMTP: " + (error.response?.data?.message || error.message));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleTest = async (id) => {
    if (actionLoadingId) return;
    const testEmail = window.prompt(
      "Enter recipient email address for SMTP test connection:",
      "support@yesgermany.org"
    );
    if (!testEmail) return;

    setActionLoadingId(id);
    try {
      const response = await testSMTPConnectionService({ email: testEmail }, id);
      if (response.data && response.data.success === "1") {
        message.success(response.data.message || "Test email dispatched successfully!");
      } else {
        message.error("Failed to send test email: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Test SMTP error:", error);
      message.error(
        "SMTP Test Connection Failed: " +
        (error.response?.data?.message || error.message)
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const filteredSMTPs = useMemo(() => {
    return smtpList.filter(
      (item) =>
        item.smtp_name.toLowerCase().includes(search.toLowerCase()) ||
        item.smtp_user.toLowerCase().includes(search.toLowerCase())
    );
  }, [smtpList, search]);

  const styles = {
    page: {
      background: colors.background,
      minHeight: "100vh",
      padding: "30px",
      color: colors.foreground,
      fontFamily: "inherit",
      transition: "0.3s ease",
    },

    container: {
      background: colors.card,
      borderRadius: "20px",
      padding: "25px",
      border: `1px solid ${colors.border}`,
      boxShadow: isDark
        ? "0 10px 35px rgba(0,0,0,0.35)"
        : "0 4px 20px rgba(0,0,0,0.08)",
      transition: "0.3s ease",
    },

    topBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "25px",
    },

    heading: {
      fontSize: "24px",
      fontWeight: "700",
      letterSpacing: "-0.5px",
      margin: "0 0 4px 0",
      color: "#ffce00"
    },

    subHeading: {
      fontSize: "14px",
      color: colors.mutedForeground,
      margin: "0",
    },

    primaryBtn: {
      background: PRIMARY_COLOR,
      color: "#111",
      border: "none",
      padding: "10px 20px",
      borderRadius: "10px",
      fontWeight: "600",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(255, 206, 0, 0.25)",
      transition: "0.2s ease",
    },

    searchWrap: {
      marginBottom: "20px",
    },

    searchInput: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "10px",
      border: `1px solid ${colors.border}`,
      background: colors.input,
      color: colors.foreground,
      outline: "none",
      fontSize: "14px",
      transition: "0.2s ease",
    },

    tableWrap: {
      overflowX: "auto",
    },

    table: {
      width: "100%",
      borderCollapse: "collapse",
      textAlign: "left",
    },

    th: {
      padding: "14px 16px",
      borderBottom: `1px solid ${colors.border}`,
      color: colors.mutedForeground,
      fontSize: "12px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },

    td: {
      padding: "14px 16px",
      borderBottom: `1px solid ${colors.border}`,
      fontSize: "14px",
    },

    badge: {
      padding: "4px 8px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "600",
      display: "inline-block",
    },

    actionWrap: {
      display: "flex",
      gap: "10px",
    },

    editBtn: {
      background: PRIMARY_COLOR,
      color: "#111",
      border: `2px solid ${PRIMARY_COLOR}`,
      padding: "6px 12px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
    },

    testBtn: {
      background: "transparent",
      color: colors.foreground,
      border: `2px solid ${colors.border}`,
      padding: "6px 12px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "0.2s ease",
    },

    deleteBtn: {
      background: "transparent",
      color: PRIMARY_COLOR,
      border: `2px solid ${PRIMARY_COLOR}`,
      padding: "6px 12px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
    },

    noData: {
      textAlign: "center",
      padding: "40px",
      color: colors.mutedForeground,
    },

    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(4px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    },

    modal: {
      background: colors.card,
      borderRadius: "20px",
      width: "600px",
      maxWidth: "90%",
      padding: "30px",
      border: `1px solid ${colors.border}`,
      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    },

    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "25px",
    },

    modalTitle: {
      fontSize: "20px",
      fontWeight: "700",
      margin: 0,
    },

    closeBtn: {
      background: "none",
      border: "none",
      fontSize: "20px",
      color: colors.mutedForeground,
      cursor: "pointer",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
    },

    label: {
      display: "block",
      fontSize: "12px",
      fontWeight: "600",
      color: colors.mutedForeground,
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },

    input: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: "8px",
      border: `1px solid ${colors.border}`,
      background: colors.input,
      color: colors.foreground,
      outline: "none",
      fontSize: "14px",
    },

    checkboxWrap: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "14px",
      gridColumn: "1 / -1",
    },

    buttonWrap: {
      display: "flex",
      gap: "12px",
      marginTop: "25px",
    },

    secondaryBtn: {
      background: "transparent",
      color: colors.foreground,
      border: `2px solid ${colors.border}`,
      padding: "10px 20px",
      borderRadius: "10px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "0.2s ease",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <div>
            <h2 style={styles.heading}>SMTP Management</h2>

            <p style={styles.subHeading}>
              Manage all your SMTP configurations easily
            </p>
          </div>

          <button style={styles.primaryBtn} onClick={openAddModal}>
            + Add SMTP
          </button>
        </div>

        <div style={styles.searchWrap}>
          <input
            type="text"
            placeholder="Search SMTP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>SMTP Name</th>
                <th style={styles.th}>SMTP User</th>
                <th style={styles.th}>SMTP Host</th>
                <th style={styles.th}>Port</th>
                <th style={styles.th}>Status</th>
                <th
                  style={{
                    ...styles.th,
                    textAlign: "center",
                  }}
                >
                  Primary
                </th>
                <th
                  style={{
                    ...styles.th,
                    textAlign: "center",
                  }}
                >Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredSMTPs.length > 0 ? (
                filteredSMTPs.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.td}>{item.smtp_name}</td>
                    <td style={styles.td}>{item.smtp_user}</td>
                    <td style={styles.td}>{item.smtp_host}</td>
                    <td style={styles.td}>{item.smtp_port}</td>

                    <td style={styles.td}>
                      <div style={{ display: "flex", gap: "10px" }}>
                        {item.status ? (
                          <Badge status="success" />
                        ) : (
                          <Badge status="error" />
                        )}

                        <CustomSelectInput
                          className="w-full min-w-[100px]"
                          size="small"
                          value={item.status ? "Active" : "Inactive"}
                          options={[
                            {
                              value: true,
                              label: <Badge status="success" text="Active" />,
                            },
                            {
                              value: false,
                              label: <Badge status="error" text="Inactive" />,
                            },
                          ]}
                          handler={() => handleToggleActivate(item)}
                        />
                      </div>
                    </td>

                    <td
                      style={{
                        ...styles.td,
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <div
                        onClick={() => {
                          if (!actionLoadingId && item.status && !item.is_primary) {
                            handleSetPrimary(item);
                          }
                        }}
                        style={{
                          width: "42px",
                          height: "22px",
                          borderRadius: "999px",
                          background: item.is_primary
                            ? PRIMARY_COLOR
                            : isDark
                              ? "#374151"
                              : "#d1d5db",
                          position: "relative",
                          margin: "0 auto",
                          cursor:
                            actionLoadingId || !item.status || item.is_primary
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            actionLoadingId && actionLoadingId === item.id
                              ? 0.6
                              : item.status
                                ? 1
                                : 0.5,
                          transition: "0.25s ease",
                        }}
                      >
                        <div
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            background: item.is_primary ? "#111" : "#fff",
                            position: "absolute",
                            top: "3px",
                            left: item.is_primary ? "22px" : "4px",
                            transition: "0.25s ease",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                          }}
                        />
                      </div>
                    </td>
                    <td
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "14px 16px",
                        borderBottom: `1px solid ${colors.border}`,
                        fontSize: "14px",
                      }}>
                      <div style={styles.actionWrap}>
                        <Tooltip title="Edit SMTP">
                          <button
                            style={{
                              background: "transparent",
                              border: "none",
                              width: "34px",
                              height: "34px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: 0,
                              boxShadow: "none",
                              opacity: actionLoadingId ? 0.5 : 1,
                              cursor: actionLoadingId ? "not-allowed" : "pointer",
                            }}
                            disabled={!!actionLoadingId}
                            onClick={() => handleEdit(item)}
                          >
                            <MdOutlineEdit size={20} />
                          </button>
                        </Tooltip>

                        <Tooltip title="Test SMTP Connection">
                          <button
                            style={{
                              background: "transparent",
                              border: "none",
                              width: "34px",
                              height: "34px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: 0,
                              boxShadow: "none",
                              opacity: actionLoadingId ? 0.5 : 1,
                              cursor: actionLoadingId ? "not-allowed" : "pointer",
                            }}
                            disabled={!!actionLoadingId}
                            onClick={() => handleTest(item.id)}
                          >
                            <MdOutlineFactCheck size={20} />
                          </button>
                        </Tooltip>

                        <Tooltip title="Delete SMTP">
                          <button
                            style={{
                              background: "transparent",
                              border: "none",
                              width: "34px",
                              height: "34px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: 0,
                              boxShadow: "none",
                              opacity: actionLoadingId ? 0.5 : 1,
                              cursor: actionLoadingId ? "not-allowed" : "pointer",
                            }}
                            disabled={!!actionLoadingId}
                            onClick={() => handleDelete(item.id)}
                          >
                            <MdDeleteOutline size={20} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={styles.noData} colSpan="6">
                    No SMTP Records Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      <Drawer
        title={editingId ? "Update SMTP" : "Add SMTP"}
        placement="right"
        width={600}
        onClose={closeModal}
        open={showModal}
        destroyOnClose
        maskClosable
        styles={{
          body: {
            background: colors.card,
            padding: "24px",
          },
          header: {
            background: colors.card,
            borderBottom: `1px solid ${colors.border}`,
            color: colors.foreground,
          },
          content: {
            background: colors.card,
          },
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            <div>
              <label style={styles.label}>SMTP Name</label>

              <input
                type="text"
                name="smtp_name"
                value={form.smtp_name}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter SMTP Name"
              />
            </div>

            <div>
              <label style={styles.label}>SMTP Host</label>

              <input
                type="text"
                name="smtp_host"
                value={form.smtp_host}
                onChange={handleChange}
                style={styles.input}
                placeholder="smtp.gmail.com"
              />
            </div>

            <div>
              <label style={styles.label}>SMTP Port</label>

              <input
                type="number"
                name="smtp_port"
                value={form.smtp_port}
                onChange={handleChange}
                style={styles.input}
                placeholder="587"
              />
            </div>

            <div>
              <label style={styles.label}>SMTP User</label>

              <input
                type="text"
                name="smtp_user"
                value={form.smtp_user}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter SMTP User"
              />
            </div>

            <div>
              <label style={styles.label}>From Name</label>

              <input
                type="text"
                name="from_name"
                value={form.from_name}
                onChange={handleChange}
                style={styles.input}
                placeholder="Sender Name"
              />
            </div>

            <div>
              <label style={styles.label}>From Email</label>

              <input
                type="email"
                name="from_email"
                value={form.from_email}
                onChange={handleChange}
                style={styles.input}
                placeholder="sender@example.com"
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={styles.label}>SMTP Password</label>

              <input
                type="password"
                name="smtp_password"
                value={form.smtp_password}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter SMTP Password"
              />
            </div>

            <div style={styles.checkboxWrap}>
              <input
                type="checkbox"
                name="status"
                checked={form.status}
                onChange={handleChange}
              />

              <span>Active</span>
            </div>

            <div style={styles.checkboxWrap}>
              <input
                type="checkbox"
                name="is_primary"
                checked={form.is_primary}
                onChange={handleChange}
              />

              <span>Primary Default Routing</span>
            </div>
          </div>

          <div style={styles.buttonWrap}>
            <button
              type="submit"
              style={{
                ...styles.primaryBtn,
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
              disabled={submitting}
            >
              {submitting
                ? editingId
                  ? "Updating..."
                  : "Saving..."
                : editingId
                  ? "Update SMTP"
                  : "Save SMTP"}
            </button>

            <button
              type="button"
              style={{
                ...styles.secondaryBtn,
                opacity: submitting ? 0.5 : 1,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
              onClick={closeModal}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default MailSettings;