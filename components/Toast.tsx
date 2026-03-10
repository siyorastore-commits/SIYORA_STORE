"use client";
import { useEffect, useState } from "react";

// Simple event-based toast system
type ToastListener = (msg: string) => void;
const listeners: ToastListener[] = [];

export function showToast(msg: string) {
  listeners.forEach((fn) => fn(msg));
}

export default function Toast() {
  const [msg, setMsg] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler: ToastListener = (m) => {
      setMsg(m);
      setVisible(true);
      setTimeout(() => setVisible(false), 2800);
    };
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  return (
    <div className={`toast ${visible ? "show" : ""}`}>
      <span>✓</span>
      {msg}
    </div>
  );
}
