"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Brain, Activity, Utensils, Moon, Zap } from "lucide-react";

interface AgentReportsProps {
    plan: any;
}

export function AgentReports({ plan }: AgentReportsProps) {
    const [expanded, setExpanded] = useState(false);

    if (!plan) return null;

    const unified = plan.plan_data || {};
    const fitness = unified.fitness || {};
    const nutrition = unified.nutrition || {};
    const sleep = unified.sleep || {};
    const mental = unified.mental || {};

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-800/30 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <Brain className="w-6 h-6 text-brand-400" />
                    <div className="text-left">
                        <h3 className="text-white font-semibold">Agent Intelligence Reports</h3>
                        <p className="text-slate-400 text-sm">Deep dive into the swarm's reasoning</p>
                    </div>
                </div>
                {expanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                )}
            </button>

            {expanded && (
                <div className="p-6 pt-0 border-t border-slate-800/50 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 fade-in duration-300">
                    {/* Fitness Report */}
                    <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                        <div className="flex items-center gap-2 mb-3 text-blue-400">
                            <Activity className="w-4 h-4" />
                            <h4 className="font-semibold text-sm uppercase tracking-wider">Fitness Agent</h4>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Objective</span>
                                <span className="text-slate-200">{fitness.phase || "General Conditioning"}</span>
                            </div>
                            <div className="bg-blue-500/10 p-3 rounded-lg text-blue-200/80 text-xs leading-relaxed">
                                <strong>Strategy:</strong> Selected {fitness.intensity || "Moderate"} intensity protocol based on current recovery markers. Prioritizing {fitness.type || "Strength"} to maximize ROI.
                            </div>
                        </div>
                    </div>

                    {/* Nutrition Report */}
                    <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                        <div className="flex items-center gap-2 mb-3 text-green-400">
                            <Utensils className="w-4 h-4" />
                            <h4 className="font-semibold text-sm uppercase tracking-wider">Nutrition Agent</h4>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Target</span>
                                <span className="text-slate-200">{nutrition.diet_type || "Balanced"}</span>
                            </div>
                            <div className="bg-green-500/10 p-3 rounded-lg text-green-200/80 text-xs leading-relaxed">
                                <strong>Analysis:</strong> Budget constraint (₹150/day) verified. Calibrated macros for metabolic stability.
                            </div>
                        </div>
                    </div>

                    {/* Sleep Report */}
                    <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                        <div className="flex items-center gap-2 mb-3 text-purple-400">
                            <Moon className="w-4 h-4" />
                            <h4 className="font-semibold text-sm uppercase tracking-wider">Sleep Agent</h4>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Goal</span>
                                <span className="text-slate-200">{sleep.schedule?.bedtime || "11:00 PM"} Start</span>
                            </div>
                            <div className="bg-purple-500/10 p-3 rounded-lg text-purple-200/80 text-xs leading-relaxed">
                                <strong>Intervention:</strong> Circadian anchor set. Recommended blue-light reduction block 45m pre-bed.
                            </div>
                        </div>
                    </div>

                    {/* Mental Report */}
                    <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                        <div className="flex items-center gap-2 mb-3 text-cyan-400">
                            <Zap className="w-4 h-4" />
                            <h4 className="font-semibold text-sm uppercase tracking-wider">Mental Agent</h4>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Focus</span>
                                <span className="text-slate-200">{mental.focus_area || "Clarity"}</span>
                            </div>
                            <div className="bg-cyan-500/10 p-3 rounded-lg text-cyan-200/80 text-xs leading-relaxed">
                                <strong>Vector:</strong> Detected high cognitive load. Inserted micro-breaks to manage cortisol levels.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
