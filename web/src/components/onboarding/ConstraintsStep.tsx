"use client";

import { UserProfile } from "@/lib/api";
import { cn } from "@/lib/utils";
import { TbClock, TbBarbell, TbBandage, TbCurrencyRupee } from "react-icons/tb";

interface ConstraintsStepProps {
    data: Partial<UserProfile>;
    onUpdate: (data: Partial<UserProfile>) => void;
}

export function ConstraintsStep({ data, onUpdate }: ConstraintsStepProps) {
    const equipmentOptions = [
        "Full Gym", "Home Gym", "Dumbbells Only", "Resistance Bands", "Bodyweight Only"
    ];

    const timeOptions = [
        "15 mins", "30 mins", "45 mins", "60 mins", "90+ mins"
    ];

    const updateConstraint = (category: keyof UserProfile['constraints'], value: any) => {
        onUpdate({
            constraints: {
                ...data.constraints!,
                [category]: value
            }
        });
    };

    const toggleArrayItem = (category: 'injuries' | 'equipment', item: string) => {
        const current = data.constraints?.[category] || [];
        const updated = current.includes(item)
            ? current.filter(i => i !== item)
            : [...current, item];

        updateConstraint(category, updated);
    };

    return (
        <div className="space-y-8">
            {/* Equipment */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-blue-400">
                    <TbBarbell className="w-5 h-5" />
                    <label className="text-sm font-medium uppercase tracking-wider">Equipment Available</label>
                </div>
                <div className="flex flex-wrap gap-3">
                    {equipmentOptions.map((item) => (
                        <button
                            key={item}
                            onClick={() => toggleArrayItem('equipment', item)}
                            className={cn(
                                "px-4 py-2 rounded-full border text-sm font-medium transition-all hover:scale-[1.02]",
                                data.constraints?.equipment?.includes(item)
                                    ? "bg-blue-500/20 border-blue-500 text-white shadow-lg shadow-blue-500/10"
                                    : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800"
                            )}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {/* Time Available */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-orange-400">
                    <TbClock className="w-5 h-5" />
                    <label className="text-sm font-medium uppercase tracking-wider">Time Per Day</label>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {timeOptions.map((time) => (
                        <button
                            key={time}
                            onClick={() => updateConstraint('time_available', time)}
                            className={cn(
                                "px-2 py-3 rounded-xl border text-sm font-medium transition-all hover:scale-[1.02]",
                                data.constraints?.time_available === time
                                    ? "bg-orange-500/20 border-orange-500 text-white shadow-lg shadow-orange-500/10"
                                    : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800"
                            )}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>

            {/* Injuries */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-red-400">
                    <TbBandage className="w-5 h-5" />
                    <label className="text-sm font-medium uppercase tracking-wider">Injuries / Limitations</label>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="E.g. Lower back pain, knee issues (comma separated)"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition-all"
                        onChange={(e) => updateConstraint('injuries', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    />
                </div>
            </div>

            {/* Budget */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-400">
                    <TbCurrencyRupee className="w-5 h-5" />
                    <label className="text-sm font-medium uppercase tracking-wider">Monthly Wellness Budget</label>
                </div>
                <div className="relative">
                    <input
                        type="number"
                        placeholder="Amount in INR (₹)"
                        value={data.constraints?.budget || ""}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all"
                        onChange={(e) => updateConstraint('budget', parseInt(e.target.value) || 0)}
                    />
                </div>
            </div>
        </div>
    );
}
