"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    TbClock,
    TbMoon,
    TbSunrise,
    TbPlayerPlay,
    TbCheck,
    TbChevronDown,
    TbChevronUp,
    TbBrain,
    TbCode
} from "react-icons/tb";
import { GiNightSleep, GiBed, GiMoon, GiSunrise } from "react-icons/gi";

export default function SleepPage() {
    const { user } = useAuth();
    const [plan, setPlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showRawData, setShowRawData] = useState(false);

    useEffect(() => {
        async function fetchPlan() {
            if (!user) return;
            const { data } = await supabase
                .from("profiles")
                .select("current_plan")
                .eq("id", user.id)
                .single();

            if (data?.current_plan) {
                setPlan(data.current_plan);
            }
            setLoading(false);
        }
        fetchPlan();
    }, [user]);

    // Extract unified plan data
    const extractSleepData = (planData: any) => {
        const s = planData?.plan?.unified_plan?.sleep ||
            planData?.plan_data?.sleep ||
            planData?.unified_plan?.sleep || {};
        return {
            targetHours: s.target_hours || 8,
            bedtime: s.bedtime || "10:30 PM",
            wakeTime: s.wake_time || "6:30 AM",
            sleepHygiene: s.sleep_hygiene || [],
            windDown: s.wind_down_routine || [],
            focus: s.focus || "recovery_optimization",
            recoveryStatus: s.recovery_status || "good",
            qualityTarget: s.sleep_quality_target || 85,
            confidence: s.confidence || 0.85,
            currentAvg: s.current_avg || "variable",
            rawData: s
        };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-20 h-20 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6">
                    <GiNightSleep className="w-10 h-10 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">No Sleep Plan Yet</h2>
                <p className="text-slate-400 mb-8 max-w-md">
                    Generate your personalized AI sleep plan to optimize your rest and recovery.
                </p>
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl text-white font-medium hover:from-purple-600 hover:to-violet-600 transition-all"
                >
                    <TbPlayerPlay className="w-5 h-5" />
                    Generate Plan
                </Link>
            </div>
        );
    }

    const sleep = extractSleepData(plan);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/30 to-violet-500/20 flex items-center justify-center">
                        <GiNightSleep className="w-7 h-7 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">💤 Sleep Agent</h1>
                        <p className="text-slate-400 capitalize">{sleep.focus.replace(/_/g, ' ')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Confidence:</span>
                    <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-purple-500/20 text-purple-400">
                        {(sleep.confidence * 100).toFixed(0)}%
                    </span>
                </div>
            </div>

            {/* Main Schedule Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-violet-500/5 border border-purple-500/20 rounded-2xl p-8"
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

                <div className="relative">
                    <div className="flex items-center justify-center gap-8 md:gap-16">
                        {/* Bedtime */}
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                                <GiMoon className="w-10 h-10 text-purple-400" />
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">{sleep.bedtime}</p>
                            <p className="text-sm text-slate-400">Bedtime</p>
                        </div>

                        {/* Duration */}
                        <div className="flex flex-col items-center">
                            <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-purple-500/50 to-orange-500/50 rounded-full" />
                            <div className="py-2 px-6 bg-slate-800/50 rounded-full my-2">
                                <span className="text-2xl font-bold text-white">{sleep.targetHours}h</span>
                            </div>
                            <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-purple-500/50 to-orange-500/50 rounded-full" />
                        </div>

                        {/* Wake Time */}
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-2xl bg-orange-500/20 flex items-center justify-center mx-auto mb-3">
                                <GiSunrise className="w-10 h-10 text-orange-400" />
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">{sleep.wakeTime}</p>
                            <p className="text-sm text-slate-400">Wake Up</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Agent Reasoning Trace */}
            <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-800/50 flex items-center gap-2">
                    <TbBrain className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold text-white">🧠 Reasoning Trace</h3>
                </div>
                <div className="p-5">
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-4">
                        <strong className="text-blue-400">Circadian Target:</strong>{" "}
                        <span className="text-white">{sleep.targetHours} Hours</span>
                    </div>

                    <div className="space-y-3 text-sm text-slate-300">
                        <p className="flex items-start gap-2">
                            <span className="text-purple-400 mt-1">•</span>
                            <span><strong>Deficit Analysis:</strong> User reports {sleep.currentAvg}h average.</span>
                        </p>
                        <p className="flex items-start gap-2">
                            <span className="text-purple-400 mt-1">•</span>
                            <span><strong>Intervention:</strong> Prescribed consistent Bedtime ({sleep.bedtime}) to anchor circadian rhythm.</span>
                        </p>
                        <p className="flex items-start gap-2">
                            <span className="text-purple-400 mt-1">•</span>
                            <span><strong>Hygiene Protocol:</strong> Recommended blue-light reduction block (1h pre-bed).</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Sleep Hygiene Tips */}
            {sleep.sleepHygiene.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-white mb-4">Sleep Hygiene Tips</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {sleep.sleepHygiene.map((tip: string, idx: number) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-start gap-3 p-4 bg-slate-900/60 border border-slate-800/50 rounded-xl"
                            >
                                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <TbCheck className="w-4 h-4 text-purple-400" />
                                </div>
                                <p className="text-sm text-slate-300">{tip}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Wind Down Routine */}
            {sleep.windDown.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-white mb-4">Wind-Down Routine</h2>
                    <div className="flex flex-wrap gap-3">
                        {sleep.windDown.map((activity: string, idx: number) => (
                            <motion.span
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20 text-purple-300 rounded-xl text-sm"
                            >
                                {activity}
                            </motion.span>
                        ))}
                    </div>
                </div>
            )}

            {/* Raw Agent Output */}
            <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl overflow-hidden">
                <button
                    onClick={() => setShowRawData(!showRawData)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <TbCode className="w-5 h-5 text-slate-400" />
                        <span className="text-sm text-slate-300">📝 View Raw Agent Output (JSON)</span>
                    </div>
                    {showRawData ? <TbChevronUp className="w-4 h-4 text-slate-400" /> : <TbChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                <AnimatePresence>
                    {showRawData && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                        >
                            <pre className="p-4 bg-slate-950/50 text-xs text-green-400 overflow-x-auto max-h-80">
                                {JSON.stringify(sleep.rawData, null, 2)}
                            </pre>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
