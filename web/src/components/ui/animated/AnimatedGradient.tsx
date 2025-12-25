"use client";

import { cn } from "@/lib/utils";

interface AnimatedGradientProps {
    className?: string;
    variant?: "brand" | "warm" | "cool" | "mixed";
}

export function AnimatedGradient({ className, variant = "brand" }: AnimatedGradientProps) {
    // Use explicit colors for each variant
    const colors = {
        brand: {
            main: "rgba(99, 102, 241, 0.25)",
            secondary: "rgba(168, 85, 247, 0.2)",
            tertiary: "rgba(34, 211, 238, 0.15)",
        },
        warm: {
            main: "rgba(249, 115, 22, 0.2)",
            secondary: "rgba(239, 68, 68, 0.15)",
            tertiary: "rgba(234, 179, 8, 0.15)",
        },
        cool: {
            main: "rgba(59, 130, 246, 0.2)",
            secondary: "rgba(34, 211, 238, 0.15)",
            tertiary: "rgba(99, 102, 241, 0.15)",
        },
        mixed: {
            main: "rgba(236, 72, 153, 0.2)",
            secondary: "rgba(99, 102, 241, 0.15)",
            tertiary: "rgba(34, 197, 94, 0.15)",
        },
    };

    const { main, secondary, tertiary } = colors[variant];

    return (
        <div
            className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}
            style={{
                maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)"
            }}
        >
            {/* Main centered blob */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px] animate-blob"
                style={{ backgroundColor: main }}
            />
            {/* Secondary blob - top left area */}
            <div
                className="absolute top-[35%] left-[30%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[280px] rounded-full blur-[100px] animate-blob animation-delay-2000"
                style={{ backgroundColor: secondary }}
            />
            {/* Tertiary blob - bottom right area */}
            <div
                className="absolute top-[65%] left-[70%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[220px] rounded-full blur-[80px] animate-blob animation-delay-4000"
                style={{ backgroundColor: tertiary }}
            />
        </div>
    );
}
