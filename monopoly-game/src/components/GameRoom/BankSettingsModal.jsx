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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-retro">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 opacity-85"
        onClick={() => { setShowBankSettingsModal(false); clickSound.play(); }}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#1a1a1a] border-[8px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in duration-100">
        {/* Header */}
        <div className="bg-black p-4 border-b-8 border-black flex items-center justify-between">
          <h5 className="text-[14px] font-bold text-[#ffcc00] uppercase flex items-center gap-3">
            <span className="animate-pulse">⚙</span> BANK_CONFIG
          </h5>
          <button
            type="button"
            className="text-white hover:text-[#ffcc00]"
            onClick={() => { setShowBankSettingsModal(false); clickSound.play(); }}
          >
            [X]
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            {/* Currency Symbol */}
            <div className="space-y-3">
              <label htmlFor="currencySymbolInput" className="block text-[10px] font-bold text-gray-500 uppercase">SYMBOL</label>
              <input
                type="text"
                className="w-full bg-black border-4 border-white p-3 text-white text-[12px] focus:outline-none focus:border-[#ffcc00] shadow-[inset_4px_4px_0px_rgba(0,0,0,1)]"
                id="currencySymbolInput"
                value={newCurrencySymbol}
                onChange={(e) => setNewCurrencySymbol(e.target.value)}
                placeholder="$"
              />
              {roomData.currencySymbol && (
                <div className="text-[8px] text-gray-600">
                  NOW: {roomData.currencySymbol}
                </div>
              )}
            </div>

            {/* Currency Code */}
            <div className="space-y-3">
              <label htmlFor="currencyCodeInput" className="block text-[10px] font-bold text-gray-500 uppercase">CODE</label>
              <input
                type="text"
                className="w-full bg-black border-4 border-white p-3 text-white text-[12px] focus:outline-none focus:border-[#ffcc00] shadow-[inset_4px_4px_0px_rgba(0,0,0,1)]"
                id="currencyCodeInput"
                value={newCurrencyCode}
                onChange={(e) => setNewCurrencyCode(e.target.value)}
                placeholder="USD"
              />
              {roomData.currencyCode && (
                <div className="text-[8px] text-gray-600">
                  NOW: {roomData.currencyCode}
                </div>
              )}
            </div>
          </div>

          {/* Game Unit */}
          <div className="space-y-3">
            <label htmlFor="gameUnitSelect" className="block text-[10px] font-bold text-gray-500 uppercase">UNIT_SCALE</label>
            <div className="relative">
              <select
                id="gameUnitSelect"
                className="w-full bg-black border-4 border-white p-3 text-white text-[12px] appearance-none focus:outline-none focus:border-[#ffcc00]"
                value={newGameUnit}
                onChange={(e) => setNewGameUnit(e.target.value)}
              >
                <option value="">STANDARD (1:1)</option>
                <option value="thousands">THOUSANDS (k)</option>
                <option value="millions">MILLIONS (m)</option>
                <option value="billions">BILLIONS (b)</option>
              </select>
            </div>
            {roomData.gameUnit && (
              <div className="text-[8px] text-gray-600 font-bold">
                NOW: {roomData.gameUnit.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-black flex flex-col gap-4">
          <button
            type="button"
            className="w-full py-4 bg-[#ffcc00] border-4 border-black text-black text-[14px] font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            onClick={() => { handleUpdateCurrencySettings(); clickSound.play(); }}
          >
            WRITE_CONFIG
          </button>
          <button
            type="button"
            className="w-full py-3 bg-[#333] border-4 border-black text-white text-[10px] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            onClick={() => { setShowBankSettingsModal(false); clickSound.play(); }}
          >
            DISCARD_CHANGES
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankSettingsModal;
