import React, { useState, useEffect } from 'react';
import CharacterSprite from './characters/CharacterSprite';
import { MONSTERS, REACTIONS, CELEBRATION_SEQUENCE, delay } from './characters/constants';

const GameRoomCharacters = ({ transactionType }) => {
    const [phase, setPhase] = useState('hidden'); // hidden, ready, entering, celebrating, exiting
    const [messages, setMessages] = useState([]);
    const [showBubble, setShowBubble] = useState(false);
    const [currentAnim, setCurrentAnim] = useState({ name: 'Run', frames: 6 });

    useEffect(() => {
        if (!transactionType) {
            setPhase('hidden');
            return;
        }

        const type = transactionType.type; // Extract type from object
        let isMounted = true;
        console.log('Animation Sequence Started:', type);

        const runAnimationSequence = async () => {
            // 0. Setup Messages
            const reaction = REACTIONS[type];
            const newMessages = MONSTERS.map(() =>
                reaction.messages[Math.floor(Math.random() * reaction.messages.length)]
            );
            if (isMounted) setMessages(newMessages);

            // 1. Phase: Ready (Initial Position)
            if (isMounted) {
                console.log('Phase: Ready');
                setPhase('ready');
                setCurrentAnim({ name: 'Run', frames: 6 });
            }
            await delay(50);

            // 2. Phase: Entering (Run in)
            if (isMounted) {
                console.log('Phase: Entering');
                setPhase('entering');
            }
            await delay(2000);

            // 3. Phase: Celebrating
            if (isMounted) {
                console.log('Phase: Celebrating');
                setPhase('celebrating');
                setShowBubble(true);
            }

            // Short pause to ensure phase update renders
            await delay(100);

            // Run celebration sequence
            console.log('Starting Celebration Sequence:', CELEBRATION_SEQUENCE);
            for (const anim of CELEBRATION_SEQUENCE) {
                if (!isMounted) {
                    console.log('Component unmounted, stopping sequence');
                    break;
                }
                console.log('Setting Anim:', anim.name);
                setCurrentAnim({ name: anim.name, frames: anim.frames });
                await delay(anim.duration);
            }

            if (isMounted) setShowBubble(false);
            await delay(500); // Short pause before exit

            // 4. Phase: Exiting (Run out)
            if (isMounted) {
                console.log('Phase: Exiting');
                setCurrentAnim({ name: 'Run', frames: 6 });
                await delay(50);
                setPhase('exiting');
            }
            await delay(3000);

            // 5. Phase: Hidden (Cleanup)
            if (isMounted) {
                console.log('Phase: Hidden');
                setPhase('hidden');
            }
        };

        runAnimationSequence();

        return () => {
            console.log('Cleanup: Component unmounted or transaction changed');
            isMounted = false;
        };
    }, [transactionType]);

    if (phase === 'hidden') return null;

    return (
        <div className="fixed inset-0 z-[999] pointer-events-none overflow-hidden">
            {MONSTERS.map((monster, index) => (
                <CharacterSprite
                    key={monster.id}
                    monster={monster}
                    index={index}
                    phase={phase}
                    currentAnim={currentAnim}
                    showBubble={showBubble}
                    message={messages[index]}
                    transactionType={transactionType?.type}
                />
            ))}

            {/* Bubble Bounce Animation Keyframes */}
            <style>{`
                @keyframes bubble-bounce {
                    0% { transform: translateX(-50%) scale(0) translateY(10px); opacity: 0; }
                    50% { transform: translateX(-50%) scale(1.15) translateY(-5px); }
                    100% { transform: translateX(-50%) scale(1) translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default GameRoomCharacters;
