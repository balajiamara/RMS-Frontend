import React, { useState, useEffect, useCallback, useRef } from "react";
import { AuthContext } from "./AuthContext";
import { apiGet } from "../api/api";

export default function AuthProvider({ children }) {
  // initialize from localStorage (optimistic)
  const [user, setUserState] = useState(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // loading indicates whether we're currently validating with server
  const [loading, setLoading] = useState(true);

  // keep a stable ref to avoid re-creating functions (helps with event listeners)
  const mountedRef = useRef(true);
  useEffect(() => { return () => { mountedRef.current = false; }; }, []);

  // stable setUser wrapper (won't change identity)
  const setUser = useCallback((u) => {
    setUserState(u);
    try {
      if (u) localStorage.setItem("auth_user", JSON.stringify(u));
      else localStorage.removeItem("auth_user");
    } catch (e) {
      console.warn("localStorage error", e);
    }
  }, []);

  // loadUser: stable function, no dependency on `user`
  const loadUser = useCallback(async () => {
    // show loading only when we do not have an optimistic local user
    // if (!localStorage.getItem("auth_user")) {
    //   setLoading(true);
    // }

    try {
      const res = await apiGet("whoami/"); // must use credentials: include inside apiGet
      if (res && res.userid) {
        // server verified session -> update user (and persist)
        setUser(res);
      } else {
        // server responded but no payload -> unauthenticated
        setUser(null);
      }
    } catch (err) {
      if (err?.status === 401) {
        // unauthorized: clear local user
        setUser(null);
      } else {
        // network or other error: keep optimistic local user if present, but log
        console.error("whoami error:", err);
      }
    } finally {
      // only update loading if component still mounted
      if (mountedRef.current) setLoading(false);
    }
  }, [setUser]);

  // run once on mount and add focus listener
  useEffect(() => {
  // Validate once on mount
  loadUser();

  const onFocus = () => {
    if (!loading) loadUser();
  };
  window.addEventListener("focus", onFocus);

  return () => window.removeEventListener("focus", onFocus);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadUser]);


  const logout = useCallback(() => {
    setUser(null);
    // optionally call backend logout endpoint
    // fetch(buildUrl('logout'), { method: 'POST', credentials: 'include' })
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, loadUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
