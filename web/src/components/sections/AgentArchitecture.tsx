"use client";

import { useState, useRef, useCallback } from "react";
import { GiMuscleUp, GiMeal, GiNightSleep, GiMeditation, GiCircuitry } from "react-icons/gi";
import { RiMessage3Line } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";
import { NetworkBackground } from "@/components/ui/animated/NetworkBackground";

const agents = [
    { id: "fitness", name: "Fitness", icon: GiMuscleUp, color: "#3b82f6" },
    { id: "nutrition", name: "Nutrition", icon: GiMeal, color: "#22c55e" },
    { id: "sleep", name: "Sleep", icon: GiNightSleep, color: "#6366f1" },
    { id: "mental", name: "Mental", icon: GiMeditation, color: "#ec4899" },
];

const messages = [
    { from: "fitness", text: "Requesting high-intensity session." },
    { from: "sleep", text: "HRV is low. Veto on heavy lifts." },
    { from: "nutrition", text: "Adjusting macros for recovery." },
    { from: "mental", text: "Stress levels permit light activity." },
    { from: "coordinator", text: "Consensus: Recovery yoga + anti-inflammatory diet." },
];

export function AgentArchitecture() {
    const containerRef = useRef<HTMLElement>(null);
    const agentNodesRef = useRef<HTMLDivElement>(null);
    const coordinatorRef = useRef<HTMLDivElement>(null);

    const [isSimulating, setIsSimulating] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(-1);
    const [activeAgent, setActiveAgent] = useState<string | null>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    useGSAP(
        () => {
            if (!containerRef.current) return;

            // Simple fade-in for agent nodes
            const nodes = agentNodesRef.current?.querySelectorAll(".agent-node");
            if (nodes) {
                gsap.from(nodes, {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: agentNodesRef.current,
                        start: "top 85%",
                    },
                });
            }

            // Coordinator entrance
            if (coordinatorRef.current) {
                gsap.from(coordinatorRef.current, {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.6,
                    ease: "back.out(1.5)",
                    scrollTrigger: {
                        trigger: coordinatorRef.current,
                        start: "top 85%",
                    },
                });
            }
        },
        { scope: containerRef }
    );

    const runSimulation = useCallback(() => {
        if (isSimulating) return;
        setIsSimulating(true);
        setCurrentMessage(-1);
        setActiveAgent(null);

        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        const tl = gsap.timeline({
            onComplete: () => {
                setIsSimulating(false);
                setActiveAgent(null);
            },
        });

        timelineRef.current = tl;

        messages.forEach((msg, i) => {
            tl.add(() => {
                setCurrentMessage(i);
                setActiveAgent(msg.from);
            }, i * 0.8);

            // Pulse active agent
            const agentEl = agentNodesRef.current?.querySelector(`[data-agent="${msg.from}"]`);
            if (agentEl) {
                tl.to(
                    agentEl,
                    { scale: 1.15, duration: 0.15, ease: "power2.out" },
                    i * 0.8
                ).to(
                    agentEl,
                    { scale: 1, duration: 0.3, ease: "power2.out" },
                    i * 0.8 + 0.2
                );
            }

            // Coordinator pulse
            if (msg.from === "coordinator" && coordinatorRef.current) {
                tl.to(
                    coordinatorRef.current,
                    { scale: 1.1, duration: 0.2 },
                    i * 0.8
                ).to(
                    coordinatorRef.current,
                    { scale: 1, duration: 0.3 },
                    i * 0.8 + 0.3
                );
            }
        });
    }, [isSimulating]);

    return (
        <section id="architecture" className="py-16 md:py-24 bg-slate-950 relative overflow-hidden" ref={containerRef}>
            <NetworkBackground />
            <div className="absolute inset-0 bg-grid-white/[0.015] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-6">
                {/* Header - No GSAP animation to avoid button issues */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-depth-subtle">
                        Watch Agents Think
                    </h2>
                    <p className="text-slate-400 max-w-lg mx-auto mb-8">
                        Independent intelligences negotiate before a unified plan emerges.
                    </p>
                    <button
                        onClick={runSimulation}
                        disabled={isSimulating}
                        className={cn(
                            "px-6 py-3 rounded-full font-medium transition-all duration-300",
                            isSimulating
                                ? "bg-slate-800 text-slate-500 cursor-wait"
                                : "bg-brand-600 hover:bg-brand-500 text-white shadow-[0_0_30px_-10px_rgba(99,102,241,0.5)] hover:scale-105"
                        )}
                    >
                        {isSimulating ? "Simulating..." : "▶ Start Collaboration"}
                    </button>
                </div>

                {/* Agent Visualization */}
                <div className="relative">
                    <div ref={agentNodesRef} className="flex justify-center items-center gap-4 md:gap-8 flex-wrap mb-8">
                        {agents.map((agent) => (
                            <div
                                key={agent.id}
                                data-agent={agent.id}
                                className="agent-node flex flex-col items-center"
                            >
                                <div
                                    className={cn(
                                        "w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border transition-all duration-300",
                                        activeAgent === agent.id && "ring-2 ring-offset-2 ring-offset-slate-950"
                                    )}
                                    style={{
                                        backgroundColor: `${agent.color}15`,
                                        borderColor: activeAgent === agent.id ? agent.color : `${agent.color}40`,
                                        boxShadow: activeAgent === agent.id ? `0 0 25px ${agent.color}50` : "none",
                                    }}
                                >
                                    <agent.icon className="w-6 h-6 md:w-7 md:h-7" style={{ color: agent.color }} />
                                </div>
                                <p className="text-xs font-mono mt-2" style={{ color: agent.color }}>{agent.name}</p>
                            </div>
                        ))}

                        {/* Arrow */}
                        <div className="hidden md:block text-slate-600 text-2xl mx-2">→</div>

                        {/* Coordinator */}
                        <div
                            ref={coordinatorRef}
                            data-agent="coordinator"
                            className="flex flex-col items-center"
                        >
                            <div
                                className={cn(
                                    "w-16 h-16 md:w-20 md:h-20 rounded-2xl border flex items-center justify-center transition-all duration-300",
                                    activeAgent === "coordinator" && "ring-2 ring-brand-500 ring-offset-2 ring-offset-slate-950"
                                )}
                                style={{
                                    backgroundColor: "#6366f115",
                                    borderColor: activeAgent === "coordinator" ? "#6366f1" : "#6366f140",
                                    boxShadow: activeAgent === "coordinator" ? "0 0 30px rgba(99, 102, 241, 0.5)" : "none",
                                }}
                            >
                                <GiCircuitry className="w-8 h-8 md:w-10 md:h-10 text-brand-400" />
                            </div>
                            <p className="text-xs font-mono mt-2 text-brand-400">Coordinator</p>
                        </div>
                    </div>

                    {/* Message Log */}
                    <div className="max-w-md mx-auto">
                        <div className="min-h-[180px] rounded-2xl bg-slate-900/50 border border-white/5 p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                                <div className={cn(
                                    "w-2 h-2 rounded-full transition-colors",
                                    isSimulating ? "bg-green-500 animate-pulse" : "bg-slate-600"
                                )} />
                                <RiMessage3Line className="w-4 h-4 text-slate-500" />
                                <span className="text-xs font-mono text-slate-500">AGENT_COMMS_LOG</span>
                            </div>

                            <div className="space-y-2">
                                {messages.slice(0, currentMessage + 1).map((msg, i) => {
                                    const agent = agents.find(a => a.id === msg.from) || { color: "#6366f1", name: "Coordinator" };
                                    return (
                                        <div key={i} className="flex items-start gap-2 animate-fadeIn">
                                            <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: agent.color }} />
                                            <div>
                                                <span className="text-xs font-mono font-bold" style={{ color: agent.color }}>
                                                    {agent.name}:
                                                </span>
                                                <p className="text-sm text-slate-400">{msg.text}</p>
                                            </div>
                                        </div>
                                    );
                                })}

                                {currentMessage === -1 && !isSimulating && (
                                    <p className="text-sm text-slate-600 italic">Click "Start Collaboration" to see agents reason...</p>
                                )}

                                {isSimulating && currentMessage < messages.length - 1 && (
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping" />
                                        Processing...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
