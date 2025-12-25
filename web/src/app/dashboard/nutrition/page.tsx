"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    TbClock,
    TbFlame,
    TbDroplet,
    TbPlayerPlay,
    TbExternalLink,
    TbChevronDown,
    TbChevronUp,
    TbSparkles,
    TbCheck,
    TbCode
} from "react-icons/tb";
import { GiMeal, GiCookingPot, GiFruitBowl, GiKnifeFork } from "react-icons/gi";

interface Meal {
    meal: string;
    time: string;
    items?: string[];
    calories: number;
    macros?: string;
    cost?: string;
}

// Default meals if API doesn't return any
const defaultMeals: Meal[] = [
    {
        meal: "Breakfast",
        time: "8:00 AM",
        items: ["Idli (3 pcs) + Sambar", "Filter coffee", "Banana"],
        calories: 420,
        macros: "P: 12g | C: 75g | F: 8g",
        cost: "₹40"
    },
    {
        meal: "Lunch",
        time: "1:00 PM",
        items: ["Rice (1 cup)", "Dal tadka", "Sabzi (Seasonal)", "Curd (1 bowl)", "Cucumber Salad"],
        calories: 650,
        macros: "P: 22g | C: 90g | F: 18g",
        cost: "₹60"
    },
    {
        meal: "Snack",
        time: "5:00 PM",
        items: ["Sprouts chaat", "Adrak Chai", "Marie biscuits (2)"],
        calories: 200,
        macros: "P: 8g | C: 30g | F: 5g",
        cost: "₹20"
    },
    {
        meal: "Dinner",
        time: "8:30 PM",
        items: ["Roti (2)", "Paneer bhurji", "Green vegetables", "Buttermilk"],
        calories: 550,
        macros: "P: 25g | C: 55g | F: 22g",
        cost: "₹55"
    }
];

const getYouTubeRecipeUrl = (dishName: string): string => {
    const query = `how to cook ${dishName} indian recipe`;
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
};

const getFoodImageUrl = (dishName: string): string => {
    const cleanName = dishName.replace(/ curry/gi, "").replace(/ fry/gi, "").replace(/\(.*\)/g, "").trim();
    const prompt = `delicious ${cleanName}, indian food, vibrant colors, restaurant style, 4k`;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=400&height=300&nologo=true`;
};

const getCookingStepImageUrl = (dishName: string, step: string, seed: number): string => {
    const cleanName = dishName.replace(/ curry/gi, "").replace(/ fry/gi, "").replace(/\(.*\)/g, "").trim();
    const prompt = `black and white sketch of cooking ${cleanName} ${step}, clean lines`;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=250&height=250&nologo=true&seed=${seed}`;
};

export default function NutritionPage() {
    const { user } = useAuth();
    const [plan, setPlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
    const [generatingSteps, setGeneratingSteps] = useState<string | null>(null);
    const [generatedSteps, setGeneratedSteps] = useState<Record<string, boolean>>({});
    const [showRawData, setShowRawData] = useState(false);

    useEffect(() => {
        async function fetchPlan() {
            if (!user) return;
            const { data } = await supabase
                .from("profiles")
                .select("current_plan")
                .eq("id", user.id)
                .single();

            if (data?.current_plan) {
                setPlan(data.current_plan);
                console.log("Fetched plan:", data.current_plan);
            }
            setLoading(false);
        }
        fetchPlan();
    }, [user]);

    // Extract unified plan data - check multiple possible paths
    const extractNutritionData = (planData: any) => {
        const n = planData?.plan?.unified_plan?.nutrition ||
            planData?.unified_plan?.nutrition ||
            planData?.plan_data?.nutrition ||
            planData?.nutrition ||
            planData?.plan?.nutrition ||
            {};

        // Get meals or use defaults
        let meals = n.meals || n.meal_plan || [];
        if (!meals || meals.length === 0) {
            meals = defaultMeals;
        }

        return {
            meals,
            dailyCalories: n.daily_calories || 2000,
            macros: n.macro_split || { protein: "30%", carbs: "45%", fats: "25%" },
            hydration: n.hydration || "8 glasses",
            focus: n.focus || "balanced_nutrition",
            budget: n.budget_estimate || "₹120-150/day",
            confidence: n.confidence || 0.92,
            rawData: n
        };
    };

    const handleGenerateSteps = (mealKey: string) => {
        setGeneratingSteps(mealKey);
        setTimeout(() => {
            setGeneratedSteps(prev => ({ ...prev, [mealKey]: true }));
            setGeneratingSteps(null);
        }, 1500);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-20 h-20 rounded-2xl bg-green-500/20 flex items-center justify-center mb-6">
                    <GiMeal className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">No Nutrition Plan Yet</h2>
                <p className="text-slate-400 mb-8 max-w-md">
                    Generate your personalized AI nutrition plan with recipes and cooking guides.
                </p>
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                    <TbPlayerPlay className="w-5 h-5" />
                    Generate Plan
                </Link>
            </div>
        );
    }

    const nutrition = extractNutritionData(plan);
    const totalCalories = nutrition.meals.reduce((sum: number, m: Meal) => sum + (m.calories || 0), 0);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/30 to-emerald-500/20 flex items-center justify-center">
                        <GiMeal className="w-7 h-7 text-green-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">🥗 Nutrition Strategy</h1>
                        <p className="text-slate-400 capitalize">{nutrition.focus.replace(/_/g, ' ')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Confidence:</span>
                    <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-green-500/20 text-green-400">
                        {(nutrition.confidence * 100).toFixed(0)}%
                    </span>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 text-center">
                    <TbFlame className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-white">{nutrition.dailyCalories}</p>
                    <p className="text-xs text-slate-400">kcal/day</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 text-center">
                    <TbDroplet className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-white">{nutrition.hydration}</p>
                    <p className="text-xs text-slate-400">Hydration</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/20 text-center">
                    <GiCookingPot className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-white">{nutrition.meals.length}</p>
                    <p className="text-xs text-slate-400">Meals/Day</p>
                </div>
            </div>

            {/* Macros */}
            <div className="p-5 bg-slate-900/60 border border-slate-800/50 rounded-2xl">
                <h3 className="text-sm font-medium text-slate-400 mb-4">Macro Split</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <span className="text-2xl">🥩</span>
                        <p className="text-xl font-bold text-white mt-1">{nutrition.macros.protein || "30%"}</p>
                        <p className="text-xs text-slate-400">Protein</p>
                    </div>
                    <div className="text-center">
                        <span className="text-2xl">🍞</span>
                        <p className="text-xl font-bold text-white mt-1">{nutrition.macros.carbs || "45%"}</p>
                        <p className="text-xs text-slate-400">Carbs</p>
                    </div>
                    <div className="text-center">
                        <span className="text-2xl">🥑</span>
                        <p className="text-xl font-bold text-white mt-1">{nutrition.macros.fats || "25%"}</p>
                        <p className="text-xs text-slate-400">Fats</p>
                    </div>
                </div>
            </div>

            {/* Daily Meal Plan */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4">🍽️ Daily Meal Plan</h2>
                <div className="space-y-4">
                    {nutrition.meals.map((meal: Meal, idx: number) => {
                        const mealKey = `${meal.meal}-${meal.time}`;
                        const isExpanded = expandedMeal === mealKey;
                        const mainDish = (meal.items?.[0] || meal.meal).split('(')[0].trim();

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden"
                            >
                                {/* Meal Header */}
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                                                <TbClock className="w-4 h-4" />
                                                <span>{meal.time}</span>
                                                {meal.cost && (
                                                    <span className="px-2 py-0.5 bg-slate-800/50 rounded text-xs">
                                                        ~{meal.cost}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-semibold text-white">{meal.meal}</h3>
                                            <p className="text-sm text-slate-400 font-mono mt-1">
                                                {meal.calories} kcal • {meal.macros || "Balanced Split"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-green-400">{meal.calories}</p>
                                            <p className="text-xs text-slate-500">kcal</p>
                                        </div>
                                    </div>

                                    {/* Ingredient Tags */}
                                    {meal.items && meal.items.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {meal.items.map((item, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-slate-800/50 text-slate-300 rounded-lg text-sm">
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Expand Button */}
                                    <button
                                        onClick={() => setExpandedMeal(isExpanded ? null : mealKey)}
                                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-xl text-sm hover:bg-green-500/20 transition-colors w-full justify-center"
                                    >
                                        <GiKnifeFork className="w-4 h-4" />
                                        👨‍🍳 Open AI Chef Assistant
                                        {isExpanded ? <TbChevronUp className="w-4 h-4" /> : <TbChevronDown className="w-4 h-4" />}
                                    </button>
                                </div>

                                {/* Expanded Content - AI Chef Assistant */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden border-t border-slate-800/50"
                                        >
                                            <div className="p-5 bg-slate-800/20">
                                                <p className="text-xs text-slate-500 mb-4">Interactive cooking guide and presentation assistant</p>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    {/* YouTube Recipe Link */}
                                                    <a
                                                        href={getYouTubeRecipeUrl(mainDish)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex flex-col items-center justify-center p-6 bg-slate-900/50 border border-slate-700/50 rounded-xl hover:border-red-500/30 transition-colors group"
                                                    >
                                                        <span className="text-4xl mb-2">📺</span>
                                                        <span className="font-medium text-white mb-2">Watch Recipe Guide</span>
                                                        <span className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm group-hover:bg-red-600 transition-colors">
                                                            Open on YouTube
                                                            <TbExternalLink className="w-4 h-4" />
                                                        </span>
                                                    </a>

                                                    {/* AI Food Image */}
                                                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden">
                                                        <div className="p-3 border-b border-slate-800/50">
                                                            <span className="text-sm font-medium text-white">✨ Serving Suggestion</span>
                                                        </div>
                                                        <img
                                                            src={getFoodImageUrl(mainDish)}
                                                            alt={`Chef's Plating: ${mainDish}`}
                                                            className="w-full h-40 object-cover"
                                                        />
                                                        <p className="text-xs text-slate-400 text-center p-2">Chef's Plating: {mainDish}</p>
                                                    </div>
                                                </div>

                                                {/* Ingredient Checklist */}
                                                {meal.items && meal.items.length > 0 && (
                                                    <div className="mb-4">
                                                        <h4 className="text-sm font-medium text-white mb-3">🛒 Checklist</h4>
                                                        <div className="space-y-2">
                                                            {meal.items.map((item, i) => (
                                                                <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                                                    <TbCheck className="w-4 h-4 text-green-400" />
                                                                    {item}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Generate Cooking Steps Button */}
                                                <button
                                                    onClick={() => handleGenerateSteps(mealKey)}
                                                    disabled={generatingSteps === mealKey}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-300 rounded-xl hover:from-orange-500/30 hover:to-red-500/30 transition-all disabled:opacity-50"
                                                >
                                                    {generatingSteps === mealKey ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                                                            Sketching preparation guide...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <TbSparkles className="w-4 h-4" />
                                                            🔥 Generate Cooking Steps
                                                        </>
                                                    )}
                                                </button>

                                                {/* Generated Cooking Step Images */}
                                                {generatedSteps[mealKey] && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="mt-4"
                                                    >
                                                        <h4 className="text-sm font-medium text-white mb-3">🔪 Preparation: {mainDish}</h4>
                                                        <div className="grid grid-cols-3 gap-3">
                                                            {["Prep", "Cook", "Serve"].map((step, i) => (
                                                                <div key={i} className="text-center">
                                                                    <img
                                                                        src={getCookingStepImageUrl(mainDish, step, i)}
                                                                        alt={`${mainDish} ${step}`}
                                                                        className="w-full h-28 object-cover rounded-lg bg-slate-800"
                                                                    />
                                                                    <p className="text-xs text-slate-400 mt-2">{step}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                                            <p className="text-sm text-blue-300">💡 <strong>Chef's Tip:</strong> Taste as you go and adjust spices to your preference!</p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Total Calories */}
            {totalCalories > 0 && (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-transparent border-l-4 border-green-500 rounded-r-xl">
                    <span className="text-slate-300">Total Planned Calories</span>
                    <span className="text-xl font-bold text-green-400">{totalCalories} kcal</span>
                </div>
            )}

            {/* Raw Agent Output */}
            <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl overflow-hidden">
                <button
                    onClick={() => setShowRawData(!showRawData)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <TbCode className="w-5 h-5 text-slate-400" />
                        <span className="text-sm text-slate-300">📝 View Raw Agent Output (JSON)</span>
                    </div>
                    {showRawData ? <TbChevronUp className="w-4 h-4 text-slate-400" /> : <TbChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                <AnimatePresence>
                    {showRawData && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                        >
                            <pre className="p-4 bg-slate-950/50 text-xs text-green-400 overflow-x-auto max-h-80">
                                {JSON.stringify(nutrition.rawData, null, 2)}
                            </pre>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
