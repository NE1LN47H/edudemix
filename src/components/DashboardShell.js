"use client";

import { useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Command,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings2,
  Users,
  Wallet,
  X,
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    href: "#overview",
    icon: LayoutDashboard,
  },
  {
    label: "Students",
    href: "#students",
    icon: Users,
  },
  {
    label: "Batches",
    href: "#batches",
    icon: BookOpen,
  },
  {
    label: "Attendance",
    href: "#attendance",
    icon: CalendarDays,
  },
  {
    label: "Fees & payments",
    href: "#fees",
    icon: CreditCard,
  },
];

const activities = [
  {
    name: "Ananya S.",
    detail: "Monthly tuition fee",
    initials: "AS",
    color: "violet",
    amount: "+₹2,500",
    date: "Today, 10:42 AM",
    status: "Paid",
  },
  {
    name: "Arjun R.",
    detail: "Monthly tuition fee",
    initials: "AR",
    color: "blue",
    amount: "+₹1,800",
    date: "Today, 09:18 AM",
    status: "Paid",
  },
  {
    name: "Meera K.",
    detail: "Partial fee payment",
    initials: "MK",
    color: "orange",
    amount: "+₹1,000",
    date: "Yesterday",
    status: "Partial",
  },
  {
    name: "Adithya P.",
    detail: "Monthly tuition fee",
    initials: "AP",
    color: "green",
    amount: "+₹2,500",
    date: "Yesterday",
    status: "Paid",
  },
];

const batches = [
  {
    name: "Class 10 · Mathematics",
    teacher: "Rahul Menon",
    time: "09:00 AM – 10:30 AM",
    students: 32,
    progress: 82,
  },
  {
    name: "Class 12 · Physics",
    teacher: "Anjali Nair",
    time: "11:00 AM – 12:30 PM",
    students: 24,
    progress: 67,
  },
  {
    name: "Class 9 · Science",
    teacher: "Arun Kumar",
    time: "02:00 PM – 03:30 PM",
    students: 28,
    progress: 91,
  },
];

function MetricCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  trend = "up",
}) {
  return (
    <section className="metric-card">
      <div className="metric-top">
        <span className="metric-label">{title}</span>
        <span className="metric-icon">
          <Icon size={17} strokeWidth={1.7} />
        </span>
      </div>

      <div className="metric-value">{value}</div>

      <div className="metric-bottom">
        <span className={`metric-change ${trend}`}>
          {trend === "up" ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}
          {change}
        </span>
        <span className="metric-description">{description}</span>
      </div>
    </section>
  );
}

export default function DashboardShell() {
  const [activePage, setActivePage] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredActivities = activities.filter((activity) =>
    `${activity.name} ${activity.detail}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function navigateTo(label) {
    setActivePage(label);
    setSidebarOpen(false);
  }

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <a className="brand" href="#overview" onClick={() => navigateTo("Overview")}>
          <span className="brand-mark">
            <GraduationCap size={21} strokeWidth={2.2} />
          </span>
          <span className="brand-name">edudemix</span>
        </a>

        <button className="workspace-switcher">
          <span className="workspace-avatar">A</span>
          <span className="workspace-copy">
            <strong>Acme Academy</strong>
            <small>Free workspace</small>
          </span>
          <ChevronDown size={15} className="muted-icon" />
        </button>

        <div className="sidebar-section">
          <span className="sidebar-heading">WORKSPACE</span>

          <nav className="navigation">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.label;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`nav-item ${active ? "nav-active" : ""}`}
                  onClick={() => navigateTo(item.label)}
                >
                  <Icon size={17} strokeWidth={1.8} />
                  <span>{item.label}</span>
                  {item.label === "Fees & payments" && (
                    <span className="nav-count">4</span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-heading">MANAGEMENT</span>

          <nav className="navigation">
            <a
              href="#teachers"
              className="nav-item"
              onClick={() => navigateTo("Teachers")}
            >
              <GraduationCap size={17} strokeWidth={1.8} />
              <span>Teachers</span>
            </a>
            <a
              href="#reports"
              className="nav-item"
              onClick={() => navigateTo("Reports")}
            >
              <Activity size={17} strokeWidth={1.8} />
              <span>Reports</span>
            </a>
            <a
              href="#settings"
              className="nav-item"
              onClick={() => navigateTo("Settings")}
            >
              <Settings2 size={17} strokeWidth={1.8} />
              <span>Settings</span>
            </a>
          </nav>
        </div>

        <div className="sidebar-spacer" />

        <div className="sidebar-bottom">
          <a className="nav-item" href="#help">
            <CircleHelp size={17} strokeWidth={1.8} />
            <span>Help & support</span>
          </a>

          <div className="profile-card">
            <div className="profile-avatar">NN</div>
            <div className="profile-copy">
              <strong>Centre Admin</strong>
              <small>admin@edudemix.in</small>
            </div>
            <button className="icon-button profile-menu" aria-label="Profile menu">
              <Settings2 size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu icon-button"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={19} />
            </button>
            <span className="breadcrumb-muted">Workspace</span>
            <span className="breadcrumb-slash">/</span>
            <span className="breadcrumb-current">{activePage}</span>
          </div>

          <div className="topbar-actions">
            <label className="search-box">
              <Search size={15} />
              <input
                type="search"
                placeholder="Search activity..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <kbd>⌘ K</kbd>
            </label>

            <button className="icon-button notification-button" aria-label="Notifications">
              <Bell size={17} strokeWidth={1.8} />
              <span className="notification-dot" />
            </button>

            <div className="topbar-avatar">NN</div>
          </div>
        </header>

        <div className="page-content">
          <section className="page-heading">
            <div>
              <div className="eyebrow">
                <span className="live-dot" />
                YOUR CENTRE AT A GLANCE
              </div>
              <h1>Overview</h1>
              <p className="page-description">
                Here&apos;s what&apos;s happening at your centre today.
              </p>
            </div>

            <button className="primary-button" onClick={() => navigateTo("Students")}>
              <Plus size={16} />
              Add student
            </button>
          </section>

          <section className="metrics-grid">
            <MetricCard
              title="Total students"
              value="248"
              change="+12.5%"
              description="vs. last month"
              icon={Users}
            />
            <MetricCard
              title="Fees collected"
              value="₹1,84,500"
              change="+8.2%"
              description="vs. last month"
              icon={Wallet}
            />
            <MetricCard
              title="Outstanding fees"
              value="₹32,400"
              change="12 students"
              description="need follow-up"
              icon={CreditCard}
              trend="down"
            />
            <MetricCard
              title="Today's attendance"
              value="92.4%"
              change="↑ 3.1%"
              description="vs. last week"
              icon={CalendarDays}
            />
          </section>

          <section className="content-grid">
            <div className="panel collection-panel">
              <div className="panel-header">
                <div>
                  <h2>Fee collection</h2>
                  <p>Monthly collection overview</p>
                </div>
                <button className="select-button">
                  Last 6 months
                  <ChevronDown size={14} />
                </button>
              </div>

              <div className="chart-summary">
                <div>
                  <div className="chart-total">₹1,84,500</div>
                  <div className="chart-subtitle">
                    <span className="positive-text">
                      <ArrowUpRight size={14} /> 8.2%
                    </span>
                    <span>compared to last month</span>
                  </div>
                </div>
                <div className="chart-legend">
                  <span className="legend-dot current" />
                  This period
                  <span className="legend-dot previous" />
                  Previous
                </div>
              </div>

              <div className="chart">
                <div className="chart-gridlines">
                  <div><span>₹2L</span></div>
                  <div><span>₹1.5L</span></div>
                  <div><span>₹1L</span></div>
                  <div><span>₹50k</span></div>
                  <div><span>₹0</span></div>
                </div>

                <div className="chart-bars">
                  {[
                    { month: "May", current: 52, previous: 42 },
                    { month: "Jun", current: 67, previous: 56 },
                    { month: "Jul", current: 48, previous: 61 },
                    { month: "Aug", current: 76, previous: 65 },
                    { month: "Sep", current: 62, previous: 57 },
                    { month: "Oct", current: 91, previous: 71 },
                  ].map((item) => (
                    <div className="bar-group" key={item.month}>
                      <div className="bar-pair">
                        <div
                          className="bar previous-bar"
                          style={{ height: `${item.previous}%` }}
                          title={`${item.month} previous period`}
                        />
                        <div
                          className="bar current-bar"
                          style={{ height: `${item.current}%` }}
                          title={`${item.month} current period`}
                        />
                      </div>
                      <span className="bar-label">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel attendance-panel">
              <div className="panel-header">
                <div>
                  <h2>Attendance</h2>
                  <p>Today&apos;s student attendance</p>
                </div>
                <button className="icon-button" aria-label="Attendance options">
                  <Settings2 size={16} />
                </button>
              </div>

              <div className="attendance-visual">
                <svg viewBox="0 0 180 180" className="donut-chart">
                  <circle
                    cx="90"
                    cy="90"
                    r="66"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="13"
                  />
                  <circle
                    cx="90"
                    cy="90"
                    r="66"
                    fill="none"
                    stroke="var(--foreground)"
                    strokeWidth="13"
                    strokeDasharray="383.5 414.7"
                    strokeLinecap="round"
                    transform="rotate(-90 90 90)"
                  />
                </svg>
                <div className="donut-center">
                  <strong>92.4%</strong>
                  <span>Present today</span>
                </div>
              </div>

              <div className="attendance-legend">
                <div>
                  <span className="legend-square present" />
                  <span>Present</span>
                  <strong>229</strong>
                </div>
                <div>
                  <span className="legend-square absent" />
                  <span>Absent</span>
                  <strong>19</strong>
                </div>
              </div>

              <a
                href="#attendance"
                className="text-link"
                onClick={() => navigateTo("Attendance")}
              >
                View attendance <span>→</span>
              </a>
            </div>
          </section>

          <section className="bottom-grid">
            <div className="panel activity-panel">
              <div className="panel-header">
                <div>
                  <h2>Recent payments</h2>
                  <p>Latest transactions from your centre</p>
                </div>
                <a
                  className="text-link"
                  href="#fees"
                  onClick={() => navigateTo("Fees & payments")}
                >
                  View all <span>→</span>
                </a>
              </div>

              <div className="table-wrapper">
                <table className="activity-table">
                  <thead>
                    <tr>
                      <th>STUDENT</th>
                      <th>DESCRIPTION</th>
                      <th>DATE</th>
                      <th>STATUS</th>
                      <th className="amount-heading">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivities.map((item) => (
                      <tr key={item.name}>
                        <td>
                          <div className="student-cell">
                            <span className={`student-avatar ${item.color}`}>
                              {item.initials}
                            </span>
                            <strong>{item.name}</strong>
                          </div>
                        </td>
                        <td className="muted-cell">{item.detail}</td>
                        <td className="muted-cell">{item.date}</td>
                        <td>
                          <span
                            className={`status-pill ${
                              item.status === "Paid" ? "status-paid" : "status-partial"
                            }`}
                          >
                            {item.status === "Paid" && <Check size={12} />}
                            {item.status}
                          </span>
                        </td>
                        <td className="amount-cell">{item.amount}</td>
                      </tr>
                    ))}
                    {filteredActivities.length === 0 && (
                      <tr>
                        <td colSpan={5} className="empty-state">
                          No matching payments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="panel batches-panel">
              <div className="panel-header">
                <div>
                  <h2>Active batches</h2>
                  <p>Your running classes</p>
                </div>
                <button className="icon-button" aria-label="Batch options">
                  <Command size={16} />
                </button>
              </div>

              <div className="batch-list">
                {batches.map((batch) => (
                  <div className="batch-item" key={batch.name}>
                    <div className="batch-title-row">
                      <div className="batch-symbol">
                        <BookOpen size={16} />
                      </div>
                      <div className="batch-main">
                        <strong>{batch.name}</strong>
                        <span>{batch.teacher}</span>
                      </div>
                      <span className="batch-student-count">
                        <Users size={13} />
                        {batch.students}
                      </span>
                    </div>

                    <div className="batch-time">{batch.time}</div>

                    <div className="progress-track">
                      <div
                        className="progress-value"
                        style={{ width: `${batch.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="#batches"
                className="text-link batch-footer"
                onClick={() => navigateTo("Batches")}
              >
                Manage batches <span>→</span>
              </a>
            </div>
          </section>

          <footer className="page-footer">
            <span>© 2026 edudemix</span>
            <span>Built for better learning management.</span>
          </footer>
        </div>
      </main>
    </div>
  );
}