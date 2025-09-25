import React from 'react';
import MoneyTransferAnimation from './MoneyTransferAnimation';
import ShareRoomModal from './GameRoom/ShareRoomModal';
import BankingModal from './GameRoom/BankingModal';
import PlayerList from './GameRoom/PlayerList';
import TransactionLog from './GameRoom/TransactionLog';
import BankSettingsModal from './GameRoom/BankSettingsModal';
import { GameRoomProvider, useGameRoom } from './GameRoom/GameRoomProvider';

const GameRoomContent = () => {
  const { roomId, roomData, loading, error, setShowShareModal, clickSound, isAnimating, animationDetails, user, BANK_UID, setShowBankSettingsModal } = useGameRoom();

  if (loading) {
    return <div className="container mt-5">Loading room...</div>;
  }

  if (error) {
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  }

  if (!roomData) {
    return <div className="container mt-5">Room data not available.</div>;
  }

  return (
    <>
      <div className="container mt-2 mt-md-3">
        <h2 className="text-center mb-3 mb-md-4">Game Room: {roomData.name || roomId}
          <button className="btn btn-info btn-sm ms-2 ms-md-3" onClick={() => { setShowShareModal(true); clickSound.play(); }}>
            Share Room
          </button>
          {user && user.uid === BANK_UID && (
            <button className="btn btn-warning btn-sm ms-2 ms-md-3" onClick={() => { setShowBankSettingsModal(true); clickSound.play(); }}>
              Bank Settings
            </button>
          )}
        </h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row">
          {/* Left Column: Game Status and Players */}
          <div className="col-lg-6 mb-3 mb-md-4">
            <PlayerList />
          </div>

          {/* Right Column: Banking and Transaction Log */}
          <div className="col-lg-6 mb-3 mb-md-4">
            <BankingModal />
            <TransactionLog />
          </div>
        </div>
      </div>

      <ShareRoomModal />
      <BankSettingsModal />
      <MoneyTransferAnimation isAnimating={isAnimating} animationDetails={animationDetails} />
    </>
  );
};

const GameRoomPage = () => (
  <GameRoomProvider>
    <GameRoomContent />
  </GameRoomProvider>
);

export default GameRoomPage;