"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { checkHealth } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { TbCircleFilled } from "react-icons/tb";

interface DashboardTopBarProps {
    className?: string;
}

type SystemStatus = "ready" | "processing" | "offline";

export function DashboardTopBar({ className }: DashboardTopBarProps) {
    const { user } = useAuth();
    const [systemStatus, setSystemStatus] = useState<SystemStatus>("ready");
    const [currentDate] = useState(() => {
        return new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    });

    // Health check ping every 30s
    useEffect(() => {
        const checkSystemHealth = async () => {
            const isHealthy = await checkHealth();
            setSystemStatus(isHealthy ? "ready" : "offline");
        };

        checkSystemHealth();
        const interval = setInterval(checkSystemHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    const statusConfig = {
        ready: { label: "System Ready", color: "text-green-400", bg: "bg-green-500" },
        processing: { label: "Processing", color: "text-yellow-400", bg: "bg-yellow-500" },
        offline: { label: "Offline", color: "text-red-400", bg: "bg-red-500" },
    };

    const status = statusConfig[systemStatus];

    const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

    return (
        <div className={cn(
            "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6",
            className
        )}>
            {/* Left: Date & Welcome */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    Welcome back, {userName}
                </h1>
                <p className="text-slate-400 text-sm mt-1">{currentDate}</p>
            </div>

            {/* Right: System Status */}
            <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full",
                "bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm"
            )}>
                <span className="relative flex h-2.5 w-2.5">
                    {systemStatus === "ready" && (
                        <span className={cn(
                            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                            status.bg
                        )} />
                    )}
                    <span className={cn(
                        "relative inline-flex rounded-full h-2.5 w-2.5",
                        status.bg
                    )} />
                </span>
                <span className={cn("text-sm font-medium", status.color)}>
                    {status.label}
                </span>
            </div>
        </div>
    );
}
