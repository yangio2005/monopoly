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
        <div className="flex flex-col gap-6 font-retro">
            {/* Bank Card - Strip style */}
            <div className="bg-[#0f0f0f] border-[1px] border-[#333] shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                <div
                    onClick={() => { setSelectedRecipientId(BANK_UID); setShowBankingModal(true); clickSound.play(); }}
                    className={`p-4 flex items-center justify-between transition-all cursor-pointer ${selectedRecipientId === BANK_UID ? 'bg-[#111] ring-2 ring-[#40ff00] ring-inset' : ''}`}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#1a1a1a] flex items-center justify-center border-[1px] border-[#444]">
                            <span className="text-xl opacity-80 filter saturate-0">🏢</span>
                        </div>
                        <div className="text-left">
                            <div className="text-[7px] text-gray-500 font-bold mb-0.5 uppercase tracking-widest">CENTRAL BANK</div>
                            <div className="text-[16px] font-black text-[#66ccff]">
                                {formatCurrency(bank.balance, currencySymbol, currencyCode)}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-[7px] font-black text-[#ffcc00] hidden sm:block">DEPOSIT</div>
                        <div className="text-[#0080ff] text-xl transform rotate-0">▶</div>
                    </div>
                </div>
            </div>

            {/* Players Horizontal Scroll */}
            <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                <div className="flex gap-4 w-max py-2">
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
                                    relative p-4 bg-[#0a0a0a] border-[1px] transition-all w-[140px] flex-shrink-0 flex flex-col items-center gap-4
                                    ${isSelected
                                        ? 'border-[#40ff00] ring-1 ring-[#40ff00] ring-inset shadow-[0_0_15px_rgba(64,255,0,0.2)]'
                                        : 'border-[#333]'
                                    }
                                    ${hasEffect ? 'animate-pulse' : ''}
                                `}
                            >
                                <div className="relative">
                                    {/* Gold Frame Effect */}
                                    <div className="absolute inset-[-8px] border-[1px] border-[#ffcc00]/20 rounded-full scale-110 opacity-30"></div>

                                    <AvatarFrame
                                        balance={playerData.balance}
                                        totalMoney={totalMoney}
                                        size={90}
                                        offset={30}
                                    />

                                    <div className={`w-14 h-14 overflow-hidden bg-[#111] border-[1px] ${isSelected ? 'border-[#40ff00]' : 'border-[#444]'} relative z-10`}>
                                        {playerData.avatarURL ? (
                                            <img
                                                src={playerData.avatarURL}
                                                alt="Avatar"
                                                className="w-full h-full object-cover pixelated"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl bg-[#222]">
                                                👤
                                            </div>
                                        )}
                                        <div className="absolute top-0 right-0 w-3 h-3 bg-[#40ff00] border border-[#0a0a0a] z-20"></div>
                                    </div>
                                </div>

                                <div className="text-center w-full">
                                    <h6 className={`text-[10px] font-black uppercase truncate mb-1 tracking-wide ${isSelected ? 'text-[#40ff00]' : 'text-white'}`}>
                                        {playerData.name}
                                    </h6>
                                    <p className={`text-[8px] font-black ${isSelected ? 'text-[#40ff00]' : 'text-[#40ff00]/60'}`}>
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
