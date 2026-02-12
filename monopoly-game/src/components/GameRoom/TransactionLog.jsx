import React, { useEffect, useRef } from 'react';
import { useGameRoom } from './GameRoomProvider';
import { formatCurrency } from '../../utils/formatters.jsx';

const TransactionLog = () => {
  const { roomData, BANK_UID, bankAvatarURL, currencySymbol, currencyCode } = useGameRoom();
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [roomData?.log]);

  if (!roomData || !roomData.log) return null;

  const bank = { name: "Bank", balance: roomData.bank || 0, avatarURL: bankAvatarURL };
  const logs = Object.values(roomData.log).reverse();

  return (
    <div className="bg-[#1a1a1a] border-[6px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col font-retro">
      {/* Header */}
      <div className="p-4 bg-black border-b-[6px] border-black flex items-center justify-between shrink-0">
        <h3 className="text-[14px] font-bold text-[#f0f] uppercase flex items-center gap-3">
          <span className="w-3 h-3 bg-[#f0f] animate-flash"></span>
          Data_Stream
        </h3>
        <div className="text-[10px] text-gray-500 uppercase">
          Packets: {logs.length}
        </div>
      </div>

      {/* Log Content */}
      <div
        ref={logContainerRef}
        className="p-6 overflow-y-auto custom-scrollbar flex-grow h-[350px] bg-black"
      >
        <div className="space-y-4">
          {logs.map((logEntry) => {
            const sender = roomData.players[logEntry.from];
            const recipient = logEntry.to === BANK_UID ? bank : roomData.players[logEntry.to];

            return (
              <div
                key={logEntry.timestamp}
                className="relative pb-4 border-b-2 border-[#333] last:border-0"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] text-[#40ff00] font-bold">
                      [{new Date(logEntry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                    </span>
                    <span className="text-[8px] text-gray-600">ID_{String(logEntry.timestamp).slice(-4)}</span>
                  </div>

                  <div className="flex items-center flex-wrap gap-2 text-[10px]">
                    <span className="text-white font-bold">{sender?.name?.toUpperCase()}</span>
                    <span className="text-[#f0f]">➔</span>
                    <span className="text-[#ffcc00] font-black">{formatCurrency(logEntry.amount, currencySymbol, currencyCode)}</span>
                    <span className="text-[#f0f]">➔</span>
                    <span className="text-white font-bold">{recipient?.name?.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes flash {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-flash { animation: flash 0.8s infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border: 2px solid #000; }
      `}</style>
    </div>
  );
};

export default TransactionLog;
