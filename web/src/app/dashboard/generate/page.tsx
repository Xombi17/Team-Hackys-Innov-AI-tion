"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateWellnessPlan, UserProfile } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { AuroraBackground } from "@/components/ui/animated/AuroraBackground";
import { NetworkBackground } from "@/components/ui/animated/NetworkBackground";
import { Brain, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GeneratePlanPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [status, setStatus] = useState<"idle" | "generating" | "success" | "error">("idle");
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        setLogs((prev) => [...prev, message]);
    };

    const handleGenerate = async () => {
        if (!user) return;
        setStatus("generating");
        setLogs([]);

        addLog("Initializing agent swarm...");

        try {
            // Fetch user profile from Supabase
            const { data: profile, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (error || !profile) {
                throw new Error("Profile not found. Please complete onboarding.");
            }

            // Construct full UserProfile object
            const fullProfile: UserProfile = {
                user_id: user.id,
                fitness_level: profile.fitness_level,
                goals: profile.goals,
                constraints: profile.constraints,
                // Use optional chaining or defaults if columns might be null
                age: profile.age,
                weight: profile.weight,
                height: profile.height,
            };

            // Simulate agent steps for UX (since the real API might be fast or silent)
            setTimeout(() => addLog("FitnessAgent: Analyzing user constraints..."), 1000);
            setTimeout(() => addLog("NutritionAgent: Calculating metabolic needs..."), 2000);
            setTimeout(() => addLog("SleepAgent: Optimizing circadian rhythm..."), 3000);
            setTimeout(() => addLog("Coordinator: Synthesizing final plan..."), 4500);

            // Call Real API
            const plan = await generateWellnessPlan(fullProfile);

            // Save plan to Supabase
            const { error: saveError } = await supabase
                .from("profiles")
                .update({
                    current_plan: plan,
                    updated_at: new Date().toISOString()
                })
                .eq("id", user.id);

            if (saveError) throw saveError;

            setTimeout(() => {
                setStatus("success");
                addLog("Plan generated successfully!");
            }, 1000);

        } catch (error) {
            console.error("Generation failed:", error);
            setStatus("error");
            addLog("Error: " + (error as Error).message);
        }
    };

    if (status === "success") {
        return (
            <AuroraBackground className="min-h-screen flex items-center justify-center p-4">
                <NetworkBackground />
                <div className="relative z-10 text-center bg-slate-950/80 backdrop-blur-xl border border-brand-500/30 p-12 rounded-3xl shadow-2xl max-w-lg w-full">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-10 h-10 text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">Plan Ready!</h1>
                    <p className="text-slate-400 mb-8">
                        Your personalized wellness ecosystem has been architected by the swarm.
                    </p>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="px-8 py-3 bg-white text-slate-900 rounded-full font-bold hover:scale-105 transition-transform"
                    >
                        View Dashboard
                    </button>
                </div>
            </AuroraBackground>
        );
    }

    return (
        <AuroraBackground className="min-h-screen flex items-center justify-center p-4">
            <NetworkBackground />

            <div className="relative z-10 w-full max-w-2xl">
                <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500/10 mb-4">
                            <Brain className={cn("w-8 h-8 text-brand-400", status === "generating" && "animate-pulse")} />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            {status === "generating" ? "Agents Working..." : "Generate New Plan"}
                        </h1>
                        <p className="text-slate-400">
                            {status === "generating"
                                ? "Orchestrating specialized intelligences to build your optimal routine."
                                : "Trigger the swarm to analyze your data and build a comprehensive wellness strategy."}
                        </p>
                    </div>

                    {status === "idle" && (
                        <div className="flex justify-center">
                            <button
                                onClick={handleGenerate}
                                className="group relative px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-full font-bold shadow-[0_0_30px_-5px_rgba(99,102,241,0.6)] hover:scale-105 transition-all"
                            >
                                <span className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Generate Plan Now
                                </span>
                            </button>
                        </div>
                    )}

                    {status === "generating" && (
                        <div className="space-y-4">
                            <div className="h-64 bg-slate-900/50 rounded-xl border border-slate-800 p-4 font-mono text-sm overflow-y-auto">
                                {logs.map((log, i) => (
                                    <div key={i} className="mb-2 flex items-start gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <span className="text-brand-500">➜</span>
                                        <span className={cn(
                                            "text-slate-300",
                                            log.includes("FitnessAgent") && "text-blue-400",
                                            log.includes("NutritionAgent") && "text-green-400",
                                            log.includes("SleepAgent") && "text-purple-400",
                                            log.includes("Coordinator") && "text-yellow-400 font-bold",
                                            log.includes("Error") && "text-red-400",
                                        )}>
                                            {log}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex items-center gap-2 text-slate-500 mt-4 animate-pulse">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    <span>Processing...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 text-red-400 bg-red-500/10 px-4 py-2 rounded-lg mb-6">
                                <AlertTriangle className="w-5 h-5" />
                                <span>Generation Failed</span>
                            </div>
                            <button
                                onClick={() => setStatus("idle")}
                                className="text-sm text-slate-400 hover:text-white underline"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AuroraBackground>
    );
}
