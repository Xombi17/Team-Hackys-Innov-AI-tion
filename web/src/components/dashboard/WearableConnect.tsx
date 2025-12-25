"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TbDeviceWatch, TbHeartRateMonitor, TbWalk, TbMoon, TbFlame, TbCheck } from "react-icons/tb";

const mockWearableData = {
    heartRate: 72,
    steps: 8453,
    sleepHours: 7.5,
    caloriesBurned: 2150,
    activeMinutes: 45,
    restingHR: 58,
};

export function WearableConnect() {
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [data, setData] = useState<typeof mockWearableData | null>(null);

    const handleConnect = () => {
        setConnecting(true);
        // Simulate connection delay
        setTimeout(() => {
            setConnecting(false);
            setConnected(true);
            setData(mockWearableData);
        }, 2000);
    };

    if (!connected) {
        return (
            <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <TbDeviceWatch className="w-6 h-6 text-brand-400" />
                    <h3 className="font-semibold text-white">Connect Wearable</h3>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                    Sync data from your fitness tracker for more personalized recommendations.
                </p>
                <div className="flex flex-wrap gap-3 mb-4">
                    {["Apple Watch", "Fitbit", "Garmin", "Samsung Galaxy Watch"].map((device) => (
                        <span key={device} className="px-3 py-1.5 bg-slate-800/50 text-slate-400 rounded-lg text-xs">
                            {device}
                        </span>
                    ))}
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConnect}
                    disabled={connecting}
                    className="w-full py-3 bg-gradient-to-r from-brand-500 to-cyan-500 text-white rounded-xl font-medium hover:from-brand-600 hover:to-cyan-600 transition-all disabled:opacity-50"
                >
                    {connecting ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Connecting...
                        </span>
                    ) : (
                        "Connect Device (Demo)"
                    )}
                </motion.button>
            </div>
        );
    }

    return (
        <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <TbDeviceWatch className="w-6 h-6 text-green-400" />
                    <h3 className="font-semibold text-white">Apple Watch</h3>
                </div>
                <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                    <TbCheck className="w-3 h-3" /> Connected
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <WearableStat
                    icon={TbHeartRateMonitor}
                    label="Heart Rate"
                    value={`${data?.heartRate} bpm`}
                    color="red"
                />
                <WearableStat
                    icon={TbWalk}
                    label="Steps"
                    value={data?.steps.toLocaleString() || "0"}
                    color="blue"
                />
                <WearableStat
                    icon={TbMoon}
                    label="Sleep"
                    value={`${data?.sleepHours}h`}
                    color="purple"
                />
                <WearableStat
                    icon={TbFlame}
                    label="Calories"
                    value={`${data?.caloriesBurned}`}
                    color="orange"
                />
                <WearableStat
                    icon={TbHeartRateMonitor}
                    label="Resting HR"
                    value={`${data?.restingHR} bpm`}
                    color="pink"
                />
                <WearableStat
                    icon={TbWalk}
                    label="Active Min"
                    value={`${data?.activeMinutes}`}
                    color="green"
                />
            </div>

            <p className="text-xs text-slate-500 mt-4 text-center">
                Last synced: Just now (Demo data)
            </p>
        </div>
    );
}

function WearableStat({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
    const colors: Record<string, string> = {
        red: "text-red-400 bg-red-500/10",
        blue: "text-blue-400 bg-blue-500/10",
        purple: "text-purple-400 bg-purple-500/10",
        orange: "text-orange-400 bg-orange-500/10",
        pink: "text-pink-400 bg-pink-500/10",
        green: "text-green-400 bg-green-500/10",
    };

    return (
        <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-white font-semibold">{value}</p>
                <p className="text-xs text-slate-400">{label}</p>
            </div>
        </div>
    );
}
