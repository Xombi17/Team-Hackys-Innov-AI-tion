"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Moon, Utensils, Coffee, AlertCircle, Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Scenario = "optimal" | "sleep_deprived" | "busy_day" | "low_energy";

const scenarios: Record<Scenario, { label: string; icon: any; fitness: string; nutrition: string; sleep: string }> = {
    optimal: {
        label: "Optimal Day",
        icon: Zap,
        fitness: "Heavy Compound Lifts — 60 min",
        nutrition: "High Carb + Protein Loading",
        sleep: "Standard 8h Protocol",
    },
    sleep_deprived: {
        label: "Sleep Deprived",
        icon: Moon,
        fitness: "Recovery Yoga — 30 min",
        nutrition: "Anti-Inflammatory Focus",
        sleep: "Early Bedtime 9pm+",
    },
    busy_day: {
        label: "Busy Schedule",
        icon: Coffee,
        fitness: "HIIT Micro-Session — 15 min",
        nutrition: "Dense Liquid Meals",
        sleep: "Power Nap + 6h Core",
    },
    low_energy: {
        label: "Low Energy",
        icon: AlertCircle,
        fitness: "Walk & Sunlight — 45 min",
        nutrition: "Complex Carbs Focus",
        sleep: "Deep Rest 8.5h Target",
    },
};

export function AdaptationSimulator() {
    const [activeScenario, setActiveScenario] = useState<Scenario>("optimal");
    const [isCalculating, setIsCalculating] = useState(false);

    const handleScenarioChange = (scenario: Scenario) => {
        if (scenario === activeScenario || isCalculating) return;
        setIsCalculating(true);
        setTimeout(() => {
            setActiveScenario(scenario);
            setIsCalculating(false);
        }, 800);
    };

    const current = scenarios[activeScenario];

    return (
        <section id="simulator" className="py-12 md:py-16 bg-slate-950 relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-depth-subtle">
                        See It Adapt
                    </h2>
                    <p className="text-slate-400 max-w-lg mx-auto">
                        Click a scenario. Watch the plan change in real-time.
                    </p>
                </div>

                {/* Scenario Buttons */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {(Object.keys(scenarios) as Scenario[]).map((key) => {
                        const s = scenarios[key];
                        const isActive = activeScenario === key;
                        return (
                            <button
                                key={key}
                                onClick={() => handleScenarioChange(key)}
                                disabled={isCalculating}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-white text-black border-white scale-105 shadow-[0_0_30px_-10px_rgba(255,255,255,0.4)]"
                                        : "bg-slate-900/50 border-white/10 text-slate-400 hover:border-white/30 hover:text-white",
                                    isCalculating && "opacity-50 cursor-wait"
                                )}
                            >
                                <s.icon className="w-4 h-4" />
                                {s.label}
                            </button>
                        );
                    })}
                </div>

                {/* Result Display */}
                <AnimatePresence mode="wait">
                    {isCalculating ? (
                        <motion.div
                            key="calculating"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-40 gap-4"
                        >
                            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
                            <p className="text-sm text-slate-500 font-mono">Agents negotiating...</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeScenario}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                            {/* Fitness */}
                            <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                                <div className="flex items-center gap-2 mb-3">
                                    <Activity className="w-5 h-5 text-blue-400" />
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Fitness</span>
                                </div>
                                <p className="text-white font-medium">{current.fitness}</p>
                            </div>

                            {/* Nutrition */}
                            <div className="p-5 rounded-2xl bg-green-500/5 border border-green-500/20">
                                <div className="flex items-center gap-2 mb-3">
                                    <Utensils className="w-5 h-5 text-green-400" />
                                    <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Nutrition</span>
                                </div>
                                <p className="text-white font-medium">{current.nutrition}</p>
                            </div>

                            {/* Sleep */}
                            <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
                                <div className="flex items-center gap-2 mb-3">
                                    <Moon className="w-5 h-5 text-indigo-400" />
                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Sleep</span>
                                </div>
                                <p className="text-white font-medium">{current.sleep}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
