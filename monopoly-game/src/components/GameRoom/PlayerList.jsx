import React from 'react';
import { useGameRoom } from './GameRoomProvider';
import { formatCurrency } from '../../utils/formatters.jsx';
import AvatarFrame from './AvatarFrame';

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
    BANK_UID,
    currencySymbol,
    currencyCode,
  } = useGameRoom();

  if (!roomData) return null;

  const players = roomData.players ? Object.entries(roomData.players).filter(([uid]) => uid !== BANK_UID) : [];
  const bank = { name: "Bank", balance: roomData.bank || 0, avatarURL: bankAvatarURL };

  // Calculate Total Money (excluding Bank) for percentage calculation
  const totalMoney = players.reduce((sum, [, p]) => sum + (p.balance || 0), 0);

  return (
    <div className="relative p-1 rounded-2xl bg-gradient-to-b from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] h-full min-h-[400px]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50"></div>

      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20 rounded-t-xl">
        <h3 className="text-lg font-bold text-cyan-400 tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
          GAME STATUS
        </h3>
        <div className="text-xs font-mono text-purple-400/80">
          PLAYERS: {players.length}
        </div>
      </div>

      <div className="p-4 relative h-[calc(100%-60px)]">
        {/* Bank Button (Center) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-[200px]">
          <button
            ref={bankRef}
            onClick={() => { setSelectedRecipientId(BANK_UID); setShowBankingModal(true); clickSound.play(); }}
            className={`
              w-full group relative p-4 rounded-xl border transition-all duration-300
              ${selectedRecipientId === BANK_UID
                ? 'bg-yellow-500/20 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                : 'bg-black/40 border-yellow-500/30 hover:border-yellow-500/60 hover:bg-yellow-500/10'
              }
            `}
          >
            <div className="flex flex-col items-center gap-2">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${selectedRecipientId === BANK_UID ? 'border-yellow-400 bg-yellow-500/20' : 'border-yellow-500/30 bg-black/50 group-hover:border-yellow-500/60'}
              `}>
                <span className="text-2xl">🏦</span>
              </div>
              <div className="text-center">
                <div className="text-xs font-mono text-yellow-500/80 mb-1">CENTRAL BANK</div>
                <div className="text-lg font-bold text-yellow-400 font-mono tracking-tight">
                  {formatCurrency(bank.balance, currencySymbol, currencyCode)}
                </div>
              </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-yellow-500 opacity-50"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-yellow-500 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-yellow-500 opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-yellow-500 opacity-50"></div>
          </button>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-2 gap-4 h-full">
          {players.map(([uid, playerData], index) => {
            const isCurrentUser = uid === user.uid;
            const isSelected = selectedRecipientId === uid;
            const hasEffect = playersWithEffect.includes(uid);

            // Calculate position classes based on index
            // 0: Top Left, 1: Top Right, 2: Bottom Left, 3: Bottom Right
            // For more than 4 players, we might need a different layout, but for now let's stick to corners/sides
            let positionClass = '';
            if (players.length <= 4) {
              if (index === 0) positionClass = 'self-start justify-self-start';
              if (index === 1) positionClass = 'self-start justify-self-end';
              if (index === 2) positionClass = 'self-end justify-self-start';
              if (index === 3) positionClass = 'self-end justify-self-end';
            } else {
              // Fallback for many players - just grid flow
              positionClass = '';
            }

            return (
              <button
                key={uid}
                ref={el => playerRefs.current[uid] = el}
                onClick={() => { setSelectedRecipientId(uid); setShowBankingModal(true); clickSound.play(); }}
                className={`
                  ${positionClass}
                  relative p-3 rounded-xl border transition-all duration-300 w-full max-w-[160px]
                  ${isSelected
                    ? 'bg-cyan-500/20 border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.3)] scale-105'
                    : isCurrentUser
                      ? 'bg-green-500/10 border-green-500/50 hover:bg-green-500/20 hover:border-green-500'
                      : 'bg-black/40 border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10'
                  }
                  ${hasEffect ? 'animate-pulse ring-2 ring-green-400 shadow-[0_0_30px_rgba(74,222,128,0.5)]' : ''}
                `}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    {/* Dynamic Avatar Frame */}
                    <AvatarFrame
                      balance={playerData.balance}
                      totalMoney={totalMoney}
                      size={84}
                      offset={22}
                    />

                    {playerData.avatarURL ? (
                      <img
                        src={playerData.avatarURL}
                        alt="Avatar"
                        className={`w-10 h-10 rounded-full object-cover border-2 relative z-10 ${isSelected ? 'border-cyan-400' : 'border-white/20'}`}
                      />
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 relative z-10 ${isSelected ? 'border-cyan-400 bg-cyan-500/20' : 'border-white/20 bg-white/5'}`}>
                        <span className="text-lg">👤</span>
                      </div>
                    )}
                    {isCurrentUser && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black z-30"></div>
                    )}
                  </div>

                  <div className="text-center w-full overflow-hidden mt-4">
                    <h6 className={`text-sm font-bold truncate mb-0.5 ${isSelected ? 'text-cyan-300' : 'text-gray-200'}`}>
                      {playerData.name}
                    </h6>
                    <p className={`text-xs font-mono font-bold ${isSelected ? 'text-cyan-400' : 'text-gray-400'}`}>
                      {formatCurrency(playerData.balance, currencySymbol, currencyCode)}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayerList;
