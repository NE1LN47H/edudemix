"use client";

import { Search, X } from "lucide-react";

export default function StudentToolbar({
  total,
  search,
  onSearchChange,
  onClearSearch,
}) {
  return (
    <div className="students-toolbar">
      <div>
        <h2>All students</h2>
        <p className="students-subtitle">
          {total} {total === 1 ? "student" : "students"} in your centre
        </p>
      </div>

      <label className="students-search">
        <Search size={17} />
        <input
          type="search"
          placeholder="Search students..."
          value={search}
          onChange={onSearchChange}
          aria-label="Search by name, admission number, or phone"
        />
        {search && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={onClearSearch}
          >
            <X size={15} />
          </button>
        )}
      </label>
    </div>
  );
}
