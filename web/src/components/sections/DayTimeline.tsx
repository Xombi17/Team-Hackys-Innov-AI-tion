"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiUploadCloud, FiCpu, FiGitMerge, FiCheckCircle, FiDatabase } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { NetworkBackground } from "@/components/ui/animated/NetworkBackground";

const steps = [
    { icon: FiUploadCloud, label: "Input Data", desc: "Sleep, vitals, calendar", color: "slate" },
    { icon: FiCpu, label: "Agents Reason", desc: "Independent analysis", color: "blue" },
    { icon: FiGitMerge, label: "Negotiate", desc: "Trade-off resolution", color: "purple" },
    { icon: FiCheckCircle, label: "Plan Delivered", desc: "Unified output", color: "green" },
    { icon: FiDatabase, label: "Memory Stored", desc: "Learns for next time", color: "brand" },
];

export function DayTimeline() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-50px" });

    return (
        <section id="timeline" className="py-12 md:py-16 bg-slate-950 relative overflow-hidden" ref={containerRef}>
            <NetworkBackground />
            <div className="max-w-5xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-depth-subtle">
                        The Workflow
                    </h2>
                    <p className="text-slate-400 max-w-lg mx-auto">
                        From raw data to personalized plan in under 60 seconds.
                    </p>
                </div>

                {/* Horizontal Timeline */}
                <div className="relative">
                    {/* Connection Line */}
                    <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

                    {/* Animated Progress Line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                        className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 origin-left"
                    />

                    {/* Steps */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.3 + i * 0.15 }}
                                className="flex flex-col items-center text-center"
                            >
                                {/* Icon Circle */}
                                <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                                    className={cn(
                                        "w-20 h-20 rounded-2xl flex items-center justify-center mb-4 border backdrop-blur-sm relative z-10",
                                        step.color === "slate" && "bg-slate-800/50 border-slate-700 text-slate-400",
                                        step.color === "blue" && "bg-blue-500/10 border-blue-500/30 text-blue-400",
                                        step.color === "purple" && "bg-purple-500/10 border-purple-500/30 text-purple-400",
                                        step.color === "green" && "bg-green-500/10 border-green-500/30 text-green-400",
                                        step.color === "brand" && "bg-brand-500/10 border-brand-500/30 text-brand-400",
                                    )}
                                >
                                    <step.icon className="w-8 h-8" />
                                </motion.div>

                                {/* Step Number */}
                                <span className="text-xs font-mono text-slate-600 mb-1">0{i + 1}</span>

                                {/* Label */}
                                <h4 className="font-semibold text-white text-sm mb-1">{step.label}</h4>

                                {/* Description */}
                                <p className="text-xs text-slate-500">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
