import React, { useState, useEffect } from 'react';
import QuickTransferInput from '../../components/Calculator/QuickTransferInput';
import { useGameRoom } from './GameRoomProvider';

const BankingModal = () => {
  const {
    user,
    roomData,
    showBankingModal,
    setShowBankingModal,
    transferError,
    transferAmount,
    setTransferAmount,
    selectedRecipientId,
    setSelectedRecipientId,
    handleTransfer,
    clickSound,
    BANK_UID,
    currencySymbol,
  } = useGameRoom();

  // Reset transfer amount when modal opens/closes
  useEffect(() => {
    if (!showBankingModal) {
      setTransferAmount('');
    }
  }, [showBankingModal, setTransferAmount]);

  if (!showBankingModal || !roomData) return null;

  const players = roomData.players ? Object.entries(roomData.players).filter(([uid]) => uid !== BANK_UID) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => { setShowBankingModal(false); clickSound.play(); }}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-gray-900/90 rounded-2xl border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.2)] overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-900/50 to-purple-900/50 p-4 border-b border-white/10 flex items-center justify-between">
          <h5 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
            <span className="text-2xl">💸</span> TRANSFER CREDITS
          </h5>
          <button
            type="button"
            className="text-gray-400 hover:text-white transition-colors"
            onClick={() => { setShowBankingModal(false); clickSound.play(); }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {transferError && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 text-red-400 rounded-lg text-sm flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {transferError}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="recipientSelect" className="block text-sm font-mono text-cyan-400">RECIPIENT</label>
            <div className="relative">
              <select
                id="recipientSelect"
                className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white appearance-none focus:outline-none focus:border-cyan-500 transition-colors cursor-not-allowed opacity-70"
                value={selectedRecipientId}
                onChange={(e) => setSelectedRecipientId(e.target.value)}
                required
                disabled
              >
                <option value="">Select Recipient</option>
                <option value={BANK_UID}>Bank</option>
                {players.filter(([uid]) => uid !== user.uid).map(([uid, playerData]) => (
                  <option key={uid} value={uid}>{playerData.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="transferAmountInput" className="block text-sm font-mono text-cyan-400">AMOUNT</label>
            <QuickTransferInput
              value={transferAmount}
              onValueChange={setTransferAmount}
              currencySymbol={currencySymbol}
            />
          </div>
        </div>

        <div className="p-4 bg-black/20 border-t border-white/10 flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all font-mono text-sm"
            onClick={() => { setShowBankingModal(false); clickSound.play(); }}
          >
            CANCEL
          </button>
          <button
            type="button"
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
            onClick={() => { handleTransfer(); clickSound.play(); }}
            disabled={!transferAmount || isNaN(parseFloat(transferAmount)) || parseFloat(transferAmount) <= 0}
          >
            INITIATE TRANSFER
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankingModal;
