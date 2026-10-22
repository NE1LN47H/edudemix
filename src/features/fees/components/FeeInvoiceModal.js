"use client";

import { LoaderCircle, X } from "lucide-react";

export default function FeeInvoiceModal({
  isOpen,
  form,
  students,
  batches,
  saving,
  onChange,
  onClose,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="students-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
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
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="students-form-grid">
            <label className="students-form-field">
              <span>Student *</span>
              <select
                name="studentId"
                value={form.studentId}
                onChange={(e) => {
                  const stId = e.target.value;
                  const st = students.find((s) => s._id === stId);
                  onChange({
                    target: {
                      name: "studentId",
                      value: stId,
                      batchId: st?.batchId?._id || st?.batchId || "",
                    },
                  });
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
                value={form.batchId || ""}
                onChange={onChange}
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
                value={form.title}
                onChange={onChange}
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
                value={form.amount}
                onChange={onChange}
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
                value={form.paidAmount}
                onChange={onChange}
                placeholder="0"
              />
            </label>

            <label className="students-form-field">
              <span>Due Date *</span>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={onChange}
                required
              />
            </label>

            <label className="students-form-field">
              <span>Payment Mode</span>
              <select
                name="paymentMode"
                value={form.paymentMode}
                onChange={onChange}
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
                value={form.remarks}
                onChange={onChange}
                placeholder="Optional notes or details..."
              />
            </label>
          </div>

          <div className="students-modal-actions">
            <button
              type="button"
              className="students-secondary-button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="students-primary-button"
              disabled={saving}
            >
              {saving ? (
                <LoaderCircle className="students-spinner" size={16} />
              ) : null}
              {saving ? "Creating invoice..." : "Create invoice"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
