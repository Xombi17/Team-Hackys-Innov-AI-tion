"use client";
import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export const BlurText = ({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    return (
        <div ref={ref} className={className}>
            <span className="sr-only">{text}</span>
            <motion.span
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ staggerChildren: 0.1, delayChildren: delay }}
                aria-hidden
            >
                {text.split(" ").map((word, i) => (
                    <span key={i} className="inline-block mr-2">
                        {[...word].map((char, j) => (
                            <motion.span
                                key={j}
                                className="inline-block"
                                variants={{
                                    hidden: { filter: "blur(10px)", opacity: 0, y: 5 },
                                    visible: { filter: "blur(0px)", opacity: 1, y: 0 },
                                }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </span>
                ))}
            </motion.span>
        </div>
    );
};
