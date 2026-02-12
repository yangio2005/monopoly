import React from 'react';
import QRCode from 'react-qr-code';
import { useGameRoom } from './GameRoomProvider';

const ShareRoomModal = () => {
  const { roomId, showShareModal, setShowShareModal, clickSound } = useGameRoom();

  if (!showShareModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-retro">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 opacity-85"
        onClick={() => { setShowShareModal(false); clickSound.play(); }}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-[#1a1a1a] border-[8px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in duration-100">
        {/* Header */}
        <div className="bg-black p-4 border-b-8 border-black flex items-center justify-between">
          <h5 className="text-[14px] font-bold text-[#40ff00] uppercase flex items-center gap-3">
            <span className="animate-pulse">⦿</span> PROTOCOL_LINK
          </h5>
          <button
            type="button"
            className="text-white hover:text-[#40ff00]"
            onClick={() => { setShowShareModal(false); clickSound.play(); }}
          >
            [X]
          </button>
        </div>

        <div className="p-8 text-center space-y-8">
          <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Scan to join the private network:</p>

          <div className="relative inline-block p-6 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
            {roomId && (
              <div style={{ imageRendering: 'pixelated' }}>
                <QRCode value={roomId} size={160} level="H" />
              </div>
            )}
            {/* Corner Decorative Dots */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-black"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-black"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-black"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-black"></div>
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-bold text-[#40ff00] uppercase">ACCESS_KEY</div>
            <div className="bg-black border-4 border-white p-4 text-white text-[18px] font-bold tracking-[0.2em] select-all">
              {roomId}
            </div>
          </div>
        </div>

        <div className="p-6 bg-black">
          <button
            type="button"
            className="w-full py-4 bg-white border-4 border-black text-black text-[12px] font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-[#40ff00] transition-all"
            onClick={() => { setShowShareModal(false); clickSound.play(); }}
          >
            RETURN_TO_BASE
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareRoomModal;
