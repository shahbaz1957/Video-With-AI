"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, LogIn, LogOut, Upload, User } from "lucide-react";
import { useNotification } from "./Notification";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50  bg-gray-600 shadow-sm">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg"
          onClick={() => showNotification("Welcome to ImageKit ReelsPro", "info")}
        >
          <Home className="h-5 w-5 text-white" />
          <span className="text-white">Video with AI</span>
        </Link>

        {/* User menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-full bg-gray-100 hover:bg-gray-200 p-2 transition"
          >
            <User className="w-5 h-5 text-gray-700" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50 text-sm">
              {session ? (
                <>
                  <div className="px-4 py-2 text-gray-600">
                    {session.user?.email?.split("@")[0]}
                  </div>
                  <hr />
                  <Link
                    href="/upload"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      showNotification("Welcome to Admin Dashboard", "info");
                      setOpen(false);
                    }}
                  >
                    <Upload className="inline w-4 h-4 mr-2" />
                    Upload Video
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="inline w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    showNotification("Please sign in to continue", "info");
                    setOpen(false);
                  }}
                >
                  <LogIn className="inline w-4 h-4 mr-2" />
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}