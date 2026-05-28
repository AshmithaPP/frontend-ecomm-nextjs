"use client";

import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "@/store/authStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
    checkSession();
  }, [checkSession]);

  return (
    <>
      {children}
      <ToastContainer position="top-right" autoClose={3000} limit={2} />
    </>
  );
}

