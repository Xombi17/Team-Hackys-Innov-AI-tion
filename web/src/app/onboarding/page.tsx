"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { FitnessStep } from "@/components/onboarding/FitnessStep";
import { GoalsStep } from "@/components/onboarding/GoalsStep";
import { ConstraintsStep } from "@/components/onboarding/ConstraintsStep";
import { AuroraBackground } from "@/components/ui/animated/AuroraBackground";
import { NetworkBackground } from "@/components/ui/animated/NetworkBackground";
import { TbArrowRight, TbArrowLeft, TbCheck } from "react-icons/tb";
import { Loader2 } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";

const STEPS = [
    { title: "Physical Profile", description: "Your current stats" },
    { title: "Goals", description: "What you want to achieve" },
    { title: "Constraints", description: "Your limitations" },
];



export default function OnboardingPage() {
    return (
        <AuthGuard>
            <OnboardingContent />
        </AuthGuard>
    );
}

function OnboardingContent() {
    const router = useRouter();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    // Initial State
    const [profile, setProfile] = useState<Partial<UserProfile>>({
        fitness_level: "beginner",
        goals: {
            fitness: "",
            nutrition: "",
        },
        constraints: {
            equipment: [],
            injuries: [],
            time_available: "45 mins",
        },
    });

    const handleUpdate = (data: Partial<UserProfile>) => {
        setProfile((prev) => ({ ...prev, ...data }));
    };

    const handleNext = async () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            await submitProfile();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const submitProfile = async () => {
        if (!user) return;
        setLoading(true);

        console.log("Submitting profile for user:", user.id);
        console.log("Profile data:", profile);

        try {
            // Save to Supabase 'profiles' table
            const { error } = await supabase
                .from("profiles")
                .upsert({
                    id: user.id,
                    ...profile,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;

            // Redirect to dashboard
            router.push("/dashboard");
        } catch (error: any) {
            console.error("Failed to save profile:", error);
            console.error("Error details:", {
                message: error?.message,
                details: error?.details,
                hint: error?.hint,
                code: error?.code
            });
            // Show error toast here
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuroraBackground className="h-screen flex items-center justify-center p-4">
            <NetworkBackground />

            <div className="relative z-10 w-full max-w-4xl h-full max-h-screen flex flex-col justify-center p-4">
                {/* Header */}
                <div className="flex-shrink-0 mb-6 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Let's Personalize Your AI
                    </h1>
                    <p className="text-slate-400">
                        Help us understand your baseline so we can build the perfect plan.
                    </p>
                </div>

                {/* Main Card */}
                <div className="flex-shrink-0 bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
                    {/* Progress - Fixed at top of card */}
                    <div className="p-6 md:p-8 pb-0 flex-shrink-0">
                        <StepIndicator steps={STEPS} currentStep={currentStep} />
                    </div>

                    {/* Step Content - Scrollable area */}
                    <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-grow">
                        {currentStep === 0 && (
                            <FitnessStep data={profile} onUpdate={handleUpdate} />
                        )}
                        {currentStep === 1 && (
                            <GoalsStep data={profile} onUpdate={handleUpdate} />
                        )}
                        {currentStep === 2 && (
                            <ConstraintsStep data={profile} onUpdate={handleUpdate} />
                        )}
                    </div>

                    {/* Footer / Navigation - Fixed at bottom of card */}
                    <div className="p-6 md:p-8 pt-4 flex-shrink-0 border-t border-slate-800 bg-slate-950/50">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handleBack}
                                disabled={currentStep === 0 || loading}
                                className="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-white disabled:opacity-0 transition-colors"
                            >
                                <TbArrowLeft className="w-5 h-5" />
                                Back
                            </button>

                            <button
                                onClick={handleNext}
                                disabled={loading}
                                className="flex items-center gap-2 px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-full font-bold shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : currentStep === STEPS.length - 1 ? (
                                    <>
                                        Finish Setup
                                        <TbCheck className="w-5 h-5" />
                                    </>
                                ) : (
                                    <>
                                        Next Step
                                        <TbArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuroraBackground>
    );
}
