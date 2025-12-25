"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TbCheck, TbLoader2, TbSparkles } from "react-icons/tb";
import { GiMuscleUp, GiMeal, GiNightSleep, GiMeditation, GiCircuitry } from "react-icons/gi";

interface AgentExecutionTimelineProps {
    isSimulating?: boolean;
    onComplete?: () => void;
    className?: string;
}

interface AgentStep {
    id: string;
    name: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    status: "idle" | "thinking" | "done";
    message: string;
    duration: number; // ms for simulation
}

const initialAgents: AgentStep[] = [
    {
        id: "fitness",
        name: "Fitness Agent",
        icon: GiMuscleUp,
        color: "text-blue-400",
        bgColor: "bg-blue-500/20",
        status: "idle",
        message: "Analyzing workout requirements...",
        duration: 2000
    },
    {
        id: "nutrition",
        name: "Nutrition Agent",
        icon: GiMeal,
        color: "text-green-400",
        bgColor: "bg-green-500/20",
        status: "idle",
        message: "Calculating meal plans...",
        duration: 2200
    },
    {
        id: "sleep",
        name: "Sleep Agent",
        icon: GiNightSleep,
        color: "text-purple-400",
        bgColor: "bg-purple-500/20",
        status: "idle",
        message: "Optimizing recovery schedule...",
        duration: 1800
    },
    {
        id: "mental",
        name: "Mental Wellness Agent",
        icon: GiMeditation,
        color: "text-pink-400",
        bgColor: "bg-pink-500/20",
        status: "idle",
        message: "Designing mindfulness practices...",
        duration: 1600
    },
    {
        id: "coordinator",
        name: "Coordinator Agent",
        icon: GiCircuitry,
        color: "text-brand-400",
        bgColor: "bg-brand-500/20",
        status: "idle",
        message: "Synthesizing unified wellness plan...",
        duration: 2500
    }
];

export function AgentExecutionTimeline({ isSimulating, onComplete, className }: AgentExecutionTimelineProps) {
    const [agents, setAgents] = useState<AgentStep[]>(initialAgents);
    const [currentIndex, setCurrentIndex] = useState(-1);

    useEffect(() => {
        if (!isSimulating) return;

        // Start simulation
        let index = 0;

        const runAgent = (idx: number) => {
            if (idx >= agents.length) {
                // All agents done
                setTimeout(() => {
                    onComplete?.();
                }, 500);
                return;
            }

            // Set current agent to thinking
            setAgents(prev => prev.map((a, i) =>
                i === idx ? { ...a, status: "thinking" } : a
            ));
            setCurrentIndex(idx);

            // Complete after duration
            setTimeout(() => {
                setAgents(prev => prev.map((a, i) =>
                    i === idx ? { ...a, status: "done" } : a
                ));

                // Move to next agent
                setTimeout(() => runAgent(idx + 1), 300);
            }, initialAgents[idx].duration);
        };

        // Start with first agent after a brief delay
        setTimeout(() => runAgent(0), 500);

        return () => {
            setAgents(initialAgents);
            setCurrentIndex(-1);
        };
    }, [isSimulating, onComplete]);

    return (
        <div className={cn(
            "relative bg-gradient-to-br from-slate-900/80 to-slate-800/50",
            "border border-slate-700/50 rounded-2xl p-6 overflow-hidden",
            className
        )}>
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-purple-500/5" />

            {/* Header */}
            <div className="relative flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
                    <TbSparkles className="w-5 h-5 text-brand-400 animate-pulse" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">AI Agents Working</h2>
                    <p className="text-sm text-slate-400">Generating your personalized plan</p>
                </div>
            </div>

            {/* Timeline */}
            <div className="relative space-y-4">
                {/* Vertical line */}
                <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-700" />

                {agents.map((agent, idx) => {
                    const Icon = agent.icon;
                    const isActive = agent.status === "thinking";
                    const isDone = agent.status === "done";

                    return (
                        <motion.div
                            key={agent.id}
                            initial={{ opacity: 0.5, x: -10 }}
                            animate={{
                                opacity: agent.status !== "idle" ? 1 : 0.5,
                                x: 0
                            }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                            className={cn(
                                "relative flex items-start gap-4 pl-10",
                                agent.status === "idle" && "opacity-50"
                            )}
                        >
                            {/* Status dot */}
                            <div className={cn(
                                "absolute left-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                                isDone ? agent.bgColor : isActive ? "bg-slate-800" : "bg-slate-900",
                                isActive && "ring-2 ring-brand-500/50 ring-offset-2 ring-offset-slate-900"
                            )}>
                                {isDone ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"
                                    >
                                        <TbCheck className="w-4 h-4 text-green-400" />
                                    </motion.div>
                                ) : isActive ? (
                                    <TbLoader2 className={cn("w-5 h-5 animate-spin", agent.color)} />
                                ) : (
                                    <Icon className={cn("w-5 h-5", agent.color, "opacity-50")} />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={cn(
                                        "font-medium transition-colors",
                                        isDone ? "text-white" : isActive ? agent.color : "text-slate-500"
                                    )}>
                                        {agent.name}
                                    </span>
                                    {isDone && (
                                        <span className="text-xs text-green-400">✓ Complete</span>
                                    )}
                                </div>

                                <AnimatePresence mode="wait">
                                    {isActive && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="text-sm text-slate-400"
                                        >
                                            {agent.message}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Progress indicator */}
            <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-brand-400 font-medium">
                        {agents.filter(a => a.status === "done").length} / {agents.length}
                    </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(agents.filter(a => a.status === "done").length / agents.length) * 100}%` }}
                        className="h-full bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500 rounded-full"
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>
        </div>
    );
}
