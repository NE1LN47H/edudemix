
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Settings2,
  Users,
  X,
} from "lucide-react";

import LogoutButton from "@/components/layout/LogoutButton";

const navigation = [
  {
    label: "Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Students",
    href: "/students",
    icon: Users,
  },
  {
    label: "Batches",
    href: "/batches",
    icon: BookOpen,
  },
  {
    label: "Attendance",
    href: "/attendance",
    icon: CalendarDays,
  },
  {
    label: "Fees & payments",
    href: "/fees",
    icon: CreditCard,
  },
];

const managementNavigation = [
  {
    label: "Teachers",
    href: "/teachers",
    icon: GraduationCap,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: Activity,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings2,
  },
];

export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUserInfo(data.user);
        }
      } catch (err) {
        // Fallback gracefully
      }
    }
    loadUser();
  }, []);

  function isActive(href) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function renderNavigation(items) {
    return items.map((item) => {
      const Icon = item.icon;
      const active = isActive(item.href);

      return (
        <Link
          key={item.href}
          href={item.href}
          className={`nav-item ${active ? "nav-active" : ""}`}
          onClick={() => setSidebarOpen(false)}
        >
          <Icon size={17} strokeWidth={1.8} />
          <span>{item.label}</span>
        </Link>
      );
    });
  }

  const currentPage =
    [...navigation, ...managementNavigation].find(
      (item) => isActive(item.href)
    )?.label || "Overview";

  const centreName = userInfo?.centreName || "My Academy";
  const userName = userInfo?.name || "Centre account";
  const userRole = userInfo?.role ? userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1) : "Staff";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "ED";

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <button
          type="button"
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
      >
        <Link className="brand" href="/">
          <span className="brand-mark">
            <GraduationCap size={21} strokeWidth={2.2} />
          </span>

          <span className="brand-name">edudemix</span>
        </Link>

        <button
          type="button"
          className="workspace-switcher"
        >
          <span className="workspace-avatar">{centreName.charAt(0).toUpperCase()}</span>

          <span className="workspace-copy">
            <strong>{centreName}</strong>
            <small>Centre workspace</small>
          </span>

          <ChevronDown size={15} className="muted-icon" />
        </button>

        <div className="sidebar-section">
          <span className="sidebar-heading">WORKSPACE</span>

          <nav className="navigation">
            {renderNavigation(navigation)}
          </nav>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-heading">MANAGEMENT</span>

          <nav className="navigation">
            {renderNavigation(managementNavigation)}
          </nav>
        </div>

        <div className="sidebar-spacer" />

        <div className="sidebar-bottom">
          <a className="nav-item" href="mailto:support@edudemix.in">
            <CircleHelp size={17} strokeWidth={1.8} />
            <span>Help & support</span>
          </a>

          <Link href="/settings" className="profile-card">
            <div className="profile-avatar">{initials}</div>

            <div className="profile-copy">
              <strong>{userName}</strong>
              <small>{userRole}</small>
            </div>

            <Settings2 size={16} className="muted-icon" />
          </Link>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              type="button"
              className="mobile-menu icon-button"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={19} />
            </button>

            <span className="breadcrumb-muted">Workspace</span>
            <span className="breadcrumb-slash">/</span>
            <span className="breadcrumb-current">
              {currentPage}
            </span>
          </div>

          <div className="topbar-actions">
            <LogoutButton />

            <button
              type="button"
              className="icon-button notification-button"
              aria-label="Notifications"
            >
              <Bell size={17} strokeWidth={1.8} />
            </button>

            <div className="topbar-avatar">{initials}</div>
          </div>
        </header>

        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}
