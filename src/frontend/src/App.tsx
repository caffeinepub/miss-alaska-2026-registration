import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AdminPage from "./pages/AdminPage";
import RegistrationPage from "./pages/RegistrationPage";

export default function App() {
  const [page, setPage] = useState<"register" | "admin">(() => {
    const hash = window.location.hash;
    if (hash === "#/admin") return "admin";
    return "register";
  });

  const navigate = (p: "register" | "admin") => {
    window.location.hash = p === "admin" ? "#/admin" : "#/register";
    setPage(p);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-white/90 backdrop-blur-md border-b border-border shadow-xs">
        <button
          type="button"
          data-ocid="nav.link"
          onClick={() => navigate("register")}
          className="flex items-center gap-2 font-display font-bold text-royal-purple text-lg hover:opacity-80 transition-opacity"
        >
          <img
            src="/assets/generated/miss-alaska-crown-transparent.dim_200x200.png"
            alt="Crown"
            className="w-8 h-8 object-contain"
          />
          <span className="hidden sm:inline">Miss Alaska 2026</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="nav.register.link"
            onClick={() => navigate("register")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              page === "register"
                ? "bg-primary text-white shadow-pageant"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Register
          </button>
          <button
            type="button"
            data-ocid="nav.admin.link"
            onClick={() => navigate("admin")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              page === "admin"
                ? "bg-primary text-white shadow-pageant"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Admin
          </button>
        </div>
      </nav>

      <main className="pt-14">
        {page === "register" && <RegistrationPage />}
        {page === "admin" && <AdminPage />}
      </main>

      <Toaster richColors position="top-center" />
    </>
  );
}
