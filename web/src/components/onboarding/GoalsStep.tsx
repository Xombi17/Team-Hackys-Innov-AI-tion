"use client";

import { UserProfile } from "@/lib/api";
import { cn } from "@/lib/utils";
import { GiMuscleUp, GiMeal, GiNightSleep, GiMeditation } from "react-icons/gi";

interface GoalsStepProps {
    data: Partial<UserProfile>;
    onUpdate: (data: Partial<UserProfile>) => void;
}

export function GoalsStep({ data, onUpdate }: GoalsStepProps) {
    const fitnessGoals = [
        "Lose Weight", "Build Muscle", "Improve Endurance", "Increase Flexibility", "General Health"
    ];

    const nutritionGoals = [
        "Calorie Deficit", "Maintenance", "Calorie Surplus", "Keto", "Vegetarian", "Vegan"
    ];

    const updateGoals = (category: keyof UserProfile['goals'], value: string) => {
        onUpdate({
            goals: {
                ...data.goals!,
                [category]: value
            }
        });
    };

    return (
        <div className="space-y-8">
            {/* Fitness Goal */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-brand-400">
                    <GiMuscleUp className="w-5 h-5" />
                    <label className="text-sm font-medium uppercase tracking-wider">Fitness Goal</label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {fitnessGoals.map((goal) => (
                        <button
                            key={goal}
                            onClick={() => updateGoals('fitness', goal)}
                            className={cn(
                                "px-4 py-3 rounded-xl border text-sm font-medium transition-all hover:scale-[1.02]",
                                data.goals?.fitness === goal
                                    ? "bg-brand-500/20 border-brand-500 text-white shadow-lg shadow-brand-500/10"
                                    : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800"
                            )}
                        >
                            {goal}
                        </button>
                    ))}
                </div>
            </div>

            {/* Nutrition Goal */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-400">
                    <GiMeal className="w-5 h-5" />
                    <label className="text-sm font-medium uppercase tracking-wider">Nutrition Focus</label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {nutritionGoals.map((goal) => (
                        <button
                            key={goal}
                            onClick={() => updateGoals('nutrition', goal)}
                            className={cn(
                                "px-4 py-3 rounded-xl border text-sm font-medium transition-all hover:scale-[1.02]",
                                data.goals?.nutrition === goal
                                    ? "bg-green-500/20 border-green-500 text-white shadow-lg shadow-green-500/10"
                                    : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800"
                            )}
                        >
                            {goal}
                        </button>
                    ))}
                </div>
            </div>

            {/* Other Goals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="flex items-center gap-2 text-purple-400 mb-3">
                        <GiNightSleep className="w-5 h-5" />
                        <label className="text-sm font-medium uppercase tracking-wider">Sleep Goal</label>
                    </div>
                    <input
                        type="text"
                        value={data.goals?.sleep || ""}
                        onChange={(e) => updateGoals('sleep', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all"
                        placeholder="e.g. 8 hours, Consistent schedule"
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2 text-cyan-400 mb-3">
                        <GiMeditation className="w-5 h-5" />
                        <label className="text-sm font-medium uppercase tracking-wider">Mental Wellness</label>
                    </div>
                    <input
                        type="text"
                        value={data.goals?.mental || ""}
                        onChange={(e) => updateGoals('mental', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all"
                        placeholder="e.g. Reduce stress, Meditation"
                    />
                </div>
            </div>
        </div>
    );
}
