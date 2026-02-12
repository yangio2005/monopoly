import React from 'react';

const ChatBubble = ({ message, show, transactionType, index }) => {
    if (!show || !message) return null;

    const bgColor = transactionType === 'received' ? 'bg-[#40ff00]' : 'bg-[#ffcc00]';
    const textColor = 'text-black';

    const positionClass = (index === 1)
        ? '-top-32 md:-top-36'
        : '-top-20 md:-top-24';

    return (
        <div
            className={`absolute ${positionClass} left-1/2 -translate-x-1/2 px-4 py-3 border-4 border-black font-retro text-[8px] md:text-[10px] whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-[1000] ${bgColor} ${textColor}`}
            style={{
                animation: 'bubble-bounce 0.4s steps(4)'
            }}
        >
            {message}
            {/* Pixel Tail */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="w-4 h-2 bg-black"></div>
                <div className="w-2 h-2 bg-black"></div>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className={`w-2 h-2 ${bgColor}`}></div>
            </div>
        </div>
    );
};

export default ChatBubble;
