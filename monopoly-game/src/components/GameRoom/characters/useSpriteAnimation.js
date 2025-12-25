import { useState, useEffect, useRef } from 'react';

export const useSpriteAnimation = (frames, fps = 10, animName) => {
    const [currentFrame, setCurrentFrame] = useState(0);
    const frameRef = useRef(0);
    const lastTimeRef = useRef(0);

    useEffect(() => {
        // Reset frame when animation changes (frames or name)
        frameRef.current = 0;
        setCurrentFrame(0);
        lastTimeRef.current = 0;

        let animationFrameId;
        const frameInterval = 1000 / fps;

        const animate = (timestamp) => {
            if (!lastTimeRef.current) lastTimeRef.current = timestamp;

            if (timestamp - lastTimeRef.current >= frameInterval) {
                frameRef.current = (frameRef.current + 1) % frames;
                setCurrentFrame(frameRef.current);
                lastTimeRef.current = timestamp;
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [frames, fps, animName]);

    return currentFrame;
};
