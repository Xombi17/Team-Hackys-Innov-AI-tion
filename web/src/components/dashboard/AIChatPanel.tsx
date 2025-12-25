"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { TbMessageCircle, TbX, TbSend, TbLoader2, TbSparkles } from "react-icons/tb";
import { API_BASE_URL } from "@/lib/api";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export interface AIChatPanelProps {
    userId?: string;
    context?: any;
}

export function AIChatPanel({ userId, context }: AIChatPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "👋 Hi! I'm your WellSync AI wellness coach. Ask me anything about your today's plan!",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            // Try to call chat API
            // Construct history for context-aware chat (Frontend Memory)
            const history = messages.map(m => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`).join("\n");
            const fullPrompt = `Previous conversation:\n${history}\nUser: ${userMessage.content}`;

            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: fullPrompt,
                    user_id: userId,
                    context: context
                }),
            });

            let aiResponse: string;
            if (response.ok) {
                const data = await response.json();
                aiResponse = data.response || data.message || "I'm here to help!";
            } else {
                // Mock responses for demo
                aiResponse = getMockResponse(userMessage.content);
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: aiResponse,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            // Fallback mock response
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: getMockResponse(userMessage.content),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
        } finally {
            setLoading(false);
        }
    };

    const getMockResponse = (query: string): string => {
        const q = query.toLowerCase();
        if (q.includes("workout") || q.includes("exercise")) {
            return "Based on your plan, I recommend **compound movements**:\n\n* **Squats**: Great for legs/core\n* **Push-ups**: Upper body strength\n\nThey're efficient and work multiple muscle groups! 💪";
        }
        if (q.includes("sleep") || q.includes("tired")) {
            return "For better sleep, try:\n\n* **Consistency**: Bedtime at 10:30 PM\n* **No Screens**: 1 hour before bed\n* **Light Stretching**: To unwind\n\n😴";
        }
        if (q.includes("food") || q.includes("eat") || q.includes("meal") || q.includes("diet")) {
            return "Your nutrition plan recommends **2000 kcal/day**. Key tips:\n\n* **Protein** with every meal\n* **Hydration**: 8+ glasses of water\n* **Veggies**: Aim for color 🥗";
        }
        if (q.includes("stress") || q.includes("anxious") || q.includes("mental")) {
            return "For stress management, try **4-7-8 Breathing**:\n\n1. **Inhale** for 4s\n2. **Hold** for 7s\n3. **Exhale** for 8s\n\nEven 5 minutes daily helps! 🧘";
        }
        if (q.includes("hurt") || q.includes("pain") || q.includes("injury")) {
            return "⚠️ **Safety First**: If you're injured, please rest and consult a doctor.\n\nFor minor soreness, focus on recovery and hydration. Shall we switch to a **Rest Day** plan? 🩹";
        }
        return "That's a great question! Based on your wellness profile, I recommend balancing four pillars:\n\n* **Fitness**\n* **Nutrition**\n* **Sleep**\n* **Mental Wellness**\n\nWould you like specific advice on any of these? ✨";
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 text-white shadow-lg shadow-brand-500/30 flex items-center justify-center ${isOpen ? "hidden" : ""}`}
            >
                <TbMessageCircle className="w-6 h-6" />
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-brand-500/20 to-cyan-500/10 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
                                    <TbSparkles className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-sm">WellSync Coach</h3>
                                    <p className="text-xs text-slate-400">AI Wellness Assistant</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
                            >
                                <TbX className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === "user"
                                            ? "bg-brand-500 text-white rounded-br-md"
                                            : "bg-slate-800 text-slate-200 rounded-bl-md"
                                            }`}
                                    >
                                        <ReactMarkdown
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                                                strong: ({ node, ...props }) => <span className="font-semibold text-brand-300" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                                                li: ({ node, ...props }) => <li className="" {...props} />,
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-slate-800 text-slate-400 p-3 rounded-2xl rounded-bl-md flex items-center gap-2">
                                        <TbLoader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">Thinking...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-slate-800">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    placeholder="Ask about your wellness..."
                                    className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500/50 placeholder:text-slate-500"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim() || loading}
                                    className="px-4 py-2.5 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-50"
                                >
                                    <TbSend className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
