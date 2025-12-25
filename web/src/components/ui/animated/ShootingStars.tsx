"use client";
import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

export const ShootingStars = ({
    minDelay = 4500,
    maxDelay = 9000,
    minSpeed = 10,
    maxSpeed = 30,
    starColor = "#9E00FF",
    trailColor = "#2EB9DF",
    starWidth = 10,
    starHeight = 1,
    className,
}: {
    minDelay?: number;
    maxDelay?: number;
    minSpeed?: number;
    maxSpeed?: number;
    starColor?: string;
    trailColor?: string;
    starWidth?: number;
    starHeight?: number;
    className?: string;
}) => {
    const [star, setStar] = useState<{ x: number; y: number; angle: number; scale: number; speed: number; distance: number } | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const createStar = () => {
            const { innerWidth, innerHeight } = window;
            const x = Math.random() * innerWidth;
            const y = 0;
            const angle = 45;
            const scale = 1 + Math.random();
            const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
            const distance = 0;

            setStar({ x, y, angle, scale, speed, distance });

            const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
            setTimeout(createStar, randomDelay);
        };

        createStar();
    }, [minDelay, maxDelay, minSpeed, maxSpeed]);

    useEffect(() => {
        const moveStar = () => {
            if (star) {
                setStar((prevStar) => {
                    if (!prevStar) return null;
                    const newX = prevStar.x - prevStar.speed * Math.cos((prevStar.angle * Math.PI) / 180);
                    const newY = prevStar.y + prevStar.speed * Math.sin((prevStar.angle * Math.PI) / 180);
                    const newDistance = prevStar.distance + prevStar.speed;
                    const scale = 1 + newDistance / 100;

                    if (newX < -20 || newX > window.innerWidth + 20 || newY > window.innerHeight + 20) {
                        return null;
                    }

                    return {
                        ...prevStar,
                        x: newX,
                        y: newY,
                        distance: newDistance,
                        scale,
                    };
                });
            }
        };

        const animationFrame = requestAnimationFrame(moveStar);
        return () => cancelAnimationFrame(animationFrame);
    }, [star]);

    return (
        <svg ref={svgRef} className={cn("w-full h-full absolute inset-0 z-0 pointer-events-none", className)}>
            {star && (
                <rect
                    key={star.distance}
                    x={star.x}
                    y={star.y}
                    width={starWidth * star.scale}
                    height={starHeight}
                    fill="url(#gradient)"
                    transform={`rotate(${star.angle}, ${star.x + (starWidth * star.scale) / 2}, ${star.y + starHeight / 2})`}
                />
            )}
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: trailColor, stopOpacity: 0 }} />
                    <stop offset="100%" style={{ stopColor: starColor, stopOpacity: 1 }} />
                </linearGradient>
            </defs>
        </svg>
    );
};

export const StarsBackground = ({
    starDensity = 0.00015,
    allStarsTwinkle = true,
    twinkleProbability = 0.7,
    minTwinkleSpeed = 0.5,
    maxTwinkleSpeed = 1,
    className,
}: {
    starDensity?: number;
    allStarsTwinkle?: boolean;
    twinkleProbability?: number;
    minTwinkleSpeed?: number;
    maxTwinkleSpeed?: number;
    className?: string;
}) => {
    const [stars, setStars] = useState<any[]>([]);

    useEffect(() => {
        const generateStars = () => {
            const { innerWidth, innerHeight } = window;
            const starCount = Math.floor(innerWidth * innerHeight * starDensity);
            const newStars = Array.from({ length: starCount }, () => ({
                x: Math.random() * 100,
                y: Math.random() * 100,
                radius: Math.random() * 1.5 + 0.5,
                opacity: Math.random(),
                twinkleSpeed: Math.random() * (maxTwinkleSpeed - minTwinkleSpeed) + minTwinkleSpeed,
                doesTwinkle: allStarsTwinkle || Math.random() < twinkleProbability,
            }));
            setStars(newStars);
        };

        generateStars();
        window.addEventListener("resize", generateStars);
        return () => window.removeEventListener("resize", generateStars);
    }, [starDensity, allStarsTwinkle, twinkleProbability, minTwinkleSpeed, maxTwinkleSpeed]);

    return (
        <div className={cn("absolute inset-0 w-full h-full", className)}>
            <svg className="w-full h-full">
                {stars.map((star, i) => (
                    <circle
                        key={i}
                        cx={`${star.x}%`}
                        cy={`${star.y}%`}
                        r={star.radius}
                        fill="white"
                        className={cn("animate-twinkle", star.doesTwinkle ? "animate-pulse" : "")}
                        style={{
                            opacity: star.opacity,
                            animationDuration: `${star.twinkleSpeed}s`,
                        }}
                    />
                ))}
            </svg>
        </div>
    );
};
