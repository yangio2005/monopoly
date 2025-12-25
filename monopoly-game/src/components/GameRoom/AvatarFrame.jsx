import React, { useState, useEffect } from 'react';

const AvatarFrame = ({ balance, totalMoney, size = 84, offset = 22 }) => {
    const [currentFrame, setCurrentFrame] = useState(0);

    useEffect(() => {
        if (balance <= 0 || totalMoney <= 0) return;

        // 1. Calculate Asset Percentage
        const percent = balance / totalMoney;

        // 2. Determine Target Frame (0-8) based on wealth
        let targetFrame = Math.floor(percent * 10);
        targetFrame = Math.min(8, Math.max(0, targetFrame));

        // 3. Animation Logic: Run from 0 to TargetFrame
        // If targetFrame is 0, just stay at 0
        if (targetFrame === 0) {
            setCurrentFrame(0);
            return;
        }

        // Start at 0
        setCurrentFrame(0);

        // Continuous Animation Loop: 0 -> 1 -> ... -> targetFrame -> 0
        const interval = setInterval(() => {
            setCurrentFrame(prev => {
                if (prev >= targetFrame) {
                    return 0; // Reset to start
                }
                return prev + 1; // Next frame
            });
        }, 100); // 100ms per frame

        return () => clearInterval(interval);
    }, [balance, totalMoney]);

    if (balance <= 0 || totalMoney <= 0) return null;

    // Sprite Sheet Logic
    const positionY = currentFrame * (100 / 8);

    return (
        <div
            className="absolute pointer-events-none z-20 drop-shadow-lg"
            style={{
                top: `-${offset}px`,
                left: `-${offset}px`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundImage: 'url("/assets/avatar.png")',
                backgroundSize: '100% auto', // Fit width, auto height
                backgroundPosition: `0% ${positionY}%`,
                imageRendering: 'pixelated'
            }}
        />
    );
};

export default AvatarFrame;
