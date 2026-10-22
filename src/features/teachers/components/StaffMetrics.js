"use client";

import { Users, GraduationCap, Shield, Calculator } from "lucide-react";

export default function StaffMetrics({ staff }) {
  const total = staff.length;
  const teachers = staff.filter((s) => s.role === "teacher").length;
  const admins = staff.filter((s) => s.role === "admin" || s.role === "owner").length;
  const accountants = staff.filter((s) => s.role === "accountant").length;

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-top">
          <span className="metric-label">TOTAL TEAM</span>
          <div className="metric-icon">
            <Users size={16} />
          </div>
        </div>
        <div className="metric-value">{total}</div>
        <div className="metric-bottom">
          <span className="metric-description">
            Active workspace accounts
          </span>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-top">
          <span className="metric-label">TEACHING FACULTY</span>
          <div className="metric-icon">
            <GraduationCap size={16} />
          </div>
        </div>
        <div className="metric-value" style={{ color: "#166534" }}>{teachers}</div>
        <div className="metric-bottom">
          <span className="metric-description">
            Course instructors & tutors
          </span>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-top">
          <span className="metric-label">ADMINISTRATORS</span>
          <div className="metric-icon">
            <Shield size={16} />
          </div>
        </div>
        <div className="metric-value" style={{ color: "#1e40af" }}>{admins}</div>
        <div className="metric-bottom">
          <span className="metric-description">
            Management & Owner
          </span>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-top">
          <span className="metric-label">FINANCE & ACCOUNTS</span>
          <div className="metric-icon">
            <Calculator size={16} />
          </div>
        </div>
        <div className="metric-value" style={{ color: "#854d0e" }}>{accountants}</div>
        <div className="metric-bottom">
          <span className="metric-description">
            Fee ledger managers
          </span>
        </div>
      </div>
    </div>
  );
}
