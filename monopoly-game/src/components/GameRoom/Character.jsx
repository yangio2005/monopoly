import React, { useState, useEffect } from 'react';
import { CHARACTERS } from '../CharacterSelector';

// Fallback to default sprite if character assets folder path doesn't work
const getCharacterSprite = (characterId) => {
    const character = CHARACTERS.find(c => c.id === characterId);
    return character ? character.sprite : CHARACTERS[0].sprite; // Default to first character
};

/**
 * Character Component - Animated sprite character for game room
 * Sprite sheet: 2 columns x 3 rows = 5 frames
 * Frame layout (2 cols x 3 rows):
 * [0] [1]
 * [2] [3]
 * [4] [ ]
 * 
 * Animation logic:
 * - Idle: Frame 0 (default state)
 * - Transfer: Frames 1 -> 2 -> 3 (animation)
 * - Complete: Frame 4 (end state, same as idle)
 */
const Character = ({
    playerId,
    playerName,
    characterId = 'male-1', // Character selection from profile
    position = { x: 50, y: 50 },
    size = 100,
    isTransferring = false, // New prop: true when character is transferring money
    onTransferComplete
}) => {
    const [currentFrame, setCurrentFrame] = useState(0); // Start at frame 0 (idle)
    const [animationState, setAnimationState] = useState('idle'); // 'idle', 'transferring', 'complete'

    const SPRITE_SIZE = 100; // Original sprite size
    const COLS = 2;
    const TOTAL_FRAMES = 5;

    // Calculate sprite position based on frame
    const getSpritePosition = (frame) => {
        const col = frame % COLS;
        const row = Math.floor(frame / COLS);
        return {
            x: col * SPRITE_SIZE,
            y: row * SPRITE_SIZE
        };
    };

    // Handle transfer animation
    useEffect(() => {
        if (!isTransferring && animationState === 'idle') {
            // Stay at frame 0 when idle
            setCurrentFrame(0);
            return;
        }

        if (isTransferring && animationState === 'idle') {
            // Start transfer animation
            setAnimationState('transferring');
            setCurrentFrame(1); // Start from frame 1

            let frameSequence = 1;
            const animationFrames = [1, 2, 3]; // Frames 1 -> 2 -> 3

            const interval = setInterval(() => {
                frameSequence++;
                if (frameSequence < animationFrames.length) {
                    setCurrentFrame(animationFrames[frameSequence]);
                } else {
                    // Animation complete, go to frame 4
                    setCurrentFrame(4);
                    setAnimationState('complete');
                    clearInterval(interval);

                    // Notify parent that animation is complete
                    if (onTransferComplete) {
                        onTransferComplete();
                    }

                    // After 500ms, return to idle
                    setTimeout(() => {
                        setCurrentFrame(0);
                        setAnimationState('idle');
                    }, 500);
                }
            }, 150); // 150ms per frame for smooth animation

            return () => clearInterval(interval);
        }
    }, [isTransferring, animationState, onTransferComplete]);

    // Reset to idle when transfer prop changes back to false
    useEffect(() => {
        if (!isTransferring && animationState !== 'idle') {
            // Allow current animation to complete
            const timeout = setTimeout(() => {
                setAnimationState('idle');
                setCurrentFrame(0);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [isTransferring, animationState]);

    const spritePos = getSpritePosition(currentFrame);
    const characterSprite = getCharacterSprite(characterId);

    return (
        <div
            className="absolute transition-all duration-500 ease-out"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${size}px`,
                height: `${size}px`,
                zIndex: 10
            }}
        >
            {/* Character Sprite */}
            <div
                className="relative w-full h-full"
                style={{
                    backgroundImage: `url(${characterSprite})`,
                    backgroundPosition: `-${spritePos.x}px -${spritePos.y}px`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: `${COLS * size}px auto`,
                    imageRendering: 'pixelated', // Preserve pixel art quality
                }}
            >
                {/* Player Name Tag */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-20">
                    <div className="px-3 py-1 bg-black/80 text-white text-xs rounded-full backdrop-blur-sm border border-white/30 font-mono shadow-lg">
                        {playerName}
                    </div>
                </div>

                {/* Transfer indicator */}
                {isTransferring && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <div className="px-2 py-1 bg-green-500/90 text-white text-xs rounded-full backdrop-blur-sm border border-green-300 animate-pulse font-mono">
                            💸 Transferring...
                        </div>
                    </div>
                )}
            </div>

            {/* Shadow effect */}
            <div
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-3 bg-black/40 rounded-full blur-md"
                style={{
                    transform: `translateX(-50%) ${isTransferring ? 'scale(1.3)' : 'scale(1)'}`,
                    transition: 'transform 0.3s ease'
                }}
            />
        </div>
    );
};

export default Character;
