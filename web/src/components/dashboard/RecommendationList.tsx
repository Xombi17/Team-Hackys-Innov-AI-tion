"use client";

import { cn } from "@/lib/utils";
import { TbCheck, TbChevronRight } from "react-icons/tb";

interface Recommendation {
    id: string;
    title: string;
    description: string;
    type: "fitness" | "nutrition" | "sleep" | "mental";
    priority: "high" | "medium" | "low";
}

interface RecommendationListProps {
    recommendations: Recommendation[];
    onComplete?: (id: string) => void;
}

export function RecommendationList({ recommendations, onComplete }: RecommendationListProps) {
    if (recommendations.length === 0) {
        return (
            <div className="text-center p-8 text-slate-400">
                No active recommendations. You're all caught up!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {recommendations.map((item) => (
                <div
                    key={item.id}
                    className="group flex items-start gap-4 p-4 bg-slate-800/20 hover:bg-slate-800/40 border border-slate-700/50 hover:border-brand-500/30 rounded-xl transition-all"
                >
                    <button
                        onClick={() => onComplete?.(item.id)}
                        className="mt-1 w-5 h-5 rounded-full border border-slate-600 hover:border-brand-500 hover:bg-brand-500/20 flex items-center justify-center transition-colors group/check"
                    >
                        <TbCheck className="w-3.5 h-3.5 text-transparent group-hover/check:text-brand-400 transition-colors" />
                    </button>

                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-white">{item.title}</h4>
                            {item.priority === "high" && (
                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 rounded-full">
                                    High Priority
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            {item.description}
                        </p>
                    </div>

                    <button className="p-2 text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                        <TbChevronRight className="w-5 h-5" />
                    </button>
                </div>
            ))}
        </div>
    );
}
