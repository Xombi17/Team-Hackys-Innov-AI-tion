"use client";

import { useEffect, useRef } from "react";

export function NetworkBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const nodes: any[] = [];
        const maxNodes = 50;

        // Initialize nodes
        for (let i = 0; i < maxNodes; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }

        function animate() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, width, height);

            // Update and draw nodes
            nodes.forEach((node, i) => {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(99, 102, 241, 0.3)"; // Brand color
                ctx.fill();

                // Connect nodes
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[j].x - node.x;
                    const dy = nodes[j].y - node.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 150)})`;
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            if (canvas) {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            }
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="block absolute inset-0 z-0 pointer-events-none opacity-60 mix-blend-screen"
        />
    );
}
