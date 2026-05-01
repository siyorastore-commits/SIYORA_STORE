"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { SiyoraUser } from "@/types";

interface UserContextType {
  user: SiyoraUser | null;
  loading: boolean;
  showQuiz: boolean;
  setShowQuiz: (v: boolean) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  showQuiz: false,
  setShowQuiz: () => {},
  refreshUser: async () => {},
  logout: async () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SiyoraUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuizState] = useState(false);

  async function fetchUser() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (typeof window !== "undefined" && localStorage.getItem("siyora_show_quiz") === "true") {
          setShowQuizState(true);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  function setShowQuiz(v: boolean) {
    setShowQuizState(v);
    if (!v && typeof window !== "undefined") {
      localStorage.removeItem("siyora_show_quiz");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setShowQuiz(false);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, showQuiz, setShowQuiz, refreshUser: fetchUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
