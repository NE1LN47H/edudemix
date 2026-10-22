"use client";

import { Power, Trash2 } from "lucide-react";

export default function StaffTable({
  staff,
  onToggleStatus,
  onDeleteStaff,
}) {
  return (
    <div className="students-table-wrap">
      <table className="students-table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {staff.map((user) => (
            <tr key={user._id}>
              <td>
                <div className="students-person">
                  <div className="students-avatar">
                    {(user.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <span className="students-person-name">
                    {user.name}
                  </span>
                </div>
              </td>

              <td>{user.email}</td>

              <td>
                <span className={`role-pill role-${user.role}`}>
                  {user.role}
                </span>
              </td>

              <td>
                <span
                  className={`students-status students-status-${
                    user.status === "active" ? "active" : "inactive"
                  }`}
                >
                  <span />
                  {user.status}
                </span>
              </td>

              <td>
                {new Date(user.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>

              <td>
                {user.role !== "owner" ? (
                  <div className="student-actions-cell">
                    <button
                      type="button"
                      className="student-action-btn"
                      title={
                        user.status === "active"
                          ? "Disable account"
                          : "Activate account"
                      }
                      onClick={() => onToggleStatus(user)}
                    >
                      <Power size={13} />
                    </button>

                    <button
                      type="button"
                      className="student-action-btn delete"
                      title="Remove staff member"
                      onClick={() => onDeleteStaff(user)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: "11px", color: "#888" }}>
                    Primary owner
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
