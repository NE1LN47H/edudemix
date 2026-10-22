"use client";

import { ShieldCheck, Lock, Globe, KeyRound, CheckCircle2 } from "lucide-react";

export default function WorkspaceAccessCard({ slug }) {
  return (
    <section className="settings-card">
      <div className="settings-card-header">
        <div className="settings-header-left">
          <div className="settings-card-icon" style={{ background: "#ecfdf5", color: "#059669" }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2>Workspace Security & Access</h2>
            <p>Cryptographic session boundaries and multi-tenant access parameters.</p>
          </div>
        </div>
      </div>

      <div className="system-info-grid">
        <div className="system-info-item">
          <label>Multi-Tenancy Isolation</label>
          <div className="val" style={{ display: "flex", alignItems: "center", gap: 6, color: "#059669" }}>
            <CheckCircle2 size={16} />
            <span>Partitioned & Active</span>
          </div>
          <small style={{ fontSize: "11px", color: "#64748b", marginTop: 4, display: "block" }}>
            All student, batch, and finance records are strictly isolated to workspace #{slug}.
          </small>
        </div>

        <div className="system-info-item">
          <label>Session Security</label>
          <div className="val" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Lock size={15} style={{ color: "#0284c7" }} />
            <span>HTTP-Only JWT Cookie</span>
          </div>
          <small style={{ fontSize: "11px", color: "#64748b", marginTop: 4, display: "block" }}>
            8-hour session lifetime with automatic tamper verification.
          </small>
        </div>

        <div className="system-info-item">
          <label>Direct Workspace Login URL</label>
          <div className="val" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "13px", fontFamily: "monospace" }}>
            <Globe size={14} style={{ color: "#6366f1" }} />
            <span>/login?slug={slug}</span>
          </div>
          <small style={{ fontSize: "11px", color: "#64748b", marginTop: 4, display: "block" }}>
            Share this endpoint with your tutors and accountants to prefill your workspace slug.
          </small>
        </div>

        <div className="system-info-item">
          <label>Credential Encryption</label>
          <div className="val" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <KeyRound size={15} style={{ color: "#d97706" }} />
            <span>Bcrypt Salted Hash (10 Rounds)</span>
          </div>
          <small style={{ fontSize: "11px", color: "#64748b", marginTop: 4, display: "block" }}>
            Zero plaintext credentials stored in the primary datastore.
          </small>
        </div>
      </div>
    </section>
  );
}
