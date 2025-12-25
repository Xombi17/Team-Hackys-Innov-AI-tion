"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateWellnessPlan, UserProfile, WellnessPlan } from "@/lib/api";
import { Loader2, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import PlanView from "@/components/dashboard/PlanView";
import AgentThinking from "@/components/dashboard/AgentThinking";

export default function AppFlow() {
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState<WellnessPlan | null>(null);

    const [profile, setProfile] = useState<UserProfile>({
        user_id: `guest_${Math.random().toString(36).substr(2, 9)}`,
        fitness_level: "beginner",
        goals: {
            fitness: "general_health",
            nutrition: "balanced",
        },
        constraints: {
            time_available: "30",
            equipment: []
        }
    });

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);
    const handleReset = () => {
        setPlan(null);
        setStep(0);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const generatedPlan = await generateWellnessPlan(profile);
            setPlan(generatedPlan);
        } catch (error) {
            alert("Failed to generate plan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-hero-glow opacity-30 pointer-events-none" />
                <AgentThinking />
            </main>
        );
    }

    if (plan) {
        return (
            <main className="min-h-screen bg-slate-50 p-4 md:p-8">
                <PlanView plan={plan} onReset={handleReset} />
            </main>
        );
    }

    const steps = [
        // Step 0: Welcome
        <div key="welcome" className="text-center space-y-6">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400">
                WellSync AI
            </h1>
            <p className="text-xl text-slate-600 max-w-md mx-auto">
                Your personal, adaptive wellness orchestrator.
                Let's build your perfect plan.
            </p>
            <button onClick={handleNext} className="mt-8 px-8 py-4 bg-brand-600 text-white rounded-full text-lg font-medium hover:bg-brand-700 transition-all shadow-lg hover:shadow-brand-500/30 flex items-center gap-2 mx-auto">
                Start Journey <ArrowRight className="w-5 h-5" />
            </button>
        </div>,

        // Step 1: Fitness Level
        <div key="fitness" className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">Your Fitness Level</h2>
            <div className="grid grid-cols-1 gap-4">
                {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <button
                        key={level}
                        onClick={() => {
                            setProfile({ ...profile, fitness_level: level });
                            handleNext();
                        }}
                        className={cn(
                            "p-6 rounded-xl border-2 text-left transition-all hover:scale-[1.02]",
                            profile.fitness_level === level
                                ? "border-brand-500 bg-brand-50"
                                : "border-slate-200 hover:border-brand-300"
                        )}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-semibold capitalize">{level}</span>
                            {profile.fitness_level === level && <Check className="text-brand-600" />}
                        </div>
                    </button>
                ))}
            </div>
        </div>,

        // Step 2: Goals
        <div key="goals" className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">Primary Goal</h2>
            <div className="grid grid-cols-2 gap-4">
                {[
                    { id: 'weight_loss', label: 'Weight Loss' },
                    { id: 'muscle_gain', label: 'Muscle Gain' },
                    { id: 'endurance', label: 'Endurance' },
                    { id: 'stress_reduction', label: 'Stress Relief' }
                ].map((goal) => (
                    <button
                        key={goal.id}
                        onClick={() => setProfile({ ...profile, goals: { ...profile.goals, fitness: goal.id } })}
                        className={cn(
                            "p-6 rounded-xl border-2 text-left transition-all h-32 flex flex-col justify-end",
                            profile.goals.fitness === goal.id
                                ? "border-brand-500 bg-brand-50 shadow-md"
                                : "border-slate-200 hover:border-brand-300"
                        )}
                    >
                        <span className="text-lg font-semibold">{goal.label}</span>
                    </button>
                ))}
            </div>
            <div className="flex justify-between mt-8">
                <button onClick={handleBack} className="text-slate-500 hover:text-slate-900">Back</button>
                <button onClick={handleNext} className="px-6 py-2 bg-brand-600 text-white rounded-lg">Next</button>
            </div>
        </div>,

        // Step 3: Review & Generate
        <div key="review" className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">Ready to Synchronize?</h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-left space-y-4 max-w-sm mx-auto">
                <div className="flex justify-between">
                    <span className="text-slate-500">Level</span>
                    <span className="font-medium capitalize">{profile.fitness_level}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Goal</span>
                    <span className="font-medium capitalize">{profile.goals.fitness.replace('_', ' ')}</span>
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full px-8 py-4 bg-brand-600 text-white rounded-xl text-lg font-bold hover:bg-brand-700 transition-all shadow-lg hover:shadow-brand-500/30 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? <Loader2 className="animate-spin" /> : "Generate My Plan"}
            </button>
            <button onClick={handleBack} className="text-slate-500 hover:text-slate-900 text-sm">Make Changes</button>
        </div>
    ];

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-hero-glow opacity-30 pointer-events-none" />

            <div className="w-full max-w-2xl z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="glass p-8 md:p-12 rounded-3xl"
                    >
                        {steps[step]}
                    </motion.div>
                </AnimatePresence>

                {/* Progress Bar */}
                {step > 0 && (
                    <div className="mt-8 flex justify-center gap-2">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    i === step ? "w-8 bg-brand-600" : "w-2 bg-slate-300"
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
