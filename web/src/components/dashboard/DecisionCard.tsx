"use client";

import { motion } from "framer-motion";
import { TbCheck, TbEdit, TbChevronDown, TbBarbell, TbApple, TbMoon, TbHeart, TbSparkles } from "react-icons/tb";
import { useState } from "react";

interface DecisionCardProps {
    planData: Record<string, any> | null;
    onAccept?: () => void;
    onModify?: () => void;
    statusMessage?: string;
}

/**
 * Tier 1 Decision Card - Premium visual design with calm aesthetic
 */
export function DecisionCard({ planData, onAccept, onModify, statusMessage }: DecisionCardProps) {
    const [showDetails, setShowDetails] = useState(false);

    if (!planData) return null;

    // Extract key decisions from plan
    const fitness = planData.fitness?.workout_plan || planData.fitness || {};
    const nutrition = planData.nutrition?.meal_plan || planData.nutrition || {};
    const sleep = planData.sleep?.sleep_recommendations || planData.sleep || {};
    const mental = planData.mental_wellness?.wellness_recommendations || planData.mental_wellness || {};

    const highlights = [
        {
            icon: TbBarbell,
            label: 'Workout',
            value: fitness.sessions?.[0]?.type || fitness.focus || 'Training',
            detail: `${fitness.sessions?.[0]?.duration || 45} min • ${fitness.intensity || 'Moderate'}`,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
            textColor: 'text-blue-400'
        },
        {
            icon: TbApple,
            label: 'Nutrition',
            value: `${nutrition.daily_calories || 2000} calories`,
            detail: `${nutrition.meals?.length || 4} meals • ${nutrition.budget_estimate || 'Balanced'}`,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-500/10',
            textColor: 'text-green-400'
        },
        {
            icon: TbMoon,
            label: 'Sleep',
            value: `${sleep.target_hours || 8} hours`,
            detail: `${sleep.bedtime || '10:30 PM'} → ${sleep.wake_time || '6:30 AM'}`,
            color: 'from-purple-500 to-violet-500',
            bgColor: 'bg-purple-500/10',
            textColor: 'text-purple-400'
        },
        {
            icon: TbHeart,
            label: 'Wellness',
            value: mental.daily_practices?.[0]?.activity || 'Mindfulness',
            detail: `${mental.daily_practices?.length || 3} daily practices`,
            color: 'from-pink-500 to-rose-500',
            bgColor: 'bg-pink-500/10',
            textColor: 'text-pink-400'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/50 rounded-3xl"
        >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            {/* Header Section */}
            <div className="relative p-8 pb-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center">
                                <TbSparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Today's Plan</h2>
                                <p className="text-sm text-slate-400">Personalized for you</p>
                            </div>
                        </div>
                    </div>
                    {statusMessage && (
                        <div className="px-3 py-1.5 bg-brand-500/20 border border-brand-500/30 rounded-full">
                            <span className="text-xs text-brand-400">{statusMessage}</span>
                        </div>
                    )}
                </div>

                {/* Key Highlights Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {highlights.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative p-4 rounded-2xl ${item.bgColor} border border-white/5 backdrop-blur-sm group hover:scale-[1.02] transition-transform cursor-pointer`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
                                    <item.icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <div className={`text-xs font-medium ${item.textColor} mb-0.5`}>{item.label}</div>
                                    <div className="text-white font-semibold truncate">{item.value}</div>
                                    <div className="text-xs text-slate-400 mt-1 truncate">{item.detail}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Primary Actions */}
                <div className="flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onAccept}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-brand-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-shadow"
                    >
                        <TbCheck className="w-5 h-5" />
                        Accept Plan
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onModify}
                        className="px-5 py-4 bg-slate-800/80 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors border border-slate-700/50"
                    >
                        <TbEdit className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>

            {/* Expandable Details */}
            <div className="relative border-t border-slate-700/50">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full px-8 py-4 flex items-center justify-between text-sm text-slate-400 hover:text-slate-300 transition-colors"
                >
                    <span>View detailed breakdown</span>
                    <TbChevronDown className={`w-4 h-4 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`} />
                </button>

                {showDetails && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="px-8 pb-6"
                    >
                        <div className="grid grid-cols-4 gap-3 text-center">
                            {[
                                { label: 'Focus', value: fitness.focus || 'Balanced' },
                                { label: 'Calories', value: nutrition.daily_calories || 2000 },
                                { label: 'Sleep Target', value: `${sleep.target_hours || 8}h` },
                                { label: 'Practices', value: mental.daily_practices?.length || 3 }
                            ].map((stat, idx) => (
                                <div key={idx} className="p-3 bg-slate-800/50 rounded-xl">
                                    <div className="text-xs text-slate-500 mb-1">{stat.label}</div>
                                    <div className="text-lg font-bold text-white">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
