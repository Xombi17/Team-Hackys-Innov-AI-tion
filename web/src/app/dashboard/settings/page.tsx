"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
    TbUser,
    TbScale,
    TbRuler,
    TbCalendar,
    TbTarget,
    TbAlertCircle,
    TbCheck,
    TbLoader2,
    TbDeviceFloppy
} from "react-icons/tb";
import { GiMuscleUp } from "react-icons/gi";

const fitnessLevels = ["beginner", "intermediate", "advanced"];
const goalOptions = ["weight_loss", "muscle_gain", "endurance", "flexibility", "stress_reduction", "better_sleep", "general_wellness"];
const constraintOptions = ["vegetarian", "vegan", "gluten_free", "dairy_free", "low_budget", "limited_time", "home_workouts", "no_equipment"];

export default function SettingsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Form state
    const [profile, setProfile] = useState({
        full_name: "",
        age: 25,
        weight: 70,
        height: 170,
        fitness_level: "beginner",
        goals: [] as string[],
        constraints: [] as string[],
    });

    useEffect(() => {
        async function fetchProfile() {
            if (!user) return;
            const { data } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (data) {
                setProfile({
                    full_name: data.full_name || "",
                    age: data.age || 25,
                    weight: data.weight || 70,
                    height: data.height || 170,
                    fitness_level: data.fitness_level || "beginner",
                    goals: data.goals || [],
                    constraints: data.constraints || [],
                });
            }
            setLoading(false);
        }
        fetchProfile();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        setSaved(false);

        const { error } = await supabase
            .from("profiles")
            .update({
                full_name: profile.full_name,
                age: profile.age,
                weight: profile.weight,
                height: profile.height,
                fitness_level: profile.fitness_level,
                goals: profile.goals,
                constraints: profile.constraints,
                updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);

        setSaving(false);
        if (!error) {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
    };

    const toggleGoal = (goal: string) => {
        setProfile(prev => ({
            ...prev,
            goals: prev.goals.includes(goal)
                ? prev.goals.filter(g => g !== goal)
                : [...prev.goals, goal]
        }));
    };

    const toggleConstraint = (constraint: string) => {
        setProfile(prev => ({
            ...prev,
            constraints: prev.constraints.includes(constraint)
                ? prev.constraints.filter(c => c !== constraint)
                : [...prev.constraints, constraint]
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">⚙️ Settings</h1>
                    <p className="text-slate-400">Manage your profile and preferences</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={saving}
                    className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all",
                        saved
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-brand-500 text-white hover:bg-brand-600"
                    )}
                >
                    {saving ? (
                        <><TbLoader2 className="w-5 h-5 animate-spin" /> Saving...</>
                    ) : saved ? (
                        <><TbCheck className="w-5 h-5" /> Saved!</>
                    ) : (
                        <><TbDeviceFloppy className="w-5 h-5" /> Save Changes</>
                    )}
                </motion.button>
            </div>

            {/* Profile Section */}
            <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TbUser className="w-5 h-5 text-brand-400" />
                    Profile Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={profile.full_name}
                            onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-brand-500/50"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Email</label>
                        <input
                            type="email"
                            value={user?.email || ""}
                            disabled
                            className="w-full px-4 py-3 bg-slate-800/30 border border-slate-700/30 rounded-xl text-slate-500 cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>

            {/* Health Data */}
            <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <GiMuscleUp className="w-5 h-5 text-blue-400" />
                    Health Data
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">
                            <TbCalendar className="w-4 h-4 inline mr-1" /> Age
                        </label>
                        <input
                            type="number"
                            value={profile.age}
                            onChange={(e) => setProfile(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-brand-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">
                            <TbScale className="w-4 h-4 inline mr-1" /> Weight (kg)
                        </label>
                        <input
                            type="number"
                            value={profile.weight}
                            onChange={(e) => setProfile(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-brand-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">
                            <TbRuler className="w-4 h-4 inline mr-1" /> Height (cm)
                        </label>
                        <input
                            type="number"
                            value={profile.height}
                            onChange={(e) => setProfile(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-brand-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Fitness Level</label>
                        <select
                            value={profile.fitness_level}
                            onChange={(e) => setProfile(prev => ({ ...prev, fitness_level: e.target.value }))}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-brand-500/50"
                        >
                            {fitnessLevels.map(level => (
                                <option key={level} value={level} className="bg-slate-900">
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Goals */}
            <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TbTarget className="w-5 h-5 text-green-400" />
                    Wellness Goals
                </h2>
                <div className="flex flex-wrap gap-3">
                    {goalOptions.map(goal => (
                        <button
                            key={goal}
                            onClick={() => toggleGoal(goal)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                profile.goals.includes(goal)
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-700/50"
                            )}
                        >
                            {goal.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </button>
                    ))}
                </div>
            </div>

            {/* Constraints */}
            <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TbAlertCircle className="w-5 h-5 text-orange-400" />
                    Constraints & Preferences
                </h2>
                <div className="flex flex-wrap gap-3">
                    {constraintOptions.map(constraint => (
                        <button
                            key={constraint}
                            onClick={() => toggleConstraint(constraint)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                profile.constraints.includes(constraint)
                                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                    : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-700/50"
                            )}
                        >
                            {constraint.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </button>
                    ))}
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h2>
                <p className="text-sm text-slate-400 mb-4">Irreversible actions</p>
                <button className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl text-sm hover:bg-red-500/20 transition-colors">
                    Delete Account
                </button>
            </div>
        </div>
    );
}
