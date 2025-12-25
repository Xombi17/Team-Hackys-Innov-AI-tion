"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TbSun, TbMoon } from "react-icons/tb";

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Load saved preference
        const saved = localStorage.getItem("wellsync-theme");
        if (saved) {
            setIsDark(saved === "dark");
        }
    }, []);

    useEffect(() => {
        // Apply theme to document
        if (isDark) {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
        } else {
            document.documentElement.classList.add("light");
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("wellsync-theme", isDark ? "dark" : "light");
    }, [isDark]);

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDark(!isDark)}
            className="relative w-14 h-7 bg-slate-800 rounded-full p-1 transition-colors"
        >
            <motion.div
                animate={{ x: isDark ? 0 : 24 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center"
            >
                {isDark ? (
                    <TbMoon className="w-3 h-3 text-white" />
                ) : (
                    <TbSun className="w-3 h-3 text-white" />
                )}
            </motion.div>
        </motion.button>
    );
}
