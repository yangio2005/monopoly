import React, { useEffect } from 'react';
import { useGameRoom } from './GameRoomProvider';
import { formatCurrency } from '../../utils/formatters.jsx';

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
    currencyCode,
  } = useGameRoom();

  const [mode, setMode] = React.useState('send'); // 'send' or 'collect'

  useEffect(() => {
    if (!showBankingModal) {
      setTransferAmount('');
      setMode('send');
    }
  }, [showBankingModal, setTransferAmount]);

  if (!showBankingModal || !roomData) return null;

  const isBanker = user.uid === BANK_UID || roomData.banker === user.uid;
  const targetRecipientId = selectedRecipientId;
  const recipient = targetRecipientId === BANK_UID
    ? { name: "CENTRAL BANK", balance: roomData.bank || 0, avatarURL: null }
    : roomData.players[targetRecipientId];

  const userBalance = roomData.players[user.uid]?.balance || 0;
  const userAvatar = roomData.players[user.uid]?.avatarURL;
  const recipientBalance = recipient?.balance || 0;
  const recipientAvatar = recipient?.avatarURL;
  const canCollect = targetRecipientId === BANK_UID || isBanker;

  const suggestions = [
    { label: '5k', value: 5000 },
    { label: '10k', value: 10000 },
    { label: '50k', value: 50000 },
    { label: '100k', value: 100000 },
    { label: '500k', value: 500000 },
    { label: '1M', value: 1000000 },
    { label: '5M', value: 5000000 },
    { label: '10M', value: 10000000 },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-retro">
      <div
        className={`absolute inset-0 transition-colors duration-700 backdrop-blur-[6px] ${mode === 'send' ? 'bg-cyan-950/30' : 'bg-red-950/30'}`}
        onClick={() => { setShowBankingModal(false); clickSound.play(); }}
      ></div>

      <div className="relative w-full max-w-sm md:max-w-md bg-[#0d0d0d] border border-[#222] shadow-[0_30px_90px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col mx-2">

        {/* Mode Toggle Header */}
        <div className="px-5 py-3 border-b border-[#222] flex items-center justify-between bg-[#111]">
          <h4 className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#555]">
            PROTOCOL_INIT: <span className={mode === 'send' ? 'text-[#40ffcc]' : 'text-[#ff4d4d]'}>{mode.toUpperCase()}</span>
          </h4>

          {canCollect && (
            <div className="flex bg-black p-0.5 border border-[#333] rounded-sm">
              <button
                onClick={() => { setMode('send'); clickSound.play(); }}
                className={`px-3 py-1 text-[8px] font-black transition-all ${mode === 'send' ? 'bg-[#40ffcc] text-black' : 'text-[#444] hover:text-[#888]'}`}
              >
                PAY
              </button>
              <button
                onClick={() => { setMode('collect'); clickSound.play(); }}
                className={`px-3 py-1 text-[8px] font-black transition-all ${mode === 'collect' ? 'bg-[#ff4d4d] text-white' : 'text-[#444] hover:text-[#888]'}`}
              >
                COLLECT
              </button>
            </div>
          )}
        </div>

        <div className="p-4 md:p-6 space-y-6 md:space-y-8">
          {/* Avatar Flow Display */}
          <div className="flex items-center justify-between gap-1">
            {/* Sender / Me */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className={`relative w-12 h-12 md:w-16 md:h-16 border-2 transition-all duration-500 p-1 ${mode === 'send' ? 'border-[#40ffcc] shadow-[0_0_15px_rgba(64,255,204,0.3)]' : 'border-[#333] opacity-40'}`}>
                <div className="w-full h-full bg-[#111] overflow-hidden">
                  {userAvatar ? (
                    <img src={userAvatar} alt="" className="w-full h-full object-cover pixelated" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl md:text-2xl">👤</div>
                  )}
                </div>
              </div>
              <div className="text-[7px] md:text-[8px] font-black text-white uppercase tracking-tighter">YOU</div>
              <div className="text-[9px] md:text-[10px] font-black text-[#555] tracking-tight">{formatCurrency(userBalance, currencySymbol, currencyCode)}</div>
            </div>

            {/* Animation Arrow & Scroll Loop */}
            <div className="flex-1 flex flex-col items-center relative overflow-hidden h-10 px-2">
              {/* Background Path */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#222]"></div>

              {/* Scrolling Loop Particles */}
              <div className="absolute top-1/2 left-0 right-0 h-[4px] -translate-y-1/2 overflow-hidden pointer-events-none">
                <div
                  className={`flex w-[200%] h-full transition-transform duration-700 ${mode === 'send' ? 'animate-flow-right' : 'animate-flow-left'}`}
                  style={{
                    backgroundImage: `radial-gradient(circle, ${mode === 'send' ? '#40ffcc' : '#ff4d4d'} 1.5px, transparent 1.5px)`,
                    backgroundSize: '24px 100%',
                    backgroundRepeat: 'repeat-x'
                  }}
                />
              </div>

              {/* Central Status Indicator */}
              <div className={`z-10 text-xl md:text-2xl transition-all duration-700 flex items-center h-full ${mode === 'send' ? 'text-[#40ffcc]' : 'text-[#ff4d4d] rotate-180'}`}>
                <span className="relative flex h-2 w-2 md:h-3 md:w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${mode === 'send' ? 'bg-[#40ffcc]' : 'bg-[#ff4d4d]'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 ${mode === 'send' ? 'bg-[#40ffcc]' : 'bg-[#ff4d4d]'}`}></span>
                </span>
                <span className="font-bold ml-1 text-xs md:text-base">➔</span>
              </div>

              <style>{`
                @keyframes flow-right {
                  from { transform: translateX(-50%); }
                  to { transform: translateX(0); }
                }
                @keyframes flow-left {
                  from { transform: translateX(0); }
                  to { transform: translateX(-50%); }
                }
                .animate-flow-right {
                  animation: flow-right 1.5s linear infinite;
                }
                .animate-flow-left {
                  animation: flow-left 1.5s linear infinite;
                }
              `}</style>
            </div>

            {/* Target Avatar */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className={`relative w-12 h-12 md:w-16 md:h-16 border-2 transition-all duration-500 p-1 ${mode === 'collect' ? 'border-[#ff4d4d] shadow-[0_0_15px_rgba(255,77,77,0.3)]' : 'border-[#333] opacity-40'}`}>
                <div className="w-full h-full bg-[#111] overflow-hidden">
                  {recipientAvatar ? (
                    <img src={recipientAvatar} alt="" className="w-full h-full object-cover pixelated" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl md:text-3xl">
                      {targetRecipientId === BANK_UID ? '🏦' : '👤'}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-[7px] md:text-[8px] font-black text-white uppercase tracking-tighter truncate max-w-[60px] md:max-w-[80px]">{recipient?.name}</div>
              <div className="text-[9px] md:text-[10px] font-black text-[#555] tracking-tight">{formatCurrency(recipientBalance, currencySymbol, currencyCode)}</div>
            </div>
          </div>

          {/* Amount Selection */}
          <div className="space-y-4">
            <div className="relative group">
              <div className={`absolute -inset-1 rounded-sm opacity-10 group-focus-within:opacity-30 transition-opacity blur-[1px] ${mode === 'send' ? 'bg-[#40ffcc]' : 'bg-[#ff4d4d]'}`}></div>
              <div className="relative flex items-center bg-black border border-[#222]">
                <div className="pl-3 font-black text-[9px] text-[#444]">{currencyCode}</div>
                <input
                  type="number"
                  inputMode="decimal"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="flex-1 bg-transparent py-3 md:py-4 px-3 md:px-4 text-right text-xl md:text-2xl font-black text-white focus:outline-none placeholder-[#1a1a1a] w-full"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Chips */}
            <div className="grid grid-cols-4 gap-1.5 md:gap-2">
              {suggestions.map((s) => (
                <button
                  key={s.value}
                  onClick={() => { setTransferAmount(String(s.value)); clickSound.play(); }}
                  className="py-2 bg-[#1a1a1a] border border-[#333] text-white text-[8px] md:text-[9px] font-black hover:bg-[#222] transition-colors"
                >
                  {s.label}
                </button>
              ))}
              <button
                onClick={() => { setTransferAmount(String(userBalance)); clickSound.play(); }}
                className="col-span-2 py-2 bg-[#ffcc00] text-black text-[8px] md:text-[9px] font-black hover:brightness-110 active:scale-[0.98]"
              >
                PAY ALL (MAX)
              </button>
              <button
                onClick={() => { setTransferAmount(''); clickSound.play(); }}
                className="col-span-2 py-2 bg-[#333] text-white text-[8px] md:text-[9px] font-black active:scale-[0.98]"
              >
                CLEAR
              </button>
            </div>
          </div>

          {transferError && (
            <div className="text-red-500 text-[8px] font-black uppercase text-center animate-pulse tracking-widest leading-relaxed">
              ! SYST_ERR: {transferError}
            </div>
          )}
        </div>

        {/* Footer Buttons - Smoother Sizing */}
        <div className="p-3 md:p-4 border-t border-[#1a1a1a] flex gap-3 bg-[#0a0a0a]">
          <button
            onClick={() => { setShowBankingModal(false); clickSound.play(); }}
            className="px-4 py-2 text-[#444] text-[8px] md:text-[9px] font-black uppercase hover:text-white transition-all tracking-wider"
          >
            ABORT
          </button>
          <button
            onClick={() => {
              clickSound.play();
              if (mode === 'send') {
                handleTransfer();
              } else {
                const originalRecipient = targetRecipientId;
                setSelectedRecipientId(user.uid);
                setTimeout(() => {
                  handleTransfer(originalRecipient);
                }, 50);
              }
            }}
            disabled={!transferAmount || parseFloat(transferAmount) <= 0}
            className={`flex-1 py-3 text-black text-[12px] md:text-[14px] font-black uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-5 disabled:grayscale ${mode === 'send' ? 'bg-[#40ffcc]' : 'bg-[#ff4d4d] text-white'}`}
          >
            {mode === 'send' ? 'INIT DISBURSE' : 'AUTH COLLECT'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankingModal;
