"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useRef, useEffect, useCallback } from "react";

export default function OnboardingModal() {
  const { data: session, status, update } = useSession();
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1); // 1 = profile pic, 2 = username/display name
  const [profilePic, setProfilePic] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [usernameStatus, setUsernameStatus] = useState(""); // "", "checking", "available", "taken", "invalid"
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const checkTimeoutRef = useRef(null);

  // Show the modal only for first-time users
  useEffect(() => {
    if (status === "authenticated" && session?.user && !session.user.isProfileComplete && !session.user.username) {
      setShow(true);
      setDisplayName(session.user.displayName || session.user.name || "");
      setProfilePic(session.user.profilePic || session.user.image || "");
    }
  }, [status, session]);

  // Debounced username availability check
  const checkUsername = useCallback((value) => {
    if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);

    if (!value || value.length < 3) {
      setUsernameStatus(value.length > 0 ? "invalid" : "");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameStatus("invalid");
      return;
    }

    setUsernameStatus("checking");
    checkTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/onboarding?username=${encodeURIComponent(value)}`);
        const data = await res.json();
        setUsernameStatus(data.available ? "available" : "taken");
      } catch {
        setUsernameStatus("");
      }
    }, 400);
  }, []);

  const handleUsernameChange = (e) => {
    const val = e.target.value.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 20);
    setUsername(val);
    checkUsername(val);
    setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setProfilePic(event.target.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!username || username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (usernameStatus === "taken") {
      setError("That username is taken");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          displayName: displayName || session.user.name,
          profilePic: profilePic || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setSaving(false);
        return;
      }

      if (!data.user) {
        setError(`Database failed to find your record (${session.user.email}). Please try signing out and back in.`);
        setSaving(false);
        return;
      }

      // Hard reload to guarantee the next-auth session is refreshed from the database
      // so the new profile pic and username reflect instantly everywhere
      window.location.reload();
    } catch (err) {
      console.error("Onboarding saving error:", err);
      setError("Network error. Please try again.");
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (cancelling) return;
    setCancelling(true);
    try {
      await fetch('/api/onboarding/cancel', { method: 'POST' });
    } catch (e) {
      console.error('Cancel registration error:', e);
    }
    signOut({ callbackUrl: '/' });
  };

  if (!show) return null;

  return (
    <div className="onboard-overlay">
      <div className="onboard-modal">
        {/* Close / Cancel Button */}
        <button
          className="onboard-close-btn"
          onClick={handleCancel}
          disabled={cancelling || saving}
          title="Cancel registration"
        >
          {cancelling ? (
            <div className="onboard-close-spinner" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </button>

        {/* Header */}
        <div className="onboard-header">
          <div className="onboard-logo">
            <img src="/logo.png" alt="Swinglify" />
          </div>
          <h2 className="onboard-title">Welcome to Swinglify! 🎉</h2>
          <p className="onboard-subtitle">Set up your profile to get started</p>
        </div>

        {/* Step indicators */}
        <div className="onboard-steps">
          <div className={`onboard-step-dot ${step >= 1 ? "active" : ""}`} />
          <div className="onboard-step-line" />
          <div className={`onboard-step-dot ${step >= 2 ? "active" : ""}`} />
        </div>

        {step === 1 && (
          <div className="onboard-body">
            <p className="onboard-label">Profile Picture</p>
            <div className="onboard-pic-area">
              <div className="onboard-pic-preview" onClick={() => fileInputRef.current?.click()}>
                {profilePic ? (
                  <img src={profilePic} alt="Profile" referrerPolicy="no-referrer" />
                ) : (
                  <div className="onboard-pic-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
                <div className="onboard-pic-overlay">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
              </div>
              <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleFileChange} />
              <span className="onboard-pic-hint">Click to upload (max 2MB)</span>
            </div>

            {error && <div className="onboard-error">{error}</div>}

            <button className="onboard-btn-primary" onClick={() => { setStep(2); setError(""); }}>
              Continue
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="onboard-body">
            {/* Username */}
            <div className="onboard-field">
              <label className="onboard-label">
                Username
                {usernameStatus === "available" && <span className="onboard-tag ok">✓ Available</span>}
                {usernameStatus === "taken" && <span className="onboard-tag err">✗ Taken</span>}
                {usernameStatus === "checking" && <span className="onboard-tag">Checking...</span>}
              </label>
              <div className="onboard-input-wrap">
                <span className="onboard-input-prefix">@</span>
                <input
                  type="text"
                  className="onboard-input"
                  placeholder="your_username"
                  value={username}
                  onChange={handleUsernameChange}
                  maxLength={20}
                  autoFocus
                />
              </div>
              <span className="onboard-hint">3-20 characters, letters, numbers, underscores</span>
            </div>

            {/* Display Name */}
            <div className="onboard-field">
              <label className="onboard-label">Display Name</label>
              <input
                type="text"
                className="onboard-input full"
                placeholder="Your Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value.slice(0, 30))}
                maxLength={30}
              />
            </div>

            {error && <div className="onboard-error">{error}</div>}

            <div className="onboard-actions">
              <button className="onboard-btn-secondary" onClick={() => setStep(1)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back
              </button>
              <button
                className="onboard-btn-primary"
                onClick={handleSave}
                disabled={saving || !username || username.length < 3 || usernameStatus === "taken"}
              >
                {saving ? "Saving..." : "Complete Setup"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
