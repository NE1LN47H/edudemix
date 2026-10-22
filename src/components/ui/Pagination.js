"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
}) {
  if (totalRecords === 0) return null;

  const firstRecord = (page - 1) * pageSize + 1;
  const lastRecord = Math.min(page * pageSize, totalRecords);
  const safeTotalPages = Math.max(1, totalPages);

  return (
    <div className="students-pagination">
      <span>
        Showing {firstRecord}–{lastRecord} of {totalRecords} records
      </span>

      <div className="students-pagination-controls">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} />
        </button>

        <span>
          Page {page} of {safeTotalPages}
        </span>

        <button
          type="button"
          aria-label="Next page"
          disabled={page >= safeTotalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
