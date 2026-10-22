"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  Users,
  BookOpen,
  CalendarCheck2,
  CreditCard,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import "./landing.css";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sessionUser, setSessionUser] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const data = await res.json();
        if (!ignore && data.authenticated && data.user) {
          setSessionUser(data.user);
        }
      } catch {
        // Unauthenticated visitor
      }
    }
    checkAuth();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="landing-body">
      <div className="landing-grid-bg" />

      {/* Navigation Header */}
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <Link href="/" className="landing-brand">
            <span className="landing-brand-icon">
              <GraduationCap size={18} strokeWidth={2.4} />
            </span>
            <span>edudemix</span>
          </Link>

          <nav className="landing-nav-links">
            <a href="#showcase" className="landing-nav-link">Live Console</a>
            <a href="#modules" className="landing-nav-link">Features & Modules</a>
            <a href="mailto:contact@edudemix.in" className="landing-nav-link">Inquiries</a>
          </nav>

          <div className="landing-nav-actions">
            {sessionUser ? (
              <Link href="/dashboard" className="v-btn-primary">
                Open Workspace ({sessionUser.centreSlug})
                <ArrowRight size={14} />
              </Link>
            ) : (
              <Link href="/login" className="v-btn-primary">
                Sign In
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-pill">
          <span className="landing-pill-tag">New</span>
          <span>edudemix • The Operating System for Coaching Institutes</span>
          <ChevronRight size={13} style={{ color: "#777" }} />
        </div>

        <h1 className="landing-title">
          Scale your coaching institute.<br />
          Without the complexity.
        </h1>

        <p className="landing-subtitle">
          The all-in-one multi-tenant management platform built for modern academies.
          Streamline admissions, track cohort roll-call, collect tuition fees, and empower faculty from one unified console.
        </p>

        <div className="landing-hero-actions">
          {sessionUser ? (
            <Link href="/dashboard" className="v-btn-primary" style={{ padding: "12px 24px", fontSize: "14px" }}>
              Go to Workspace Dashboard
              <ArrowRight size={16} />
            </Link>
          ) : (
            <Link href="/login" className="v-btn-primary" style={{ padding: "12px 24px", fontSize: "14px" }}>
              Sign in to Workspace
              <ArrowRight size={16} />
            </Link>
          )}

          <a href="#modules" className="v-btn-secondary" style={{ padding: "12px 24px", fontSize: "14px" }}>
            Explore Capabilities
          </a>
        </div>

        {/* Vercel-Style Live Interactive Dashboard Showcase */}
        <div className="showcase-wrapper" id="showcase">
          <div className="showcase-header">
            <div className="showcase-dots">
              <span className="showcase-dot" style={{ background: "#ff5f56" }} />
              <span className="showcase-dot" style={{ background: "#ffbd2e" }} />
              <span className="showcase-dot" style={{ background: "#27c93f" }} />
            </div>

            <div className="showcase-tabs">
              <button
                type="button"
                className={`showcase-tab ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                type="button"
                className={`showcase-tab ${activeTab === "students" ? "active" : ""}`}
                onClick={() => setActiveTab("students")}
              >
                Students Roster
              </button>
              <button
                type="button"
                className={`showcase-tab ${activeTab === "attendance" ? "active" : ""}`}
                onClick={() => setActiveTab("attendance")}
              >
                Daily Roll-Call
              </button>
              <button
                type="button"
                className={`showcase-tab ${activeTab === "fees" ? "active" : ""}`}
                onClick={() => setActiveTab("fees")}
              >
                Fee Ledger
              </button>
              <button
                type="button"
                className={`showcase-tab ${activeTab === "batches" ? "active" : ""}`}
                onClick={() => setActiveTab("batches")}
              >
                Batch Capacities
              </button>
            </div>

            <div style={{ fontSize: "11px", color: "#888", fontFamily: "monospace" }}>
              workspace.edudemix.in
            </div>
          </div>

          <div className="showcase-body">
            {activeTab === "overview" && (
              <div>
                <div className="preview-stats-row">
                  <div className="preview-stat-card">
                    <div className="preview-stat-label">TOTAL REVENUE COLLECTED</div>
                    <div className="preview-stat-num" style={{ color: "#059669" }}>₹4,85,000</div>
                    <div className="preview-stat-meta">
                      <TrendingUp size={12} />
                      88.2% Collection Rate
                    </div>
                  </div>
                  <div className="preview-stat-card">
                    <div className="preview-stat-label">ENROLLED STUDENTS</div>
                    <div className="preview-stat-num">142</div>
                    <div className="preview-stat-meta" style={{ color: "#2563eb" }}>
                      Active across 6 cohorts
                    </div>
                  </div>
                  <div className="preview-stat-card">
                    <div className="preview-stat-label">TODAY&apos;S ATTENDANCE</div>
                    <div className="preview-stat-num">94.8%</div>
                    <div className="preview-stat-meta">
                      128 present · 4 late
                    </div>
                  </div>
                  <div className="preview-stat-card">
                    <div className="preview-stat-label">CAPACITY UTILIZATION</div>
                    <div className="preview-stat-num">78.9%</div>
                    <div className="preview-stat-meta" style={{ color: "#7c3aed" }}>
                      142 / 180 seats filled
                    </div>
                  </div>
                </div>

                <div className="preview-table-box">
                  <div className="preview-table-header">
                    <span>Recent Institutional Activity</span>
                    <span style={{ fontSize: "11px", color: "#666" }}>Live sync</span>
                  </div>
                  <div className="preview-table-row">
                    <div>
                      <strong style={{ color: "#000" }}>Aditya Verma</strong>
                      <span style={{ color: "#666", marginLeft: 8 }}>JEE Advanced Batch A</span>
                    </div>
                    <span className="preview-badge badge-paid">Fee Received (₹25,000)</span>
                  </div>
                  <div className="preview-table-row">
                    <div>
                      <strong style={{ color: "#000" }}>Sneha Kulkarni</strong>
                      <span style={{ color: "#666", marginLeft: 8 }}>NEET Physics Fast-track</span>
                    </div>
                    <span className="preview-badge badge-active">Admitted to Cohort</span>
                  </div>
                  <div className="preview-table-row">
                    <div>
                      <strong style={{ color: "#000" }}>Rohan Nair</strong>
                      <span style={{ color: "#666", marginLeft: 8 }}>Class 12 Board Prep</span>
                    </div>
                    <span className="preview-badge badge-pending">Due Reminded (₹12,500)</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "students" && (
              <div className="preview-table-box">
                <div className="preview-table-header">
                  <span>Student Directory Roster</span>
                  <span style={{ fontSize: "11px", color: "#059669" }}>142 Enrolled</span>
                </div>
                <div className="preview-table-row">
                  <div>
                    <strong style={{ color: "#000" }}>Aarav Patel</strong>
                    <span style={{ color: "#666", marginLeft: 8 }}>aarav.p@gmail.com · +91 98200 11223</span>
                  </div>
                  <span className="preview-badge badge-active">Active</span>
                </div>
                <div className="preview-table-row">
                  <div>
                    <strong style={{ color: "#000" }}>Pooja Deshmukh</strong>
                    <span style={{ color: "#666", marginLeft: 8 }}>pooja.d@yahoo.com · +91 98450 44556</span>
                  </div>
                  <span className="preview-badge badge-active">Active</span>
                </div>
                <div className="preview-table-row">
                  <div>
                    <strong style={{ color: "#000" }}>Devendra Sen</strong>
                    <span style={{ color: "#666", marginLeft: 8 }}>dev.sen@gmail.com · +91 97110 88990</span>
                  </div>
                  <span className="preview-badge badge-paid">Graduated</span>
                </div>
              </div>
            )}

            {activeTab === "attendance" && (
              <div className="preview-table-box">
                <div className="preview-table-header">
                  <span>Morning Roll-Call Session (JEE Advanced 2026)</span>
                  <span style={{ fontSize: "11px", color: "#2563eb" }}>96% Rate</span>
                </div>
                <div className="preview-table-row">
                  <span>Aman Gupta (Roll #01)</span>
                  <span className="preview-badge badge-paid">✓ Present</span>
                </div>
                <div className="preview-table-row">
                  <span>Bhavna Iyer (Roll #02)</span>
                  <span className="preview-badge badge-paid">✓ Present</span>
                </div>
                <div className="preview-table-row">
                  <span>Chirag Rao (Roll #03)</span>
                  <span className="preview-badge badge-pending">✗ Absent (Excused)</span>
                </div>
              </div>
            )}

            {activeTab === "fees" && (
              <div className="preview-table-box">
                <div className="preview-table-header">
                  <span>Fee Ledger & Invoice Register</span>
                  <span style={{ fontSize: "11px", color: "#059669" }}>₹4,85,000 Collected</span>
                </div>
                <div className="preview-table-row">
                  <div>
                    <strong style={{ color: "#000" }}>INV-2026-0042</strong>
                    <span style={{ color: "#666", marginLeft: 8 }}>Aarav Patel (Annual Tuition)</span>
                  </div>
                  <span className="preview-badge badge-paid">Paid (₹45,000)</span>
                </div>
                <div className="preview-table-row">
                  <div>
                    <strong style={{ color: "#000" }}>INV-2026-0043</strong>
                    <span style={{ color: "#666", marginLeft: 8 }}>Kavita Singh (Installment 2)</span>
                  </div>
                  <span className="preview-badge badge-pending">Due 28 Oct (₹15,000)</span>
                </div>
              </div>
            )}

            {activeTab === "batches" && (
              <div className="preview-table-box">
                <div className="preview-table-header">
                  <span>Active Course Cohorts & Occupancy</span>
                  <span style={{ fontSize: "11px", color: "#7c3aed" }}>6 Running Cohorts</span>
                </div>
                <div className="preview-table-row">
                  <div>
                    <strong style={{ color: "#000" }}>JEE Advanced Focus Cohort</strong>
                    <span style={{ color: "#666", marginLeft: 8 }}>Mon-Wed-Fri · 08:00 - 11:00 AM</span>
                  </div>
                  <span style={{ color: "#059669", fontWeight: 600 }}>28 / 30 (93%)</span>
                </div>
                <div className="preview-table-row">
                  <div>
                    <strong style={{ color: "#000" }}>NEET Medical Chemistry Masterclass</strong>
                    <span style={{ color: "#666", marginLeft: 8 }}>Tue-Thu-Sat · 04:00 - 07:00 PM</span>
                  </div>
                  <span style={{ color: "#2563eb", fontWeight: 600 }}>24 / 30 (80%)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="landing-strip">
        <div className="landing-strip-inner">
          <div className="strip-item">
            <strong>100%</strong>
            <span>Multi-Tenant Isolation</span>
          </div>
          <div className="strip-item">
            <strong>10x</strong>
            <span>Faster Daily Roll-Call</span>
          </div>
          <div className="strip-item">
            <strong>Zero</strong>
            <span>Messy Spreadsheets</span>
          </div>
          <div className="strip-item">
            <strong>99.9%</strong>
            <span>Next.js 16 Edge Uptime</span>
          </div>
        </div>
      </section>

      {/* Bento Grid: Core Modules */}
      <section className="landing-section" id="modules">
        <div className="landing-section-header">
          <div className="section-eyebrow">MODULAR ARCHITECTURE</div>
          <h2 className="section-title">Engineered for Academy Operations</h2>
          <p className="section-description">
            Everything your coaching centre requires to manage students, faculties, finances, and courses in real-time.
          </p>
        </div>

        <div className="bento-grid">
          {/* Card 1 */}
          <div className="bento-card">
            <div className="bento-card-top">
              <div className="bento-icon-wrapper">
                <Users size={20} />
              </div>
              <span className="bento-tag">Admissions</span>
            </div>
            <h3>Student Roster & Lifecycle</h3>
            <p>
              Maintain accurate student profiles, contact channels, parent details, and cohort enrollments with instant search and status filters.
            </p>
            <ul className="bento-feature-list">
              <li className="bento-feature-item">
                <CheckCircle2 size={13} style={{ color: "#059669" }} />
                Comprehensive profiles & contact info
              </li>
              <li className="bento-feature-item">
                <CheckCircle2 size={13} style={{ color: "#059669" }} />
                Cohort batch linking & transfers
              </li>
              <li className="bento-feature-item">
                <CheckCircle2 size={13} style={{ color: "#059669" }} />
                Active, On-Leave & Alumni tracking
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bento-card">
            <div className="bento-card-top">
              <div className="bento-icon-wrapper">
                <BookOpen size={20} />
              </div>
              <span className="bento-tag">Cohorts</span>
            </div>
            <h3>Dynamic Batch Scheduling</h3>
            <p>
              Organize your curriculum cohorts with seating capacity caps, classroom timings, and assigned head faculty.
            </p>
            <ul className="bento-feature-list">
              <li className="bento-feature-item">
                <CheckCircle2 size={13} style={{ color: "#059669" }} />
                Real-time seat occupancy monitors
              </li>
              <li className="bento-feature-item">
                <CheckCircle2 size={13} style={{ color: "#059669" }} />
                Recurring schedule management
              </li>
              <li className="bento-feature-item">
                <CheckCircle2 size={13} style={{ color: "#059669" }} />
                Over-enrollment prevention guardrails
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bento-card">
            <div className="bento-card-top">
              <div className="bento-icon-wrapper">
                <CalendarCheck2 size={20} />
              </div>
              <span className="bento-tag">Attendance</span>
            </div>
            <h3>Smart Roll-Call Matrix</h3>
            <p>
              Conduct daily roll call in seconds. Record present, absent, or late statuses with automated rate metrics per batch.
            </p>
            <ul className="bento-feature-list">
              <li className="bento-feature-item">
                <CheckCircle2 size={13} style={{ color: "#059669" }} />
                One-tap status updates
              </li>
              <li className="bento-feature-item">
                <CheckCircle2 size={13} style={{ color: "#059669" }} />
                Date-stamped historical logs
              </li>
              <li className="bento-feature-item">
                <CheckCircle2 size={13} style={{ color: "#059669" }} />
                Instant batch attendance % computation
              </li>
            </ul>
          </div>

          {/* Card 4 */}
          <div className="bento-card">
            <div className="bento-card-top">
              <div className="bento-icon-wrapper">
                <CreditCard size={20} />
              </div>
              <span className="bento-tag">Finances</span>
            </div>
            <h3>Fee Collection & Invoicing</h3>
            <p>
              Full financial ledger tracking total invoiced tuition, collected receipts, overdue dues, and partial payment milestones.
            </p>
            <ul className="bento-feature-list">
              <li className="bento-feature-item">
                <CheckCircle2 size={13} style={{ color: "#059669" }} />
                Custom invoice creation & due dates
              </li>
              <li className="bento-feature-item">
                <CheckCircle2 size={13} style={{ color: "#059669" }} />
                Cash, UPI, and Bank transfer modes
              </li>
              <li className="bento-feature-item">
                <CheckCircle2 size={13} style={{ color: "#059669" }} />
                Overdue flags & financial status tabs
              </li>
            </ul>
          </div>

          {/* Card 5 */}
          <div className="bento-card">
            <div className="bento-card-top">
              <div className="bento-icon-wrapper">
                <GraduationCap size={20} />
              </div>
              <span className="bento-tag">Faculty</span>
            </div>
            <h3>Staff & Role-Based Access</h3>
            <p>
              Invite tutors and administrative staff with granular role permissions: Owners, Administrators, Teachers, and Accountants.
            </p>
            <ul className="bento-feature-list">
              <li className="bento-feature-item">
                <CheckCircle2 size={13} style={{ color: "#059669" }} />
                Role-based privileges enforcement
              </li>
              <li className="bento-feature-item">
                <CheckCircle2 size={13} style={{ color: "#059669" }} />
                Staff credential management
              </li>
              <li className="bento-feature-item">
                <CheckCircle2 size={13} style={{ color: "#059669" }} />
                Activity audit and separation of duties
              </li>
            </ul>
          </div>

          {/* Card 6 */}
          <div className="bento-card">
            <div className="bento-card-top">
              <div className="bento-icon-wrapper">
                <TrendingUp size={20} />
              </div>
              <span className="bento-tag">Insights</span>
            </div>
            <h3>Executive Analytics & Reports</h3>
            <p>
              Bird&apos;s-eye visibility into institute growth: capacity utilization graphs, attendance trends, and revenue realization rates.
            </p>
            <ul className="bento-feature-list">
              <li className="bento-feature-item">
                <CheckCircle2 size={13} style={{ color: "#059669" }} />
                Interactive collection rate gauges
              </li>
              <li className="bento-feature-item">
                <CheckCircle2 size={13} style={{ color: "#059669" }} />
                Batch occupancy percentage meters
              </li>
              <li className="bento-feature-item">
                <CheckCircle2 size={13} style={{ color: "#059669" }} />
                Real-time financial breakdown reports
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action Light Banner */}
      <section className="landing-section" id="cta">
        <div className="cta-banner">
          <h2>Modernize your coaching institute today</h2>
          <p>
            Experience lightning-fast admissions, automated attendance, and real-time financial tracking built on modern cloud architecture.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            {sessionUser ? (
              <Link href="/dashboard" className="v-btn-primary" style={{ padding: "12px 28px", fontSize: "14px" }}>
                Open Your Dashboard
                <ArrowRight size={15} />
              </Link>
            ) : (
              <Link href="/login" className="v-btn-primary" style={{ padding: "12px 28px", fontSize: "14px" }}>
                Sign in to Your Workspace
                <ArrowRight size={15} />
              </Link>
            )}

            <a href="mailto:contact@edudemix.in" className="v-btn-secondary" style={{ padding: "12px 24px", fontSize: "14px" }}>
              Institutional Inquiries
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="landing-brand-icon" style={{ width: 24, height: 24 }}>
              <GraduationCap size={15} strokeWidth={2.4} />
            </span>
            <span style={{ fontWeight: 700, fontSize: "15px", color: "#000" }}>edudemix</span>
            <span className="footer-copy" style={{ marginLeft: 16 }}>
              © 2026 edudemix Inc. The Coaching Management Cloud.
            </span>
          </div>

          <div className="footer-links">
            <Link href="/login" className="footer-link">Workspace Login</Link>
            <a href="#modules" className="footer-link">Features & Modules</a>
            <a href="mailto:contact@edudemix.in" className="footer-link">Institutional Inquiries</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
