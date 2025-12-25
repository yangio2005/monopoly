import React from 'react';
import { useGameRoom } from './GameRoomProvider';
import { formatCurrency } from '../../utils/formatters.jsx';
import AvatarFrame from './AvatarFrame';

const MobilePlayerList = () => {
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

    // Calculate Total Money (excluding Bank)
    const totalMoney = players.reduce((sum, [, p]) => sum + (p.balance || 0), 0);

    return (
        <div className="flex flex-col gap-4">
            {/* Bank Card - Prominent at the top */}
            <button
                ref={bankRef}
                onClick={() => { setSelectedRecipientId(BANK_UID); setShowBankingModal(true); clickSound.play(); }}
                className={`
          w-full relative p-4 rounded-xl border transition-all duration-300 flex items-center justify-between
          ${selectedRecipientId === BANK_UID
                        ? 'bg-yellow-500/20 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                        : 'bg-black/40 border-yellow-500/30 active:bg-yellow-500/10'
                    }
        `}
            >
                <div className="flex items-center gap-3">
                    <div className={`
            w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
            ${selectedRecipientId === BANK_UID ? 'border-yellow-400 bg-yellow-500/20' : 'border-yellow-500/30 bg-black/50'}
          `}>
                        <span className="text-2xl">🏦</span>
                    </div>
                    <div className="text-left">
                        <div className="text-xs font-mono text-yellow-500/80">CENTRAL BANK</div>
                        <div className="text-xl font-bold text-yellow-400 font-mono tracking-tight">
                            {formatCurrency(bank.balance, currencySymbol, currencyCode)}
                        </div>
                    </div>
                </div>
                <div className="text-yellow-500/50">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
            </button>

            {/* Players Horizontal Scroll */}
            <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                <div className="flex gap-3 w-max">
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
                  relative p-3 rounded-xl border transition-all duration-300 w-[140px] flex-shrink-0 flex flex-col items-center gap-3
                  ${isSelected
                                        ? 'bg-cyan-500/20 border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                                        : isCurrentUser
                                            ? 'bg-green-500/10 border-green-500/50'
                                            : 'bg-black/40 border-white/10'
                                    }
                  ${hasEffect ? 'animate-pulse ring-2 ring-green-400 shadow-[0_0_30px_rgba(74,222,128,0.5)]' : ''}
                `}
                            >
                                <div className="relative">
                                    {/* Dynamic Avatar Frame */}
                                    <AvatarFrame
                                        balance={playerData.balance}
                                        totalMoney={totalMoney}
                                        size={100}
                                        offset={26}
                                    />

                                    {playerData.avatarURL ? (
                                        <img
                                            src={playerData.avatarURL}
                                            alt="Avatar"
                                            className={`w-12 h-12 rounded-full object-cover border-2 relative z-10 ${isSelected ? 'border-cyan-400' : 'border-white/20'}`}
                                        />
                                    ) : (
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 relative z-10 ${isSelected ? 'border-cyan-400 bg-cyan-500/20' : 'border-white/20 bg-white/5'}`}>
                                            <span className="text-xl">👤</span>
                                        </div>
                                    )}
                                    {isCurrentUser && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black z-30"></div>
                                    )}
                                </div>

                                <div className="text-center w-full overflow-hidden mt-4">
                                    <h6 className={`text-sm font-bold truncate mb-1 ${isSelected ? 'text-cyan-300' : 'text-gray-200'}`}>
                                        {playerData.name}
                                    </h6>
                                    <p className={`text-xs font-mono font-bold ${isSelected ? 'text-cyan-400' : 'text-gray-400'}`}>
                                        {formatCurrency(playerData.balance, currencySymbol, currencyCode)}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MobilePlayerList;
