import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.warn(
        "Supabase environment variables not set. Authentication will not work. " +
        "Please set NEXT_PUBLIC_SUPABASE_URL and either NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY in .env.local"
    );
}

export const supabase = createClient(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseKey || "placeholder-key"
);

// Helper functions for auth
export async function signInWithEmail(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string) {
    const redirectTo = typeof window !== 'undefined'
        ? `${window.location.origin}/onboarding`
        : undefined;

    return supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: redirectTo
        }
    });
}

export async function signOut() {
    return supabase.auth.signOut();
}

export async function getSession() {
    return supabase.auth.getSession();
}

export async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}
