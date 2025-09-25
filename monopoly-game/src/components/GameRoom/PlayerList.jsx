import React from 'react';
import { useGameRoom } from './GameRoomProvider';
import { formatCurrency } from '../../utils/formatters.jsx';

const PlayerList = () => {
  const {
    user,
    roomData,
    bankAvatarURL,
    selectedRecipientId,
    setSelectedRecipientId,
    setShowBankingModal,
    clickSound,
    playerRefs,
    bankRef,
    playersWithEffect,
    newInitialBalance,
    setNewInitialBalance,
    handleUpdateInitialBalance,
    newCurrencySymbol,
    setNewCurrencySymbol,
    handleUpdateCurrencySymbol,
    BANK_UID,
    currencySymbol,
    currencyCode,
    setShowBankSettingsModal,
  } = useGameRoom();

  if (!roomData) return null;

  const players = roomData.players ? Object.entries(roomData.players).filter(([uid]) => uid !== BANK_UID) : [];
  const bank = { name: "Bank", balance: roomData.bank || 0, avatarURL: bankAvatarURL };

  return (
    <div className="card h-100">
      <div className="card-header bg-primary text-white">Game Status</div>
      <div className="card-body p-2 p-md-3 position-relative" style={{ minHeight: '300px' }}>
        <div className="position-absolute top-50 start-50 translate-middle text-center">
          <button
            ref={bankRef}
            className={`btn btn-light text-start p-0 mb-1 mb-md-2 ${selectedRecipientId === BANK_UID ? 'border-warning shadow' : ''}`}
            onClick={() => { setSelectedRecipientId(BANK_UID); setShowBankingModal(true); clickSound.play(); }}
          >
            <strong>Total Game Money (Bank):</strong> {formatCurrency(bank.balance, currencySymbol, currencyCode)}
          </button>
        </div>
        {players.map(([uid, playerData], index) => {
          const playerPositions = [
            { top: '10px', left: '10px' },
            { top: '10px', right: '10px' },
            { bottom: '10px', left: '10px' },
            { bottom: '10px', right: '10px' }
          ];
          const position = playerPositions[index % playerPositions.length];

          return (
            <button
              ref={el => playerRefs.current[uid] = el}
              key={uid}
              className={`text-center p-1 border rounded btn btn-light position-absolute ${uid === user.uid ? 'border-success' : ''} ${selectedRecipientId === uid ? 'border-warning shadow' : ''} ${playersWithEffect.includes(uid) ? 'money-received-effect' : ''}` }
              style={{ width: '120px', ...position }}
              onClick={() => { setSelectedRecipientId(uid); setShowBankingModal(true); clickSound.play(); }}
            >
              {playerData.avatarURL && (
                <img
                  src={playerData.avatarURL}
                  alt="Avatar"
                  className="rounded-circle mb-1"
                  style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                />
              )}
              <h6 className="mb-0" style={{ fontSize: '1.05rem' }}>{playerData.name}</h6>
              <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>{formatCurrency(playerData.balance, currencySymbol, currencyCode)}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerList;
