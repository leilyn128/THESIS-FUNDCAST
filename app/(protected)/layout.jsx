"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { supabase } from "../../lib/supabaseClient";

// Icons
import {
  ChartBarIcon,
  ArrowsRightLeftIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

function ProtectedLayoutContent({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const year = searchParams.get("year");

  const [loading, setLoading] = useState(true);
  const [accountOpen, setAccountOpen] = useState(false); // ✅ ONLY HERE
  const [showChangePassword, setShowChangePassword] = useState(false);
const [newPassword, setNewPassword] = useState("");
const [passwordMessage, setPasswordMessage] = useState("");

const [oldPassword, setOldPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [passwordLoading, setPasswordLoading] = useState(false);

const isPasswordValid =
  oldPassword &&
  newPassword &&
  confirmPassword &&
  newPassword === confirmPassword &&
  newPassword.length >= 8;

  // =========================
  // SIDEBAR LINKS (YEAR SAFE)
  // =========================
  const links = [
    {
      href: year ? `/dashboard?year=${year}` : "/dashboard",
      base: "/dashboard",
      label: "Cash Flow",
      icon: ChartBarIcon,
    },
    {
      href: year ? `/transaction?year=${year}` : "/transaction",
      base: "/transaction",
      label: "Transactions",
      icon: ArrowsRightLeftIcon,
    },
    {
      href: year ? `/expenses?year=${year}` : "/expenses",
      base: "/expenses",
      label: "Expenses",
      icon: DocumentChartBarIcon,
    },
    {
      href: year ? `/transactions?year=${year}` : "/transactions",
      base: "/transactions",
      label: "Forecast",
      icon: DocumentChartBarIcon,
    },
    {
      href: year ? `/reports?year=${year}` : "/reports",
      base: "/reports",
      label: "History",
      icon: DocumentChartBarIcon,
    },
   
  ];

  useEffect(() => {
  if (showChangePassword) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [showChangePassword]);

  // =========================
  // AUTH CHECK
  // =========================
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/auth");
      } else if (mounted) {
        setLoading(false);
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) router.replace("/auth");
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <p className="text-gray-400 animate-pulse">
          Checking authentication...
        </p>
      </div>
    );
  }

  return (
<div className="min-h-screen flex">

      {/* SIDEBAR */}
      <aside
        className="fixed top-0 left-0 h-full w-80
        bg-gradient-to-b from-emerald-800 to-emerald-900
        px-6 py-6 flex flex-col justify-between"
      >
        {/* LOGO */}
        <div>
          <div className="flex flex-col items-center text-center space-y-2 mb-8">
            <img
              src="/logo.png"
              alt="FUNDCAST Logo"
              className="w-30 h-30 rounded-full border border-emerald-500 shadow-sm object-cover"
            />
          </div>

          {/* NAVIGATION */}
          <nav className="space-y-3">
            {links.map((link) => {
              const isActive = pathname === link.base;

              return (
                <Link
                  key={link.base}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all
                    ${
                      isActive
                        ? "bg-emerald-600 text-white font-semibold shadow-sm"
                        : "text-emerald-100/80 hover:bg-emerald-700 hover:text-white"
                    }
                  `}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
    {/* CHANGE PASSWORD MODAL */}
{/* CHANGE PASSWORD MODAL */}
{showChangePassword && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    onClick={() => setShowChangePassword(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-xl shadow-lg w-full max-w-md p-6"
    >
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Change Password
      </h2>

      <input
        type="password"
        placeholder="Current password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        className="w-full border border-slate-300 rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-emerald-500"
      />

      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full border border-slate-300 rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-emerald-500"
      />

      <input
        type="password"
        placeholder="Re-enter new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full border border-slate-300 rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-emerald-500"
      />

      {passwordMessage && (
        <p
          className={`text-sm text-center mb-3 ${
            passwordMessage.includes("success")
              ? "text-emerald-600"
              : "text-red-600"
          }`}
        >
          {passwordMessage}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setShowChangePassword(false);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordMessage("");
          }}
          className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>

        <button
          disabled={!isPasswordValid || passwordLoading}
          onClick={async () => {
            setPasswordMessage("");
            setPasswordLoading(true);

            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (!user?.email) throw new Error("User not found.");

              const { error: signInError } =
                await supabase.auth.signInWithPassword({
                  email: user.email,
                  password: oldPassword,
                });

              if (signInError) throw new Error("Current password is incorrect.");

              const { error } = await supabase.auth.updateUser({
                password: newPassword,
              });

              if (error) throw error;

              setPasswordMessage("Password updated successfully.");

              setTimeout(() => {
                setShowChangePassword(false);
                setPasswordMessage("");
              }, 1500);
            } catch (err) {
              setPasswordMessage(err.message);
            } finally {
              setPasswordLoading(false);
            }
          }}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {passwordLoading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  </div>
)}
{/* ACCOUNT MENU */}
<div className="mt-auto pt-1 border-t border-emerald-700/60 relative">
  <button
    onClick={() => setAccountOpen(prev => !prev)}
    className="w-full flex items-center gap-3 px-15 py-2
      text-emerald-100 font-medium
      hover:bg-emerald-700/70 hover:text-white
      rounded-lg transition"
  >
    <Cog6ToothIcon className="h-5 w-5" />
    <span>Account</span>
  </button>

  {accountOpen && (
    <div className="mt-2 ml-2 mr-2 rounded-lg bg-white border border-slate-200 shadow-lg overflow-hidden">
      
      {/* CHANGE PASSWORD → SETTINGS PAGE */}
      <button
        onClick={() => {
          setAccountOpen(false);
          router.push("/settings"); // ✅ THIS IS THE KEY
        }}
        className="w-full text-left px-4 py-2 text-sm
          text-slate-700 hover:bg-slate-100 transition"
      >
        Change Password
      </button>

      <div className="h-px bg-slate-200 mx-3" />

      {/* LOGOUT */}
      <button
        onClick={async () => {
          setAccountOpen(false);
          await supabase.auth.signOut();
          router.replace("/auth");
        }}
        className="w-full text-left px-4 py-2 text-sm
          text-red-600 hover:bg-red-50 transition"
      >
        Logout
      </button>
    </div>
  )}
</div>


      </aside>

      {/* MAIN CONTENT */}
     <main
  className={`flex-1 overflow-y-auto ${
    showChangePassword ? "pointer-events-none" : ""
  }`}
  style={{ paddingLeft: "20rem" }}
>
  {children}
</main>
 

    </div>
  );
}

export default dynamic(() => Promise.resolve(ProtectedLayoutContent), {
  ssr: false,
});
