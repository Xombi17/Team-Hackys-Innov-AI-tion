/**
 * WellSync AI API Service
 * Handles communication with the FastAPI backend
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

// ============================================
// Types
// ============================================

export interface UserProfile {
    user_id: string;
    name?: string;
    age?: number;
    weight?: number;
    height?: number;
    fitness_level: string;
    goals: {
        fitness: string;
        nutrition: string;
        sleep?: string;
        mental?: string;
    };
    constraints: {
        injuries?: string[];
        equipment?: string[];
        time_available?: string;
        budget?: number;
        dietary_restrictions?: string[];
        current_sleep?: number;
        current_mood?: string;
        current_energy?: string;
        meals_skipped?: boolean;
    };
    dietary_preferences?: string[];
    health_conditions?: string[];
}

export interface WellnessPlan {
    plan_id: string;
    user_id: string;
    timestamp: string;
    plan_data: {
        fitness: Record<string, unknown>;
        nutrition: Record<string, unknown>;
        sleep: Record<string, unknown>;
        mental: Record<string, unknown>;
    };
    reasoning: string;
    meta: {
        agent_confidence: Record<string, number>;
    };
}

export interface AgentStatus {
    status: string;
    health: string;
    domain?: string;
    confidence_threshold?: number;
    type?: string;
    role?: string;
    error?: string;
}

export interface AgentsStatusResponse {
    success: boolean;
    timestamp: string;
    request_id: string;
    agents: Record<string, AgentStatus>;
    total_agents: number;
    healthy_agents: number;
    swarm_architecture: string;
}

export interface HealthStatus {
    status: "healthy" | "unhealthy";
    timestamp: string;
    version: string;
    services: {
        database: { status: string; type: string };
        redis: string;
    };
}

// ============================================
// Dashboard Types (Decision-Centric Flow)
// ============================================

export interface DailyCheckin {
    sleep_hours: number;
    meals_skipped: boolean;
    mood: "very_low" | "low" | "neutral" | "good" | "great";
    energy: "low" | "medium" | "high";
    notes?: string;
}

export interface DailyPlan {
    activity: string;
    nutrition: string;
    recovery: string;
    focus: string;
}

export interface AgentReasoning {
    agent_name: string;
    reasoning: string;
    confidence?: number;
}

export interface Explainability {
    fitness: AgentReasoning;
    nutrition: AgentReasoning;
    sleep: AgentReasoning;
    mental: AgentReasoning;
    coordinator_summary: string;
}

export interface HistoryEntry {
    date: string;
    tag: string;
    plan: DailyPlan;
    reasoning?: string;
}

export type AgentExecutionStatus = "idle" | "thinking" | "done";

export interface AgentExecutionEvent {
    agent: "FitnessAgent" | "NutritionAgent" | "SleepAgent" | "MentalAgent" | "Coordinator";
    status: AgentExecutionStatus;
    message: string;
    confidence?: number;
}

// ============================================
// API Functions
// ============================================

export async function checkHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch {
        return false;
    }
}

export async function getHealthStatus(): Promise<HealthStatus | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
}

export async function getAgentsStatus(): Promise<AgentsStatusResponse | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/agents/status`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Failed to get agents status:", error);
        return null;
    }
}

export async function generateWellnessPlan(profile: UserProfile): Promise<WellnessPlan> {
    const response = await fetch(`${API_BASE_URL}/wellness-plan`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_profile: profile,
            constraints: profile.constraints,
            goals: profile.goals,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return await response.json();
}

export async function getWellnessPlanStatus(stateId: string): Promise<Record<string, unknown> | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/wellness-plan/${stateId}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Failed to get plan status:", error);
        return null;
    }
}

export async function submitFeedback(
    stateId: string,
    feedback: Record<string, unknown>
): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/wellness-plan/${stateId}/feedback`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ feedback }),
        });
        return response.ok;
    } catch {
        return false;
    }
}

export async function getNutritionState(userId: string): Promise<Record<string, unknown> | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/nutrition/state/${userId}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Failed to get nutrition state:", error);
        return null;
    }
}

export async function triggerNutritionDecision(
    userProfile: UserProfile,
    constraints?: Record<string, unknown>
): Promise<Record<string, unknown> | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/nutrition/decision`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_profile: userProfile,
                constraints: constraints || {},
            }),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Failed to trigger nutrition decision:", error);
        return null;
    }
}

// ============================================
// Dashboard API Functions (Decision-Centric Flow)
// ============================================

export async function submitDailyCheckin(checkin: DailyCheckin): Promise<boolean> {
    // NOTE: Backend endpoint /daily-checkin does not exist yet
    // This function mocks success for frontend development
    console.warn("Daily checkin endpoint not implemented on backend, mocking success");
    return true;
}

export function getDailyPlan(planData: Record<string, unknown>): DailyPlan {
    // Extract actionable daily plan from full plan data
    const fitness = planData.fitness as Record<string, unknown> || {};
    const nutrition = planData.nutrition as Record<string, unknown> || {};
    const sleep = planData.sleep as Record<string, unknown> || {};
    const mental = planData.mental as Record<string, unknown> || {};

    return {
        activity: fitness.recommendation as string || fitness.type as string || "Light activity recommended",
        nutrition: nutrition.meal_guidance as string || nutrition.diet_type as string || "Balanced nutrition",
        recovery: sleep.recommendation as string || `Target ${sleep.target_hours || 8}h sleep`,
        focus: mental.recommendation as string || mental.focus_area as string || "Mindfulness practice"
    };
}

export async function getExplainability(planData: Record<string, unknown>): Promise<Explainability> {
    // NOTE: Backend endpoint /explainability does not exist yet
    // Extracting explainability from plan data directly

    const fitness = planData.fitness as Record<string, unknown> || {};
    const nutrition = planData.nutrition as Record<string, unknown> || {};
    const sleep = planData.sleep as Record<string, unknown> || {};
    const mental = planData.mental as Record<string, unknown> || {};

    return {
        fitness: {
            agent_name: "Fitness Agent",
            reasoning: fitness.reasoning as string || `Selected ${fitness.intensity || "moderate"} intensity based on your energy level and recovery status.`,
            confidence: 0.85
        },
        nutrition: {
            agent_name: "Nutrition Agent",
            reasoning: nutrition.reasoning as string || `Calibrated meal plan for your metabolic needs and budget constraints.`,
            confidence: 0.90
        },
        sleep: {
            agent_name: "Sleep Agent",
            reasoning: sleep.reasoning as string || "Optimized sleep schedule based on your circadian rhythm and daily commitments.",
            confidence: 0.88
        },
        mental: {
            agent_name: "Mental Agent",
            reasoning: mental.reasoning as string || `Curated mindfulness practices to manage stress and boost clarity.`,
            confidence: 0.82
        },
        coordinator_summary: planData.reasoning as string || "All agents have reached consensus on today's unified wellness strategy."
    };
}

export async function getHistory(userId: string): Promise<HistoryEntry[]> {
    // NOTE: Backend endpoint /history/<userId> does not exist yet
    // Returning mock history data for frontend development

    const today = new Date();

    return Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        return {
            date: date.toISOString().split('T')[0],
            tag: ["High Energy", "Rest Day", "Focus Flow", "Recovery"][i % 4],
            plan: {
                activity: i % 2 === 0 ? "Strength training" : "Rest day",
                nutrition: "Balanced meals planned",
                recovery: "8h sleep target",
                focus: "Morning meditation"
            }
        };
    });
}

export async function submitPlanFeedback(
    planId: string,
    accepted: boolean,
    reason?: string
): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/feedback`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                plan_id: planId,
                accepted,
                reason: reason || null
            }),
        });
        return response.ok;
    } catch {
        console.warn("Feedback endpoint not available, mocking success");
        return true;
    }
}

export async function getCompletedTasks(userId: string): Promise<string[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/plan/progress?user_id=${userId}`);
        if (!response.ok) return [];
        const data = await response.json();
        return data.completed_tasks || [];
    } catch {
        return [];
    }
}

export async function syncCompletedTasks(userId: string, tasks: string[]): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/plan/progress`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: userId, completed_tasks: tasks }),
        });
        return response.ok;
    } catch {
        return false;
    }
}

// ============================================
// Simulation API
// ============================================

export type Scenario = "optimal" | "sleep_deprived" | "busy" | "low_energy";

const SCENARIO_PROFILES: Record<Scenario, Partial<UserProfile>> = {
    optimal: {
        fitness_level: "advanced",
        goals: { fitness: "Hypertrophy", nutrition: "Surplus", sleep: "Performance", mental: "Focus" },
        constraints: { time_available: "120 minutes", current_energy: "high", current_mood: "great", current_sleep: 8 }
    },
    sleep_deprived: {
        fitness_level: "intermediate",
        goals: { fitness: "Maintenance", nutrition: "Recovery", sleep: "Restoration", mental: "Calm" },
        constraints: { time_available: "45 minutes", current_energy: "low", current_mood: "tired", current_sleep: 4 }
    },
    busy: {
        fitness_level: "intermediate",
        goals: { fitness: "Efficiency", nutrition: "Convenience", sleep: "Power Nap", mental: "De-stress" },
        constraints: { time_available: "20 minutes", current_energy: "medium", current_mood: "stressed", current_sleep: 6 }
    },
    low_energy: {
        fitness_level: "beginner",
        goals: { fitness: "Movement", nutrition: "Energy", sleep: "Catch-up", mental: "Resilience" },
        constraints: { time_available: "30 minutes", current_energy: "low", current_mood: "low", current_sleep: 7 }
    }
};

export async function runSimulation(scenario: Scenario): Promise<any> {
    const baseProfile: UserProfile = {
        user_id: `sim_${Date.now()}`,
        name: "Demo User",
        age: 30,
        weight: 70,
        height: 175,
        fitness_level: "intermediate",
        goals: { fitness: "General Health", nutrition: "Balance" },
        constraints: {}
    };

    const scenarioProfile = SCENARIO_PROFILES[scenario];
    const fullProfile = {
        ...baseProfile,
        ...scenarioProfile,
        goals: { ...baseProfile.goals, ...scenarioProfile?.goals },
        constraints: { ...baseProfile.constraints, ...scenarioProfile?.constraints }
    };

    return await generateWellnessPlan(fullProfile);
}
