import React from 'react';

const MoneyTransferAnimation = ({ isAnimating, animationDetails }) => {
  if (!animationDetails) {
    return null;
  }

  const translateX = animationDetails.recipientPos.x - animationDetails.senderPos.x;
  const translateY = animationDetails.recipientPos.y - animationDetails.senderPos.y;

  const transformValue = isAnimating
    ? `translate(${translateX}px, ${translateY}px) scale(1.5) translate(-50%, -50%)`
    : `translate(-50%, -50%)`;

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
      className="transition-all duration-[1200ms] ease-in font-retro"
    >
      <div className="px-4 py-2 bg-[#ffcc00] text-black font-bold text-[14px] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        -${animationDetails.amount}
      </div>
    </div>
  );
};

export default MoneyTransferAnimation;