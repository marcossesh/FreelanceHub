import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Settings,
    LogOut
} from "lucide-react";
import { SignOutButton } from "../auth/sign-out-button";

const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Users, label: "Clientes", href: "/dashboard/clients" },
    { icon: Briefcase, label: "Projetos", href: "/dashboard/projects" },
    { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
];

export function Sidebar({ user }: { user: any }) {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6">
                <h2 className="text-xl font-bold text-blue-600">FreelanceHub</h2>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                        {user?.name?.[0] || "U"}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold text-gray-900 truncate">{user?.name}</span>
                        <span className="text-xs text-gray-500 truncate">{user?.email}</span>
                    </div>
                </div>
                <SignOutButton />
            </div>
        </aside>
    );
}
