"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
    TbHistory,
    TbCalendar,
    TbChevronDown,
    TbChevronUp,
    TbTrash,
    TbEye,
    TbX
} from "react-icons/tb";
import { GiMuscleUp, GiMeal, GiNightSleep, GiMeditation } from "react-icons/gi";

interface HistoryEntry {
    id: string;
    created_at: string;
    plan_data: any;
}

export default function HistoryPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [viewingPlan, setViewingPlan] = useState<any>(null);

    useEffect(() => {
        async function fetchHistory() {
            if (!user) return;

            // Try to fetch from plan_history table, fallback to current_plan
            const { data: historyData } = await supabase
                .from("plan_history")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(20);

            if (historyData && historyData.length > 0) {
                setHistory(historyData);
            } else {
                // Fallback: use current_plan as single history entry
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("current_plan, updated_at")
                    .eq("id", user.id)
                    .single();

                if (profile?.current_plan) {
                    setHistory([{
                        id: "current",
                        created_at: profile.updated_at || new Date().toISOString(),
                        plan_data: profile.current_plan
                    }]);
                }
            }
            setLoading(false);
        }
        fetchHistory();
    }, [user]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const extractPlanSummary = (plan: any) => {
        const unified = plan?.plan?.unified_plan || plan?.unified_plan || plan?.plan_data || plan || {};
        return {
            fitness: unified.fitness?.focus || "General",
            nutrition: `${unified.nutrition?.daily_calories || 2000} kcal`,
            sleep: `${unified.sleep?.target_hours || 8}h target`,
            mental: unified.mental_wellness?.focus || "Wellness"
        };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <TbHistory className="w-6 h-6 text-brand-400" />
                    Plan History
                </h1>
                <p className="text-slate-400">View and compare your past wellness plans</p>
            </div>

            {/* History List */}
            {history.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <TbHistory className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                    <h3 className="text-lg font-medium text-white mb-2">No History Yet</h3>
                    <p className="text-slate-400">Generate your first plan to see it here</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((entry, idx) => {
                        const summary = extractPlanSummary(entry.plan_data);
                        const isExpanded = expandedId === entry.id;

                        return (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-slate-900/60 border border-slate-800/50 rounded-2xl overflow-hidden"
                            >
                                {/* Entry Header */}
                                <div
                                    className="p-5 cursor-pointer hover:bg-slate-800/30 transition-colors"
                                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
                                                <TbCalendar className="w-6 h-6 text-brand-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white">
                                                    {idx === 0 ? "Latest Plan" : `Plan #${history.length - idx}`}
                                                </h3>
                                                <p className="text-sm text-slate-400">{formatDate(entry.created_at)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setViewingPlan(entry.plan_data);
                                                }}
                                                className="p-2 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-colors"
                                            >
                                                <TbEye className="w-5 h-5" />
                                            </button>
                                            {isExpanded ? <TbChevronUp className="w-5 h-5 text-slate-400" /> : <TbChevronDown className="w-5 h-5 text-slate-400" />}
                                        </div>
                                    </div>

                                    {/* Quick Summary Tags */}
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs flex items-center gap-1">
                                            <GiMuscleUp className="w-3 h-3" /> {summary.fitness}
                                        </span>
                                        <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-xs flex items-center gap-1">
                                            <GiMeal className="w-3 h-3" /> {summary.nutrition}
                                        </span>
                                        <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs flex items-center gap-1">
                                            <GiNightSleep className="w-3 h-3" /> {summary.sleep}
                                        </span>
                                        <span className="px-3 py-1 bg-pink-500/10 text-pink-400 rounded-lg text-xs flex items-center gap-1">
                                            <GiMeditation className="w-3 h-3" /> {summary.mental}
                                        </span>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-slate-800/50"
                                        >
                                            <div className="p-5 bg-slate-800/20">
                                                <pre className="text-xs text-green-400 overflow-x-auto max-h-60 bg-slate-950/50 p-4 rounded-xl">
                                                    {JSON.stringify(entry.plan_data, null, 2)}
                                                </pre>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Full Plan Modal */}
            <AnimatePresence>
                {viewingPlan && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setViewingPlan(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                                <h3 className="font-semibold text-white">Full Plan Details</h3>
                                <button
                                    onClick={() => setViewingPlan(null)}
                                    className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"
                                >
                                    <TbX className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4 overflow-y-auto max-h-[calc(80vh-60px)]">
                                <pre className="text-xs text-green-400 whitespace-pre-wrap">
                                    {JSON.stringify(viewingPlan, null, 2)}
                                </pre>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
