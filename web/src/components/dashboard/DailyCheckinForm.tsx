"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TbMoon, TbBolt, TbMoodSmile, TbSend, TbLoader2 } from "react-icons/tb";
import { DailyCheckin } from "@/lib/api";

interface DailyCheckinFormProps {
    onSubmit: (checkin: DailyCheckin) => void;
    isLoading?: boolean;
    disabled?: boolean;
}

const moodOptions = [
    { value: "very_low", emoji: "😢", label: "Bad" },
    { value: "low", emoji: "😕", label: "Low" },
    { value: "neutral", emoji: "😐", label: "Okay" },
    { value: "good", emoji: "🙂", label: "Good" },
    { value: "great", emoji: "😄", label: "Great" }
];

const energyOptions = [
    { value: "low", label: "Low", color: "text-red-400" },
    { value: "medium", label: "Medium", color: "text-yellow-400" },
    { value: "high", label: "High", color: "text-green-400" }
];

export function DailyCheckinForm({ onSubmit, isLoading, disabled }: DailyCheckinFormProps) {
    const [sleepHours, setSleepHours] = useState(7);
    const [mealsSkipped, setMealsSkipped] = useState(false);
    const [mood, setMood] = useState<DailyCheckin["mood"]>("neutral");
    const [energy, setEnergy] = useState<DailyCheckin["energy"]>("medium");
    const [notes, setNotes] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            sleep_hours: sleepHours,
            meals_skipped: mealsSkipped,
            mood,
            energy,
            notes: notes || undefined
        });
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className={cn(
                "bg-gradient-to-br from-slate-900/80 via-slate-800/50 to-brand-900/10",
                "border border-slate-700/50 rounded-2xl p-5 space-y-5",
                "backdrop-blur-xl shadow-xl",
                disabled && "opacity-50 pointer-events-none"
            )}
        >
            <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
                    <TbMoon className="w-4 h-4 text-brand-400" />
                </div>
                <h3 className="font-semibold text-white">Daily Check-in</h3>
            </div>

            {/* Sleep Hours */}
            <div>
                <label className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-300">Hours of sleep last night</span>
                    <span className="text-brand-400 font-bold text-lg">{sleepHours}h</span>
                </label>
                <input
                    type="range"
                    min={3}
                    max={12}
                    step={0.5}
                    value={sleepHours}
                    onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>3h</span>
                    <span>12h</span>
                </div>
            </div>

            {/* Mood Selection */}
            <div>
                <label className="text-sm text-slate-300 block mb-2">How are you feeling?</label>
                <div className="flex gap-2">
                    {moodOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setMood(option.value as DailyCheckin["mood"])}
                            className={cn(
                                "flex-1 py-2.5 rounded-xl text-center transition-all",
                                mood === option.value
                                    ? "bg-brand-500/20 border-2 border-brand-500/50 scale-105"
                                    : "bg-slate-800/50 border-2 border-transparent hover:bg-slate-700/50"
                            )}
                        >
                            <span className="text-xl">{option.emoji}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Energy Level */}
            <div>
                <label className="text-sm text-slate-300 block mb-2">Energy level</label>
                <div className="flex gap-2">
                    {energyOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setEnergy(option.value as DailyCheckin["energy"])}
                            className={cn(
                                "flex-1 py-2 rounded-xl text-sm font-medium transition-all",
                                energy === option.value
                                    ? `bg-slate-800 ${option.color} border-2 border-current`
                                    : "bg-slate-800/50 text-slate-400 border-2 border-transparent hover:bg-slate-700/50"
                            )}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Meals Skipped Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl">
                <span className="text-sm text-slate-300">Skipped any meals?</span>
                <button
                    type="button"
                    onClick={() => setMealsSkipped(!mealsSkipped)}
                    className={cn(
                        "w-12 h-6 rounded-full transition-all relative",
                        mealsSkipped ? "bg-red-500" : "bg-slate-600"
                    )}
                >
                    <span
                        className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                            mealsSkipped ? "left-7" : "left-1"
                        )}
                    />
                </button>
            </div>

            {/* Optional Notes */}
            <div>
                <label className="text-sm text-slate-300 block mb-2">Notes (optional)</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any specific concerns today..."
                    className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-brand-500/50"
                    rows={2}
                />
            </div>

            {/* Submit Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={cn(
                    "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all",
                    "bg-gradient-to-r from-brand-500 to-purple-500",
                    "hover:from-brand-600 hover:to-purple-600",
                    "text-white shadow-lg shadow-brand-500/25",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
            >
                {isLoading ? (
                    <>
                        <TbLoader2 className="w-5 h-5 animate-spin" />
                        Generating Plan...
                    </>
                ) : (
                    <>
                        <TbSend className="w-5 h-5" />
                        Run WellSync AI
                    </>
                )}
            </motion.button>
        </motion.form>
    );
}
