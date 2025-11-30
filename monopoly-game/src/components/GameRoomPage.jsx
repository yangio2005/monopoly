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

const GameRoomContent = () => {
  const { roomId, roomData, loading, error, setShowShareModal, clickSound, isAnimating, animationDetails, user, BANK_UID, setShowBankSettingsModal, showWealthModal, setShowWealthModal } = useGameRoom();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-cyan-400 font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <div className="animate-pulse">INITIALIZING CONNECTION...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-6 rounded-xl backdrop-blur-xl max-w-md w-full text-center shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold mb-2">SYSTEM ERROR</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-400 font-mono">
        Room data not available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900 to-black text-gray-100 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="relative mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                {roomData.name || roomId}
              </h2>
              <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-mono text-green-400/80 tracking-widest">SYSTEM ONLINE</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/50 text-purple-400 rounded-lg transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] backdrop-blur-sm flex items-center gap-2 font-mono text-sm"
                onClick={() => { setShowWealthModal(true); clickSound.play(); }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                STATS
              </button>

              <button
                className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-lg transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] backdrop-blur-sm flex items-center gap-2 font-mono text-sm"
                onClick={() => { setShowShareModal(true); clickSound.play(); }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                SHARE
              </button>

              {user && user.uid === BANK_UID && (
                <button
                  className="px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 rounded-lg transition-all hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] backdrop-blur-sm flex items-center gap-2 font-mono text-sm"
                  onClick={() => { setShowBankSettingsModal(true); clickSound.play(); }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  BANK
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 text-red-400 rounded-xl backdrop-blur-sm flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Players */}
          <div className="space-y-6">
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
          <div className="space-y-6">
            <BankingModal />
            <TransactionLog />
          </div>
        </div>
      </div>

      <ShareRoomModal />
      <BankSettingsModal />
      <WealthChartModal isOpen={showWealthModal} onClose={() => setShowWealthModal(false)} />
      <MoneyTransferAnimation isAnimating={isAnimating} animationDetails={animationDetails} />
    </div>
  );
};

const GameRoomPage = () => (
  <GameRoomProvider>
    <GameRoomContent />
  </GameRoomProvider>
);

export default GameRoomPage;