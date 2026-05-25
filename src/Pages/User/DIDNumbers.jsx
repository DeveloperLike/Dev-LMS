import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { message, Tooltip, Spin, Modal, Switch, Pagination } from "antd";
import { MdOutlineEdit, MdAdd, MdSearch } from "react-icons/md";
import {
  getDIDNumbersService,
  createDIDNumberService,
  updateDIDNumberService,
  toggleDIDNumberActiveService,
} from "./DIDNumbersApiService";

const PRIMARY_COLOR = "rgb(255 206 0)";

const DIDNumbers = () => {
  const [didList, setDidList] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Selector for permissions and UI mode
  const userModulePermission = useSelector(
    (state) => state.permissions.permissionsData || {}
  );
  
  // Dynamic theme detection
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const mode = isDark ? "dark" : "light";

  const initialForm = {
    provider: "",
    did_number: "",
    truecaller_name: "",
    is_active: true,
  };

  const [form, setForm] = useState(initialForm);

  // Fetch DID Numbers with server-side pagination and search
  const fetchDIDs = async (currentPage = page, currentPageSize = pageSize, currentSearch = search) => {
    setLoading(true);
    try {
      const response = await getDIDNumbersService({
        current_page_number: currentPage,
        count_per_page: currentPageSize,
        search: currentSearch.trim() || undefined,
      });
      if (response.data && response.data.success === "1") {
        setDidList(response.data.data || []);
        setTotal(response.data.data_count || 0);
      } else {
        message.error(response.data.message || "Failed to load DID numbers");
      }
    } catch (error) {
      console.error("Error loading DID numbers:", error);
      message.error("An error occurred while loading DID numbers");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search input to prevent network spamming
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      fetchDIDs(1, pageSize, search);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Handle page & page-size changes
  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);
    fetchDIDs(newPage, newPageSize, search);
  };

  // Form input change handler
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit Add/Edit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.provider.trim() || !form.did_number.trim()) {
      message.warning("Provider and DID Number are required fields");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        // Update
        const response = await updateDIDNumberService(editingId, form);
        if (response.data && response.data.success === "1") {
          message.success("DID number updated successfully");
          setShowModal(false);
          setForm(initialForm);
          setEditingId(null);
          fetchDIDs(page, pageSize, search);
        } else {
          message.error(response.data.message || "Failed to update DID number");
        }
      } else {
        // Create
        const response = await createDIDNumberService(form);
        if (response.data && response.data.success === "1") {
          message.success("DID number registered successfully");
          setShowModal(false);
          setForm(initialForm);
          setPage(1);
          fetchDIDs(1, pageSize, search);
        } else {
          message.error(response.data.message || "Failed to register DID number");
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      const errMsg = error.response?.data?.message || "Operation failed. Please verify unique properties.";
      message.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit mode
  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      provider: item.provider,
      did_number: item.did_number,
      truecaller_name: item.truecaller_name || "",
      is_active: item.is_active,
    });
    setShowModal(true);
  };

  // Toggle Active State
  const handleToggleActive = async (id) => {
    setActionLoadingId(id);
    try {
      const response = await toggleDIDNumberActiveService(id);
      if (response.data && response.data.success === "1") {
        message.success("Status updated successfully");
        fetchDIDs(page, pageSize, search);
      } else {
        message.error(response.data.message || "Failed to toggle status");
      }
    } catch (error) {
      console.error("Toggle active error:", error);
      message.error("Failed to update status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filtered list is directly the paginated didList returned by backend
  const filteredList = didList;

  const canEdit = userModulePermission.staff_management === "edit";

  return (
    <div className="mx-6 my-4">
      {/* Top Header Section */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-stroke dark:border-strokedark">
        <div>
          <h1
            className={`font-semibold text-2xl ${
              mode === "dark" ? "text-yellow-500" : "text-black"
            }`}
          >
            DID Numbers
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your corporate direct inward dialing numbers, providers, and Truecaller designations.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => {
              setEditingId(null);
              setForm(initialForm);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#ffce00] hover:bg-[#e6b800] text-black font-semibold rounded-lg shadow-sm transition duration-150 ease-in-out"
          >
            <MdAdd className="text-xl" />
            Add DID Number
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-4 mb-6 bg-white dark:bg-[#1a222c] p-4 rounded-xl shadow-sm border border-stroke dark:border-strokedark">
        <div className="relative flex-1 max-w-md">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          <input
            type="text"
            placeholder="Search by number, provider, or truecaller name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ffce00] focus:border-transparent transition-all"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          {total} DID number{total !== 1 ? "s" : ""} registered
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" tip="Loading DID configuration..." />
        </div>
      ) : filteredList.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-20 bg-white dark:bg-[#1a222c] rounded-2xl border border-stroke dark:border-strokedark">
          <p className="text-slate-400 dark:text-slate-500 font-medium text-lg">
            No DID Numbers registered yet
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
            {search.trim() ? "Try adjusting your search criteria" : "Click 'Add DID Number' to register a new entry"}
          </p>
        </div>
      ) : (
        /* Dynamic Premium Table */
        <div className="overflow-hidden bg-white dark:bg-[#1a222c] rounded-2xl border border-stroke dark:border-strokedark shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-stroke dark:border-strokedark text-slate-500 dark:text-slate-400 font-semibold text-sm">
                <th className="py-4 px-6">Provider</th>
                <th className="py-4 px-6">DID Number</th>
                <th className="py-4 px-6">Truecaller Identity</th>
                <th className="py-4 px-6 text-center">Status</th>
                {canEdit && <th className="py-4 px-6 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-stroke dark:border-strokedark hover:bg-slate-50/50 dark:hover:bg-slate-800/20 text-slate-700 dark:text-slate-200 text-sm font-medium transition"
                >
                  <td className="py-4 px-6 capitalize">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
                      {item.provider}
                    </span>
                  </td>
                  <td className="py-4 px-6 tracking-wide font-mono font-semibold text-slate-900 dark:text-white">
                    {item.did_number}
                  </td>
                  <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                    {item.truecaller_name || <em className="text-slate-300 dark:text-slate-600">Not set</em>}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {actionLoadingId === item.id ? (
                      <Spin size="small" />
                    ) : (
                      <Switch
                        checked={item.is_active}
                        disabled={!canEdit || actionLoadingId !== null}
                        onChange={() => handleToggleActive(item.id)}
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                        style={{
                          backgroundColor: item.is_active ? "#10b981" : "#ef4444",
                        }}
                      />
                    )}
                  </td>
                  {canEdit && (
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-3">
                        <Tooltip title="Edit Details">
                          <button
                            disabled={actionLoadingId !== null}
                            onClick={() => handleEdit(item)}
                            className="p-1.5 bg-slate-50 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-amber-950/30 text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 rounded-lg transition"
                          >
                            <MdOutlineEdit className="text-lg" />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-stroke dark:border-strokedark bg-slate-50/50 dark:bg-slate-800/20">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Showing {total === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} entries
            </div>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["10", "20", "50", "100"]}
              size="small"
              className="dark:text-white"
            />
          </div>
        </div>
      )}

      {/* Add / Edit Antd Modal */}
      <Modal
        title={
          <span className="font-bold text-xl tracking-tight dark:text-white block mt-1">
            {editingId ? "Update DID Number" : "Add DID Number"}
          </span>
        }
        visible={showModal}
        onCancel={() => {
          if (!submitting) {
            setShowModal(false);
            setEditingId(null);
            setForm(initialForm);
          }
        }}
        footer={null}
        destroyOnClose
        centered
        width={500}
        styles={{
          body: {
            padding: "10px 0 0 0",
          },
          content: {
            backgroundColor: mode === "dark" ? "#1b2432" : "#ffffff",
            borderRadius: "16px",
            border: mode === "dark" ? "1px solid #2d3a4f" : "1px solid #e2e8f0",
            padding: "24px 28px",
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          },
          header: {
            backgroundColor: "transparent",
            borderBottom: "none",
            marginBottom: "20px",
          }
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Provider <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="provider"
              placeholder="e.g. Airtel, Jio, Tata, RouteMobile"
              value={form.provider}
              onChange={handleChange}
              disabled={submitting}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a222c] rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ffce00] focus:border-transparent transition-all duration-200 disabled:opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              DID Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="did_number"
              placeholder="e.g. +91 98765 43210"
              value={form.did_number}
              onChange={handleChange}
              disabled={submitting}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a222c] rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ffce00] focus:border-transparent transition-all duration-200 disabled:opacity-50 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Truecaller Identity (Optional)
            </label>
            <input
              type="text"
              name="truecaller_name"
              placeholder="e.g. Yes Germany Admission Department"
              value={form.truecaller_name}
              onChange={handleChange}
              disabled={submitting}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a222c] rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ffce00] focus:border-transparent transition-all duration-200 disabled:opacity-50"
            />
          </div>

          <div className="flex items-center gap-3 pt-1 pb-1">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              disabled={submitting}
              className="h-5 w-5 text-[#ffce00] border-slate-300 dark:border-slate-700 rounded focus:ring-[#ffce00] disabled:opacity-50 cursor-pointer accent-[#ffce00]"
            />
            <label
              htmlFor="is_active"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none"
            >
              Set Active by default
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-5 mt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setEditingId(null);
                setForm(initialForm);
              }}
              disabled={submitting}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-[#ffce00] hover:bg-[#e6b800] text-black font-semibold rounded-xl shadow-sm transition duration-200 disabled:opacity-50 flex items-center justify-center min-w-[100px]"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <Spin size="small" />
                  <span>Saving...</span>
                </div>
              ) : editingId ? (
                "Update"
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DIDNumbers;
