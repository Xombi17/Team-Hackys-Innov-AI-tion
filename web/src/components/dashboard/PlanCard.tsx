"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { TbChevronRight } from "react-icons/tb";

interface Metric {
    label: string;
    value: string;
}

interface PlanCardProps {
    title: string;
    description: string;
    icon: any; // Type 'any' to support both Lucide and React Icons
    color: "brand" | "blue" | "green" | "purple" | "orange";
    metrics?: Metric[];
    onClick?: () => void;
}

export function PlanCard({ title, description, icon: Icon, color, metrics, onClick }: PlanCardProps) {
    const colorStyles = {
        brand: { bg: "bg-brand-500/10", text: "text-brand-400", border: "border-brand-500/20", hover: "hover:border-brand-500/50" },
        blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", hover: "hover:border-blue-500/50" },
        green: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20", hover: "hover:border-green-500/50" },
        purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", hover: "hover:border-purple-500/50" },
        orange: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20", hover: "hover:border-orange-500/50" },
    };

    const styles = colorStyles[color];

    return (
        <div
            onClick={onClick}
            className={cn(
                "group relative bg-slate-900/50 border rounded-2xl p-6 transition-all duration-300",
                "hover:bg-slate-800/50 hover:shadow-xl",
                styles.border,
                styles.hover,
                onClick && "cursor-pointer"
            )}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", styles.bg)}>
                    <Icon className={cn("w-6 h-6", styles.text)} />
                </div>
                {onClick && (
                    <div className="p-2 rounded-lg text-slate-500 group-hover:text-white transition-colors">
                        <TbChevronRight className="w-5 h-5" />
                    </div>
                )}
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {description}
            </p>

            {metrics && metrics.length > 0 && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                    {metrics.map((metric, i) => (
                        <div key={i}>
                            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                                {metric.label}
                            </div>
                            <div className="font-semibold text-white">
                                {metric.value}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
