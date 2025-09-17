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
        opacity: 1,
      }}
      className="money-animation" // This class will now only define the transition
    >
      <span className="badge bg-warning text-dark" style={{ fontSize: '1.2rem' }}>
        -${animationDetails.amount}
      </span>
    </div>
  );
};

export default MoneyTransferAnimation;