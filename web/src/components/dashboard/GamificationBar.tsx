"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { TbFlame, TbTrophy, TbStar } from "react-icons/tb";

const defaultAchievements = [
    { id: "first_plan", name: "First Plan", icon: "🎯", points: 100 },
    { id: "week_streak", name: "7 Day Streak", icon: "🔥", points: 200 },
    { id: "month_streak", name: "30 Day Streak", icon: "⭐", points: 500 },
    { id: "workout_warrior", name: "Workout Warrior", icon: "💪", points: 150 },
    { id: "nutrition_ninja", name: "Nutrition Ninja", icon: "🥗", points: 150 },
    { id: "sleep_champion", name: "Sleep Champion", icon: "😴", points: 150 },
];

export function GamificationBar() {
    const { user } = useAuth();
    const [streak, setStreak] = useState(0);
    const [points, setPoints] = useState(0);
    const [achievements, setAchievements] = useState<typeof defaultAchievements>([]);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        async function fetchGamificationData() {
            if (!user) return;

            try {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("current_plan, streak, points, achievements, updated_at")
                    .eq("id", user.id)
                    .single();

                if (profile) {
                    // Calculate streak based on last update
                    const hasCurrentPlan = !!profile.current_plan;
                    const savedStreak = profile.streak || 0;
                    const savedPoints = profile.points || 0;

                    // If they have a plan, give them at least streak of 1 and base points
                    const calculatedStreak = hasCurrentPlan ? Math.max(savedStreak, 1) : savedStreak;
                    const calculatedPoints = hasCurrentPlan ? Math.max(savedPoints, 100) : savedPoints;

                    setStreak(calculatedStreak);
                    setPoints(calculatedPoints);

                    // Build achievements list with earned status
                    const earnedIds = profile.achievements || [];
                    // Auto-unlock "first_plan" if they have a plan
                    const autoEarned = hasCurrentPlan ? ["first_plan"] : [];
                    // Auto-unlock "week_streak" if streak >= 7
                    if (calculatedStreak >= 7) autoEarned.push("week_streak");

                    setAchievements(defaultAchievements.map(a => ({
                        ...a,
                        unlocked: earnedIds.includes(a.id) || autoEarned.includes(a.id)
                    })));

                    // Update profile with calculated values if different
                    if (calculatedStreak !== savedStreak || calculatedPoints !== savedPoints) {
                        await supabase
                            .from("profiles")
                            .update({
                                streak: calculatedStreak,
                                points: calculatedPoints,
                                achievements: [...new Set([...earnedIds, ...autoEarned])]
                            })
                            .eq("id", user.id);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch gamification data:", error);
            }
        }

        fetchGamificationData();
    }, [user]);

    const unlockedCount = achievements.filter((a: any) => a.unlocked).length;
    const nextLevel = Math.ceil(points / 500) * 500;
    const progress = ((points % 500) / 500) * 100;

    return (
        <div className="bg-gradient-to-r from-orange-500/10 via-yellow-500/5 to-transparent border border-orange-500/20 rounded-2xl p-4">
            <div className="flex items-center justify-between">
                {/* Streak */}
                <div className="flex items-center gap-3">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center"
                    >
                        <TbFlame className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                        <p className="text-2xl font-bold text-white">{streak}</p>
                        <p className="text-xs text-slate-400">Day Streak</p>
                    </div>
                </div>

                {/* Points */}
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-2xl font-bold text-yellow-400">{points}</p>
                        <p className="text-xs text-slate-400">Points</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
                        <TbStar className="w-6 h-6 text-white" />
                    </div>
                </div>

                {/* Achievements */}
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    <div className="text-right">
                        <p className="text-2xl font-bold text-white">{unlockedCount}/{achievements.length}</p>
                        <p className="text-xs text-slate-400">Achievements</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <TbTrophy className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>

            {/* Level Progress */}
            <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Level {Math.floor(points / 500) + 1}</span>
                    <span>{points}/{nextLevel} XP</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                    />
                </div>
            </div>

            {/* Achievement Details */}
            {showDetails && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="mt-4 pt-4 border-t border-slate-800"
                >
                    <div className="grid grid-cols-3 gap-3">
                        {achievements.map((achievement: any) => (
                            <motion.div
                                key={achievement.id}
                                whileHover={{ scale: 1.05 }}
                                className={`flex flex-col items-center p-3 rounded-xl transition-all ${achievement.unlocked
                                        ? "bg-brand-500/10 border border-brand-500/30"
                                        : "bg-slate-800/30 border border-slate-700/30 opacity-50"
                                    }`}
                            >
                                <span className="text-2xl mb-1">{achievement.icon}</span>
                                <span className="text-xs text-center text-slate-300">{achievement.name}</span>
                                <span className="text-xs text-yellow-400">+{achievement.points}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
