"use client";

import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
} from "recharts";

interface WellnessRadarProps {
    sleepScore: number;
    nutritionScore: number;
    fitnessScore: number;
    mentalScore: number;
}

export function WellnessRadar({
    sleepScore,
    nutritionScore,
    fitnessScore,
    mentalScore,
}: WellnessRadarProps) {
    const data = [
        { subject: "Sleep", A: sleepScore, fullMark: 100 },
        { subject: "Nutrition", A: nutritionScore, fullMark: 100 },
        { subject: "Fitness", A: fitnessScore, fullMark: 100 },
        { subject: "Mental", A: mentalScore, fullMark: 100 },
    ];

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                    />
                    <Radar
                        name="Wellness"
                        dataKey="A"
                        stroke="#818cf8"
                        strokeWidth={2}
                        fill="#818cf8"
                        fillOpacity={0.3}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
