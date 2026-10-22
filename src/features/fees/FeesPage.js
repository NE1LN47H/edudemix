"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CreditCard,
  Plus,
  Search,
  X,
  LoaderCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import "./FeesPage.css";

const PAGE_SIZE = 10;

const EMPTY_FEE_FORM = {
  studentId: "",
  batchId: "",
  title: "Monthly Tuition Fee",
  amount: "",
  paidAmount: "0",
  dueDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
  paymentMode: "none",
  remarks: "",
};

const EMPTY_PAYMENT_FORM = {
  amount: "",
  paymentMode: "upi",
  paidDate: new Date().toISOString().slice(0, 10),
  remarks: "",
};

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function FeesPage() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  const [stats, setStats] = useState({
    totalInvoiced: 0,
    totalCollected: 0,
    totalPending: 0,
    paidCount: 0,
    partialCount: 0,
    pendingCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [feeForm, setFeeForm] = useState(EMPTY_FEE_FORM);
  const [savingFee, setSavingFee] = useState(false);

  const [payingFee, setPayingFee] = useState(null);
  const [paymentForm, setPaymentForm] = useState(EMPTY_PAYMENT_FORM);
  const [savingPayment, setSavingPayment] = useState(false);

  // Load students & batches for selectors
  useEffect(() => {
    async function loadResources() {
      try {
        const [studentRes, batchRes] = await Promise.all([
          fetch("/api/students?limit=100", { cache: "no-store" }),
          fetch("/api/batches?limit=100", { cache: "no-store" }),
        ]);
        const [studentData, batchData] = await Promise.all([
          studentRes.json(),
          batchRes.json(),
        ]);

        if (studentData.success) setStudents(studentData.students || []);
        if (batchData.success) setBatches(batchData.batches || []);
      } catch (err) {
        console.error("Failed to load resources", err);
      }
    }
    loadResources();
  }, []);

  const loadFees = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        search: search.trim(),
        status: statusFilter,
        page: String(page),
        limit: String(PAGE_SIZE),
      });

      const response = await fetch(`/api/fees?${params.toString()}`, {
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load fee records");
      }

      setFees(result.fees || []);
      if (result.stats) setStats(result.stats);
      if (result.pagination) setPagination(result.pagination);
    } catch (err) {
      setError(err.message || "Error loading fee records");
      setFees([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadFees();
    }, 250);
    return () => clearTimeout(timeout);
  }, [loadFees]);

  function handleCreateFeeSubmit(e) {
    e.preventDefault();
    setSavingFee(true);
    setError("");

    fetch("/api/fees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feeForm),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Unable to create fee invoice");
        }
        setSuccess("Fee record created successfully.");
        setShowCreateModal(false);
        setFeeForm(EMPTY_FEE_FORM);
        loadFees();
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setSavingFee(false));
  }

  function handleRecordPaymentSubmit(e) {
    e.preventDefault();
    if (!payingFee) return;

    setSavingPayment(true);
    setError("");

    fetch(`/api/fees/${payingFee._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentForm),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Unable to record payment");
        }
        setSuccess("Payment recorded successfully.");
        setPayingFee(null);
        setPaymentForm(EMPTY_PAYMENT_FORM);
        loadFees();
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setSavingPayment(false));
  }

  function handleDeleteFee(fee) {
    if (!window.confirm(`Are you sure you want to delete this fee record for ${fee.studentId?.name || "this student"}?`)) {
      return;
    }

    fetch(`/api/fees/${fee._id}`, { method: "DELETE" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Unable to delete fee record");
        }
        setSuccess("Fee record deleted.");
        loadFees();
      })
      .catch((err) => setError(err.message));
  }

  function openPaymentModal(fee) {
    setPayingFee(fee);
    const balance = Math.max(0, fee.amount - (fee.paidAmount || 0));
    setPaymentForm({
      ...EMPTY_PAYMENT_FORM,
      amount: String(balance),
    });
  }

  const collectionRate =
    stats.totalInvoiced > 0
      ? Math.round((stats.totalCollected / stats.totalInvoiced) * 100)
      : 0;

  return (
    <div className="fees-container">
      <section className="page-heading">
        <div>
          <div className="eyebrow">WORKSPACE</div>
          <h1>Fees & Payments</h1>
          <p className="page-description">
            Track student tuition fees, invoices, payments, and receipts.
          </p>
        </div>

        <button
          type="button"
          className="students-primary-button"
          onClick={() => {
            setFeeForm(EMPTY_FEE_FORM);
            setShowCreateModal(true);
          }}
        >
          <Plus size={16} />
          Create invoice
        </button>
      </section>

      {success && (
        <div className="students-notice students-notice-success" role="status">
          {success}
          <button type="button" onClick={() => setSuccess("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="students-notice students-notice-error" role="alert">
          {error}
          <button type="button" onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="fees-metrics">
        <div className="fees-metric-card">
          <span className="label">Total Invoiced</span>
          <span className="value">{formatCurrency(stats.totalInvoiced)}</span>
          <span className="sub">All-time invoices created</span>
        </div>

        <div className="fees-metric-card">
          <span className="label">Total Collected</span>
          <span className="value" style={{ color: "#166534" }}>
            {formatCurrency(stats.totalCollected)}
          </span>
          <span className="sub">{collectionRate}% collection rate</span>
        </div>

        <div className="fees-metric-card">
          <span className="label">Pending Dues</span>
          <span className="value" style={{ color: "#991b1b" }}>
            {formatCurrency(stats.totalPending)}
          </span>
          <span className="sub">{stats.pendingCount + stats.partialCount} pending invoices</span>
        </div>

        <div className="fees-metric-card">
          <span className="label">Fully Paid</span>
          <span className="value">{stats.paidCount}</span>
          <span className="sub">Cleared student invoices</span>
        </div>
      </div>

      <section className="fees-panel">
        <div className="fees-toolbar">
          <div className="fees-filter-tabs">
            {["", "pending", "partial", "paid"].map((status) => (
              <button
                key={status}
                type="button"
                className={`fees-tab-btn ${
                  statusFilter === status ? "active" : ""
                }`}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
              >
                {status === ""
                  ? "All records"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <label className="students-search">
            <Search size={16} />
            <input
              type="search"
              placeholder="Search student, receipt #..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            {search && (
              <button type="button" onClick={() => setSearch("")}>
                <X size={14} />
              </button>
            )}
          </label>
        </div>

        {loading ? (
          <div className="students-state">
            <LoaderCircle className="students-spinner" size={25} />
            <p>Loading fee records...</p>
          </div>
        ) : fees.length === 0 ? (
          <div className="students-state">
            <div className="students-state-icon">
              <CreditCard size={24} />
            </div>
            <h3>No fee records found</h3>
            <p>Create fee invoices for your students to track payments.</p>
            <button
              type="button"
              className="students-secondary-button"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={15} />
              Create invoice
            </button>
          </div>
        ) : (
          <>
            <div className="fees-table-wrap">
              <table className="fees-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Batch</th>
                    <th>Title</th>
                    <th>Due Date</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Receipt #</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {fees.map((fee) => {
                    const balance = Math.max(0, fee.amount - (fee.paidAmount || 0));
                    return (
                      <tr key={fee._id}>
                        <td>
                          <div className="students-person">
                            <div className="students-avatar">
                              {(fee.studentId?.name || "?").charAt(0).toUpperCase()}
                            </div>
                            <div className="students-person-info">
                              <span className="students-person-name">
                                {fee.studentId?.name || "Unknown student"}
                              </span>
                              <span className="students-person-email">
                                {fee.studentId?.admissionNumber || "—"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          {fee.batchId?.name ? (
                            <span className="student-batch-tag">
                              {fee.batchId.name}
                            </span>
                          ) : (
                            <span className="student-batch-unassigned">None</span>
                          )}
                        </td>

                        <td>{fee.title}</td>

                        <td>{formatDate(fee.dueDate)}</td>

                        <td style={{ fontWeight: 600 }}>
                          {formatCurrency(fee.amount)}
                        </td>

                        <td style={{ color: "#166534", fontWeight: 550 }}>
                          {formatCurrency(fee.paidAmount)}
                        </td>

                        <td style={{ color: balance > 0 ? "#991b1b" : "#666", fontWeight: 550 }}>
                          {formatCurrency(balance)}
                        </td>

                        <td>
                          <span className={`status-badge status-${fee.status}`}>
                            {fee.status}
                          </span>
                        </td>

                        <td>
                          {fee.receiptNumber ? (
                            <span className="receipt-tag">{fee.receiptNumber}</span>
                          ) : (
                            "—"
                          )}
                        </td>

                        <td>
                          <div className="student-actions-cell">
                            {fee.status !== "paid" && (
                              <button
                                type="button"
                                className="fee-pay-btn"
                                onClick={() => openPaymentModal(fee)}
                                title="Record payment"
                              >
                                Record pay
                              </button>
                            )}

                            <button
                              type="button"
                              className="student-action-btn delete"
                              onClick={() => handleDeleteFee(fee)}
                              title="Delete fee"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="students-pagination">
              <span>
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, pagination.total)} of{" "}
                {pagination.total} records
              </span>

              <div className="students-pagination-controls">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft size={16} />
                </button>

                <span>
                  Page {page} of {Math.max(1, pagination.totalPages)}
                </span>

                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Modal: Create Fee Invoice */}
      {showCreateModal && (
        <div
          className="students-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
        >
          <section className="students-modal">
            <div className="students-modal-header">
              <div>
                <div className="eyebrow">BILLING & INVOICING</div>
                <h2>Create fee invoice</h2>
                <p>Issue a new fee payment request to a student.</p>
              </div>

              <button
                type="button"
                className="students-modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateFeeSubmit}>
              <div className="students-form-grid">
                <label className="students-form-field">
                  <span>Student *</span>
                  <select
                    name="studentId"
                    value={feeForm.studentId}
                    onChange={(e) => {
                      const stId = e.target.value;
                      const st = students.find((s) => s._id === stId);
                      setFeeForm((prev) => ({
                        ...prev,
                        studentId: stId,
                        batchId: st?.batchId?._id || st?.batchId || prev.batchId,
                      }));
                    }}
                    required
                  >
                    <option value="">Select a student...</option>
                    {students.map((st) => (
                      <option key={st._id} value={st._id}>
                        {st.name} ({st.admissionNumber})
                      </option>
                    ))}
                  </select>
                </label>

                <label className="students-form-field">
                  <span>Batch (Optional)</span>
                  <select
                    name="batchId"
                    value={feeForm.batchId || ""}
                    onChange={(e) =>
                      setFeeForm((p) => ({ ...p, batchId: e.target.value }))
                    }
                  >
                    <option value="">No specific batch</option>
                    {batches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name} ({b.courseName})
                      </option>
                    ))}
                  </select>
                </label>

                <label className="students-form-field">
                  <span>Invoice Title *</span>
                  <input
                    name="title"
                    value={feeForm.title}
                    onChange={(e) =>
                      setFeeForm((p) => ({ ...p, title: e.target.value }))
                    }
                    placeholder="e.g. Monthly Tuition - Oct 2026"
                    required
                  />
                </label>

                <label className="students-form-field">
                  <span>Total Amount (₹) *</span>
                  <input
                    type="number"
                    name="amount"
                    min="1"
                    value={feeForm.amount}
                    onChange={(e) =>
                      setFeeForm((p) => ({ ...p, amount: e.target.value }))
                    }
                    placeholder="e.g. 5000"
                    required
                  />
                </label>

                <label className="students-form-field">
                  <span>Initial Paid Amount (₹)</span>
                  <input
                    type="number"
                    name="paidAmount"
                    min="0"
                    value={feeForm.paidAmount}
                    onChange={(e) =>
                      setFeeForm((p) => ({ ...p, paidAmount: e.target.value }))
                    }
                    placeholder="0"
                  />
                </label>

                <label className="students-form-field">
                  <span>Due Date *</span>
                  <input
                    type="date"
                    name="dueDate"
                    value={feeForm.dueDate}
                    onChange={(e) =>
                      setFeeForm((p) => ({ ...p, dueDate: e.target.value }))
                    }
                    required
                  />
                </label>

                <label className="students-form-field">
                  <span>Payment Mode</span>
                  <select
                    name="paymentMode"
                    value={feeForm.paymentMode}
                    onChange={(e) =>
                      setFeeForm((p) => ({ ...p, paymentMode: e.target.value }))
                    }
                  >
                    <option value="none">None / Pending</option>
                    <option value="upi">UPI</option>
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="card">Card</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </label>

                <label className="students-form-field students-form-field-full">
                  <span>Remarks</span>
                  <textarea
                    name="remarks"
                    rows={2}
                    value={feeForm.remarks}
                    onChange={(e) =>
                      setFeeForm((p) => ({ ...p, remarks: e.target.value }))
                    }
                    placeholder="Optional notes or details..."
                  />
                </label>
              </div>

              <div className="students-modal-actions">
                <button
                  type="button"
                  className="students-secondary-button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={savingFee}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="students-primary-button"
                  disabled={savingFee}
                >
                  {savingFee ? (
                    <LoaderCircle className="students-spinner" size={16} />
                  ) : null}
                  {savingFee ? "Creating invoice..." : "Create invoice"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Modal: Record Payment */}
      {payingFee && (
        <div
          className="students-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPayingFee(null);
          }}
        >
          <section className="students-modal" style={{ maxWidth: 480 }}>
            <div className="students-modal-header">
              <div>
                <div className="eyebrow">RECORD PAYMENT</div>
                <h2>Pay fee balance</h2>
                <p>
                  Student: <strong>{payingFee.studentId?.name}</strong> (Due:{" "}
                  {formatCurrency(payingFee.amount - payingFee.paidAmount)})
                </p>
              </div>

              <button
                type="button"
                className="students-modal-close"
                onClick={() => setPayingFee(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <label className="students-form-field">
                  <span>Payment Amount (₹) *</span>
                  <input
                    type="number"
                    min="1"
                    max={payingFee.amount - payingFee.paidAmount}
                    value={paymentForm.amount}
                    onChange={(e) =>
                      setPaymentForm((p) => ({ ...p, amount: e.target.value }))
                    }
                    required
                  />
                </label>

                <label className="students-form-field">
                  <span>Payment Mode *</span>
                  <select
                    value={paymentForm.paymentMode}
                    onChange={(e) =>
                      setPaymentForm((p) => ({ ...p, paymentMode: e.target.value }))
                    }
                    required
                  >
                    <option value="upi">UPI</option>
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="card">Card</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </label>

                <label className="students-form-field">
                  <span>Payment Date</span>
                  <input
                    type="date"
                    value={paymentForm.paidDate}
                    onChange={(e) =>
                      setPaymentForm((p) => ({ ...p, paidDate: e.target.value }))
                    }
                  />
                </label>

                <label className="students-form-field">
                  <span>Notes / Transaction Reference</span>
                  <input
                    type="text"
                    placeholder="e.g. UPI Ref / Cheque No."
                    value={paymentForm.remarks}
                    onChange={(e) =>
                      setPaymentForm((p) => ({ ...p, remarks: e.target.value }))
                    }
                  />
                </label>
              </div>

              <div className="students-modal-actions">
                <button
                  type="button"
                  className="students-secondary-button"
                  onClick={() => setPayingFee(null)}
                  disabled={savingPayment}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="students-primary-button"
                  disabled={savingPayment}
                >
                  {savingPayment ? (
                    <LoaderCircle className="students-spinner" size={16} />
                  ) : null}
                  {savingPayment ? "Recording..." : "Confirm payment"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
