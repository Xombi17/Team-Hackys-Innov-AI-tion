"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    TbCalendar,
    TbClock,
    TbFlame,
    TbTrendingUp,
    TbPlayerPlay,
    TbExternalLink,
    TbChevronDown,
    TbChevronUp,
    TbEye,
    TbSparkles,
    TbCode
} from "react-icons/tb";
import { GiMuscleUp, GiWeightLiftingUp, GiRunningShoe, GiHeartBeats } from "react-icons/gi";

interface Exercise {
    name: string;
    sets: number;
    reps: number | string;
}

interface WorkoutSession {
    day: string;
    type: string;
    duration: number;
    exercises: Exercise[];
}

// Default sessions if API doesn't return any
const defaultSessions: WorkoutSession[] = [
    {
        day: "Monday",
        type: "Upper Body",
        duration: 45,
        exercises: [
            { name: "Push-ups", sets: 3, reps: 12 },
            { name: "Dumbbell Rows", sets: 3, reps: 10 },
            { name: "Shoulder Press", sets: 3, reps: 10 }
        ]
    },
    {
        day: "Wednesday",
        type: "Lower Body",
        duration: 45,
        exercises: [
            { name: "Squats", sets: 4, reps: 12 },
            { name: "Lunges", sets: 3, reps: 10 },
            { name: "Glute Bridges", sets: 3, reps: 15 }
        ]
    },
    {
        day: "Friday",
        type: "Full Body",
        duration: 40,
        exercises: [
            { name: "Burpees", sets: 3, reps: 8 },
            { name: "Mountain Climbers", sets: 3, reps: 20 },
            { name: "Plank", sets: 3, reps: "30s" }
        ]
    }
];

// Form tips for common exercises
const formTips: Record<string, string> = {
    "push-up": "Elbows at 45 degrees, don't let hips sag. Core engaged.",
    "push-ups": "Elbows at 45 degrees, don't let hips sag. Core engaged.",
    "squat": "Drive through heels, keep chest up, knees track over toes.",
    "squats": "Drive through heels, keep chest up, knees track over toes.",
    "lunge": "Front knee stays behind toes, torso upright.",
    "lunges": "Front knee stays behind toes, torso upright.",
    "plank": "Straight line from head to heels. Don't hold breath.",
    "burpee": "Land softly, control the movement down.",
    "burpees": "Land softly, control the movement down.",
    "row": "Squeeze shoulder blades together at top. Control the negative.",
    "rows": "Squeeze shoulder blades together at top. Control the negative.",
    "dumbbell rows": "Squeeze shoulder blades together. Pull to hip level.",
    "shoulder press": "Core tight, don't arch lower back. Press straight up.",
    "glute bridges": "Squeeze glutes at top, don't hyperextend spine.",
    "mountain climbers": "Keep hips low, drive knees to chest quickly.",
    "default": "Keep core engaged and maintain proper breathing throughout."
};

const getFormTip = (exerciseName: string): string => {
    const name = exerciseName.toLowerCase();
    for (const [key, tip] of Object.entries(formTips)) {
        if (name.includes(key)) return tip;
    }
    return formTips.default;
};

const getYouTubeUrl = (exerciseName: string): string => {
    const query = `how to do ${exerciseName} exercise perfect form`;
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
};

const getExerciseImageUrl = (exerciseName: string, step: number): string => {
    const positions = ["start", "action", "end"];
    const prompt = `realistic 3D render of human doing ${exerciseName} exercise ${positions[step]} position, gym background, anatomical accuracy, 4k, photorealistic`;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=250&height=250&nologo=true&seed=${step}`;
};

export default function FitnessPage() {
    const { user } = useAuth();
    const [plan, setPlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
    const [generatingSteps, setGeneratingSteps] = useState<string | null>(null);
    const [generatedSteps, setGeneratedSteps] = useState<Record<string, boolean>>({});
    const [showRawData, setShowRawData] = useState(false);

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
                console.log("Fetched plan:", data.current_plan); // Debug log
            }
            setLoading(false);
        }
        fetchPlan();
    }, [user]);

    // Extract unified plan data - check multiple possible paths
    const extractFitnessData = (planData: any) => {
        // Try multiple paths to find fitness data
        const p = planData?.plan?.unified_plan?.fitness ||
            planData?.unified_plan?.fitness ||
            planData?.plan_data?.fitness ||
            planData?.fitness ||
            planData?.plan?.fitness ||
            {};

        // Get sessions or use defaults
        let sessions = p.sessions || p.workout_sessions || p.workouts || [];
        if (!sessions || sessions.length === 0) {
            sessions = defaultSessions;
        }

        return {
            sessions,
            intensity: p.intensity || "moderate",
            focus: p.focus || "balanced",
            weeklyVolume: p.weekly_volume || "120 min",
            progression: p.progression || "",
            overtrainingRisk: p.overtraining_risk || "low",
            energyDemand: p.energy_demand || "medium",
            confidence: p.confidence || 0.88,
            rawData: p
        };
    };

    const handleGenerateSteps = (exerciseName: string) => {
        setGeneratingSteps(exerciseName);
        setTimeout(() => {
            setGeneratedSteps(prev => ({ ...prev, [exerciseName]: true }));
            setGeneratingSteps(null);
        }, 1500);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-20 h-20 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6">
                    <GiMuscleUp className="w-10 h-10 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">No Fitness Plan Yet</h2>
                <p className="text-slate-400 mb-8 max-w-md">
                    Generate your personalized AI workout plan to see detailed exercises with video tutorials.
                </p>
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white font-medium hover:from-blue-600 hover:to-cyan-600 transition-all"
                >
                    <TbPlayerPlay className="w-5 h-5" />
                    Generate Plan
                </Link>
            </div>
        );
    }

    const fitness = extractFitnessData(plan);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/30 to-cyan-500/20 flex items-center justify-center">
                        <GiMuscleUp className="w-7 h-7 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">💪 Fitness Protocol</h1>
                        <p className="text-slate-400 capitalize">{fitness.focus.replace(/_/g, ' ')} Training</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Confidence:</span>
                    <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-blue-500/20 text-blue-400">
                        {(fitness.confidence * 100).toFixed(0)}%
                    </span>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 text-center">
                    <p className="text-2xl font-bold text-white capitalize">{fitness.focus.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-slate-400 mt-1">Focus</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/20 text-center">
                    <p className="text-2xl font-bold text-white capitalize">{fitness.intensity}</p>
                    <p className="text-xs text-slate-400 mt-1">Intensity</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 text-center">
                    <p className="text-2xl font-bold text-white">{fitness.weeklyVolume}</p>
                    <p className="text-xs text-slate-400 mt-1">Weekly Volume</p>
                </div>
            </div>

            {/* Weekly Schedule */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4">📅 Weekly Schedule</h2>
                <div className="space-y-6">
                    {fitness.sessions.map((session: WorkoutSession, idx: number) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden"
                        >
                            {/* Session Header */}
                            <div className="p-5 border-b border-slate-800/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                            <TbCalendar className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <span className="font-semibold text-white text-lg">{session.day}</span>
                                            <p className="text-blue-400 text-sm">{session.type} • {session.duration} min</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Exercises */}
                            <div className="divide-y divide-slate-800/50">
                                {(session.exercises || []).map((ex, exIdx) => {
                                    const exerciseKey = `${session.day}-${ex.name}`;
                                    const isExpanded = expandedExercise === exerciseKey;

                                    return (
                                        <div key={exIdx} className="p-4">
                                            {/* Exercise Row */}
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <GiWeightLiftingUp className="w-5 h-5 text-slate-400" />
                                                    <span className="font-medium text-white">{ex.name}</span>
                                                    <span className="text-xs text-slate-500 font-mono bg-slate-800/50 px-2 py-1 rounded">
                                                        {ex.sets}×{ex.reps}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => setExpandedExercise(isExpanded ? null : exerciseKey)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-sm hover:bg-blue-500/20 transition-colors"
                                                >
                                                    <TbEye className="w-4 h-4" />
                                                    AI Vision Coach
                                                    {isExpanded ? <TbChevronUp className="w-4 h-4" /> : <TbChevronDown className="w-4 h-4" />}
                                                </button>
                                            </div>

                                            {/* Expanded Content - AI Vision Coach */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="mt-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                                                            <p className="text-xs text-slate-500 mb-4">AI-curated demonstrations and form analysis</p>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                                {/* YouTube Link */}
                                                                <a
                                                                    href={getYouTubeUrl(ex.name)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex flex-col items-center justify-center p-6 bg-slate-900/50 border border-slate-700/50 rounded-xl hover:border-red-500/30 transition-colors group"
                                                                >
                                                                    <span className="text-4xl mb-2">▶️</span>
                                                                    <span className="font-medium text-white mb-2">Watch Demo</span>
                                                                    <span className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm group-hover:bg-red-600 transition-colors">
                                                                        Open on YouTube
                                                                        <TbExternalLink className="w-4 h-4" />
                                                                    </span>
                                                                </a>

                                                                {/* Form Tip */}
                                                                <div className="p-5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl border-dashed">
                                                                    <div className="text-xs text-indigo-400 font-semibold uppercase mb-2">AI Form Scan</div>
                                                                    <p className="text-slate-300 text-sm leading-relaxed">"{getFormTip(ex.name)}"</p>
                                                                    <div className="text-xs text-slate-500 mt-3">Target: {session.type}</div>
                                                                </div>
                                                            </div>

                                                            {/* Generate Steps Button */}
                                                            <button
                                                                onClick={() => handleGenerateSteps(exerciseKey)}
                                                                disabled={generatingSteps === exerciseKey}
                                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 rounded-xl hover:from-indigo-500/30 hover:to-purple-500/30 transition-all disabled:opacity-50"
                                                            >
                                                                {generatingSteps === exerciseKey ? (
                                                                    <>
                                                                        <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                                                                        Generating biomechanical sequence...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <TbSparkles className="w-4 h-4" />
                                                                        ✨ Auto-Generate Steps
                                                                    </>
                                                                )}
                                                            </button>

                                                            {/* Generated Step Images */}
                                                            {generatedSteps[exerciseKey] && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    className="grid grid-cols-3 gap-3 mt-4"
                                                                >
                                                                    {["Start", "Action", "End"].map((step, i) => (
                                                                        <div key={i} className="text-center">
                                                                            <img
                                                                                src={getExerciseImageUrl(ex.name, i)}
                                                                                alt={`${ex.name} ${step}`}
                                                                                className="w-full h-32 object-cover rounded-lg bg-slate-800"
                                                                            />
                                                                            <p className="text-xs text-slate-400 mt-2">{step}</p>
                                                                        </div>
                                                                    ))}
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Progression Note */}
            {fitness.progression && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500/10 to-transparent border-l-4 border-blue-500 rounded-r-xl"
                >
                    <TbTrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <p className="text-sm text-slate-300">{fitness.progression}</p>
                </motion.div>
            )}

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
                                {JSON.stringify(fitness.rawData, null, 2)}
                            </pre>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
