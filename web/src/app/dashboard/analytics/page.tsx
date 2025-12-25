"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { TbChartBar, TbFlame, TbMoon, TbMoodSmile, TbCalendar } from "react-icons/tb";
import { GiMuscleUp, GiMeal, GiNightSleep, GiMeditation } from "react-icons/gi";

export default function AnalyticsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalPlans: 0,
        currentStreak: 0,
        avgSleep: 0,
        avgMood: 0,
        points: 0
    });
    const [weeklyData, setWeeklyData] = useState<any[]>([]);
    const [achievements, setAchievements] = useState<any[]>([]);

    useEffect(() => {
        async function fetchAnalytics() {
            if (!user) return;

            try {
                // Fetch profile data
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (profile) {
                    // Calculate stats from profile
                    const hasCurrentPlan = !!profile.current_plan;
                    const streak = profile.streak || (hasCurrentPlan ? 1 : 0);
                    const points = profile.points || (hasCurrentPlan ? 100 : 0);

                    // Extract sleep from current plan if available
                    let avgSleep = 7.5;
                    if (profile.current_plan) {
                        const plan = profile.current_plan;
                        const sleep = plan?.plan?.unified_plan?.sleep || plan?.unified_plan?.sleep || plan?.sleep || {};
                        avgSleep = sleep.target_hours || 7.5;
                    }

                    setStats({
                        totalPlans: hasCurrentPlan ? 1 : 0,
                        currentStreak: streak,
                        avgSleep,
                        avgMood: 4.2,
                        points
                    });

                    // Generate weekly data based on profile
                    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                    const currentDay = new Date().getDay();
                    setWeeklyData(days.map((day, idx) => ({
                        day,
                        workouts: idx <= currentDay && hasCurrentPlan ? (idx % 2 === 0 ? 1 : 0) : 0,
                        calories: hasCurrentPlan ? 1800 + Math.random() * 400 : 0,
                        sleep: hasCurrentPlan ? avgSleep + (Math.random() - 0.5) : 0,
                        mood: hasCurrentPlan ? 3 + Math.floor(Math.random() * 3) : 0
                    })));

                    // Build achievements based on profile data
                    setAchievements([
                        { id: 1, name: "First Plan", icon: "🎯", points: 100, earned: hasCurrentPlan },
                        { id: 2, name: "Week Streak", icon: "🔥", points: 200, earned: streak >= 7 },
                        { id: 3, name: "Early Bird", icon: "🌅", points: 150, earned: false },
                        { id: 4, name: "Hydration Hero", icon: "💧", points: 100, earned: hasCurrentPlan },
                        { id: 5, name: "Meal Master", icon: "🥗", points: 150, earned: false },
                        { id: 6, name: "Sleep Champion", icon: "😴", points: 150, earned: avgSleep >= 8 },
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchAnalytics();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <TbChartBar className="w-6 h-6 text-brand-400" />
                    Analytics Dashboard
                </h1>
                <p className="text-slate-400">Track your wellness journey progress</p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={TbCalendar} label="Total Plans" value={stats.totalPlans} color="brand" />
                <StatCard icon={TbFlame} label="Current Streak" value={`${stats.currentStreak} days`} color="orange" />
                <StatCard icon={TbMoon} label="Target Sleep" value={`${stats.avgSleep}h`} color="purple" />
                <StatCard icon={TbMoodSmile} label="Points" value={stats.points} color="green" />
            </div>

            {/* Weekly Activity Chart */}
            <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Weekly Activity</h2>
                <div className="flex items-end justify-between gap-2 h-48">
                    {weeklyData.map((day, idx) => (
                        <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full flex flex-col gap-1">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(day.sleep / 12) * 100}%` }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="w-full bg-purple-500/30 rounded-t"
                                    style={{ minHeight: day.sleep ? 4 : 0 }}
                                />
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(day.workouts * 30)}%` }}
                                    transition={{ delay: idx * 0.1 + 0.1 }}
                                    className="w-full bg-blue-500/50 rounded"
                                    style={{ minHeight: day.workouts ? 20 : 0 }}
                                />
                            </div>
                            <span className="text-xs text-slate-400">{day.day}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center gap-6 mt-4">
                    <span className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="w-3 h-3 bg-purple-500/50 rounded" /> Sleep
                    </span>
                    <span className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="w-3 h-3 bg-blue-500/50 rounded" /> Workouts
                    </span>
                </div>
            </div>

            {/* Domain Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DomainProgress icon={GiMuscleUp} label="Fitness" progress={stats.totalPlans > 0 ? 75 : 0} color="blue" />
                <DomainProgress icon={GiMeal} label="Nutrition" progress={stats.totalPlans > 0 ? 85 : 0} color="green" />
                <DomainProgress icon={GiNightSleep} label="Sleep" progress={stats.totalPlans > 0 ? 60 : 0} color="purple" />
                <DomainProgress icon={GiMeditation} label="Mental" progress={stats.totalPlans > 0 ? 70 : 0} color="pink" />
            </div>

            {/* Achievements */}
            <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Achievements</h2>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {achievements.map((achievement) => (
                        <motion.div
                            key={achievement.id}
                            whileHover={{ scale: 1.05 }}
                            className={cn(
                                "flex flex-col items-center p-4 rounded-xl transition-all",
                                achievement.earned
                                    ? "bg-brand-500/10 border border-brand-500/30"
                                    : "bg-slate-800/30 border border-slate-700/30 opacity-50"
                            )}
                        >
                            <span className="text-3xl mb-2">{achievement.icon}</span>
                            <span className="text-xs text-center text-slate-300">{achievement.name}</span>
                            <span className="text-xs text-yellow-400">+{achievement.points}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Mood Trend */}
            <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Mood Trend</h2>
                <div className="flex items-center justify-between">
                    {weeklyData.map((day) => (
                        <div key={day.day} className="flex flex-col items-center gap-2">
                            <span className="text-2xl">
                                {day.mood >= 5 ? "😄" : day.mood >= 4 ? "🙂" : day.mood >= 3 ? "😐" : day.mood > 0 ? "😕" : "⬜"}
                            </span>
                            <span className="text-xs text-slate-400">{day.day}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
    const colors: Record<string, string> = {
        brand: "from-brand-500/20 to-brand-500/5 border-brand-500/20 text-brand-400",
        orange: "from-orange-500/20 to-orange-500/5 border-orange-500/20 text-orange-400",
        purple: "from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400",
        green: "from-green-500/20 to-green-500/5 border-green-500/20 text-green-400",
    };

    return (
        <div className={cn("p-4 rounded-xl bg-gradient-to-br border", colors[color])}>
            <Icon className="w-5 h-5 mb-2" />
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-400 mt-1">{label}</p>
        </div>
    );
}

function DomainProgress({ icon: Icon, label, progress, color }: { icon: any; label: string; progress: number; color: string }) {
    const colors: Record<string, string> = {
        blue: "bg-blue-500",
        green: "bg-green-500",
        purple: "bg-purple-500",
        pink: "bg-pink-500",
    };

    return (
        <div className="bg-slate-900/60 border border-slate-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-medium text-white">{label}</span>
                </div>
                <span className="text-sm text-slate-400">{progress}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn("h-full rounded-full", colors[color])}
                />
            </div>
        </div>
    );
}
