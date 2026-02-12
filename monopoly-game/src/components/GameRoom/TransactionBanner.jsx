import React from 'react';
import { useGameRoom } from './GameRoomProvider';
import { formatCurrency } from '../../utils/formatters.jsx';

const TransactionBanner = () => {
    const { recentTransaction, currencySymbol, currencyCode } = useGameRoom();

    if (!recentTransaction) return null;

    return (
        <div className="fixed top-24 right-4 z-[100] animate-in slide-in-from-right-full duration-300 font-retro">
            <div className="bg-[#40ff00] border-4 border-black px-6 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                <div className="w-3 h-3 bg-black animate-pulse"></div>
                <span className="text-black text-[12px] font-black uppercase tracking-tight">
                    +{formatCurrency(recentTransaction.amount, currencySymbol, currencyCode)} to {recentTransaction.recipientName}
                </span>
            </div>
        </div>
    );
};

export default TransactionBanner;
