"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isCheckingProfile, setIsCheckingProfile] = useState(true);

    // 1. Basic Auth Check
    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // 2. Profile / Onboarding Check
    useEffect(() => {
        let mounted = true;

        async function checkProfile() {
            if (!user) {
                // If no user, the first useEffect handles redirect. 
                // We just stop checking profile.
                if (mounted) setIsCheckingProfile(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("id")
                    .eq("id", user.id)
                    .maybeSingle();

                if (mounted) {
                    // Profile missing? Redirect to onboarding (unless already there)
                    if ((!data || error)) {
                        if (!pathname.startsWith("/onboarding")) {
                            router.replace("/onboarding");
                        }
                    }
                    // Profile exists? If trying to access onboarding, redirect to dashboard?
                    // Optional: Prevent users from re-doing onboarding if they have a profile.
                    // For now, let's just ensure they DON'T get stuck in onboarding if they have a profile.
                    // Actually, let's keep it simple: Ensure profile exists.

                    setIsCheckingProfile(false);
                }
            } catch (e) {
                console.error("Profile check failed", e);
                if (mounted) setIsCheckingProfile(false);
            }
        }

        if (!loading) {
            checkProfile();
        }

        return () => { mounted = false; };
    }, [user, loading, router, pathname]);

    // Show loader while:
    // 1. Auth is initialising from Supabase (loading)
    // 2. We are verifying if the user has a profile (isCheckingProfile), BUT only if user is logged in.
    if (loading || (user && isCheckingProfile)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
        );
    }

    // If not authenticated, render null (redirect happens in useEffect)
    if (!user) {
        return null;
    }

    return <>{children}</>;
}
