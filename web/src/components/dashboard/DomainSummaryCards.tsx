"use client";

import { motion } from "framer-motion";
import { TbBarbell, TbApple, TbMoon, TbHeart, TbChevronRight } from "react-icons/tb";

interface DomainSummaryProps {
    planData: Record<string, any> | null;
    onDomainClick?: (domain: string) => void;
}

/**
 * Tier 2 Domain Summary Cards - Supporting context
 * Muted, compact, expandable on click
 */
export function DomainSummaryCards({ planData, onDomainClick }: DomainSummaryProps) {
    if (!planData) return null;

    const fitness = planData.fitness?.workout_plan || planData.fitness || {};
    const nutrition = planData.nutrition?.meal_plan || planData.nutrition || {};
    const sleep = planData.sleep?.sleep_recommendations || planData.sleep || {};
    const mental = planData.mental_wellness?.wellness_recommendations || planData.mental_wellness || {};

    const domains = [
        {
            id: 'fitness',
            icon: TbBarbell,
            label: 'Fitness',
            summary: fitness.sessions?.[0]?.type || fitness.focus || 'Workout',
            detail: `${fitness.intensity || 'Moderate'} intensity`,
            color: 'blue'
        },
        {
            id: 'nutrition',
            icon: TbApple,
            label: 'Nutrition',
            summary: `${nutrition.daily_calories || 2000} cal`,
            detail: nutrition.meals?.length ? `${nutrition.meals.length} meals` : 'Balanced',
            color: 'green'
        },
        {
            id: 'sleep',
            icon: TbMoon,
            label: 'Sleep',
            summary: `${sleep.target_hours || 8} hours`,
            detail: `By ${sleep.bedtime || '10:30 PM'}`,
            color: 'purple'
        },
        {
            id: 'mental',
            icon: TbHeart,
            label: 'Mental',
            summary: mental.daily_practices?.[0]?.activity || 'Mindfulness',
            detail: `${mental.daily_practices?.length || 0} practices`,
            color: 'pink'
        }
    ];

    const colorClasses: Record<string, string> = {
        blue: 'text-blue-400 bg-blue-500/10',
        green: 'text-green-400 bg-green-500/10',
        purple: 'text-purple-400 bg-purple-500/10',
        pink: 'text-pink-400 bg-pink-500/10'
    };

    return (
        <div className="space-y-2">
            {domains.map((domain, idx) => (
                <motion.button
                    key={domain.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => onDomainClick?.(domain.id)}
                    className="w-full flex items-center gap-4 p-4 bg-slate-900/60 border border-slate-800/50 rounded-xl hover:bg-slate-800/60 transition-colors text-left group"
                >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[domain.color]}`}>
                        <domain.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-300">{domain.summary}</div>
                        <div className="text-xs text-slate-500">{domain.detail}</div>
                    </div>
                    <TbChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </motion.button>
            ))}
        </div>
    );
}
