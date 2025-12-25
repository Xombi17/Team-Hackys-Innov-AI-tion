"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
    title: string;
    description: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between relative z-10">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <div key={index} className="flex flex-col items-center">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                    isCompleted
                                        ? "bg-brand-500 border-brand-500 text-white"
                                        : isCurrent
                                            ? "bg-slate-900 border-brand-500 text-brand-400 shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]"
                                            : "bg-slate-900 border-slate-700 text-slate-500"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <span className="font-semibold">{index + 1}</span>
                                )}
                            </div>
                            <div className="mt-3 text-center hidden sm:block">
                                <p
                                    className={cn(
                                        "text-sm font-medium transition-colors",
                                        isCurrent ? "text-white" : "text-slate-500"
                                    )}
                                >
                                    {step.title}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Progress Bar Background */}
            <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-800 -z-0 hidden sm:block">
                {/* Active Progress Bar */}
                <div
                    className="h-full bg-brand-500 transition-all duration-300"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />
            </div>
        </div>
    );
}
