"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, Building2, UserCircle, ShieldCheck } from "lucide-react";
import NoticeBanner from "@/components/ui/NoticeBanner";
import CentreProfileCard from "./components/CentreProfileCard";
import UserProfileCard from "./components/UserProfileCard";
import WorkspaceAccessCard from "./components/WorkspaceAccessCard";
import "./SettingsPage.css";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("centre");

  const [centreForm, setCentreForm] = useState({
    name: "",
    email: "",
    phone: "",
    slug: "",
  });

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    role: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [savingCentre, setSavingCentre] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let ignore = false;
    async function fetchSettings() {
      try {
        setLoading(true);
        const res = await fetch("/api/settings", { cache: "no-store" });
        const result = await res.json();
        if (ignore) return;
        if (!res.ok || !result.success) {
          throw new Error(result.message || "Failed to load settings");
        }

        const { centre, user } = result.data;
        setCentreForm({
          name: centre.name || "",
          email: centre.email || "",
          phone: centre.phone || "",
          slug: centre.slug || "",
        });

        setProfileForm({
          name: user.name || "",
          email: user.email || "",
          role: user.role || "",
          newPassword: "",
        });
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Unable to load settings");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchSettings();
    return () => {
      ignore = true;
    };
  }, []);

  async function handleSaveCentre(e) {
    e.preventDefault();
    setSavingCentre(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "centre",
          name: centreForm.name,
          email: centreForm.email,
          phone: centreForm.phone,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to update centre details");
      }

      setSuccess("Coaching centre workspace profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingCentre(false);
    }
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSavingProfile(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "profile",
          name: profileForm.name,
          newPassword: profileForm.newPassword || undefined,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to update profile");
      }

      setSuccess("Your account credentials have been updated successfully.");
      setProfileForm((p) => ({ ...p, newPassword: "" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingProfile(false);
    }
  }

  if (loading) {
    return null;
  }

  return (
    <div className="settings-container">
      <section className="page-heading">
        <div>
          <div className="eyebrow">SETTINGS & PREFERENCES</div>
          <h1>Workspace Settings</h1>
          <p className="page-description">
            Manage your coaching institute identity, user credentials, and security controls.
          </p>
        </div>
      </section>

      <NoticeBanner
        type="success"
        message={success}
        onDismiss={() => setSuccess("")}
      />
      <NoticeBanner
        type="error"
        message={error}
        onDismiss={() => setError("")}
      />

      <div className="settings-nav-tabs">
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === "centre" ? "active" : ""}`}
          onClick={() => setActiveTab("centre")}
        >
          <Building2 size={15} />
          Centre Profile
        </button>
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === "user" ? "active" : ""}`}
          onClick={() => setActiveTab("user")}
        >
          <UserCircle size={15} />
          My Account
        </button>
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === "security" ? "active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          <ShieldCheck size={15} />
          Security & Access
        </button>
      </div>

      {activeTab === "centre" && (
        <CentreProfileCard
          centreForm={centreForm}
          onChange={setCentreForm}
          onSubmit={handleSaveCentre}
          saving={savingCentre}
        />
      )}

      {activeTab === "user" && (
        <UserProfileCard
          profileForm={profileForm}
          onChange={setProfileForm}
          onSubmit={handleSaveProfile}
          saving={savingProfile}
        />
      )}

      {activeTab === "security" && (
        <WorkspaceAccessCard slug={centreForm.slug} />
      )}
    </div>
  );
}
