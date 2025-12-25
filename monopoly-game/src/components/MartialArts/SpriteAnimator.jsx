import React, { useEffect, useState } from 'react';

const SpriteAnimator = ({
    src,
    frameWidth = 32,
    frameHeight = 32,
    frameCount = 4,
    fps = 10,
    scale = 4,
    loop = true,
    onComplete,
    className = '',
    style = {}
}) => {
    const [currentFrame, setCurrentFrame] = useState(0);
    const frameDuration = 1000 / fps;

    useEffect(() => {
        let lastTime = 0;
        let animationFrameId;

        const animate = (time) => {
            if (!lastTime) lastTime = time;
            const deltaTime = time - lastTime;

            if (deltaTime >= frameDuration) {
                setCurrentFrame((prev) => {
                    const next = prev + 1;
                    if (next >= frameCount) {
                        if (!loop) {
                            if (onComplete) onComplete();
                            return prev; // Stay on last frame
                        }
                        return 0;
                    }
                    return next;
                });
                lastTime = time;
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [frameCount, fps, loop, onComplete, frameDuration]);

    // Reset frame when src changes
    useEffect(() => {
        setCurrentFrame(0);
    }, [src]);

    return (
        <div
            className={className}
            style={{
                width: `${frameWidth * scale}px`,
                height: `${frameHeight * scale}px`,
                backgroundImage: `url('${src}')`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: `-${currentFrame * frameWidth}px 0px`,
                backgroundSize: `auto ${frameHeight}px`, // Assuming horizontal strip
                imageRendering: 'pixelated', // Crucial for pixel art
                ...style
            }}
        />
    );
};

export default SpriteAnimator;
