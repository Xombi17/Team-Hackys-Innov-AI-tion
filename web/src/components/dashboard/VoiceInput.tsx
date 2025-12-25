"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TbMicrophone, TbMicrophoneOff, TbLoader2 } from "react-icons/tb";

interface VoiceInputProps {
    onTranscript?: (text: string) => void;
    placeholder?: string;
}

export function VoiceInput({ onTranscript, placeholder = "Click to speak..." }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [supported, setSupported] = useState(true);

    useEffect(() => {
        // Check for browser support
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            setSupported(!!SpeechRecognition);
        }
    }, []);

    const startListening = () => {
        if (!supported) {
            alert("Speech recognition is not supported in this browser. Try Chrome.");
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript("");
        };

        recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const text = event.results[current][0].transcript;
            setTranscript(text);
        };

        recognition.onend = () => {
            setIsListening(false);
            if (transcript && onTranscript) {
                onTranscript(transcript);
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };

        recognition.start();
    };

    const stopListening = () => {
        setIsListening(false);
    };

    return (
        <div className="relative">
            <div className="flex items-center gap-2 p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={isListening ? stopListening : startListening}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isListening
                            ? "bg-red-500 text-white"
                            : "bg-brand-500/20 text-brand-400 hover:bg-brand-500/30"
                        }`}
                >
                    {isListening ? (
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                        >
                            <TbMicrophoneOff className="w-5 h-5" />
                        </motion.div>
                    ) : (
                        <TbMicrophone className="w-5 h-5" />
                    )}
                </motion.button>
                <div className="flex-1">
                    {isListening ? (
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [8, 16, 8] }}
                                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                        className="w-1 bg-red-500 rounded-full"
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-slate-400">
                                {transcript || "Listening..."}
                            </span>
                        </div>
                    ) : transcript ? (
                        <span className="text-sm text-white">{transcript}</span>
                    ) : (
                        <span className="text-sm text-slate-500">{placeholder}</span>
                    )}
                </div>
            </div>
            {!supported && (
                <p className="text-xs text-red-400 mt-1">
                    Speech recognition not supported in this browser
                </p>
            )}
        </div>
    );
}
