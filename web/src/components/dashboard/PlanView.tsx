"use client";

import { motion } from "framer-motion";
import { WellnessPlan } from "@/lib/api";
import { Activity, Apple, Moon, Brain, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanViewProps {
    plan: WellnessPlan;
    onReset: () => void;
}

export default function PlanView({ plan, onReset }: PlanViewProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const domains = [
        {
            id: "fitness",
            title: "Fitness & Movement",
            icon: Activity,
            color: "text-blue-500",
            bg: "bg-blue-50",
            border: "border-blue-100",
            data: plan.plan_data.fitness
        },
        {
            id: "nutrition",
            title: "Nutrition & Fuel",
            icon: Apple,
            color: "text-green-500",
            bg: "bg-green-50",
            border: "border-green-100",
            data: plan.plan_data.nutrition
        },
        {
            id: "sleep",
            title: "Sleep Recovery",
            icon: Moon,
            color: "text-indigo-500",
            bg: "bg-indigo-50",
            border: "border-indigo-100",
            data: plan.plan_data.sleep
        },
        {
            id: "mental",
            title: "Mindfulness",
            icon: Brain,
            color: "text-purple-500",
            bg: "bg-purple-50",
            border: "border-purple-100",
            data: plan.plan_data.mental
        }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="text-center space-y-2">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium"
                >
                    <CheckCircle2 className="w-4 h-4" /> Plan Synchronized
                </motion.div>
                <h1 className="text-4xl font-bold text-slate-900">Your Daily Sync</h1>
                <p className="text-slate-500">Orchestrated by WellSync Agents based on your inputs.</p>
            </div>

            {/* Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {domains.map((domain) => (
                    <motion.div
                        key={domain.id}
                        variants={item}
                        className={cn(
                            "glass p-6 rounded-2xl border-l-4 card-hover relative overflow-hidden",
                            domain.border
                        )}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={cn("p-2.5 rounded-xl", domain.bg, domain.color)}>
                                <domain.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">{domain.title}</h3>
                        </div>

                        <div className="prose prose-sm prose-slate max-w-none">
                            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600 bg-transparent p-0 border-none">
                                {JSON.stringify(domain.data, null, 2)}
                            </pre>
                        </div>

                        {/* Decoration */}
                        <div className={cn("absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10", domain.bg.replace("bg-", "bg-opacity-50 bg-"))} />
                    </motion.div>
                ))}
            </motion.div>

            {/* Agent Reasoning (Footer) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="glass p-6 rounded-2xl border border-slate-200 bg-slate-50/50"
            >
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">Coordinator Logic</h3>
                <p className="text-slate-700 italic leading-relaxed">
                    "{plan.reasoning}"
                </p>
            </motion.div>

            <div className="text-center pt-8">
                <button
                    onClick={onReset}
                    className="text-slate-500 hover:text-brand-600 font-medium underline underline-offset-4"
                >
                    Start Over
                </button>
            </div>
        </div>
    );
}
