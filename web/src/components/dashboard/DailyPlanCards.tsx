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
    TbChevronRight,
    TbDroplet,
    TbWalk
} from "react-icons/tb";
import { GiMuscleUp, GiMeal, GiNightSleep, GiMeditation, GiBed } from "react-icons/gi";

interface DailyPlanCardsProps {
    planData: Record<string, any>;
    className?: string;
}

export function DailyPlanCards({ planData, className }: DailyPlanCardsProps) {
    const fitness = planData?.fitness || {};
    const nutrition = planData?.nutrition || {};
    const sleep = planData?.sleep || {};
    const mental = planData?.mental_wellness || planData?.mental || {};

    // Extract workout info
    const sessions = fitness?.sessions || fitness?.workout_plan?.sessions || [];
    const todaysWorkout = sessions[0]; // First session as today's
    const workoutIntensity = fitness?.intensity || fitness?.workout_plan?.intensity || 'moderate';
    const weeklyVolume = fitness?.weekly_volume || fitness?.workout_plan?.weekly_volume || '120 min';

    // Extract nutrition info
    const meals = nutrition?.meals || nutrition?.meal_plan?.meals || [];
    const dailyCalories = nutrition?.daily_calories || nutrition?.meal_plan?.daily_calories || 2000;
    const macros = nutrition?.macro_split || nutrition?.meal_plan?.macro_split || {};
    const hydration = nutrition?.hydration || nutrition?.meal_plan?.hydration || '8 glasses';

    // Extract sleep info
    const targetHours = sleep?.target_hours || sleep?.sleep_recommendations?.target_hours || 8;
    const bedtime = sleep?.bedtime || sleep?.sleep_recommendations?.bedtime || '10:30 PM';
    const wakeTime = sleep?.wake_time || sleep?.sleep_recommendations?.wake_time || '6:30 AM';
    const sleepHygiene = sleep?.sleep_hygiene || sleep?.sleep_recommendations?.sleep_hygiene || [];

    // Extract mental wellness
    const practices = mental?.daily_practices || mental?.wellness_recommendations?.daily_practices || [];
    const focusArea = mental?.focus || mental?.wellness_recommendations?.focus || 'mindfulness';

    return (
        <div className={cn("space-y-6", className)}>
            {/* Top Row: Activity + Nutrition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Activity Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0 }}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/20 via-blue-500/10 to-cyan-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
                    <div className="relative p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                    <GiMuscleUp className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Today's Workout</h3>
                                    <p className="text-blue-400/80 text-sm capitalize">{workoutIntensity} intensity</p>
                                </div>
                            </div>
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">{weeklyVolume}/week</span>
                        </div>

                        {todaysWorkout ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                    <TbCalendar className="w-4 h-4 text-slate-500" />
                                    <span className="font-medium">{todaysWorkout.day || 'Today'}</span>
                                    <span className="text-slate-500">•</span>
                                    <span className="text-blue-400">{todaysWorkout.type}</span>
                                    <span className="text-slate-500">•</span>
                                    <TbClock className="w-4 h-4 text-slate-500" />
                                    <span>{todaysWorkout.duration} min</span>
                                </div>

                                <div className="grid gap-2">
                                    {(todaysWorkout.exercises || []).slice(0, 3).map((exercise: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800/50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs font-bold">
                                                    {idx + 1}
                                                </div>
                                                <span className="text-sm text-slate-200">{exercise.name}</span>
                                            </div>
                                            <span className="text-xs text-slate-400">
                                                {exercise.sets} × {exercise.reps}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm">Rest day - Focus on recovery</p>
                        )}
                    </div>
                </motion.div>

                {/* Nutrition Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600/20 via-green-500/10 to-emerald-500/5 border border-green-500/20 hover:border-green-500/40 transition-all duration-300"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
                    <div className="relative p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <GiMeal className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Nutrition Plan</h3>
                                    <p className="text-green-400/80 text-sm">{dailyCalories} kcal target</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                <TbDroplet className="w-4 h-4 text-blue-400" />
                                {hydration}
                            </div>
                        </div>

                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                            {meals.slice(0, 4).map((meal: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                            <TbApple className="w-4 h-4 text-green-400" />
                                        </div>
                                        <div>
                                            <span className="text-sm text-slate-200 font-medium">{meal.meal}</span>
                                            <p className="text-xs text-slate-500">{meal.time}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-green-400 font-medium">{meal.calories} kcal</span>
                                </div>
                            ))}
                        </div>

                        {Object.keys(macros).length > 0 && (
                            <div className="mt-3 flex gap-2">
                                {Object.entries(macros).map(([key, value]) => (
                                    <span key={key} className="text-xs bg-slate-800/50 text-slate-300 px-2 py-1 rounded-full capitalize">
                                        {key}: {value as string}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Bottom Row: Recovery + Focus */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Recovery/Sleep Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-violet-500/5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
                    <div className="relative p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                    <GiNightSleep className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Recovery</h3>
                                    <p className="text-purple-400/80 text-sm">{targetHours}h sleep target</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-8 p-4 bg-slate-900/50 rounded-xl border border-slate-800/50 mb-3">
                            <div className="text-center">
                                <GiBed className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                                <p className="text-lg font-bold text-white">{bedtime}</p>
                                <p className="text-xs text-slate-500">Bedtime</p>
                            </div>
                            <div className="h-8 w-px bg-slate-700" />
                            <div className="text-center">
                                <TbFlame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                                <p className="text-lg font-bold text-white">{wakeTime}</p>
                                <p className="text-xs text-slate-500">Wake up</p>
                            </div>
                        </div>

                        {sleepHygiene.length > 0 && (
                            <div className="space-y-1.5">
                                {sleepHygiene.slice(0, 2).map((tip: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-400">
                                        <TbMoon className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                                        <span className="text-xs">{tip}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Mental Wellness Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-600/20 via-pink-500/10 to-rose-500/5 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />
                    <div className="relative p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                                    <GiMeditation className="w-6 h-6 text-pink-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Mental Focus</h3>
                                    <p className="text-pink-400/80 text-sm capitalize">{focusArea.replace(/_/g, ' ')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {practices.slice(0, 3).map((practice: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                                            <TbBrain className="w-4 h-4 text-pink-400" />
                                        </div>
                                        <div>
                                            <span className="text-sm text-slate-200">{practice.activity}</span>
                                            <p className="text-xs text-slate-500">{practice.time}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-pink-400 font-medium">{practice.duration}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
