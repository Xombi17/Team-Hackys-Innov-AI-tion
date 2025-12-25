"use client";

import { useRef } from "react";
import { GiMuscleUp, GiMeal, GiNightSleep, GiMeditation, GiCircuitry } from "react-icons/gi";
import { useGSAP, gsap } from "@/lib/gsap";
import { NetworkBackground } from "@/components/ui/animated/NetworkBackground";

const agents = [
    { id: "fitness", name: "Fitness", icon: GiMuscleUp, color: "#3b82f6", x: 100, y: 100 },
    { id: "nutrition", name: "Nutrition", icon: GiMeal, color: "#22c55e", x: 500, y: 100 },
    { id: "sleep", name: "Sleep", icon: GiNightSleep, color: "#8b5cf6", x: 100, y: 280 },
    { id: "mental", name: "Mental", icon: GiMeditation, color: "#ec4899", x: 500, y: 280 },
];

const coordinator = { x: 300, y: 190 };

export function AgentNetworkSVG() {
    const containerRef = useRef<HTMLElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useGSAP(
        () => {
            if (!svgRef.current || !containerRef.current) return;

            const paths = svgRef.current.querySelectorAll(".connection-path");
            const agentNodes = svgRef.current.querySelectorAll(".agent-node");
            const coordinatorNode = svgRef.current.querySelector(".coordinator-node");
            const consensusBox = svgRef.current.querySelector(".consensus-box");

            // Set initial states
            paths.forEach((path) => {
                const pathEl = path as SVGPathElement;
                const length = pathEl.getTotalLength();
                gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
            });
            gsap.set(agentNodes, { scale: 0, opacity: 0 });
            gsap.set(coordinatorNode, { scale: 0, opacity: 0 });
            gsap.set(consensusBox, { opacity: 0, y: 15 });

            // Scroll-triggered animation timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                    end: "center 40%",
                    scrub: 0.8,
                },
            });

            // 1. Agents appear
            tl.to(agentNodes, {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: "back.out(1.5)",
            });

            // 2. Coordinator appears
            tl.to(coordinatorNode, {
                scale: 1,
                opacity: 1,
                duration: 0.4,
                ease: "back.out(1.5)",
            }, "-=0.3");

            // 3. Draw connection paths
            tl.to(paths, {
                strokeDashoffset: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.inOut",
            }, "-=0.2");

            // 4. Consensus box fades in
            tl.to(consensusBox, {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
            }, "-=0.1");
        },
        { scope: containerRef }
    );

    return (
        <section
            ref={containerRef}
            id="agent-network"
            className="py-20 md:py-24 bg-slate-950 relative overflow-hidden"
        >
            <NetworkBackground />
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-depth-subtle">
                        Agent Network
                    </h2>
                    <p className="text-slate-400 max-w-lg mx-auto">
                        Scroll to see how agents connect and negotiate.
                    </p>
                </div>

                <div className="relative w-full max-w-3xl mx-auto">
                    <svg
                        ref={svgRef}
                        viewBox="0 0 600 380"
                        className="w-full h-auto"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <defs>
                            <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Connection lines */}
                        {agents.map((agent) => (
                            <line
                                key={`path-${agent.id}`}
                                className="connection-path"
                                x1={agent.x}
                                y1={agent.y}
                                x2={coordinator.x}
                                y2={coordinator.y}
                                stroke={agent.color}
                                strokeWidth="2"
                                strokeOpacity="0.6"
                            />
                        ))}

                        {/* Agent nodes */}
                        {agents.map((agent) => (
                            <g
                                key={agent.id}
                                className="agent-node"
                                style={{ transformOrigin: `${agent.x}px ${agent.y}px` }}
                            >
                                <circle
                                    cx={agent.x}
                                    cy={agent.y}
                                    r="32"
                                    fill="#0f172a"
                                    stroke={agent.color}
                                    strokeWidth="2"
                                    filter="url(#node-glow)"
                                />
                                <foreignObject x={agent.x - 12} y={agent.y - 12} width="24" height="24">
                                    <div className="w-full h-full flex items-center justify-center">
                                        <agent.icon className="w-5 h-5" style={{ color: agent.color }} />
                                    </div>
                                </foreignObject>
                                <text
                                    x={agent.x}
                                    y={agent.y + 50}
                                    textAnchor="middle"
                                    fontSize="11"
                                    fill={agent.color}
                                    fontFamily="monospace"
                                    fontWeight="600"
                                >
                                    {agent.name}
                                </text>
                            </g>
                        ))}

                        {/* Coordinator */}
                        <g
                            className="coordinator-node"
                            style={{ transformOrigin: `${coordinator.x}px ${coordinator.y}px` }}
                        >
                            <circle
                                cx={coordinator.x}
                                cy={coordinator.y}
                                r="40"
                                fill="#0f172a"
                                stroke="#6366f1"
                                strokeWidth="3"
                                filter="url(#node-glow)"
                            />
                            <foreignObject x={coordinator.x - 14} y={coordinator.y - 14} width="28" height="28">
                                <div className="w-full h-full flex items-center justify-center">
                                    <GiCircuitry className="w-6 h-6 text-brand-400" />
                                </div>
                            </foreignObject>
                            <text
                                x={coordinator.x}
                                y={coordinator.y + 58}
                                textAnchor="middle"
                                fontSize="11"
                                fill="#6366f1"
                                fontFamily="monospace"
                                fontWeight="600"
                            >
                                Coordinator
                            </text>
                        </g>

                        {/* Consensus result */}
                        <g className="consensus-box">
                            <rect
                                x={coordinator.x - 100}
                                y={320}
                                width="200"
                                height="32"
                                rx="16"
                                fill="#22c55e10"
                                stroke="#22c55e"
                                strokeWidth="1.5"
                            />
                            <text
                                x={coordinator.x}
                                y={340}
                                textAnchor="middle"
                                fontSize="11"
                                fill="#22c55e"
                                fontFamily="monospace"
                                fontWeight="bold"
                            >
                                ✓ Consensus: Recovery yoga
                            </text>
                        </g>
                    </svg>
                </div>

            </div>
        </section>
    );
}
