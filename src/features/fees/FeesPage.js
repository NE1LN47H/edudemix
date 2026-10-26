"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { Plus, CreditCard, LoaderCircle } from "lucide-react";
import FeeMetrics from "./components/FeeMetrics";
import FeeToolbar from "./components/FeeToolbar";
import FeeTable from "./components/FeeTable";
import FeeInvoiceModal from "./components/FeeInvoiceModal";
import FeePaymentModal from "./components/FeePaymentModal";
import Pagination from "@/components/ui/Pagination";
import NoticeBanner from "@/components/ui/NoticeBanner";
import { SkeletonTable } from "@/components/ui/Skeleton";
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

  const [initialLoading, setInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentRequestRef = useRef(0);
  const abortControllerRef = useRef(null);

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
    const requestId = ++currentRequestRef.current;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsRefreshing(true);
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
        signal: controller.signal,
      });
      const result = await response.json();

      if (requestId !== currentRequestRef.current) return;

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load fee records");
      }

      setFees(result.fees || []);
      if (result.stats) setStats(result.stats);
      if (result.pagination) setPagination(result.pagination);
    } catch (err) {
      if (err.name === "AbortError") return;
      if (requestId === currentRequestRef.current) {
        setError(err.message || "Error loading fee records");
      }
    } finally {
      if (requestId === currentRequestRef.current) {
        setInitialLoading(false);
        setIsRefreshing(false);
      }
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
    if (
      !window.confirm(
        `Are you sure you want to delete this fee record for ${
          fee.studentId?.name || "this student"
        }?`
      )
    ) {
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

      <NoticeBanner
        type="success"
        message={success}
        onDismiss={() => setSuccess("")}
      />
      <NoticeBanner
        type="error"
        message={error}
        onDismiss={() => setError("")}
      />

      <FeeMetrics stats={stats} collectionRate={collectionRate} />

      <section className="fees-panel">
        <FeeToolbar
          statusFilter={statusFilter}
          search={search}
          onStatusChange={(status) => {
            setStatusFilter(status);
            setPage(1);
          }}
          onSearchChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          onClearSearch={() => {
            setSearch("");
            setPage(1);
          }}
        />

        {initialLoading ? (
          <SkeletonTable rows={7} columns={6} />
        ) : error && fees.length === 0 ? (
          <div className="students-state">
            <div className="students-state-icon">
              <CreditCard size={24} />
            </div>
            <h3>Unable to load fees</h3>
            <p>{error}</p>
            <button
              type="button"
              className="students-secondary-button"
              onClick={loadFees}
            >
              Try again
            </button>
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
          <div className={`reveal-content ${isRefreshing ? "is-refreshing" : ""}`.trim()}>
            <FeeTable
              fees={fees}
              onOpenPayment={openPaymentModal}
              onDeleteFee={handleDeleteFee}
            />

            <Pagination
              page={page}
              totalPages={pagination.totalPages}
              totalRecords={pagination.total}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </div>
        )}
      </section>

      <FeeInvoiceModal
        isOpen={showCreateModal}
        form={feeForm}
        students={students}
        batches={batches}
        saving={savingFee}
        onChange={(e) => {
          const { name, value, batchId } = e.target;
          setFeeForm((prev) => ({
            ...prev,
            [name]: value,
            ...(batchId ? { batchId } : {}),
          }));
        }}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateFeeSubmit}
      />

      <FeePaymentModal
        payingFee={payingFee}
        paymentForm={paymentForm}
        savingPayment={savingPayment}
        onChange={(e) => {
          const { name, value } = e.target;
          setPaymentForm((prev) => ({ ...prev, [name]: value }));
        }}
        onClose={() => setPayingFee(null)}
        onSubmit={handleRecordPaymentSubmit}
      />
    </div>
  );
}
