"use client";

import { motion } from "framer-motion";
import { AgentSimulation } from "@/components/ui/animated/AgentSimulation";

export function Simulation() {
    return (
        <section
            id="simulation"
            className="py-32 relative z-10 w-full overflow-hidden bg-slate-900/30 border-y border-white/5"
        >
            <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-block px-4 py-1 rounded-full bg-brand-500/10 text-brand-300 text-sm font-bold mb-6 border border-brand-500/20">
                        Proprietary Agent Swarm
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                        It thinks<br />before it acts.
                    </h2>
                    <div className="space-y-6 text-lg text-slate-400">
                        <p>
                            Watch the swarm in action. Typical apps are dumb databases. WellSync is a living negotiation between specialized agents.
                        </p>
                        <div className="pl-6 border-l-2 border-brand-500/30">
                            <strong className="text-white block mb-1">The Conflict</strong>
                            You want gains, but you slept poorly.
                        </div>
                        <div className="pl-6 border-l-2 border-green-500/30">
                            <strong className="text-white block mb-1">The Resolution</strong>
                            Fitness yields to Sleep. Workout intensity lowered.
                        </div>
                    </div>
                </motion.div>

                <div className="relative">
                    <div className="absolute inset-0 bg-brand-500/20 blur-[100px] rounded-full" />
                    <AgentSimulation />
                </div>
            </div>
        </section>
    );
}
