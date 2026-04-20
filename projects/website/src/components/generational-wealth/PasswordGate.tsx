import React, { useState, useEffect } from "react";

interface PasswordGateProps {
  children: React.ReactNode;
}

const HASH = "2be49801dd95fc0a399be6d6a341d83868a177511b0155e543d0067d4b9ffd25";
const SALT = "gw-tribe-2026";
const LS_UNLOCKED = "gw_unlocked";
const LS_UNLOCKED_AT = "gw_unlocked_at";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

async function hashPassword(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(SALT + input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function isUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  const flag = localStorage.getItem(LS_UNLOCKED);
  const ts = localStorage.getItem(LS_UNLOCKED_AT);
  if (flag !== "true" || !ts) return false;
  return Date.now() - parseInt(ts, 10) < THIRTY_DAYS_MS;
}

const PasswordGate = ({ children }: PasswordGateProps) => {
  const [unlocked, setUnlocked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isUnlocked()) {
      setUnlocked(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const hashed = await hashPassword(password);

    if (hashed === HASH) {
      localStorage.setItem(LS_UNLOCKED, "true");
      localStorage.setItem(LS_UNLOCKED_AT, String(Date.now()));
      setUnlocked(true);
    } else {
      setError("That\u2019s not it \u2014 ask Mike for the password");
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (unlocked) return <>{children}</>;

  return (
    <div className="gw-gate">
      <div className="gw-gate__card">
        <h1 className="gw-gate__heading">This is for the tribe.</h1>
        <p className="gw-gate__subheading">Enter the password Mike gave you.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className={`gw-gate__input${error ? " error" : ""}`}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus
          />
          <button
            type="submit"
            className="gw-gate__btn"
            disabled={loading || !password}
          >
            {loading ? "Checking\u2026" : "Let me in"}
          </button>
        </form>
        <p className="gw-gate__error">{error}</p>
      </div>
    </div>
  );
};

export default PasswordGate;
