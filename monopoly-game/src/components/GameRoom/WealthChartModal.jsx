import React from 'react';
import { useGameRoom } from './GameRoomProvider';
import { formatCurrency } from '../../utils/formatters.jsx';

const WealthChartModal = ({ isOpen, onClose }) => {
    const { roomData, user, clickSound, BANK_UID, currencySymbol, currencyCode } = useGameRoom();

    if (!isOpen || !roomData) return null;

    const players = roomData.players ? Object.entries(roomData.players).filter(([uid]) => uid !== BANK_UID) : [];
    const sortedPlayers = [...players].sort(([, a], [, b]) => b.balance - a.balance);
    const maxBalance = Math.max(...sortedPlayers.map(([, p]) => p.balance), 1);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-retro">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 opacity-85"
                onClick={() => { onClose(); clickSound.play(); }}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-[#1a1a1a] border-[8px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[85vh] animate-in zoom-in duration-100">

                {/* Header */}
                <div className="bg-black p-4 border-b-8 border-black flex items-center justify-between flex-shrink-0">
                    <h5 className="text-[14px] font-bold text-[#f0f] uppercase flex items-center gap-3">
                        <span className="animate-pulse">▶</span> LEADERBOARD
                    </h5>
                    <button
                        type="button"
                        className="text-white hover:text-[#f0f]"
                        onClick={() => { onClose(); clickSound.play(); }}
                    >
                        [X]
                    </button>
                </div>

                {/* Chart Area */}
                <div className="p-8 overflow-y-auto custom-scrollbar bg-black/50">
                    <div className="space-y-8">
                        {sortedPlayers.map(([uid, playerData], index) => {
                            const isCurrentUser = uid === user.uid;
                            const percentage = Math.max((playerData.balance / maxBalance) * 100, 2);

                            return (
                                <div key={uid} className="relative">
                                    <div className="flex justify-between items-end mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[12px] font-bold ${index === 0 ? 'text-[#ffcc00]' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-[#ff6600]' : 'text-gray-600'}`}>
                                                #{index + 1}
                                            </span>
                                            <span className={`text-[10px] font-bold uppercase truncate max-w-[150px] ${isCurrentUser ? 'text-[#40ff00]' : 'text-white'}`}>
                                                {playerData.name}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold text-[#00f0ff]">
                                            {formatCurrency(playerData.balance, currencySymbol, currencyCode)}
                                        </span>
                                    </div>

                                    {/* Pixel Bar */}
                                    <div className="h-6 w-full bg-[#222] border-4 border-black relative overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ease-out
                                                ${isCurrentUser ? 'bg-[#40ff00]' : 'bg-[#f0f]'}
                                            `}
                                            style={{ width: `${percentage}%` }}
                                        >
                                            {/* Retro Scanline on bar */}
                                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.5) 50%, transparent 50%)', backgroundSize: '100% 2px' }}></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-black border-t-8 border-black flex flex-col gap-4 flex-shrink-0">
                    <div className="text-[8px] text-gray-500 uppercase flex justify-between">
                        <span>Global_Economy:</span>
                        <span className="text-white">
                            {formatCurrency(sortedPlayers.reduce((acc, [, p]) => acc + p.balance, 0), currencySymbol, currencyCode)}
                        </span>
                    </div>
                    <button
                        onClick={() => { onClose(); clickSound.play(); }}
                        className="w-full py-3 bg-white border-4 border-black text-black text-[12px] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ffcc00] transition-all"
                    >
                        DISMISS
                    </button>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border: 2px solid #000; }
            `}</style>
        </div>
    );
};

export default WealthChartModal;
