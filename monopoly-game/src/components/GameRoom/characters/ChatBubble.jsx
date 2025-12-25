import React from 'react';

const ChatBubble = ({ message, show, transactionType, index }) => {
    if (!show || !message) return null;

    const gradientClass = transactionType === 'received'
        ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-emerald-900'
        : 'bg-gradient-to-r from-pink-400 to-yellow-400 text-pink-900';

    const borderClass = transactionType === 'received'
        ? 'border-t-cyan-400'
        : 'border-t-yellow-400';

    // Podium style positioning: Middle (index 1) higher, sides lower
    const positionClass = (index === 1)
        ? '-top-32 md:-top-28' // Middle: Higher
        : '-top-20 md:-top-24'; // Sides: Lower

    return (
        <div
            className={`absolute ${positionClass} left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap shadow-xl z-10 ${gradientClass}`}
            style={{
                animation: 'bubble-bounce 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
            }}
        >
            {message}
            <div
                className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent ${borderClass}`}
            />
        </div>
    );
};

export default ChatBubble;
