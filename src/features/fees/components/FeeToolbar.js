"use client";

import { Search, X } from "lucide-react";

export default function FeeToolbar({
  statusFilter,
  search,
  onStatusChange,
  onSearchChange,
  onClearSearch,
}) {
  return (
    <div className="fees-toolbar">
      <div className="fees-filter-tabs">
        {["", "pending", "partial", "paid"].map((status) => (
          <button
            key={status}
            type="button"
            className={`fees-tab-btn ${
              statusFilter === status ? "active" : ""
            }`}
            onClick={() => onStatusChange(status)}
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
          onChange={onSearchChange}
        />
        {search && (
          <button type="button" onClick={onClearSearch}>
            <X size={14} />
          </button>
        )}
      </label>
    </div>
  );
}
