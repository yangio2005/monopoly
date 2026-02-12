import React from 'react';
import MoneyTransferAnimation from './MoneyTransferAnimation';
import ShareRoomModal from './GameRoom/ShareRoomModal';
import BankingModal from './GameRoom/BankingModal';
import PlayerList from './GameRoom/PlayerList';
import MobilePlayerList from './GameRoom/MobilePlayerList';
import TransactionLog from './GameRoom/TransactionLog';
import BankSettingsModal from './GameRoom/BankSettingsModal';
import WealthChartModal from './GameRoom/WealthChartModal';
import { GameRoomProvider, useGameRoom } from './GameRoom/GameRoomProvider';
import GameRoomCharacters from './GameRoom/GameRoomCharacters';
import TransactionBanner from './GameRoom/TransactionBanner';

const GameRoomContent = () => {
  const { roomId, roomData, loading, error, setShowShareModal, clickSound, isAnimating, animationDetails, user, BANK_UID, setShowBankSettingsModal, showWealthModal, setShowWealthModal, characterTransactionType } = useGameRoom();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] font-retro">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-[#ffcc00] border-4 border-black animate-bounce shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
          <div className="text-[#ffcc00] text-xl animate-pulse tracking-widest">INITIALIZING...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 font-retro">
        <div className="bg-[#ff3333] border-8 border-black text-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-md w-full text-center">
          <div className="text-4xl mb-4 animate-flicker">⚠️</div>
          <h3 className="text-xl font-bold mb-4">SYSTEM_HALT</h3>
          <p className="text-[10px] leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-white text-black border-4 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            REBOOT
          </button>
        </div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-gray-500 font-retro">
        <p className="animate-pulse text-[10px]">DISK_READ_ERROR: DATA_NOT_FOUND</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-retro pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Retro Grid Background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}>
      </div>

      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 crt-overlay opacity-[0.04]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section - Exactly like the image */}
        <div className="relative mb-8 md:mb-14 p-4 md:p-8 bg-[#0a0a0a] border-[4px] border-[#ffcc00] shadow-[0_0_20px_rgba(255,204,0,0.2)] overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="text-center lg:text-left w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row items-center lg:items-baseline gap-2 md:gap-4 justify-center lg:justify-start">
                <span className={`text-[#ffcc00] font-black leading-none ${(roomId?.length > 4) ? 'text-[24px] md:text-[32px]' : 'text-[40px] md:text-[48px]'} break-all`}>
                  {roomId?.toUpperCase() || '3'}
                </span>
                <h2 className="text-[20px] md:text-[28px] lg:text-[32px] font-black text-white tracking-widest uppercase whitespace-nowrap">
                  MONOPOLY DIGITAL
                </h2>
              </div>
              <div className="flex items-center gap-3 mt-4 justify-center lg:justify-start">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-[#40ff00] shadow-[0_0_10px_#40ff00]"></div>
                <span className="text-[10px] md:text-[12px] text-[#40ff00] font-bold uppercase tracking-widest truncate max-w-[200px] md:max-w-none">
                  ROOM {roomData.name || roomId}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
              <button
                className="px-4 md:px-8 py-2 md:py-3 bg-[#ffffcc] border-4 border-black text-black text-[10px] md:text-[14px] font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                onClick={() => { setShowWealthModal(true); clickSound.play(); }}
              >
                [STATS]
              </button>

              <button
                className="px-4 md:px-8 py-2 md:py-3 bg-[#ccffff] border-4 border-black text-black text-[10px] md:text-[14px] font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                onClick={() => { setShowShareModal(true); clickSound.play(); }}
              >
                [SHARE]
              </button>

              {user && user.uid === BANK_UID && (
                <button
                  className="px-3 md:px-4 py-2 md:py-3 bg-[#ffccff] border-4 border-black text-black text-[10px] md:text-[12px] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  onClick={() => { setShowBankSettingsModal(true); clickSound.play(); }}
                >
                  [ADMIN]
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-10 bg-[#ff3333] border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-shake text-[10px] font-bold flex items-center gap-3">
            <span className="text-xl">!</span> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Players */}
          <div className="space-y-10">
            {/* Mobile View */}
            <div className="lg:hidden">
              <MobilePlayerList />
            </div>
            {/* Desktop View */}
            <div className="hidden lg:block">
              <PlayerList />
            </div>
          </div>

          {/* Right Column: Banking & Logs */}
          <div className="space-y-10">
            <div className="bg-[#111] border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <BankingModal />
            </div>
            <div className="bg-[#111] border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <TransactionLog />
            </div>
          </div>
        </div>
      </div>

      <ShareRoomModal />
      <BankSettingsModal />
      <WealthChartModal isOpen={showWealthModal} onClose={() => setShowWealthModal(false)} />
      <MoneyTransferAnimation isAnimating={isAnimating} animationDetails={animationDetails} />
      <GameRoomCharacters transactionType={characterTransactionType} />
      <TransactionBanner />

      <style jsx>{`
        .crt-overlay {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 4px, 3px 100%;
        }
        
        @keyframes flicker {
          0% { opacity: 0.9; } 5% { opacity: 1; } 10% { opacity: 0.9; } 
          15% { opacity: 1; } 80% { opacity: 1; } 85% { opacity: 0.8; } 
          90% { opacity: 1; }
        }

        .animate-flicker { animation: flicker 0.1s infinite; }
        
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          10%, 30%, 50%, 70%, 90% { transform: translate(-4px, 0); }
          20%, 40%, 60%, 80% { transform: translate(4px, 0); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

const GameRoomPage = () => (
  <GameRoomProvider>
    <GameRoomContent />
  </GameRoomProvider>
);

export default GameRoomPage;