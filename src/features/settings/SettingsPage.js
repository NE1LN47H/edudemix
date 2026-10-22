"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import NoticeBanner from "@/components/ui/NoticeBanner";
import CentreProfileCard from "./components/CentreProfileCard";
import UserProfileCard from "./components/UserProfileCard";
import "./SettingsPage.css";

export default function SettingsPage() {
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

      setSuccess("Centre workspace details updated successfully.");
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

      setSuccess("Your account profile was updated successfully.");
      setProfileForm((p) => ({ ...p, newPassword: "" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingProfile(false);
    }
  }

  if (loading) {
    return (
      <div className="students-state">
        <LoaderCircle className="students-spinner" size={28} />
        <p>Loading workspace configuration...</p>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <section className="page-heading">
        <div>
          <div className="eyebrow">SETTINGS & PREFERENCES</div>
          <h1>Workspace Settings</h1>
          <p className="page-description">
            Configure coaching centre identity, contact details, and account security.
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

      <CentreProfileCard
        centreForm={centreForm}
        onChange={setCentreForm}
        onSubmit={handleSaveCentre}
        saving={savingCentre}
      />

      <UserProfileCard
        profileForm={profileForm}
        onChange={setProfileForm}
        onSubmit={handleSaveProfile}
        saving={savingProfile}
      />
    </div>
  );
}
