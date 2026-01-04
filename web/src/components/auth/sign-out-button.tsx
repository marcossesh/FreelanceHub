"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="flex w-full items-center gap-3 px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
    >
      <LogOut size={20} />
      <span className="font-medium">Sair</span>
    </button>
  );
}
