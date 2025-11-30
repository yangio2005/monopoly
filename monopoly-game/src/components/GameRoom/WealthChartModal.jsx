import React from 'react';
import { useGameRoom } from './GameRoomProvider';
import { formatCurrency } from '../../utils/formatters.jsx';

const WealthChartModal = ({ isOpen, onClose }) => {
    const { roomData, user, clickSound, BANK_UID, currencySymbol, currencyCode } = useGameRoom();

    if (!isOpen || !roomData) return null;

    const players = roomData.players ? Object.entries(roomData.players).filter(([uid]) => uid !== BANK_UID) : [];

    // Sort players by balance descending
    const sortedPlayers = [...players].sort(([, a], [, b]) => b.balance - a.balance);

    // Find max balance for scaling (avoid division by zero)
    const maxBalance = Math.max(...sortedPlayers.map(([, p]) => p.balance), 1);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={() => { onClose(); clickSound.play(); }}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-gray-900/95 rounded-2xl border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[80vh]">

                {/* Header */}
                <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
                    <h5 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                        <span className="text-2xl">📊</span> WEALTH ANALYTICS
                    </h5>
                    <button
                        type="button"
                        className="text-gray-400 hover:text-white transition-colors"
                        onClick={() => { onClose(); clickSound.play(); }}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Chart Area */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-5">
                        {sortedPlayers.map(([uid, playerData], index) => {
                            const isCurrentUser = uid === user.uid;
                            const percentage = Math.max((playerData.balance / maxBalance) * 100, 1); // Min 1% width

                            return (
                                <div key={uid} className="relative">
                                    <div className="flex justify-between items-end mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold font-mono ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                                                #{index + 1}
                                            </span>
                                            <span className={`text-sm font-bold truncate max-w-[120px] ${isCurrentUser ? 'text-green-400' : 'text-white'}`}>
                                                {playerData.name} {isCurrentUser && '(YOU)'}
                                            </span>
                                        </div>
                                        <span className="text-sm font-mono font-bold text-cyan-400">
                                            {formatCurrency(playerData.balance, currencySymbol, currencyCode)}
                                        </span>
                                    </div>

                                    {/* Bar Background */}
                                    <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
                                        {/* Bar Fill */}
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ease-out relative group
                        ${isCurrentUser
                                                    ? 'bg-gradient-to-r from-green-600 to-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]'
                                                    : 'bg-gradient-to-r from-purple-600 to-cyan-500'
                                                }
                      `}
                                            style={{ width: `${percentage}%` }}
                                        >
                                            {/* Shine Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-black/20 border-t border-white/10 flex justify-center flex-shrink-0">
                    <div className="text-xs font-mono text-gray-500">
                        TOTAL ECONOMY: {formatCurrency(sortedPlayers.reduce((acc, [, p]) => acc + p.balance, 0), currencySymbol, currencyCode)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WealthChartModal;
