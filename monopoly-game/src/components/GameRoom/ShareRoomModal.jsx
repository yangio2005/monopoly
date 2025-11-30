import React from 'react';
import QRCode from 'react-qr-code';
import { useGameRoom } from './GameRoomProvider';

const ShareRoomModal = () => {
  const { roomId, showShareModal, setShowShareModal, clickSound } = useGameRoom();

  if (!showShareModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => { setShowShareModal(false); clickSound.play(); }}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-gray-900/90 rounded-2xl border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.2)] overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 p-4 border-b border-white/10 flex items-center justify-between">
          <h5 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
            <span className="text-2xl">🔗</span> SHARE ACCESS
          </h5>
          <button
            type="button"
            className="text-gray-400 hover:text-white transition-colors"
            onClick={() => { setShowShareModal(false); clickSound.play(); }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 text-center space-y-6">
          <p className="text-gray-300">Scan to join the game network:</p>

          <div className="relative inline-block p-4 bg-white rounded-xl shadow-[0_0_30px_rgba(34,211,238,0.3)]">
            {roomId && (
              <QRCode value={roomId} size={180} level="H" />
            )}
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500 -translate-x-1 -translate-y-1"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500 translate-x-1 -translate-y-1"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500 -translate-x-1 translate-y-1"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500 translate-x-1 translate-y-1"></div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono text-cyan-500 uppercase tracking-widest">Room ID</div>
            <div className="bg-black/50 border border-white/10 rounded-lg py-3 px-4 font-mono text-xl font-bold text-white tracking-wider select-all">
              {roomId}
            </div>
          </div>
        </div>

        <div className="p-4 bg-black/20 border-t border-white/10 flex justify-center">
          <button
            type="button"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all font-mono text-sm"
            onClick={() => { setShowShareModal(false); clickSound.play(); }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareRoomModal;
