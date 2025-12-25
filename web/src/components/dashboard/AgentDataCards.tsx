"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    TbFlame,
    TbApple,
    TbMoon,
    TbBrain,
    TbClock,
    TbCalendar,
    TbDroplet,
    TbTarget,
    TbTrendingUp,
    TbAlertCircle,
    TbCheck
} from "react-icons/tb";
import { GiMuscleUp, GiMeal, GiNightSleep, GiMeditation, GiBed, GiWeightLiftingUp } from "react-icons/gi";

interface WorkoutSession {
    day: string;
    type: string;
    duration: number;
    exercises: Array<{
        name: string;
        sets: number;
        reps: number | string;
    }>;
}

interface Meal {
    meal: string;
    time: string;
    items?: string[];
    calories: number;
}

interface MentalPractice {
    activity: string;
    duration: string;
    time: string;
}

interface AgentDataCardsProps {
    planData: Record<string, any>;
    className?: string;
}

export function AgentDataCards({ planData, className }: AgentDataCardsProps) {
    // Extract all data from the unified plan
    const fitness = planData?.fitness || planData?.workout_plan || {};
    const nutrition = planData?.nutrition || planData?.meal_plan || {};
    const sleep = planData?.sleep || planData?.sleep_recommendations || {};
    const mental = planData?.mental_wellness || planData?.wellness_recommendations || {};

    // Metadata
    const confidence = planData?.confidence || 0.85;
    const reasoning = planData?.reasoning || "";

    return (
        <div className={cn("space-y-6", className)}>
            {/* Confidence Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-brand-500/10 via-slate-900/50 to-purple-500/10 rounded-xl border border-brand-500/20"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
                        <TbTarget className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Plan Confidence</h3>
                        <p className="text-xs text-slate-400">Based on your profile & constraints</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${confidence * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-brand-500 to-green-500 rounded-full"
                        />
                    </div>
                    <span className="text-lg font-bold text-brand-400">{Math.round(confidence * 100)}%</span>
                </div>
            </motion.div>

            {/* Fitness Card - Full Width */}
            <FitnessCard fitness={fitness} />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <NutritionCard nutrition={nutrition} />
                <div className="space-y-6">
                    <SleepCard sleep={sleep} />
                    <MentalCard mental={mental} />
                </div>
            </div>

            {/* Coordinator Reasoning */}
            {reasoning && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="p-5 bg-slate-900/60 border border-slate-800/50 rounded-2xl"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <TbBrain className="w-5 h-5 text-brand-400" />
                        <h3 className="font-semibold text-white">Coordinator Summary</h3>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{reasoning}</p>
                </motion.div>
            )}
        </div>
    );
}

// ===========================================
// FITNESS CARD
// ===========================================
function FitnessCard({ fitness }: { fitness: Record<string, any> }) {
    const sessions: WorkoutSession[] = fitness?.sessions || [];
    const intensity = fitness?.intensity || "moderate";
    const weeklyVolume = fitness?.weekly_volume || "N/A";
    const focus = fitness?.focus || "balanced";
    const progression = fitness?.progression || "";
    const overtrainingRisk = fitness?.overtraining_risk || "low";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/20 via-blue-500/10 to-cyan-500/5 border border-blue-500/20"
        >
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="relative p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                            <GiMuscleUp className="w-7 h-7 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Fitness Plan</h2>
                            <p className="text-blue-400/80 text-sm capitalize">{focus.replace(/_/g, ' ')} • {intensity} intensity</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-2xl font-bold text-white">{weeklyVolume}</p>
                            <p className="text-xs text-slate-400">weekly volume</p>
                        </div>
                        <div className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium",
                            overtrainingRisk === "low" ? "bg-green-500/20 text-green-400" :
                                overtrainingRisk === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                                    "bg-red-500/20 text-red-400"
                        )}>
                            {overtrainingRisk} risk
                        </div>
                    </div>
                </div>

                {/* Sessions Grid */}
                {sessions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {sessions.map((session, idx) => (
                            <div
                                key={idx}
                                className="p-4 bg-slate-900/50 rounded-xl border border-slate-800/50"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <TbCalendar className="w-4 h-4 text-blue-400" />
                                        <span className="font-medium text-white">{session.day}</span>
                                    </div>
                                    <span className="text-xs text-slate-400">{session.duration} min</span>
                                </div>
                                <p className="text-sm text-blue-400 font-medium mb-3">{session.type}</p>

                                <div className="space-y-2">
                                    {(session.exercises || []).map((ex, exIdx) => (
                                        <div key={exIdx} className="flex items-center justify-between text-sm">
                                            <span className="text-slate-300">{ex.name}</span>
                                            <span className="text-slate-500">{ex.sets}×{ex.reps}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-400">
                        <GiWeightLiftingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No workout sessions scheduled</p>
                    </div>
                )}

                {/* Progression */}
                {progression && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                        <TbTrendingUp className="w-4 h-4 text-green-400" />
                        <span>{progression}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ===========================================
// NUTRITION CARD
// ===========================================
function NutritionCard({ nutrition }: { nutrition: Record<string, any> }) {
    const meals: Meal[] = nutrition?.meals || [];
    const dailyCalories = nutrition?.daily_calories || 0;
    const macros = nutrition?.macro_split || {};
    const hydration = nutrition?.hydration || "8 glasses";
    const budget = nutrition?.budget_estimate || "";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600/20 via-green-500/10 to-emerald-500/5 border border-green-500/20 h-full"
        >
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />

            <div className="relative p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <GiMeal className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Nutrition Plan</h2>
                            <p className="text-green-400/80 text-sm">{dailyCalories} kcal daily</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <TbDroplet className="w-4 h-4 text-blue-400" />
                        {hydration}
                    </div>
                </div>

                {/* Macros */}
                {Object.keys(macros).length > 0 && (
                    <div className="flex gap-2 mb-4">
                        {Object.entries(macros).map(([key, value]) => (
                            <span key={key} className="px-3 py-1 bg-slate-800/50 text-slate-300 rounded-full text-xs capitalize">
                                {key}: {value as string}
                            </span>
                        ))}
                    </div>
                )}

                {/* Meals Table */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {meals.map((meal, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800/50"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                    <TbApple className="w-4 h-4 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{meal.meal}</p>
                                    <p className="text-xs text-slate-500">{meal.time}</p>
                                </div>
                            </div>
                            <span className="text-sm font-medium text-green-400">{meal.calories} kcal</span>
                        </div>
                    ))}
                </div>

                {/* Budget */}
                {budget && (
                    <div className="mt-4 text-xs text-slate-500 text-center">
                        Estimated: {budget}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ===========================================
// SLEEP CARD
// ===========================================
function SleepCard({ sleep }: { sleep: Record<string, any> }) {
    const targetHours = sleep?.target_hours || 8;
    const bedtime = sleep?.bedtime || "10:30 PM";
    const wakeTime = sleep?.wake_time || "6:30 AM";
    const sleepHygiene: string[] = sleep?.sleep_hygiene || [];
    const focus = sleep?.focus || "recovery";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-violet-500/5 border border-purple-500/20"
        >
            <div className="relative p-5">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <GiNightSleep className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="font-bold text-white">Sleep & Recovery</h2>
                        <p className="text-purple-400/80 text-xs capitalize">{focus.replace(/_/g, ' ')}</p>
                    </div>
                </div>

                {/* Sleep Schedule */}
                <div className="flex items-center justify-center gap-6 p-4 bg-slate-900/50 rounded-xl border border-slate-800/50 mb-3">
                    <div className="text-center">
                        <GiBed className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-white">{bedtime}</p>
                        <p className="text-xs text-slate-500">Bedtime</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="h-px w-12 bg-purple-500/30" />
                        <span className="text-xs text-purple-400 my-1">{targetHours}h</span>
                        <div className="h-px w-12 bg-purple-500/30" />
                    </div>
                    <div className="text-center">
                        <TbFlame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-white">{wakeTime}</p>
                        <p className="text-xs text-slate-500">Wake up</p>
                    </div>
                </div>

                {/* Hygiene Tips */}
                {sleepHygiene.length > 0 && (
                    <div className="space-y-1.5">
                        {sleepHygiene.slice(0, 3).map((tip, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                                <TbCheck className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                                <span>{tip}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ===========================================
// MENTAL WELLNESS CARD
// ===========================================
function MentalCard({ mental }: { mental: Record<string, any> }) {
    const practices: MentalPractice[] = mental?.daily_practices || [];
    const focus = mental?.focus || "mindfulness";
    const stressManagement: string[] = mental?.stress_management || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-600/20 via-pink-500/10 to-rose-500/5 border border-pink-500/20"
        >
            <div className="relative p-5">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                        <GiMeditation className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                        <h2 className="font-bold text-white">Mental Wellness</h2>
                        <p className="text-pink-400/80 text-xs capitalize">{focus.replace(/_/g, ' ')}</p>
                    </div>
                </div>

                {/* Daily Practices */}
                <div className="space-y-2">
                    {practices.slice(0, 3).map((practice, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800/50"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-pink-500/10 flex items-center justify-center">
                                    <TbBrain className="w-4 h-4 text-pink-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-white">{practice.activity}</p>
                                    <p className="text-xs text-slate-500">{practice.time}</p>
                                </div>
                            </div>
                            <span className="text-xs text-pink-400">{practice.duration}</span>
                        </div>
                    ))}
                </div>

                {/* Stress Management */}
                {stressManagement.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-800/50">
                        <p className="text-xs text-slate-500 mb-2">Stress techniques:</p>
                        <div className="flex flex-wrap gap-2">
                            {stressManagement.slice(0, 2).map((technique, idx) => (
                                <span key={idx} className="px-2 py-1 bg-pink-500/10 text-pink-400 rounded-lg text-xs">
                                    {technique}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
