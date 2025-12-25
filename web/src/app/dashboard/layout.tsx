"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    TbLayoutDashboard,
    TbHeartRateMonitor,
    TbSalad,
    TbMoon,
    TbBrain,
    TbSettings,
    TbLogout,
    TbChevronLeft,
    TbHistory,
    TbChartBar,
} from "react-icons/tb";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { AIChatPanel } from "@/components/dashboard/AIChatPanel";

const navigation = [
    { name: "Overview", href: "/dashboard", icon: TbLayoutDashboard },
    { name: "Fitness", href: "/dashboard/fitness", icon: TbHeartRateMonitor },
    { name: "Nutrition", href: "/dashboard/nutrition", icon: TbSalad },
    { name: "Sleep", href: "/dashboard/sleep", icon: TbMoon },
    { name: "Mental Wellness", href: "/dashboard/mental", icon: TbBrain },
    { name: "Analytics", href: "/dashboard/analytics", icon: TbChartBar },
    { name: "History", href: "/dashboard/history", icon: TbHistory },
    { name: "Settings", href: "/dashboard/settings", icon: TbSettings },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const { signOut } = useAuth();

    return (
        <AuthGuard>
            <div className="min-h-screen bg-slate-950 flex">
                {/* Desktop Sidebar */}
                <aside
                    className={cn(
                        "fixed left-0 top-0 h-full bg-slate-900/80 backdrop-blur-xl border-r border-slate-800/50 transition-all duration-300 z-50 hidden md:block",
                        collapsed ? "w-16" : "w-64"
                    )}
                >
                    {/* Logo */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/50">
                        {!collapsed && (
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">W</span>
                                </div>
                                <span className="text-white font-semibold">WellSync AI</span>
                            </Link>
                        )}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors"
                        >
                            <TbChevronLeft
                                className={cn(
                                    "w-5 h-5 transition-transform",
                                    collapsed && "rotate-180"
                                )}
                            />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="p-3 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                                        isActive
                                            ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    )}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" />
                                    {!collapsed && (
                                        <span className="font-medium">{item.name}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom */}
                    <div className="absolute bottom-4 left-0 right-0 px-3">
                        <button
                            onClick={() => signOut()}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
                        >
                            <TbLogout className="w-5 h-5" />
                            {!collapsed && <span>Sign Out</span>}
                        </button>
                    </div>
                </aside>

                {/* Mobile Bottom Navigation */}
                <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/50 z-50 md:hidden">
                    <div className="flex items-center justify-around py-2">
                        {navigation.slice(0, 5).map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex flex-col items-center p-2 rounded-lg transition-colors",
                                        isActive
                                            ? "text-brand-400"
                                            : "text-slate-400"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-xs mt-1">{item.name.split(" ")[0]}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Main Content */}
                <main
                    className={cn(
                        "flex-1 transition-all duration-300 pb-20 md:pb-0",
                        collapsed ? "md:ml-16" : "md:ml-64"
                    )}
                >
                    <div className="p-4 md:p-8">{children}</div>
                </main>

                {/* AI Chat Panel */}
                <AIChatPanel />
            </div>
        </AuthGuard>
    );
}
