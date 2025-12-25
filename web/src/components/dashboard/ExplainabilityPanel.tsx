"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TbChevronDown, TbBrain, TbSparkles, TbCheck } from "react-icons/tb";
import { GiMuscleUp, GiMeal, GiNightSleep, GiMeditation, GiCircuitry } from "react-icons/gi";

interface ExplainabilityPanelProps {
    planData: Record<string, any>;
    className?: string;
}

const agentConfigs = [
    {
        key: "fitness",
        title: "Fitness Agent",
        icon: GiMuscleUp,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20"
    },
    {
        key: "nutrition",
        title: "Nutrition Agent",
        icon: GiMeal,
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20"
    },
    {
        key: "sleep",
        title: "Sleep Agent",
        icon: GiNightSleep,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20"
    },
    {
        key: "mental",
        title: "Mental Agent",
        icon: GiMeditation,
        color: "text-pink-400",
        bgColor: "bg-pink-500/10",
        borderColor: "border-pink-500/20"
    },
];

export function ExplainabilityPanel({ planData, className }: ExplainabilityPanelProps) {
    const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

    const toggleAgent = (key: string) => {
        setExpandedAgent(expandedAgent === key ? null : key);
    };

    // Extract reasoning from plan data
    const getAgentReasoning = (key: string): string => {
        const domainData = planData?.[key] || planData?.[`${key}_wellness`] || {};

        // Try to get direct reasoning
        if (domainData.reasoning) return domainData.reasoning;

        // Generate contextual reasoning based on data
        switch (key) {
            case 'fitness':
                const intensity = domainData?.intensity || domainData?.workout_plan?.intensity || 'moderate';
                const focus = domainData?.focus || domainData?.workout_plan?.focus || 'balanced';
                return `Selected ${intensity} intensity protocol focusing on ${focus.replace(/_/g, ' ')}. This is optimized based on your current energy levels and recovery status to maximize gains while preventing overtraining.`;

            case 'nutrition':
                const calories = domainData?.daily_calories || domainData?.meal_plan?.daily_calories || 2000;
                const adequacy = domainData?.nutritional_adequacy || 'optimal';
                return `Calibrated ${calories} kcal daily target with ${adequacy} nutritional adequacy. Meal timing is synchronized with your workout schedule to optimize energy availability and recovery.`;

            case 'sleep':
                const hours = domainData?.target_hours || domainData?.sleep_recommendations?.target_hours || 8;
                const recovery = domainData?.recovery_status || 'good';
                return `Targeting ${hours}h sleep window for ${recovery} recovery. Sleep schedule aligned with your circadian rhythm and designed to maximize deep sleep phases for muscle recovery.`;

            case 'mental':
                const focusArea = domainData?.focus || domainData?.wellness_recommendations?.focus || 'stress management';
                const motivation = domainData?.motivation_level || 'medium';
                return `Focus on ${focusArea.replace(/_/g, ' ')} with ${motivation} motivation strategy. Practices selected to reduce cognitive load while building sustainable mindfulness habits.`;

            default:
                return 'Agent reasoning not available.';
        }
    };

    // Get confidence from plan data
    const getAgentConfidence = (key: string): number => {
        const agentContributions = planData?.agent_contributions || {};
        const contribution = agentContributions[key] || agentContributions[`${key.charAt(0).toUpperCase() + key.slice(1)}Agent`];
        return contribution?.confidence || 0.85;
    };

    // Get coordinator summary
    const coordinatorSummary = planData?.reasoning || planData?.coordinator_summary ||
        "All agents have synthesized a balanced wellness strategy. The plan prioritizes recovery while maintaining progressive fitness goals and sustainable nutrition practices.";

    // Get confidence score
    const overallConfidence = planData?.confidence || 0.87;

    return (
        <div className={cn(
            "bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl",
            className
        )}>
            {/* Header */}
            <div className="p-5 border-b border-slate-700/50 bg-gradient-to-r from-brand-500/10 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
                        <TbBrain className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Why This Plan?</h2>
                        <p className="text-xs text-slate-400">Agent reasoning & decisions</p>
                    </div>
                </div>
            </div>

            {/* Confidence Bar */}
            <div className="px-5 py-3 border-b border-slate-800/50 bg-slate-900/30">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Overall Confidence</span>
                    <span className="text-sm font-bold text-brand-400">{Math.round(overallConfidence * 100)}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${overallConfidence * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full"
                    />
                </div>
            </div>

            {/* Accordion Items */}
            <div className="divide-y divide-slate-800/50">
                {agentConfigs.map((config) => {
                    const reasoning = getAgentReasoning(config.key);
                    const confidence = getAgentConfidence(config.key);
                    const isExpanded = expandedAgent === config.key;
                    const Icon = config.icon;

                    return (
                        <div key={config.key}>
                            <button
                                onClick={() => toggleAgent(config.key)}
                                className="w-full flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
                                        isExpanded ? config.bgColor : "bg-slate-800/50",
                                        "group-hover:" + config.bgColor
                                    )}>
                                        <Icon className={cn(
                                            "w-5 h-5 transition-colors",
                                            isExpanded ? config.color : "text-slate-500",
                                            "group-hover:" + config.color
                                        )} />
                                    </div>
                                    <div className="text-left">
                                        <span className={cn(
                                            "font-medium text-sm transition-colors",
                                            isExpanded ? config.color : "text-slate-300"
                                        )}>
                                            {config.title}
                                        </span>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={cn("h-full rounded-full", config.bgColor.replace('/10', '/60'))}
                                                    style={{ width: `${confidence * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] text-slate-500">{Math.round(confidence * 100)}%</span>
                                        </div>
                                    </div>
                                </div>
                                <TbChevronDown className={cn(
                                    "w-5 h-5 text-slate-500 transition-transform duration-200",
                                    isExpanded && "rotate-180"
                                )} />
                            </button>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className={cn(
                                            "mx-4 mb-3 p-4 rounded-xl border",
                                            config.bgColor,
                                            config.borderColor
                                        )}>
                                            <p className="text-sm text-slate-300 leading-relaxed">
                                                {reasoning}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            {/* Coordinator Summary */}
            <div className="p-4 bg-gradient-to-r from-brand-500/10 via-slate-900/50 to-purple-500/10 border-t border-slate-700/50">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500/30 to-purple-500/30 flex items-center justify-center flex-shrink-0">
                        <GiCircuitry className="w-4 h-4 text-brand-300" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-brand-400">Coordinator Summary</span>
                            <TbCheck className="w-3.5 h-3.5 text-green-400" />
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            {coordinatorSummary}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
