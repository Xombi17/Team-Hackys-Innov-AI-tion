"use client";

import { motion } from "framer-motion";
import { Database, CheckCircle } from "lucide-react";
import { NetworkBackground } from "@/components/ui/animated/NetworkBackground";

const memories = [
    { date: "Dec 22", event: "Workout downgraded", reason: "Poor sleep detected (4.2h)", adapted: true },
    { date: "Dec 21", event: "Dinner calories increased", reason: "Lunch was skipped", adapted: true },
    { date: "Dec 20", event: "Budget swap applied", reason: "Weekly budget limit reached", adapted: true },
    { date: "Dec 19", event: "Rest day inserted", reason: "HRV below recovery threshold", adapted: true },
];

export function MemoryPreview() {
    return (
        <section id="memory" className="py-12 md:py-16 bg-slate-950 relative overflow-hidden">
            <NetworkBackground />
            <div className="max-w-4xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-depth-subtle">
                        It Remembers
                    </h2>
                    <p className="text-slate-400 max-w-lg mx-auto">
                        Every decision is logged. Every pattern is learned. Your plan gets smarter over time.
                    </p>
                </div>

                {/* Memory Table */}
                <div className="rounded-2xl border border-white/10 overflow-hidden">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-4 p-4 bg-slate-900/50 border-b border-white/5 text-xs font-bold uppercase tracking-widest text-slate-500">
                        <div className="col-span-2">Date</div>
                        <div className="col-span-4">What Changed</div>
                        <div className="col-span-5">Why</div>
                        <div className="col-span-1 text-center">✓</div>
                    </div>

                    {/* Data Rows */}
                    {memories.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                        >
                            <div className="col-span-2 text-sm text-slate-500 font-mono">{m.date}</div>
                            <div className="col-span-4 text-sm text-white">{m.event}</div>
                            <div className="col-span-5 text-sm text-slate-400">{m.reason}</div>
                            <div className="col-span-1 flex justify-center">
                                {m.adapted && <CheckCircle className="w-4 h-4 text-green-400" />}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer note */}
                <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-600">
                    <Database className="w-3 h-3" />
                    <span>Persistent memory across sessions</span>
                </div>
            </div>
        </section>
    );
}
