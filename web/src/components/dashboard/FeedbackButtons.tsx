"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TbCheck, TbRefresh, TbX, TbChevronDown, TbLoader2 } from "react-icons/tb";

interface FeedbackButtonsProps {
    onFeedback: (accepted: boolean, reason?: string) => void;
    isLoading?: boolean;
    className?: string;
}

const skipReasons = [
    "Too tired today",
    "Time constraints",
    "Already have plans",
    "Need more variety",
    "Weather conditions",
    "Other"
];

export function FeedbackButtons({ onFeedback, isLoading = false, className }: FeedbackButtonsProps) {
    const [showReasons, setShowReasons] = useState(false);
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [feedbackGiven, setFeedbackGiven] = useState<"accepted" | "modified" | "skipped" | null>(null);

    const handleAccept = () => {
        if (isLoading) return;
        setFeedbackGiven("accepted");
        onFeedback(true);
    };

    const handleModify = () => {
        if (isLoading) return;
        setFeedbackGiven("modified");
        setShowReasons(true);
    };

    const handleSkip = () => {
        if (isLoading) return;
        setShowReasons(true);
    };

    const confirmSkipOrModify = (reason?: string) => {
        setFeedbackGiven(feedbackGiven === "modified" ? "modified" : "skipped");
        setShowReasons(false);
        onFeedback(false, reason || selectedReason || undefined);
    };

    if (feedbackGiven && !showReasons) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                    "bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 text-center",
                    className
                )}
            >
                <div className={cn(
                    "w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center",
                    feedbackGiven === "accepted" ? "bg-green-500/20" : "bg-yellow-500/20"
                )}>
                    {feedbackGiven === "accepted" ? (
                        <TbCheck className="w-6 h-6 text-green-400" />
                    ) : (
                        <TbRefresh className="w-6 h-6 text-yellow-400" />
                    )}
                </div>
                <p className="text-slate-300 font-medium">
                    {feedbackGiven === "accepted"
                        ? "Plan accepted! Have a great day."
                        : "Feedback noted. We'll adapt."}
                </p>
            </motion.div>
        );
    }

    return (
        <div className={cn(
            "bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-5",
            className
        )}>
            <p className="text-sm text-slate-400 mb-4 text-center">How does this plan look?</p>

            <div className="flex gap-3">
                <button
                    onClick={handleAccept}
                    disabled={isLoading}
                    className={cn(
                        "flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2",
                        "bg-green-500/20 text-green-400 border border-green-500/30",
                        "hover:bg-green-500/30 hover:scale-[1.02]",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                >
                    {isLoading ? <TbLoader2 className="w-5 h-5 animate-spin" /> : <TbCheck className="w-5 h-5" />}
                    Accept
                </button>

                <button
                    onClick={handleModify}
                    disabled={isLoading}
                    className={cn(
                        "flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2",
                        "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
                        "hover:bg-yellow-500/30 hover:scale-[1.02]",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                >
                    <TbRefresh className="w-5 h-5" />
                    Modify
                </button>

                <button
                    onClick={handleSkip}
                    disabled={isLoading}
                    className={cn(
                        "flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2",
                        "bg-red-500/20 text-red-400 border border-red-500/30",
                        "hover:bg-red-500/30 hover:scale-[1.02]",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                >
                    <TbX className="w-5 h-5" />
                    Skip
                </button>
            </div>

            <AnimatePresence>
                {showReasons && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4 pt-4 border-t border-slate-800/50">
                            <p className="text-sm text-slate-400 mb-3">Select a reason (optional):</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {skipReasons.map((reason) => (
                                    <button
                                        key={reason}
                                        onClick={() => setSelectedReason(
                                            selectedReason === reason ? null : reason
                                        )}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                                            selectedReason === reason
                                                ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                                                : "bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600"
                                        )}
                                    >
                                        {reason}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => confirmSkipOrModify()}
                                className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors font-medium text-sm"
                            >
                                Confirm
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
