"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TbX, TbActivity, TbToolsKitchen2, TbMoon, TbBrain, TbClock, TbFlame } from "react-icons/tb";

interface PlanDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "fitness" | "nutrition" | "sleep" | "mental" | null;
    data: any;
}

export function PlanDetailsModal({ isOpen, onClose, type, data }: PlanDetailsModalProps) {
    if (!isOpen || !type || !data) return null;

    const getIcon = () => {
        switch (type) {
            case "fitness": return TbActivity;
            case "nutrition": return TbToolsKitchen2;
            case "sleep": return TbMoon;
            case "mental": return TbBrain;
            default: return TbActivity;
        }
    };

    const getColor = () => {
        switch (type) {
            case "fitness": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
            case "nutrition": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
            case "sleep": return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
            case "mental": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
            default: return "text-brand-400 bg-brand-500/10 border-brand-500/20";
        }
    };

    const Icon = getIcon();
    const colorClass = getColor();

    // Helper to render content based on type
    const renderContent = () => {
        if (type === "fitness") {
            const wp = data.workout_plan || {};
            // Assist: Handle simple string vs object
            const exercises = Array.isArray(wp.exercises) ? wp.exercises : (wp.exercises ? [wp.exercises] : []);

            return (
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="flex-1 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                            <span className="text-slate-400 text-xs uppercase tracking-wider">Duration</span>
                            <p className="text-xl font-bold text-white mt-1">{wp.duration || "30 mins"}</p>
                        </div>
                        <div className="flex-1 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                            <span className="text-slate-400 text-xs uppercase tracking-wider">Intensity</span>
                            <p className="text-xl font-bold text-white mt-1">{wp.intensity || "Moderate"}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                            <TbFlame className="w-4 h-4 text-orange-400" /> Workout Routine
                        </h4>
                        <ul className="space-y-3">
                            {exercises.length > 0 ? exercises.map((ex: any, i: number) => (
                                <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300 mt-0.5">{i + 1}</span>
                                    <span className="text-slate-200">{typeof ex === 'string' ? ex : (ex.name || JSON.stringify(ex))}</span>
                                </li>
                            )) : (
                                <p className="text-slate-500 italic">No specific exercises listed. Focus on general movement.</p>
                            )}
                        </ul>
                    </div>
                </div>
            );
        }

        if (type === "nutrition") {
            const mp = data.meal_plan || {};
            const meals = [
                { label: "Breakfast", val: mp.breakfast },
                { label: "Lunch", val: mp.lunch },
                { label: "Snack", val: mp.snack },
                { label: "Dinner", val: mp.dinner },
            ].filter(m => m.val);

            return (
                <div className="space-y-6">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex items-center justify-between">
                        <div>
                            <span className="text-slate-400 text-xs uppercase tracking-wider">Hydration Goal</span>
                            <p className="text-xl font-bold text-white mt-1">{data.nutrition?.hydration || "8 glasses"}</p>
                        </div>
                        <TbToolsKitchen2 className="w-8 h-8 text-slate-600 opacity-50" />
                    </div>

                    <div className="space-y-4">
                        {meals.map((meal, i) => (
                            <div key={i} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                                <h4 className="text-sm font-bold text-emerald-400 mb-1">{meal.label}</h4>
                                <p className="text-slate-200 text-sm leading-relaxed">{meal.val}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (type === "sleep") {
            const sp = data.sleep_protocol || {};
            return (
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="flex-1 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                            <span className="text-slate-400 text-xs uppercase tracking-wider">Bedtime</span>
                            <p className="text-xl font-bold text-white mt-1">{sp.bedtime || "10:30 PM"}</p>
                        </div>
                        <div className="flex-1 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                            <span className="text-slate-400 text-xs uppercase tracking-wider">Wake Up</span>
                            <p className="text-xl font-bold text-white mt-1">{sp.wake_time || "7:00 AM"}</p>
                        </div>
                    </div>

                    <div className="p-5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                        <h4 className="text-indigo-300 font-medium mb-2 flex items-center gap-2">
                            <TbMoon className="w-4 h-4" /> Hygiene Protocol
                        </h4>
                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                            {typeof sp === 'string' ? sp : (sp.recommendations || "No specific protocol. Aim for 8 hours.")}
                        </p>
                    </div>
                </div>
            );
        }

        if (type === "mental") {
            const mp = data.mental_protocol || {};
            return (
                <div className="space-y-6">
                    <div className="p-5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                        <h4 className="text-rose-300 font-medium mb-2 flex items-center gap-2">
                            <TbBrain className="w-4 h-4" /> Daily Practice
                        </h4>
                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                            {typeof mp === 'string' ? mp : (mp.practice || "Take 5 minutes to breathe efficiently.")}
                        </p>
                    </div>

                    {mp.focus && (
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                            <span className="text-slate-400 text-xs uppercase tracking-wider">Focus Area</span>
                            <p className="text-white mt-1">{mp.focus}</p>
                        </div>
                    )}
                </div>
            );
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                >
                    {/* Header */}
                    <div className={`p-6 border-b border-slate-800 flex items-center justify-between ${colorClass}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-black/20`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight capitalize">{type} Details</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-black/20 rounded-full transition-colors"
                        >
                            <TbX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="p-6 overflow-y-auto custom-scrollbar">
                        {renderContent()}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-800 bg-slate-900/50 text-center">
                        <button
                            onClick={onClose}
                            className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
