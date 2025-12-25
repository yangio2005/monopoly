import React from 'react';
import { useGameRoom } from './GameRoomProvider';

const BankSettingsModal = () => {
  const {
    user,
    roomData,
    newCurrencySymbol,
    setNewCurrencySymbol,
    newCurrencyCode,
    setNewCurrencyCode,
    handleUpdateCurrencySettings,
    BANK_UID,
    newGameUnit,
    setNewGameUnit,
    showBankSettingsModal,
    setShowBankSettingsModal,
    clickSound,
  } = useGameRoom();

  if (!showBankSettingsModal || user.uid !== BANK_UID) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => { setShowBankSettingsModal(false); clickSound.play(); }}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-gray-900/90 rounded-2xl border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.2)] overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 p-4 border-b border-white/10 flex items-center justify-between">
          <h5 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
            <span className="text-2xl">⚙️</span> BANK CONFIGURATION
          </h5>
          <button
            type="button"
            className="text-gray-400 hover:text-white transition-colors"
            onClick={() => { setShowBankSettingsModal(false); clickSound.play(); }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-6">


          <div className="grid grid-cols-2 gap-4">
            {/* Currency Symbol */}
            <div className="space-y-2">
              <label htmlFor="currencySymbolInput" className="block text-sm font-mono text-yellow-400">SYMBOL</label>
              <input
                type="text"
                className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-500 transition-colors font-mono"
                id="currencySymbolInput"
                value={newCurrencySymbol}
                onChange={(e) => setNewCurrencySymbol(e.target.value)}
                placeholder="e.g., $"
              />
              {roomData.currencySymbol && (
                <div className="text-xs font-mono text-gray-500">
                  CURRENT: <span className="text-white">{roomData.currencySymbol}</span>
                </div>
              )}
            </div>

            {/* Currency Code */}
            <div className="space-y-2">
              <label htmlFor="currencyCodeInput" className="block text-sm font-mono text-yellow-400">CODE</label>
              <input
                type="text"
                className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-500 transition-colors font-mono"
                id="currencyCodeInput"
                value={newCurrencyCode}
                onChange={(e) => setNewCurrencyCode(e.target.value)}
                placeholder="e.g., USD"
              />
              {roomData.currencyCode && (
                <div className="text-xs font-mono text-gray-500">
                  CURRENT: <span className="text-white">{roomData.currencyCode}</span>
                </div>
              )}
            </div>
          </div>

          {/* Game Unit */}
          <div className="space-y-2">
            <label htmlFor="gameUnitSelect" className="block text-sm font-mono text-yellow-400">GAME UNIT</label>
            <div className="relative">
              <select
                id="gameUnitSelect"
                className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white appearance-none focus:outline-none focus:border-yellow-500 transition-colors"
                value={newGameUnit}
                onChange={(e) => setNewGameUnit(e.target.value)}
              >
                <option value="">Standard (None)</option>
                <option value="thousands">Thousands (k)</option>
                <option value="millions">Millions (m)</option>
                <option value="billions">Billions (b)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            {roomData.gameUnit && (
              <div className="text-xs font-mono text-gray-500">
                CURRENT: <span className="text-white">{roomData.gameUnit}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-black/20 border-t border-white/10 flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all font-mono text-sm"
            onClick={() => { setShowBankSettingsModal(false); clickSound.play(); }}
          >
            CLOSE
          </button>
          <button
            type="button"
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transition-all font-mono text-sm"
            onClick={() => { handleUpdateCurrencySettings(); clickSound.play(); }}
          >
            SAVE CONFIG
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankSettingsModal;
