"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NetworkBackground } from "@/components/ui/animated/NetworkBackground";

const scenarios = [
    {
        situation: "Missed lunch",
        original: "400 cal dinner planned",
        adjusted: "800 cal dinner + snack",
        color: "orange",
    },
    {
        situation: "Only 4h sleep",
        original: "Heavy compound lifts",
        adjusted: "Recovery yoga + walk",
        color: "indigo",
    },
    {
        situation: "Budget dropped",
        original: "Salmon + quinoa bowl",
        adjusted: "Chicken + rice swap",
        color: "green",
    },
];

export function OutcomeScenarios() {
    return (
        <section id="outcomes" className="py-12 md:py-16 bg-slate-950 relative overflow-hidden">
            <NetworkBackground />
            <div className="max-w-5xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-depth-subtle">
                        Real Adaptations
                    </h2>
                    <p className="text-slate-400 max-w-lg mx-auto">
                        When life changes, your plan changes. Here's what that looks like.
                    </p>
                </div>

                {/* Scenarios */}
                <div className="space-y-4">
                    {scenarios.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                                "p-5 rounded-2xl border flex flex-col md:flex-row md:items-center gap-4",
                                s.color === "orange" && "bg-orange-500/5 border-orange-500/20",
                                s.color === "indigo" && "bg-indigo-500/5 border-indigo-500/20",
                                s.color === "green" && "bg-green-500/5 border-green-500/20",
                            )}
                        >
                            {/* Situation */}
                            <div className="md:w-1/4">
                                <span className={cn(
                                    "text-xs font-bold uppercase tracking-widest",
                                    s.color === "orange" && "text-orange-400",
                                    s.color === "indigo" && "text-indigo-400",
                                    s.color === "green" && "text-green-400",
                                )}>Situation</span>
                                <p className="text-white font-medium mt-1">{s.situation}</p>
                            </div>

                            {/* Original */}
                            <div className="md:w-1/3">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Original Plan</span>
                                <p className="text-slate-400 line-through mt-1">{s.original}</p>
                            </div>

                            {/* Arrow */}
                            <ArrowRight className="hidden md:block w-5 h-5 text-slate-600 shrink-0" />

                            {/* Adjusted */}
                            <div className="md:w-1/3">
                                <span className="text-xs font-bold uppercase tracking-widest text-green-400">Adjusted Plan</span>
                                <p className="text-white font-medium mt-1">{s.adjusted}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
