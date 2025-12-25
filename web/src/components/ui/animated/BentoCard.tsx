"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

export const BentoCard = ({
    title,
    description,
    icon: Icon,
    className,
    gradient = "from-brand-500/20 to-purple-500/20",
    delay = 0
}: any) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className={cn(
                "group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-xl transition-all hover:bg-slate-900/80 hover:border-white/20 hover:shadow-2xl",
                className
            )}
        >
            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br", gradient)} />

            <div className="relative z-10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/50 border border-white/5 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-slate-300 group-hover:text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-100">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-400 group-hover:text-slate-300">
                    {description}
                </p>
            </div>

            {/* Top Border Gradient */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
        </motion.div>
    );
};
