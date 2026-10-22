"use client";

import { Search, X } from "lucide-react";

export default function BatchToolbar({
  total,
  search,
  onSearchChange,
  onClearSearch,
}) {
  return (
    <div className="batches-toolbar">
      <div>
        <h2>All batches</h2>
        <p className="batches-subtitle">
          {total} {total === 1 ? "batch" : "batches"} in your centre
        </p>
      </div>

      <label className="batches-search">
        <Search size={17} />
        <input
          type="search"
          placeholder="Search batches or courses..."
          aria-label="Search batches or courses"
          value={search}
          onChange={onSearchChange}
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
