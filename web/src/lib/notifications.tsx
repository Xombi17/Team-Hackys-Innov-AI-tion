"use client";

import { useEffect, useState } from "react";
import { TbBell, TbBellOff, TbCheck } from "react-icons/tb";

export function useNotifications() {
    const [permission, setPermission] = useState<NotificationPermission>("default");
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        if ("Notification" in window) {
            setPermission(Notification.permission);
            setEnabled(Notification.permission === "granted");
        }
    }, []);

    const requestPermission = async () => {
        if (!("Notification" in window)) {
            alert("This browser does not support notifications");
            return false;
        }

        const permission = await Notification.requestPermission();
        setPermission(permission);
        setEnabled(permission === "granted");
        return permission === "granted";
    };

    const sendNotification = (title: string, options?: NotificationOptions) => {
        if (enabled && "Notification" in window) {
            new Notification(title, {
                icon: "/favicon.ico",
                badge: "/favicon.ico",
                ...options,
            });
        }
    };

    const scheduleReminder = (title: string, body: string, delayMs: number) => {
        if (enabled) {
            setTimeout(() => {
                sendNotification(title, { body });
            }, delayMs);
        }
    };

    return { permission, enabled, requestPermission, sendNotification, scheduleReminder };
}

export function NotificationSettings() {
    const { permission, enabled, requestPermission } = useNotifications();
    const [reminders, setReminders] = useState({
        meals: true,
        workouts: true,
        sleep: true,
        meditation: false,
    });

    const handleEnableNotifications = async () => {
        await requestPermission();
    };

    return (
        <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TbBell className="w-5 h-5 text-brand-400" />
                    <h3 className="font-semibold text-white">Notifications</h3>
                </div>
                {!enabled ? (
                    <button
                        onClick={handleEnableNotifications}
                        className="px-3 py-1.5 bg-brand-500/10 text-brand-400 rounded-lg text-sm hover:bg-brand-500/20 transition-colors"
                    >
                        Enable
                    </button>
                ) : (
                    <span className="flex items-center gap-1 text-xs text-green-400">
                        <TbCheck className="w-4 h-4" /> Enabled
                    </span>
                )}
            </div>

            <div className="space-y-3">
                <ReminderToggle
                    label="Meal Reminders"
                    description="Get notified at meal times"
                    enabled={reminders.meals}
                    onToggle={() => setReminders(p => ({ ...p, meals: !p.meals }))}
                />
                <ReminderToggle
                    label="Workout Reminders"
                    description="Don't miss your scheduled workouts"
                    enabled={reminders.workouts}
                    onToggle={() => setReminders(p => ({ ...p, workouts: !p.workouts }))}
                />
                <ReminderToggle
                    label="Sleep Reminders"
                    description="Get reminded when it's bedtime"
                    enabled={reminders.sleep}
                    onToggle={() => setReminders(p => ({ ...p, sleep: !p.sleep }))}
                />
                <ReminderToggle
                    label="Meditation Reminders"
                    description="Daily mindfulness prompts"
                    enabled={reminders.meditation}
                    onToggle={() => setReminders(p => ({ ...p, meditation: !p.meditation }))}
                />
            </div>
        </div>
    );
}

function ReminderToggle({ label, description, enabled, onToggle }: {
    label: string;
    description: string;
    enabled: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="flex items-center justify-between py-2">
            <div>
                <p className="text-sm text-white">{label}</p>
                <p className="text-xs text-slate-500">{description}</p>
            </div>
            <button
                onClick={onToggle}
                className={`w-10 h-6 rounded-full p-1 transition-colors ${enabled ? "bg-brand-500" : "bg-slate-700"
                    }`}
            >
                <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${enabled ? "translate-x-4" : "translate-x-0"
                        }`}
                />
            </button>
        </div>
    );
}
