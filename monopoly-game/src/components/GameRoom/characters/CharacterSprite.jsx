import React from 'react';
import ChatBubble from './ChatBubble';
import { useSpriteAnimation } from './useSpriteAnimation';

const CharacterSprite = ({ monster, index, phase, currentAnim, showBubble, message, transactionType }) => {
    // Use higher FPS for Run animation (entering and exiting)
    const isRunning = currentAnim.name === 'Run' || phase === 'entering' || phase === 'exiting';
    const fps = isRunning ? 15 : 10;

    // Pass animation name to force reset when animation changes
    const currentFrame = useSpriteAnimation(currentAnim.frames, fps, currentAnim.name);
    const spritePath = encodeURI(`${monster.path}_${currentAnim.name}_${currentAnim.frames}.png`);

    // Calculate Position & Transform
    // Target X: Center of screen + offset based on index - 50% of sprite width
    const targetX = `calc(50vw + ((${index} - 1) * var(--char-spacing)) - 50%)`;

    let transformX = '-300px';
    if (phase === 'ready') transformX = '-300px';
    else if (phase === 'entering' || phase === 'celebrating') transformX = targetX;
    else if (phase === 'exiting') transformX = '-300px'; // Return to left

    // Calculate Opacity
    const opacityValue = phase === 'exiting' ? 0 : 1;

    // Calculate Delays
    const baseDelay = index * 0.1;

    // Calculate Transition
    let transitionStyle = `transform 0.3s ease-out ${baseDelay}s`;
    if (phase === 'entering') {
        transitionStyle = `transform 2s ease-out ${baseDelay}s, opacity 0.5s ease-out ${0.3 + baseDelay}s`;
    } else if (phase === 'exiting') {
        // Return transition: slower and linear
        transitionStyle = `transform 2.5s linear ${baseDelay}s, opacity 1s linear ${1.5 + baseDelay}s`;
    }

    // Flip sprite when returning (exiting)
    const flipClass = phase === 'exiting' ? 'scale-x-[-1]' : '';

    return (
        <div
            className={`
                absolute left-0 will-change-transform opacity-0
                /* Responsive Spacing Variable */
                [--char-spacing:90px] md:[--char-spacing:250px]
            `}
            style={{
                top: '50%', // Center vertically
                // Combine translateX (movement) and translateY (vertical centering)
                transform: `translateX(${transformX}) translateY(-50%)`,
                transition: transitionStyle,
                opacity: opacityValue
            }}
        >
            <ChatBubble
                message={message}
                show={showBubble}
                transactionType={transactionType}
                index={index}
            />

            <div
                className={`
                    bg-no-repeat 
                    [image-rendering:pixelated] 
                    drop-shadow-[0_6px_16px_rgba(0,0,0,0.7)] 
                    will-change-[background-position]
                    ${flipClass}
                    
                    /* Responsive Sprite Size Variables */
                    [--sprite-size:64px] 
                    min-[480px]:[--sprite-size:80px] 
                    md:[--sprite-size:128px]
                    
                    /* Apply Size */
                    w-[var(--sprite-size)] 
                    h-[var(--sprite-size)]
                `}
                style={{
                    backgroundImage: `url("${spritePath}")`,
                    // Pass dynamic values
                    '--frame': currentFrame,
                    '--total-frames': currentAnim.frames,
                    // Dynamic Calculation using CSS Variables
                    backgroundSize: 'calc(var(--total-frames) * var(--sprite-size)) var(--sprite-size)',
                    backgroundPosition: 'calc(var(--frame) * -1 * var(--sprite-size)) 0'
                }}
            />
        </div>
    );
};

export default CharacterSprite;
