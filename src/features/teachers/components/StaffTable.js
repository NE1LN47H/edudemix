"use client";

import { Power, Trash2, Shield, GraduationCap, Calculator, Crown } from "lucide-react";

export default function StaffTable({
  staff,
  onToggleStatus,
  onDeleteStaff,
}) {
  function getRoleIcon(role) {
    switch (role) {
      case "owner":
        return <Crown size={12} />;
      case "admin":
        return <Shield size={12} />;
      case "accountant":
        return <Calculator size={12} />;
      default:
        return <GraduationCap size={12} />;
    }
  }

  function getAvatarClass(role) {
    switch (role) {
      case "owner":
        return "staff-avatar-owner";
      case "admin":
        return "staff-avatar-admin";
      case "accountant":
        return "staff-avatar-accountant";
      default:
        return "staff-avatar-teacher";
    }
  }

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
          {staff.map((user, idx) => (
            <tr
              key={user._id}
              className="stagger-row"
              style={{ animationDelay: `${Math.min(idx * 30, 240)}ms` }}
            >
              <td>
                <div className="students-person">
                  <div className={`students-avatar ${getAvatarClass(user.role)}`}>
                    {(user.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="students-person-info">
                    <span className="students-person-name">
                      {user.name}
                    </span>
                    {user.role === "owner" && (
                      <span style={{ fontSize: "10px", color: "#9d174d", fontWeight: 600 }}>
                        Primary Institute Owner
                      </span>
                    )}
                  </div>
                </div>
              </td>

              <td style={{ color: "#475569", fontSize: "13px" }}>
                {user.email}
              </td>

              <td>
                <span className={`role-pill role-${user.role}`}>
                  {getRoleIcon(user.role)}
                  <span>{user.role}</span>
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

              <td style={{ color: "#64748b", fontSize: "12px" }}>
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
                          ? "Disable account access"
                          : "Re-enable account access"
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
                  <span style={{ fontSize: "11px", color: "#94a3b8", fontStyle: "italic" }}>
                    Protected
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
