"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    TbClock,
    TbPlayerPlay,
    TbHeart,
    TbSparkles,
    TbChevronDown,
    TbChevronUp,
    TbBrain,
    TbCode,
    TbExternalLink
} from "react-icons/tb";
import { GiMeditation, GiLotus, GiHealing, GiBrain } from "react-icons/gi";

interface MentalPractice {
    activity: string;
    duration: string;
    time: string;
}

const getYouTubeUrl = (practice: string): string => {
    const query = `${practice} guided tutorial`;
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
};

const getPracticeImageUrl = (practice: string): string => {
    const prompt = `peaceful person doing ${practice}, minimalist zen style, calming colors, 4k`;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=400&height=250&nologo=true`;
};

export default function MentalPage() {
    const { user } = useAuth();
    const [plan, setPlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showRawData, setShowRawData] = useState(false);
    const [expandedPractice, setExpandedPractice] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPlan() {
            if (!user) return;
            const { data } = await supabase
                .from("profiles")
                .select("current_plan")
                .eq("id", user.id)
                .single();

            if (data?.current_plan) {
                setPlan(data.current_plan);
            }
            setLoading(false);
        }
        fetchPlan();
    }, [user]);

    // Extract unified plan data
    const extractMentalData = (planData: any) => {
        const m = planData?.plan?.unified_plan?.mental_wellness ||
            planData?.plan_data?.mental ||
            planData?.unified_plan?.mental_wellness || {};
        return {
            practices: m.daily_practices || [],
            focus: m.focus || "stress_management",
            stressManagement: m.stress_management || [],
            moodTracking: m.mood_tracking || "Daily check-in recommended",
            socialConnection: m.social_connection || "",
            motivationLevel: m.motivation_level || "medium",
            confidence: m.confidence || 0.90,
            rawData: m
        };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-20 h-20 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-6">
                    <GiMeditation className="w-10 h-10 text-pink-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">No Wellness Plan Yet</h2>
                <p className="text-slate-400 mb-8 max-w-md">
                    Generate your personalized AI mental wellness plan for mindfulness and stress management.
                </p>
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl text-white font-medium hover:from-pink-600 hover:to-rose-600 transition-all"
                >
                    <TbPlayerPlay className="w-5 h-5" />
                    Generate Plan
                </Link>
            </div>
        );
    }

    const mental = extractMentalData(plan);
    const totalDailyMinutes = mental.practices.reduce((sum: number, p: MentalPractice) => {
        const mins = parseInt(p.duration) || 0;
        return sum + mins;
    }, 0);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/30 to-rose-500/20 flex items-center justify-center">
                        <GiMeditation className="w-7 h-7 text-pink-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">🧠 Mental Agent</h1>
                        <p className="text-slate-400 capitalize">{mental.focus.replace(/_/g, ' ')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Confidence:</span>
                    <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-pink-500/20 text-pink-400">
                        {(mental.confidence * 100).toFixed(0)}%
                    </span>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-500/5 border border-pink-500/20 text-center">
                    <GiLotus className="w-6 h-6 text-pink-400 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-white">{mental.practices.length}</p>
                    <p className="text-xs text-slate-400">Daily Practices</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 text-center">
                    <TbClock className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-white">{totalDailyMinutes}m</p>
                    <p className="text-xs text-slate-400">Total Time</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 text-center">
                    <TbHeart className="w-6 h-6 text-green-400 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-white capitalize">{mental.motivationLevel}</p>
                    <p className="text-xs text-slate-400">Motivation</p>
                </div>
            </div>

            {/* Agent Reasoning Trace */}
            <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-800/50 flex items-center gap-2">
                    <TbBrain className="w-5 h-5 text-pink-400" />
                    <h3 className="font-semibold text-white">🧠 Reasoning Trace</h3>
                </div>
                <div className="p-5">
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-4">
                        <strong className="text-blue-400">Cognitive Load:</strong>{" "}
                        <span className="text-white capitalize">{mental.focus.replace(/_/g, ' ')}</span>
                    </div>

                    <div className="space-y-3 text-sm text-slate-300">
                        <p className="flex items-start gap-2">
                            <span className="text-pink-400 mt-1">•</span>
                            <span><strong>Stress Vector:</strong> Detected 'High' inputs. Prioritizing Cortisol reduction.</span>
                        </p>
                        <p className="flex items-start gap-2">
                            <span className="text-pink-400 mt-1">•</span>
                            <span><strong>Practice Selection:</strong> Chose 'Meditation' and 'Breathing' for immediate autonomic down-regulation.</span>
                        </p>
                        <p className="flex items-start gap-2">
                            <span className="text-pink-400 mt-1">•</span>
                            <span><strong>Integration:</strong> Scheduled practices post-work to separate professional/personal domains.</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Daily Practices with AI */}
            {mental.practices.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-white mb-4">Daily Mindfulness Practices</h2>
                    <div className="space-y-4">
                        {mental.practices.map((practice: MentalPractice, idx: number) => {
                            const practiceKey = `${practice.activity}-${practice.time}`;
                            const isExpanded = expandedPractice === practiceKey;

                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden"
                                >
                                    {/* Practice Header */}
                                    <div className="p-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                                                    <GiBrain className="w-6 h-6 text-pink-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-white text-lg">{practice.activity}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                                                        <TbClock className="w-4 h-4" />
                                                        <span>{practice.time}</span>
                                                        <span className="text-pink-400">• {practice.duration}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setExpandedPractice(isExpanded ? null : practiceKey)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-pink-500/10 text-pink-400 rounded-lg text-sm hover:bg-pink-500/20 transition-colors"
                                            >
                                                <GiHealing className="w-4 h-4" />
                                                Open Guide
                                                {isExpanded ? <TbChevronUp className="w-4 h-4" /> : <TbChevronDown className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden border-t border-slate-800/50"
                                            >
                                                <div className="p-5 bg-slate-800/20">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {/* YouTube Link */}
                                                        <a
                                                            href={getYouTubeUrl(practice.activity)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex flex-col items-center justify-center p-6 bg-slate-900/50 border border-slate-700/50 rounded-xl hover:border-red-500/30 transition-colors group"
                                                        >
                                                            <span className="text-4xl mb-2">🧘</span>
                                                            <span className="font-medium text-white mb-2">Guided Tutorial</span>
                                                            <span className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm group-hover:bg-red-600 transition-colors">
                                                                Open on YouTube
                                                                <TbExternalLink className="w-4 h-4" />
                                                            </span>
                                                        </a>

                                                        {/* AI Visualization */}
                                                        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden">
                                                            <div className="p-3 border-b border-slate-800/50">
                                                                <span className="text-sm font-medium text-white">✨ Visualization</span>
                                                            </div>
                                                            <img
                                                                src={getPracticeImageUrl(practice.activity)}
                                                                alt={practice.activity}
                                                                className="w-full h-36 object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Stress Management Techniques */}
            {mental.stressManagement.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-white mb-4">Stress Management Techniques</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {mental.stressManagement.map((technique: string, idx: number) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-500/10 to-transparent border border-pink-500/20 rounded-xl"
                            >
                                <TbSparkles className="w-5 h-5 text-pink-400 flex-shrink-0" />
                                <p className="text-sm text-slate-300">{technique}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Social & Mood */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mental.moodTracking && (
                    <div className="p-5 bg-slate-900/60 border border-slate-800/50 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2">
                            <TbHeart className="w-5 h-5 text-pink-400" />
                            <h3 className="font-medium text-white">Mood Tracking</h3>
                        </div>
                        <p className="text-sm text-slate-400">{mental.moodTracking}</p>
                    </div>
                )}
                {mental.socialConnection && (
                    <div className="p-5 bg-slate-900/60 border border-slate-800/50 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2">
                            <TbSparkles className="w-5 h-5 text-purple-400" />
                            <h3 className="font-medium text-white">Social Connection</h3>
                        </div>
                        <p className="text-sm text-slate-400">{mental.socialConnection}</p>
                    </div>
                )}
            </div>

            {/* Raw Agent Output */}
            <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl overflow-hidden">
                <button
                    onClick={() => setShowRawData(!showRawData)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <TbCode className="w-5 h-5 text-slate-400" />
                        <span className="text-sm text-slate-300">📝 View Raw Agent Output (JSON)</span>
                    </div>
                    {showRawData ? <TbChevronUp className="w-4 h-4 text-slate-400" /> : <TbChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                <AnimatePresence>
                    {showRawData && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                        >
                            <pre className="p-4 bg-slate-950/50 text-xs text-green-400 overflow-x-auto max-h-80">
                                {JSON.stringify(mental.rawData, null, 2)}
                            </pre>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
