"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP as useGSAPReact } from "@gsap/react";

// Register GSAP plugins once
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

// Re-export official useGSAP hook
export { useGSAPReact as useGSAP };

// Export gsap and ScrollTrigger for direct use
export { gsap, ScrollTrigger };

// Custom hook for scroll-triggered animations
export function useScrollAnimation(
    callback: (gsap: typeof import("gsap").default, trigger: typeof ScrollTrigger) => void,
    deps: React.DependencyList = []
) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAPReact(
        () => {
            if (containerRef.current) {
                callback(gsap, ScrollTrigger);
            }
        },
        { scope: containerRef, dependencies: deps as unknown[] }
    );

    return containerRef;
}

// Text split animation helper
export function animateSplitText(
    element: HTMLElement | string,
    options: {
        type?: "chars" | "words" | "lines";
        stagger?: number;
        duration?: number;
        y?: number;
        opacity?: number;
        ease?: string;
        delay?: number;
    } = {}
) {
    const {
        type = "chars",
        stagger = 0.02,
        duration = 0.8,
        y = 40,
        opacity = 0,
        ease = "power3.out",
        delay = 0,
    } = options;

    // Simple character split animation without SplitText plugin
    // We'll use CSS-based approach for maximum compatibility
    const el = typeof element === "string" ? document.querySelector(element) : element;
    if (!el) return null;

    const text = el.textContent || "";
    el.innerHTML = "";

    const chars = text.split("").map((char) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        el.appendChild(span);
        return span;
    });

    return gsap.to(chars, {
        y: 0,
        opacity: 1,
        duration,
        stagger,
        ease,
        delay,
    });
}

// Parallax effect helper
export function createParallax(
    element: HTMLElement | string,
    options: {
        speed?: number;
        start?: string;
        end?: string;
    } = {}
) {
    const { speed = 0.5, start = "top bottom", end = "bottom top" } = options;

    return gsap.to(element, {
        y: () => window.innerHeight * speed,
        ease: "none",
        scrollTrigger: {
            trigger: element,
            start,
            end,
            scrub: true,
        },
    });
}
