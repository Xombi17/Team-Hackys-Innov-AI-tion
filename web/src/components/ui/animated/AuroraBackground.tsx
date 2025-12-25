"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
    children?: React.ReactNode;
    showRadialGradient?: boolean;
}

export const AuroraBackground = ({
    className,
    children,
    showRadialGradient = true,
    ...props
}: AuroraBackgroundProps) => {
    return (
        <div
            className={cn(
                "relative flex flex-col h-screen items-center justify-center bg-slate-950 text-slate-950 transition-bg overflow-hidden",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 overflow-hidden">
                <div
                    //   I'm sorry but this is what peak performance looks like
                    className={cn(
                        `
            [--white-gradient:repeating-linear-gradient(100deg,#ffffff_0%,#ffffff_7%,transparent_10%,transparent_12%,#ffffff_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,#000000_0%,#000000_7%,transparent_10%,transparent_12%,#000000_16%)]
            [--aurora:repeating-linear-gradient(100deg,#312e81_10%,#4f46e5_15%,#7e22ce_20%,#6366f1_25%,#818cf8_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-80 will-change-transform`,
                        showRadialGradient &&
                        `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]`
                    )}
                ></div>
            </div>
            {children}
        </div>
    );
};
