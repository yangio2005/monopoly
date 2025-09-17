import React from 'react';

const MoneyTransferAnimation = ({ isAnimating, animationDetails }) => {
  if (!isAnimating || !animationDetails) {
    return null;
  }

  const transformStyle = `translate(${animationDetails.recipientPos.x - animationDetails.senderPos.x}px, ${animationDetails.recipientPos.y - animationDetails.senderPos.y}px) translate(-50%, -50%)`;

  return (
    <div
      style={{
        position: 'fixed',
        top: animationDetails.senderPos.y,
        left: animationDetails.senderPos.x,
        transform: transformStyle,
        zIndex: 1000,
        pointerEvents: 'none',
        opacity: 1,
      }}
      className="money-animation"
    >
      <span className="badge bg-warning text-dark" style={{ fontSize: '1.2rem' }}>
        -${animationDetails.amount}
      </span>
    </div>
  );
};

export default MoneyTransferAnimation;