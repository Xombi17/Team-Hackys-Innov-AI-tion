"use client";

import { UserProfile } from "@/lib/api";
import { cn } from "@/lib/utils";
import { TbActivity, TbScale, TbRuler } from "react-icons/tb";

interface FitnessStepProps {
    data: Partial<UserProfile>;
    onUpdate: (data: Partial<UserProfile>) => void;
}

export function FitnessStep({ data, onUpdate }: FitnessStepProps) {
    const fitnessLevels = [
        { id: "beginner", label: "Beginner", desc: "New to regular exercise" },
        { id: "intermediate", label: "Intermediate", desc: "Consistent weekly activity" },
        { id: "advanced", label: "Advanced", desc: "High-performance training" },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Age (years)</label>
                    <div className="relative group">
                        <TbActivity className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-brand-400 transition-colors" />
                        <input
                            type="number"
                            min={10}
                            max={100}
                            value={data.age || ""}
                            onChange={(e) => onUpdate({ age: parseInt(e.target.value) || undefined })}
                            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all placeholder:text-slate-600"
                            placeholder="25"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Weight (kg)</label>
                    <div className="relative group">
                        <TbScale className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-brand-400 transition-colors" />
                        <input
                            type="number"
                            min={30}
                            max={300}
                            value={data.weight || ""}
                            onChange={(e) => onUpdate({ weight: parseInt(e.target.value) || undefined })}
                            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all placeholder:text-slate-600"
                            placeholder="70"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Height (cm)</label>
                    <div className="relative group">
                        <TbRuler className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-brand-400 transition-colors" />
                        <input
                            type="number"
                            min={100}
                            max={250}
                            value={data.height || ""}
                            onChange={(e) => onUpdate({ height: parseInt(e.target.value) || undefined })}
                            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all placeholder:text-slate-600"
                            placeholder="175"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Fitness Level</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {fitnessLevels.map((level) => (
                        <button
                            key={level.id}
                            onClick={() => onUpdate({ fitness_level: level.id })}
                            className={cn(
                                "p-4 rounded-xl border text-left transition-all hover:scale-[1.02]",
                                data.fitness_level === level.id
                                    ? "bg-brand-500/20 border-brand-500 text-white shadow-lg shadow-brand-500/10"
                                    : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800"
                            )}
                        >
                            <div className="font-semibold mb-1">{level.label}</div>
                            <div className="text-xs opacity-70">{level.desc}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
