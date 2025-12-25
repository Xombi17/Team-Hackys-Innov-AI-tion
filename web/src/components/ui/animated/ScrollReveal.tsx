"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
}

const Item = ({ children, progress, range }: { children: React.ReactNode, progress: MotionValue<number>, range: [number, number] }) => {
    const opacity = useTransform(progress, range, [0, 1]);
    const blur = useTransform(progress, range, ["10px", "0px"]);
    const y = useTransform(progress, range, [20, 0]);

    return (
        <motion.div
            style={{ opacity, filter: blur, y } as any}
            className="mb-8"
        >
            {children}
        </motion.div>
    );
};

export const ScrollReveal = ({ children, className }: ScrollRevealProps) => {
    const element = useRef(null);
    const { scrollYProgress } = useScroll({
        target: element,
        offset: ["start 0.9", "end 0.5"]
    });

    return (
        <div ref={element} className={className}>
            {children}
        </div>
    );
};

export const ScrollRevealItem = ({ children, index, total }: { children: React.ReactNode, index: number, total: number }) => {
    // This is a placeholder since we need the parent's scroll progress. 
    // In a real implementation we'd pass context or clone children, 
    // but for simplicity in this specific file structure, we'll make a composite component in the main file 
    // OR just use standard Framer Motion whileInView with fast triggers.

    // Actually, let's implement the specific "Gradual Blur" the user likely saw: 
    // A list where items fade in/unblur as they enter the "sweet spot" of the screen.

    return (
        <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ margin: "-10% 0px -10% 0px", once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            {children}
        </motion.div>
    )
}
