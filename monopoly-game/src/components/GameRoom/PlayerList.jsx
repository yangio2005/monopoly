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
  const totalMoney = players.reduce((sum, [, p]) => sum + (p.balance || 0), 0);

  return (
    <div className="flex flex-col gap-8 font-retro">
      {/* Central Bank Strip - Exactly like the second image */}
      <div className="bg-[#0f0f0f] border-[1px] border-[#333] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="w-14 h-14 bg-[#1a1a1a] flex items-center justify-center border-[1px] border-[#444] shadow-inner">
              <span className="text-3xl filter saturate-0 opacity-80">�</span>
            </div>
            <div className="text-left">
              <div className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-widest">CENTRAL BANK</div>
              <div className="text-[28px] font-black text-[#66ccff] leading-none flex items-baseline gap-2">
                {formatCurrency(bank.balance, currencySymbol, currencyCode)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => { setSelectedRecipientId(BANK_UID); setShowBankingModal(true); clickSound.play(); }}
              className="px-6 py-3 bg-[#ffcc00] text-black text-[12px] font-black uppercase hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_0_#997700]"
            >
              DEPOSIT / WITHDRAW
            </button>
            <button className="w-10 h-10 bg-[#0080ff] flex items-center justify-center text-white text-xl">
              <span className="transform rotate-0">▶</span>
            </button>
          </div>
        </div>
      </div>

      {/* Players Grid - Card styles from the second image */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {players.map(([uid, playerData]) => {
          const isCurrentUser = uid === user.uid;
          const isSelected = selectedRecipientId === uid;
          const hasEffect = playersWithEffect.includes(uid);

          return (
            <button
              key={uid}
              ref={el => playerRefs.current[uid] = el}
              onClick={() => { setSelectedRecipientId(uid); setShowBankingModal(true); clickSound.play(); }}
              className={`
                relative p-6 bg-[#0a0a0a] border-[1px] transition-all flex flex-col items-center gap-6 group
                ${isSelected
                  ? 'border-[#40ff00] ring-2 ring-[#40ff00] ring-inset'
                  : 'border-[#333] hover:border-[#555]'
                }
                ${hasEffect ? 'animate-pulse' : ''}
              `}
            >
              <div className="relative">
                {/* Gold Frame Effect */}
                <div className="absolute inset-[-12px] border-[2px] border-[#ffcc00]/30 rounded-full scale-110 opacity-50"></div>

                <AvatarFrame
                  balance={playerData.balance}
                  totalMoney={totalMoney}
                  size={110}
                  offset={36}
                />

                <div className="w-20 h-20 overflow-hidden bg-[#111] border-[1px] border-[#444] relative z-10">
                  {playerData.avatarURL ? (
                    <img
                      src={playerData.avatarURL}
                      alt="Avatar"
                      className="w-full h-full object-cover pixelated"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-[#222]">
                      👤
                    </div>
                  )}
                  {/* Status Indicator */}
                  <div className="absolute top-0 right-0 w-4 h-4 bg-[#40ff00] border-2 border-[#0a0a0a] z-20"></div>
                </div>
              </div>

              <div className="text-center w-full">
                <h6 className="text-[12px] font-black text-white uppercase mb-2 tracking-wide truncate">
                  {playerData.name}
                </h6>
                <p className="text-[10px] font-black text-[#40ff00]">
                  {formatCurrency(playerData.balance, currencySymbol, currencyCode)}
                </p>
              </div>

              {isSelected && (
                <div className="absolute -bottom-2 w-1/2 h-1 bg-[#40ff00] shadow-[0_0_10px_#40ff00]"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerList;
