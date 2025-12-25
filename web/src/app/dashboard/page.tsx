"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { checkHealth, generateWellnessPlan, UserProfile, submitFeedback, getCompletedTasks, syncCompletedTasks } from "@/lib/api";
import { motion } from "framer-motion";
import {
    TbCheck, TbRefresh, TbX, TbLoader2,
    TbBarbell, TbApple, TbMoon, TbHeart, TbSparkles,
    TbFlame, TbDroplet, TbWalk, TbBrain
} from "react-icons/tb";
import { AIChatPanel } from "@/components/dashboard/AIChatPanel";
import { PlanDetailsModal } from "@/components/dashboard/PlanDetailsModal";
import confetti from "canvas-confetti";

type DashboardState = "idle" | "running" | "showing" | "stored";

export default function DashboardPage() {
    const { user } = useAuth();
    const [dashboardState, setDashboardState] = useState<DashboardState>("idle");
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [planData, setPlanData] = useState<Record<string, any> | null>(null);
    const [isHealthy, setIsHealthy] = useState(true);
    const [planStateId, setPlanStateId] = useState<string | null>(null);
    const [selectedDetail, setSelectedDetail] = useState<{ type: any; data: any } | null>(null);
    const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

    // Load persisted tasks (Cloud + Local)
    useEffect(() => {
        // Local load
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("wellsync_completed");
            if (saved) {
                try { setCompletedTasks(new Set(JSON.parse(saved))); } catch (e) { console.error("Failed to load tasks", e); }
            }
        }
        // Cloud sync
        if (user?.id) {
            getCompletedTasks(user.id).then(cloudTasks => {
                if (cloudTasks && cloudTasks.length > 0) {
                    setCompletedTasks(prev => {
                        const merged = new Set([...Array.from(prev), ...cloudTasks]);
                        localStorage.setItem("wellsync_completed", JSON.stringify(Array.from(merged)));
                        return merged;
                    });
                }
            });
        }
    }, [user]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    useEffect(() => {
        if (!user) return;
        const fetchUserData = async () => {
            try {
                const { data: profileData } = await supabase
                    .from("profiles").select("*").eq("id", user.id).single();
                if (profileData) {
                    setUserProfile({
                        user_id: user.id,
                        name: profileData.full_name,
                        age: profileData.age,
                        weight: profileData.weight,
                        height: profileData.height,
                        fitness_level: profileData.fitness_level || "intermediate",
                        goals: profileData.goals || {},
                        constraints: profileData.constraints || {},
                    });
                    if (profileData.current_plan) {
                        setPlanData(extractPlan(profileData.current_plan));
                        setPlanStateId(profileData.current_plan.state_id || profileData.current_plan.plan_id);
                        // Check if plan was already accepted today
                        const planAccepted = profileData.plan_accepted_at;
                        const today = new Date().toDateString();
                        if (planAccepted && new Date(planAccepted).toDateString() === today) {
                            setDashboardState("stored");
                        } else {
                            setDashboardState("showing");
                        }
                    }
                }
                setIsHealthy(await checkHealth());
            } catch (err) { console.error(err); }
        };
        fetchUserData();
    }, [user]);

    const extractPlan = (raw: any) => raw?.plan || raw?.unified_plan || raw?.result?.unified_plan || raw;

    const handleGenerate = async () => {
        if (!userProfile) return;
        setDashboardState("running");
        try {
            const result: any = await generateWellnessPlan(userProfile);
            if (result) {
                setPlanData(extractPlan(result));
                setPlanStateId(result.state_id || result.plan_id);
                setDashboardState("showing");
                await supabase.from("profiles").update({
                    current_plan: result,
                    plan_accepted_at: null // Reset on new plan
                }).eq("id", user?.id);
            }
        } catch (err) { setDashboardState("idle"); }
    };

    const submitPlanFeedback = async (type: 'accepted' | 'rejected' | 'skipped', rating: number) => {
        if (!planStateId) return;
        const feedback = {
            accepted: type === 'accepted',
            rating,
            comments: type === 'skipped' ? 'User skipped' : (type === 'rejected' ? 'User modified' : 'User accepted'),
            timestamp: new Date().toISOString()
        };
        try { await submitFeedback(planStateId, feedback); } catch (e) { console.error("Feedback failed", e); }
        if (user?.id) {
            await supabase.from("profiles").update({ plan_accepted_at: new Date().toISOString() }).eq("id", user.id);
        }
    };

    const handleAccept = async () => { setDashboardState("stored"); await submitPlanFeedback('accepted', 5); };
    const handleModify = async () => {
        setDashboardState("idle");
        await submitPlanFeedback('rejected', 3);
        setPlanData(null);
    };
    const handleSkip = async () => { setDashboardState("stored"); await submitPlanFeedback('skipped', 0); };

    const fitness = planData?.fitness?.workout_plan || planData?.fitness || {};
    const nutrition = planData?.nutrition?.meal_plan || planData?.nutrition || {};
    const sleep = planData?.sleep?.sleep_recommendations || planData?.sleep || {};
    const mental = planData?.mental_wellness?.wellness_recommendations || planData?.mental_wellness || {};

    const getHydration = () => {
        const text = nutrition.hydration || "8 glasses";
        const match = text.match(/\d+/);
        return match ? parseInt(match[0]) : 8;
    };

    const getSteps = () => {
        const intensity = fitness.intensity?.toLowerCase() || 'moderate';
        return intensity === 'high' ? '10,000' : (intensity === 'light' ? '6,000' : '8,000');
    };

    const scheduleItems = useMemo(() => {
        const items: any[] = [];
        if (!planData) return items;

        const parseTime = (t: string) => {
            if (!t) return 0;
            const parts = t.split(' ');
            if (parts.length < 2) return 0;
            const [time, period] = parts;
            const [h, m] = time.split(':').map(Number);
            let hours = h;
            if (period === 'PM' && h !== 12) hours += 12;
            if (period === 'AM' && h === 12) hours = 0;
            return hours * 60 + (m || 0);
        };

        if (sleep.wake_time) items.push({ time: sleep.wake_time, activity: 'Wake up', category: 'sleep' });
        if (nutrition.meals?.length) {
            nutrition.meals.forEach((m: any) => {
                if (m.time && m.meal) items.push({ time: m.time, activity: m.meal, category: 'nutrition' });
            });
        }
        items.push({
            time: '5:30 PM',
            activity: fitness.sessions?.[0]?.type || 'Workout',
            category: 'fitness'
        });
        if (mental.daily_practices?.length) {
            mental.daily_practices.forEach((p: any) => {
                if (p.time && p.activity) items.push({ time: p.time, activity: p.activity, category: 'mental' });
            });
        }
        if (sleep.bedtime) items.push({ time: sleep.bedtime, activity: 'Wind Down', category: 'sleep' });

        return items.sort((a, b) => parseTime(a.time) - parseTime(b.time));
    }, [planData, fitness, nutrition, sleep, mental]);

    const toggleTask = (id: string) => {
        setCompletedTasks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
                // Confetti if all done
                if (newSet.size === scheduleItems.length) {
                    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                }
            }
            // Save to persistence
            const arr = Array.from(newSet);
            localStorage.setItem("wellsync_completed", JSON.stringify(arr));
            if (user?.id) syncCompletedTasks(user.id, arr);
            return newSet;
        });
    };

    const quickStats = [
        { icon: TbFlame, label: 'Calories', value: nutrition.daily_calories || 2000, unit: 'kcal', color: 'text-orange-400', bg: 'from-orange-500/20 to-red-500/10' },
        { icon: TbDroplet, label: 'Water', value: getHydration(), unit: 'glasses', color: 'text-cyan-400', bg: 'from-cyan-500/20 to-blue-500/10' },
        { icon: TbWalk, label: 'Steps Goal', value: getSteps(), unit: 'steps', color: 'text-green-400', bg: 'from-green-500/20 to-emerald-500/10' },
        { icon: TbBrain, label: 'Focus', value: mental.daily_practices?.length || 3, unit: 'sessions', color: 'text-purple-400', bg: 'from-purple-500/20 to-violet-500/10' },
    ];

    const planItems = [
        { type: 'fitness', icon: TbBarbell, label: 'Workout', value: fitness.sessions?.[0]?.type || 'Training', sub: `${fitness.sessions?.[0]?.duration || 45} min • ${fitness.intensity || 'Moderate'}`, color: 'blue' },
        { type: 'nutrition', icon: TbApple, label: 'Nutrition', value: `${nutrition.daily_calories || 2000} cal`, sub: `${nutrition.meals?.length || 4} balanced meals`, color: 'green' },
        { type: 'sleep', icon: TbMoon, label: 'Sleep', value: `${sleep.target_hours || 8} hours`, sub: `Bedtime: ${sleep.bedtime || '10:30 PM'}`, color: 'purple' },
        { type: 'mental', icon: TbHeart, label: 'Mental', value: mental.daily_practices?.[0]?.activity || 'Mindfulness', sub: `${mental.daily_practices?.length || 3} practices today`, color: 'pink' },
    ];

    const colors: Record<string, { text: string; bg: string; border: string }> = {
        blue: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        green: { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
        purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        pink: { text: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
    };

    return (
        <div className="h-[calc(100vh-64px)] overflow-hidden bg-slate-950 p-6">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative h-full grid grid-cols-12 gap-6">

                {/* LEFT: Quick Stats */}
                <div className="col-span-3 space-y-4">
                    <div className="mb-2">
                        <h2 className="text-lg font-semibold text-white">{getGreeting()}</h2>
                        <p className="text-sm text-slate-500">{userProfile?.name?.split(' ')[0] || 'there'}</p>
                    </div>

                    {quickStats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-4 rounded-xl bg-gradient-to-br ${stat.bg} border border-white/5`}
                        >
                            <div className="flex items-center gap-3">
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                <span className="text-xs text-slate-400 uppercase tracking-wide">{stat.label}</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-2xl font-bold text-white">{stat.value}</span>
                                <span className="text-sm text-slate-500 ml-1">{stat.unit}</span>
                            </div>
                        </motion.div>
                    ))}

                    {/* Status */}
                    <div className="flex items-center gap-2 pt-4">
                        <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <span className="text-xs text-slate-500">System {isHealthy ? 'Ready' : 'Offline'}</span>
                    </div>
                </div>

                {/* CENTER: Main Plan */}
                <div className="col-span-6 flex flex-col">
                    {/* IDLE */}
                    {dashboardState === "idle" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex-1 flex flex-col items-center justify-center"
                        >
                            <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-brand-500/30 to-purple-500/20 flex items-center justify-center border border-brand-500/20">
                                <TbSparkles className="w-8 h-8 text-brand-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Generate Your Plan</h2>
                            <p className="text-slate-400 mb-8 text-center max-w-sm">AI-powered wellness recommendations personalized for you</p>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGenerate}
                                className="px-8 py-4 bg-gradient-to-r from-brand-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-brand-500/25"
                            >
                                Generate Today's Plan
                            </motion.button>
                        </motion.div>
                    )}

                    {/* RUNNING */}
                    {dashboardState === "running" && (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <TbLoader2 className="w-10 h-10 text-brand-400 animate-spin mb-4" />
                            <p className="text-slate-400">Crafting your personalized plan...</p>
                        </div>
                    )}

                    {/* SHOWING / STORED */}
                    {(dashboardState === "showing" || dashboardState === "stored") && planData && (
                        <div className="flex-1 flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="px-3 py-1 bg-brand-500/20 rounded-full">
                                    <span className="text-xs font-medium text-brand-400">TODAY'S PLAN</span>
                                </div>
                                <div className="px-3 py-1 bg-slate-800 rounded-full">
                                    <span className="text-xs text-slate-400">{fitness.intensity || 'Moderate'} Day</span>
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-white mb-6">
                                {planData.summary || "Balanced wellness day ahead."}
                            </h2>

                            {/* Plan Grid */}
                            <div className="grid grid-cols-2 gap-4 flex-1">
                                {planItems.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedDetail({ type: item.type, data: planData })}
                                        className={`p-5 rounded-xl ${colors[item.color].bg} border ${colors[item.color].border} flex flex-col cursor-pointer transition-shadow hover:shadow-lg`}
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <item.icon className={`w-5 h-5 ${colors[item.color].text}`} />
                                            <span className={`text-xs uppercase tracking-wide ${colors[item.color].text}`}>{item.label}</span>
                                        </div>
                                        <p className="text-lg font-semibold text-white">{item.value}</p>
                                        <p className="text-sm text-slate-400 mt-1">{item.sub}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Actions */}
                            {dashboardState === "showing" && (
                                <div className="flex gap-3 mt-6">
                                    <button onClick={handleAccept} className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 transition-colors">
                                        <TbCheck className="w-5 h-5" /> Accept
                                    </button>
                                    <button onClick={handleModify} className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors">
                                        <TbRefresh className="w-5 h-5" /> Modify
                                    </button>
                                    <button onClick={handleSkip} className="py-3 px-4 bg-slate-800/50 text-slate-400 rounded-xl hover:bg-slate-800 transition-colors" aria-label="Skip plan">
                                        <TbX className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                            {dashboardState === "stored" && (
                                <div className="mt-6 py-3 text-center bg-green-500/10 border border-green-500/20 rounded-xl">
                                    <span className="text-green-400 text-sm">✓ Plan accepted! We'll adapt tomorrow.</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT: Today's Schedule */}
                <div className="col-span-3 space-y-4">
                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">Today's Schedule</h3>

                    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5 overflow-y-auto custom-scrollbar relative h-[500px]">
                        {/* Vertical Line */}
                        <div className="absolute left-[38px] top-6 bottom-6 w-0.5 bg-slate-800" />

                        <div className="space-y-6">
                            {scheduleItems.length > 0 ? scheduleItems.map((item: any, i: number) => {
                                const id = `${item.time}-${item.activity}`;
                                const completed = completedTasks.has(id);
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`relative flex items-center gap-4 group cursor-pointer ${completed ? 'opacity-50 grayscale' : ''}`}
                                        onClick={() => toggleTask(id)}
                                    >
                                        <div className={`
                                            relative z-10 w-14 h-14 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300
                                            ${completed
                                                ? 'bg-brand-500 border-brand-500 shadow-[0_0_15px_rgba(var(--brand-500),0.3)]'
                                                : 'bg-slate-800 border-slate-700 group-hover:border-slate-600'
                                            }
                                        `}>
                                            {completed ? (
                                                <TbCheck className="w-6 h-6 text-white" />
                                            ) : (
                                                <>
                                                    <span className="text-xs text-slate-400 font-medium">{item.time.split(' ')[1]}</span>
                                                    <span className="text-sm font-bold text-white leading-tight">{item.time.split(' ')[0]}</span>
                                                </>
                                            )}
                                        </div>
                                        <div>
                                            <p className={`text-base font-medium transition-all ${completed ? 'text-slate-500 line-through' : 'text-white group-hover:text-brand-300'}`}>
                                                {item.activity}
                                            </p>
                                            <p className="text-xs text-slate-500 capitalize">{item.category}</p>
                                        </div>
                                    </motion.div>
                                );
                            }) : (
                                <p className="text-slate-500 text-center py-10">Waiting for plan...</p>
                            )}
                        </div>
                    </div>

                    {/* Quick Tip */}
                    <div className="mt-6 p-4 bg-gradient-to-br from-brand-500/10 to-purple-500/10 rounded-xl border border-brand-500/20">
                        <p className="text-xs text-brand-400 uppercase tracking-wide mb-2">💡 Tip</p>
                        <p className="text-sm text-slate-300">Stay hydrated! Drink a glass of water every 2 hours.</p>
                    </div>
                </div>

            </div>
            {selectedDetail && (
                <PlanDetailsModal
                    isOpen={!!selectedDetail}
                    onClose={() => setSelectedDetail(null)}
                    type={selectedDetail.type}
                    data={selectedDetail.data}
                />
            )}
            <AIChatPanel userId={user?.id} context={planData} />
        </div>
    );
}
