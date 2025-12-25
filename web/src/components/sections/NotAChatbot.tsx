"use client";

import { motion } from "framer-motion";
import { Bot, Lightbulb, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { NetworkBackground } from "@/components/ui/animated/NetworkBackground";

const comparisons = [
    {
        icon: Bot,
        title: "Chatbots",
        description: "React to questions. No memory. No coordination.",
        verdict: "Assistants, not systems.",
        color: "red",
    },
    {
        icon: Users,
        title: "Fitness Apps",
        description: "Isolated. Your workout app doesn't know you skipped sleep.",
        verdict: "Siloed advice.",
        color: "orange",
    },
    {
        icon: Lightbulb,
        title: "WellSync",
        description: "Multiple agents reason together. Adapts. Remembers. Coordinates.",
        verdict: "Intelligent orchestration.",
        color: "green",
    },
];

export function NotAChatbot() {
    return (
        <section id="differentiator" className="py-12 md:py-16 bg-slate-950 relative overflow-hidden">
            <NetworkBackground />
            <div className="absolute inset-0 bg-grid-white/[0.015] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-depth-subtle">
                        Not Another Chatbot
                    </h2>
                    <p className="text-slate-400 max-w-lg mx-auto">
                        Most "AI" tools react. WellSync reasons.
                    </p>
                </div>

                {/* Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {comparisons.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -4 }}
                            className={cn(
                                "p-6 rounded-2xl border transition-all",
                                item.color === "red" && "bg-red-500/5 border-red-500/20",
                                item.color === "orange" && "bg-orange-500/5 border-orange-500/20",
                                item.color === "green" && "bg-green-500/5 border-green-500/20 ring-1 ring-green-500/10",
                            )}
                        >
                            <item.icon className={cn(
                                "w-8 h-8 mb-4",
                                item.color === "red" && "text-red-400",
                                item.color === "orange" && "text-orange-400",
                                item.color === "green" && "text-green-400",
                            )} />

                            <h3 className={cn(
                                "font-bold text-lg mb-2",
                                item.color === "red" && "text-red-400",
                                item.color === "orange" && "text-orange-400",
                                item.color === "green" && "text-green-400",
                            )}>{item.title}</h3>

                            <p className="text-sm text-slate-400 mb-4">{item.description}</p>

                            <p className={cn(
                                "text-xs font-mono",
                                item.color === "red" && "text-red-500/70",
                                item.color === "orange" && "text-orange-500/70",
                                item.color === "green" && "text-green-500/70",
                            )}>{item.verdict}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
