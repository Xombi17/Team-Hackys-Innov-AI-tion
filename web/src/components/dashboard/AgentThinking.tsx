"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const agents = [
    { id: "coordinator", name: "Coordinator", image: "/avatars/coordinator.png", color: "border-indigo-500", shadow: "shadow-indigo-500/50" },
    { id: "fitness", name: "Fitness Agent", image: "/avatars/fitness.png", color: "border-blue-500", shadow: "shadow-blue-500/50" },
    { id: "nutrition", name: "Nutrition Agent", image: "/avatars/nutrition.png", color: "border-green-500", shadow: "shadow-green-500/50" },
    { id: "sleep", name: "Sleep Agent", image: "/avatars/sleep.png", color: "border-purple-500", shadow: "shadow-purple-500/50" },
    { id: "mental", name: "Mental Wellness", image: "/avatars/mental.png", color: "border-pink-500", shadow: "shadow-pink-500/50" },
];

const thoughts = [
    "Coordinator is analyzing your profile...",
    "Fitness Agent is designing your workout...",
    "Nutrition Agent is calculating macros...",
    "Sleep Agent is optimizing recovery windows...",
    "Mental Agent is curating mindfulness exercises...",
    "Coordinator is synthesizing the final plan...",
    "Finalizing your personalized schedule..."
];

export default function AgentThinking() {
    const [activeAgent, setActiveAgent] = useState(0);
    const [thoughtIndex, setThoughtIndex] = useState(0);

    useEffect(() => {
        // Cycle through agents rapidly
        const agentInterval = setInterval(() => {
            setActiveAgent((prev) => (prev + 1) % agents.length);
        }, 800);

        // Cycle through thoughts slower
        const thoughtInterval = setInterval(() => {
            setThoughtIndex((prev) => (prev < thoughts.length - 1 ? prev + 1 : prev));
        }, 1500);

        return () => {
            clearInterval(agentInterval);
            clearInterval(thoughtInterval);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-2xl mx-auto p-8">

            {/* Agents Circle */}
            <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                {agents.map((agent, index) => {
                    const isActive = index === activeAgent;
                    const angle = (index * 360) / agents.length;
                    const radius = 100; // Distance from center
                    const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
                    const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;

                    return (
                        <motion.div
                            key={agent.id}
                            className={cn(
                                "absolute w-16 h-16 rounded-full border-2 bg-slate-900/10 backdrop-blur-md p-1 transition-all duration-500",
                                isActive ? `scale-125 border-4 ${agent.color} ${agent.shadow} shadow-lg z-10` : "border-white/20 opacity-50 grayscale"
                            )}
                            style={{
                                transform: `translate(${x}px, ${y}px)`,
                            }}
                            animate={{ x, y, scale: isActive ? 1.3 : 1 }}
                        >
                            <div className="relative w-full h-full rounded-full overflow-hidden bg-black/20">
                                <Image
                                    src={agent.image}
                                    alt={agent.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>
                    );
                })}

                {/* Center Pulse */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-brand-500/20 blur-3xl animate-pulse" />
                    <motion.div
                        key={activeAgent}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <span className="text-4xl font-bold text-slate-300 opacity-20">AI</span>
                    </motion.div>
                </div>
            </div>

            {/* Thinking Text */}
            <div className="space-y-4 text-center max-w-md">
                <motion.div
                    key={thoughtIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="h-16"
                >
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-violet-600">
                        {thoughts[thoughtIndex]}
                    </h3>
                </motion.div>

                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-brand-600"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 10, ease: "linear" }}
                    />
                </div>
            </div>

        </div>
    );
}
