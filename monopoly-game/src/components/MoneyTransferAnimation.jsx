import React from 'react';

const MoneyTransferAnimation = ({ isAnimating, animationDetails }) => {
  if (!animationDetails) {
    return null;
  }

  const translateX = animationDetails.recipientPos.x - animationDetails.senderPos.x;
  const translateY = animationDetails.recipientPos.y - animationDetails.senderPos.y;

  const transformValue = isAnimating
    ? `translate(${translateX}px, ${translateY}px) scale(1.2) translate(-50%, -50%)`
    : `translate(-50%, -50%)`; // Initial state at sender's position, centered

  return (
    <div
      style={{
        position: 'fixed',
        top: animationDetails.senderPos.y,
        left: animationDetails.senderPos.x,
        transform: transformValue,
        zIndex: 1000,
        pointerEvents: 'none',
      }}
      className="transition-all duration-[1500ms] ease-in-out"
    >
      <span className="px-3 py-1 rounded-full bg-yellow-500 text-black font-bold font-mono text-lg shadow-[0_0_15px_rgba(234,179,8,0.5)] border border-yellow-300">
        -${animationDetails.amount}
      </span>
    </div>
  );
};

export default MoneyTransferAnimation;