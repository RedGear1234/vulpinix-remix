"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-[#0c0d18]/80 group-[.toaster]:text-white group-[.toaster]:border-[var(--vx-border)] group-[.toaster]:shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-[.toaster]:backdrop-blur-2xl group-[.toaster]:rounded-2xl group-[.toaster]:px-5 group-[.toaster]:py-4",
          description: "group-[.toast]:text-[#94a3b8] group-[.toast]:text-xs group-[.toast]:mt-1",
          title: "group-[.toast]:text-sm group-[.toast]:font-bold group-[.toast]:tracking-tight",
          actionButton: "group-[.toast]:bg-white group-[.toast]:text-[#0c0d18] group-[.toast]:font-bold group-[.toast]:rounded-lg",
          cancelButton: "group-[.toast]:bg-white/10 group-[.toast]:text-white group-[.toast]:rounded-lg",
          success: "group-[.toast]:border-green-500/30 group-[.toast]:bg-green-500/5",
          error: "group-[.toast]:border-red-500/30 group-[.toast]:bg-red-500/5",
          info: "group-[.toast]:border-blue-500/30 group-[.toast]:bg-blue-500/5",
          warning: "group-[.toast]:border-yellow-500/30 group-[.toast]:bg-yellow-500/5",
        },
      }}
      style={{
        fontFamily: "'Inter', sans-serif",
      }}
      {...props}
    />
  );
};

export { Toaster };


