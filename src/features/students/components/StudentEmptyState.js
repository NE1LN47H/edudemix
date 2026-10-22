"use client";

import { GraduationCap, Plus, Users } from "lucide-react";

export default function StudentEmptyState({
  search,
  error,
  onRetry,
  onAddStudent,
}) {
  if (error) {
    return (
      <div className="students-state">
        <div className="students-state-icon">
          <Users size={23} />
        </div>
        <h3>Unable to load students</h3>
        <p>{error}</p>
        <button
          type="button"
          className="students-secondary-button"
          onClick={onRetry}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="students-state">
      <div className="students-state-icon">
        <GraduationCap size={25} />
      </div>
      <h3>{search ? "No students found" : "No students yet"}</h3>
      <p>
        {search
          ? "Try another name, admission number, or phone number."
          : "Add your first student to start managing your records."}
      </p>
      {!search && (
        <button
          type="button"
          className="students-secondary-button"
          onClick={onAddStudent}
        >
          <Plus size={16} />
          Add your first student
        </button>
      )}
    </div>
  );
}
