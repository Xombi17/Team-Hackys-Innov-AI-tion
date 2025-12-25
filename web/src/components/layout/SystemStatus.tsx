"use client";

import { Activity } from "lucide-react";

export function SystemStatus() {
    return (
        <div className="w-full bg-slate-950 border-y border-white/5 py-3 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span>System Operational</span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <span>Active Agents: <span className="text-slate-300">5</span></span>
                    <span>Decisions/hr: <span className="text-slate-300">12k+</span></span>
                    <span>Latency: <span className="text-slate-300">42ms</span></span>
                </div>

                <div className="flex items-center gap-2 text-brand-400/50">
                    <Activity className="w-3 h-3" />
                    <span>v2.1.0-beta</span>
                </div>
            </div>
        </div>
    );
}
