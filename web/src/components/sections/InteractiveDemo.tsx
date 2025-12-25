"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Moon, Utensils, Coffee, AlertCircle, Sparkles, Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Constraint = "normal" | "poor_sleep" | "busy_day" | "low_energy";

export function InteractiveDemo() {
    const [constraint, setConstraint] = useState<Constraint>("normal");
    const [isCalculating, setIsCalculating] = useState(false);

    const handleConstraintChange = (newConstraint: Constraint) => {
        if (newConstraint === constraint) return;
        setIsCalculating(true);
        setTimeout(() => {
            setConstraint(newConstraint);
            setIsCalculating(false);
        }, 600);
    };

    const plans = {
        normal: {
            fitness: { title: "Heavy Compound Lifts", time: "60 min", intensity: "High" },
            nutrition: { title: "High Carb / Protein", notes: "Pre-workout loading" },
            sleep: { title: "Standard Protocol", target: "8h" }
        },
        poor_sleep: {
            fitness: { title: "Active Recovery / Yoga", time: "30 min", intensity: "Low" },
            nutrition: { title: "Anti-Inflammatory", notes: "Focus on hydration" },
            sleep: { title: "Early Bedtime", target: "9h+" }
        },
        busy_day: {
            fitness: { title: "HIIT Micro-Session", time: "15 min", intensity: "Max" },
            nutrition: { title: "Dense Liquid Meals", notes: "Efficiency focus" },
            sleep: { title: "Power Nap Protocol", target: "6h + 20m" }
        },
        low_energy: {
            fitness: { title: "Walk & Sunlight", time: "45 min", intensity: "Low" },
            nutrition: { title: "Complex Carbs", notes: "Sustained release" },
            sleep: { title: "Deep Rest Focus", target: "8.5h" }
        }
    };

    const currentPlan = plans[constraint];

    const contexts = [
        { id: "normal", label: "Optimal", icon: Zap, color: "brand" },
        { id: "poor_sleep", label: "Low Sleep", icon: Moon, color: "indigo" },
        { id: "busy_day", label: "Busy", icon: Coffee, color: "orange" },
        { id: "low_energy", label: "Fatigued", icon: AlertCircle, color: "green" },
    ];

    return (
        <section id="demo" className="py-24 md:py-32 bg-slate-950 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-grid-white/[0.015] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-mono mb-6"
                    >
                        <Sparkles className="w-3 h-3" />
                        <span>INTERACTIVE PLAYGROUND</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Try It Yourself</h2>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Select a context below. Watch the plan adapt instantly.
                    </p>
                </div>

                {/* Context Selector - Pill Buttons */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {contexts.map((ctx) => (
                        <button
                            key={ctx.id}
                            onClick={() => handleConstraintChange(ctx.id as Constraint)}
                            disabled={isCalculating}
                            className={cn(
                                "flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-medium transition-all",
                                constraint === ctx.id
                                    ? "bg-white text-black border-white shadow-[0_0_30px_-10px_rgba(255,255,255,0.4)] scale-105"
                                    : "bg-slate-900/50 border-white/10 text-slate-400 hover:border-white/30 hover:text-white",
                                isCalculating && "opacity-50 cursor-wait"
                            )}
                        >
                            <ctx.icon className="w-4 h-4" />
                            {ctx.label}
                        </button>
                    ))}
                </div>

                {/* Calculating State */}
                <AnimatePresence mode="wait">
                    {isCalculating ? (
                        <motion.div
                            key="calculating"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-48 gap-4"
                        >
                            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
                            <p className="text-sm text-slate-500 font-mono">Agents recalculating...</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={constraint}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                            {/* Fitness */}
                            <div className="p-6 rounded-2xl bg-slate-900/50 border border-blue-500/20 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <Activity className="w-5 h-5 text-blue-400" />
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Fitness</span>
                                </div>
                                <h4 className="text-lg font-bold text-white mb-2">{currentPlan.fitness.title}</h4>
                                <div className="flex gap-3 text-xs text-slate-500">
                                    <span>{currentPlan.fitness.time}</span>
                                    <span className="text-slate-600">•</span>
                                    <span>{currentPlan.fitness.intensity}</span>
                                </div>
                            </div>

                            {/* Nutrition */}
                            <div className="p-6 rounded-2xl bg-slate-900/50 border border-green-500/20 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <Utensils className="w-5 h-5 text-green-400" />
                                    <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Nutrition</span>
                                </div>
                                <h4 className="text-lg font-bold text-white mb-2">{currentPlan.nutrition.title}</h4>
                                <p className="text-xs text-slate-500">{currentPlan.nutrition.notes}</p>
                            </div>

                            {/* Sleep */}
                            <div className="p-6 rounded-2xl bg-slate-900/50 border border-indigo-500/20 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <Moon className="w-5 h-5 text-indigo-400" />
                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Sleep</span>
                                </div>
                                <h4 className="text-lg font-bold text-white mb-2">{currentPlan.sleep.title}</h4>
                                <p className="text-xs text-slate-500">Target: {currentPlan.sleep.target}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
