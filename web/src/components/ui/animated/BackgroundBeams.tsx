"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Beam {
    top: string;
    left: string;
    duration: number;
    delay: number;
    repeatDelay: number;
    width: string;
    height: string;
    colorClass: string;
}

interface Particle {
    top: string;
    left: string;
    duration: number;
    delay: number;
    size: number;
}

export const BackgroundBeams = ({ className }: { className?: string }) => {
    const [beams, setBeams] = useState<Beam[]>([]);
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        // Generate Thicker, Brighter Beams
        const newBeams = Array.from({ length: 8 }).map((_, i) => ({
            top: "-20%",
            left: `${5 + i * 12}%`, // More distributed
            duration: 4 + Math.random() * 4, // Faster
            delay: Math.random() * 5,
            repeatDelay: Math.random() * 2,
            width: Math.random() > 0.5 ? "2px" : "4px", // Thicker
            height: `${40 + Math.random() * 40}vh`, // Longer
            colorClass: i % 2 === 0 ? "via-indigo-400" : "via-brand-400", // Brighter (removed opacity slash)
        }));
        setBeams(newBeams);

        // Generate Floating Particles
        const newParticles = Array.from({ length: 25 }).map(() => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            duration: 10 + Math.random() * 10,
            delay: Math.random() * 5,
            size: 1 + Math.random() * 3,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div
            className={cn(
                "absolute inset-0 z-0 h-full w-full overflow-hidden bg-slate-950",
                className
            )}
        >
            <div className="absolute h-full w-full [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

            {/* Pulsing Core - Enhanced */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/30 blur-[120px]"
            />

            {/* Rotating Gradients */}
            <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute left-1/2 top-1/2 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-indigo-500/20 via-transparent to-purple-500/20 blur-[90px]"
            />
            <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
                className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-bl from-cyan-500/10 via-transparent to-brand-500/10 blur-[70px]"
            />

            {/* Moving Grid */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            {/* Particles Layer (The "Something Else") */}
            {particles.map((p, i) => (
                <motion.div
                    key={`p-${i}`}
                    initial={{ top: p.top, left: p.left, opacity: 0, scale: 0 }}
                    animate={{
                        top: [p.top, `${parseFloat(p.top) - 10}%`], // Float Up
                        opacity: [0, 0.6, 0],
                        scale: [0, 1, 0]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: p.delay
                    }}
                    style={{ width: p.size, height: p.size }}
                    className="absolute rounded-full bg-white/20 blur-[1px]"
                />
            ))}

            {/* Enhanced Vertical Beams */}
            <div className="absolute inset-0 overflow-hidden">
                {beams.map((beam, i) => (
                    <motion.div
                        key={i}
                        initial={{ top: beam.top, left: beam.left, opacity: 0 }}
                        animate={{
                            top: "120%",
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: beam.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: beam.delay,
                            repeatDelay: beam.repeatDelay
                        }}
                        style={{
                            width: beam.width,
                            height: beam.height
                        }}
                        className={cn(
                            "absolute bg-gradient-to-b from-transparent to-transparent",
                            beam.colorClass
                        )}
                    />
                ))}
            </div>
        </div>
    );
};
