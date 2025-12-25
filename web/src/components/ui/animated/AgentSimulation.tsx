"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Moon, Utensils, Brain, Check, RefreshCw, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const AgentSimulation = () => {
    const [step, setStep] = useState(0);

    // LOGIC PIPELINE
    // 0: Input (User sleeps 4h)
    // 1: Agent Awareness (Sleep Agent flags it)
    // 2: Swarm Negotiation (Coordinator vetoes workout)
    // 3: Output (New Plan)

    useEffect(() => {
        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % 4);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full max-w-2xl mx-auto bg-slate-950/80 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
            {/* Header: Simulated Terminal Output */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="font-mono text-xs text-slate-500">
                    coord_cycle_id: <span className="text-brand-400">#8X92</span>
                </div>
            </div>

            <div className="space-y-6">

                {/* STEP 1: INPUT */}
                <StepRow
                    active={step === 0}
                    icon={<AlertTriangle className="w-4 h-4 text-orange-400" />}
                    label="INPUT DETECTED"
                    text="Wearable Data: Sleep Duration < 4.5h. Recovery Score: 22%."
                />

                {/* LINE CONNECTOR */}
                <Connector active={step >= 1} />

                {/* STEP 2: AGENT ANALYSIS */}
                <StepRow
                    active={step === 1}
                    icon={<Moon className="w-4 h-4 text-indigo-400" />}
                    label="SLEEP_AGENT"
                    text="CRITICAL: Cognitive load capacity reduced. Requesting workout cancellation."
                    highlight="text-indigo-300"
                />

                {/* LINE CONNECTOR */}
                <Connector active={step >= 2} />

                {/* STEP 3: COORDINATION */}
                <StepRowHighlight
                    active={step === 2}
                    icon={<Brain className="w-5 h-5 text-white" />}
                    label="COORDINATOR"
                    thinking="Resolving conflict: Fitness (Push) vs Sleep (Rest)..."
                    decision="Decision: VETO Fitness Proposal. Priority: Recovery."
                />

                {/* LINE CONNECTOR */}
                <Connector active={step >= 3} />

                {/* STEP 4: OUTPUT */}
                <StepRow
                    active={step === 3}
                    icon={<Check className="w-4 h-4 text-green-400" />}
                    label="FINAL_PLAN"
                    text="Action: Switch 'Heavy Lifts' to 'Yoga Flow'. Add 20g Protein."
                    success
                />

            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-brand-500 transition-all duration-[4000ms] ease-linear w-full opacity-30" key={step} style={{ width: '100%' }} />
        </div>
    );
};

const StepRow = ({ active, icon, label, text, highlight, success }: any) => (
    <motion.div
        animate={{ opacity: active ? 1 : 0.3, x: active ? 0 : -10 }}
        className={cn("flex items-start gap-4 p-3 rounded-lg transition-colors", active ? "bg-white/5 border border-white/10" : "border border-transparent")}
    >
        <div className={cn("mt-1 p-1.5 rounded-md bg-slate-900 border border-white/10", active && success && "bg-green-500/20 border-green-500/50")}>
            {icon}
        </div>
        <div>
            <div className="font-mono text-[10px] tracking-widest text-slate-500 uppercase mb-1">{label}</div>
            <div className={cn("text-sm font-medium text-slate-400", highlight, success && "text-green-400")}>{text}</div>
        </div>
    </motion.div>
);

const StepRowHighlight = ({ active, icon, label, thinking, decision }: any) => (
    <motion.div
        animate={{
            opacity: active ? 1 : 0.4,
            scale: active ? 1.02 : 1,
            borderColor: active ? "rgba(99, 102, 241, 0.4)" : "transparent"
        }}
        className="flex items-start gap-4 p-4 rounded-xl bg-brand-500/10 border border-brand-500/20"
    >
        <div className="mt-1 p-2 rounded-lg bg-brand-600 shadow-lg shadow-brand-500/20">
            {icon}
        </div>
        <div className="w-full">
            <div className="font-mono text-[10px] tracking-widest text-brand-300 uppercase mb-2">{label}</div>
            {active ? (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-brand-200 animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin" /> {thinking}
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                        className="text-sm font-bold text-white"
                    >
                        {decision}
                    </motion.div>
                </div>
            ) : (
                <div className="text-sm text-slate-500 italic">Waiting for agents...</div>
            )}
        </div>
    </motion.div>
);

const Connector = ({ active }: { active: boolean }) => (
    <div className="ml-6 w-0.5 h-6 bg-slate-800 relative overflow-hidden">
        <motion.div
            animate={{ height: active ? "100%" : "0%" }}
            className="w-full bg-brand-500 absolute top-0 left-0"
        />
    </div>
);
