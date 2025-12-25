"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TbCalendar, TbChevronRight, TbX, TbActivity, TbMoon, TbApple, TbBrain } from "react-icons/tb";

interface HistoryEntry {
    date: string;
    tag: string;
    plan: {
        activity: string;
        nutrition: string;
        recovery: string;
        focus: string;
    };
    reasoning?: string;
}

interface HistoryTimelineProps {
    history: HistoryEntry[];
    className?: string;
}

const tagStyles: Record<string, { bg: string; text: string; border: string }> = {
    "Recovery day": { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
    "High intensity": { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" },
    "Budget adjusted": { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" },
    "Focus mode": { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
    "Balanced day": { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
};

export function HistoryTimeline({ history, className }: HistoryTimelineProps) {
    const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return "Today";
        if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric"
        });
    };

    const getTagStyle = (tag: string) => {
        return tagStyles[tag] || { bg: "bg-slate-700/50", text: "text-slate-400", border: "border-slate-600" };
    };

    return (
        <>
            <div className={cn(
                "bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg",
                className
            )}>
                <div className="p-4 border-b border-slate-700/50 bg-slate-900/50">
                    <div className="flex items-center gap-2">
                        <TbCalendar className="w-5 h-5 text-slate-400" />
                        <h3 className="font-semibold text-white">Recent History</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Your wellness journey</p>
                </div>

                <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {history.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-800/50 flex items-center justify-center">
                                <TbCalendar className="w-6 h-6 text-slate-600" />
                            </div>
                            <p className="text-sm text-slate-500">No history yet</p>
                            <p className="text-xs text-slate-600">Complete your first plan!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800/50">
                            {history.slice(0, 7).map((entry, idx) => {
                                const style = getTagStyle(entry.tag);

                                return (
                                    <motion.button
                                        key={entry.date}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => setSelectedEntry(entry)}
                                        className="w-full flex items-center justify-between p-3.5 hover:bg-slate-800/30 transition-colors text-left group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                idx === 0 ? "bg-brand-500" : "bg-slate-600"
                                            )} />
                                            <div>
                                                <span className="text-sm text-slate-200 font-medium">
                                                    {formatDate(entry.date)}
                                                </span>
                                                <div className="mt-1">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-full text-[10px] font-medium border",
                                                        style.bg, style.text, style.border
                                                    )}>
                                                        {entry.tag}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <TbChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                                    </motion.button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedEntry && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        onClick={() => setSelectedEntry(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        {formatDate(selectedEntry.date)}
                                    </h3>
                                    <span className={cn(
                                        "inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium border",
                                        getTagStyle(selectedEntry.tag).bg,
                                        getTagStyle(selectedEntry.tag).text,
                                        getTagStyle(selectedEntry.tag).border
                                    )}>
                                        {selectedEntry.tag}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedEntry(null)}
                                    className="p-2 rounded-xl hover:bg-slate-700/50 text-slate-400 transition-colors"
                                >
                                    <TbX className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="p-3.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                    <div className="flex items-center gap-2 mb-1">
                                        <TbActivity className="w-4 h-4 text-blue-400" />
                                        <span className="text-xs text-blue-400 font-medium uppercase">Activity</span>
                                    </div>
                                    <p className="text-sm text-slate-300">{selectedEntry.plan.activity}</p>
                                </div>

                                <div className="p-3.5 bg-green-500/10 rounded-xl border border-green-500/20">
                                    <div className="flex items-center gap-2 mb-1">
                                        <TbApple className="w-4 h-4 text-green-400" />
                                        <span className="text-xs text-green-400 font-medium uppercase">Nutrition</span>
                                    </div>
                                    <p className="text-sm text-slate-300">{selectedEntry.plan.nutrition}</p>
                                </div>

                                <div className="p-3.5 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                    <div className="flex items-center gap-2 mb-1">
                                        <TbMoon className="w-4 h-4 text-purple-400" />
                                        <span className="text-xs text-purple-400 font-medium uppercase">Recovery</span>
                                    </div>
                                    <p className="text-sm text-slate-300">{selectedEntry.plan.recovery}</p>
                                </div>

                                <div className="p-3.5 bg-pink-500/10 rounded-xl border border-pink-500/20">
                                    <div className="flex items-center gap-2 mb-1">
                                        <TbBrain className="w-4 h-4 text-pink-400" />
                                        <span className="text-xs text-pink-400 font-medium uppercase">Focus</span>
                                    </div>
                                    <p className="text-sm text-slate-300">{selectedEntry.plan.focus}</p>
                                </div>
                            </div>

                            {selectedEntry.reasoning && (
                                <div className="mt-4 p-4 bg-brand-500/10 rounded-xl border border-brand-500/20">
                                    <span className="text-xs text-brand-400 font-medium uppercase block mb-1">
                                        Coordinator Note
                                    </span>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        {selectedEntry.reasoning}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
