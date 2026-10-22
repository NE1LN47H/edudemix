"use client";

import { LoaderCircle, X } from "lucide-react";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default function FeePaymentModal({
  payingFee,
  paymentForm,
  savingPayment,
  onChange,
  onClose,
  onSubmit,
}) {
  if (!payingFee) return null;

  const dueBalance = Math.max(0, payingFee.amount - payingFee.paidAmount);

  return (
    <div
      className="students-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className="students-modal" style={{ maxWidth: 480 }}>
        <div className="students-modal-header">
          <div>
            <div className="eyebrow">RECORD PAYMENT</div>
            <h2>Pay fee balance</h2>
            <p>
              Student: <strong>{payingFee.studentId?.name}</strong> (Due:{" "}
              {formatCurrency(dueBalance)})
            </p>
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
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <label className="students-form-field">
              <span>Payment Amount (₹) *</span>
              <input
                type="number"
                min="1"
                max={dueBalance}
                name="amount"
                value={paymentForm.amount}
                onChange={onChange}
                required
              />
            </label>

            <label className="students-form-field">
              <span>Payment Mode *</span>
              <select
                name="paymentMode"
                value={paymentForm.paymentMode}
                onChange={onChange}
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
                name="paidDate"
                value={paymentForm.paidDate}
                onChange={onChange}
              />
            </label>

            <label className="students-form-field">
              <span>Notes / Transaction Reference</span>
              <input
                type="text"
                name="remarks"
                placeholder="e.g. UPI Ref / Cheque No."
                value={paymentForm.remarks}
                onChange={onChange}
              />
            </label>
          </div>

          <div className="students-modal-actions">
            <button
              type="button"
              className="students-secondary-button"
              onClick={onClose}
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
  );
}
