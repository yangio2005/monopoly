import React, { useState, useEffect, useRef } from 'react';
import './CharacterShowcase.css';

const MONSTERS = [
    {
        id: 'pink',
        name: 'Pink Monster',
        path: '/assets/1 Pink_Monster/Pink_Monster',
        color: '#ff6b9d'
    },
    {
        id: 'owlet',
        name: 'Owlet Monster',
        path: '/assets/2 Owlet_Monster/Owlet_Monster',
        color: '#ffb347'
    },
    {
        id: 'dude',
        name: 'Dude Monster',
        path: '/assets/3 Dude_Monster/Dude_Monster',
        color: '#98d8c8'
    }
];

const ANIMATIONS = [
    { name: 'Idle', frames: 4, speed: 200 },
    { name: 'Walk', frames: 6, speed: 150 },
    { name: 'Run', frames: 6, speed: 100 },
    { name: 'Jump', frames: 8, speed: 120 },
    { name: 'Attack1', frames: 4, speed: 100 },
    { name: 'Attack2', frames: 6, speed: 120 },
    { name: 'Hurt', frames: 4, speed: 150 },
    { name: 'Push', frames: 6, speed: 140 },
    { name: 'Throw', frames: 4, speed: 130 },
    { name: 'Climb', frames: 4, speed: 160 },
];

const CHAT_MESSAGES = {
    moneyReceived: [
        "💰 Wow! Cảm ơn nha!",
        "🎉 Giàu rồi!",
        "✨ Tuyệt vời!",
        "💸 Càng nhiều càng tốt!",
        "🤑 Ngon quá!",
        "🎊 Hehe may quá!"
    ],
    moneyLost: [
        "😢 Huhu tiền mất rồi...",
        "😭 Tội nghiệp tôi!",
        "💔 Khóc thét!",
        "😰 Ôi không!",
        "😱 Mất hết rồi!",
        "😔 Buồn quá..."
    ]
};

const CharacterShowcase = () => {
    const [characters, setCharacters] = useState(
        MONSTERS.map(monster => ({
            ...monster,
            animation: 'Idle',
            frame: 0,
            message: null,
            messageType: null
        }))
    );
    const animationIntervalsRef = useRef([]);

    // Random animation sequencer
    useEffect(() => {
        const startRandomAnimations = () => {
            // Clear existing intervals
            animationIntervalsRef.current.forEach(clearInterval);
            animationIntervalsRef.current = [];

            // Start new animation sequence
            const interval = setInterval(() => {
                // Pick a random animation
                const randomAnim = ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)];

                setCharacters(prev =>
                    prev.map(char => ({
                        ...char,
                        animation: randomAnim.name,
                        frame: 0
                    }))
                );
            }, 3000); // Change animation every 3 seconds

            animationIntervalsRef.current.push(interval);
        };

        startRandomAnimations();

        return () => {
            animationIntervalsRef.current.forEach(clearInterval);
        };
    }, []);

    const handleMoneyChange = (type) => {
        const messageArray = type === 'received' ? CHAT_MESSAGES.moneyReceived : CHAT_MESSAGES.moneyLost;

        setCharacters(prev =>
            prev.map(char => ({
                ...char,
                message: messageArray[Math.floor(Math.random() * messageArray.length)],
                messageType: type
            }))
        );

        // Clear messages after 3 seconds
        setTimeout(() => {
            setCharacters(prev =>
                prev.map(char => ({
                    ...char,
                    message: null,
                    messageType: null
                }))
            );
        }, 3000);
    };

    return (
        <div className="character-showcase">
            <div className="showcase-header">
                <h2 className="showcase-title">🎭 Monster Party</h2>
                <p className="showcase-subtitle">Watch them dance together!</p>
            </div>

            <div className="characters-container">
                {characters.map((char) => {
                    const currentAnim = ANIMATIONS.find(a => a.name === char.animation) || ANIMATIONS[0];
                    const spritePath = `${char.path}_${char.animation}_${currentAnim.frames}.png`;

                    return (
                        <div key={char.id} className="character-wrapper" style={{ '--monster-color': char.color }}>
                            {char.message && (
                                <div className={`chat-bubble ${char.messageType}`}>
                                    {char.message}
                                    <div className="chat-bubble-tail"></div>
                                </div>
                            )}

                            <div className="character-sprite-container">
                                <div
                                    className="character-sprite"
                                    style={{
                                        backgroundImage: `url(${spritePath})`,
                                        animation: `sprite-${char.animation} ${currentAnim.speed * currentAnim.frames}ms steps(${currentAnim.frames}) infinite`,
                                    }}
                                />
                            </div>

                            <div className="character-name" style={{ color: char.color }}>
                                {char.name}
                            </div>

                            <div className="character-shadow"></div>
                        </div>
                    );
                })}
            </div>

            <div className="control-panel">
                <button
                    className="control-btn money-received"
                    onClick={() => handleMoneyChange('received')}
                >
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Nhận Tiền
                </button>

                <button
                    className="control-btn money-lost"
                    onClick={() => handleMoneyChange('lost')}
                >
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Mất Tiền
                </button>
            </div>
        </div>
    );
};

export default CharacterShowcase;
