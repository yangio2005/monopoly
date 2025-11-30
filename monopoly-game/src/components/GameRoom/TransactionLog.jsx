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
    <div className="relative p-1 rounded-2xl bg-gradient-to-b from-purple-900/20 to-cyan-900/20 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] h-full min-h-[300px] flex flex-col">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50"></div>

      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20 rounded-t-xl shrink-0">
        <h3 className="text-lg font-bold text-purple-400 tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
          SYSTEM LOGS
        </h3>
        <div className="text-xs font-mono text-cyan-400/80">
          ENTRIES: {logs.length}
        </div>
      </div>

      {/* Log Content */}
      <div
        ref={logContainerRef}
        className="p-4 overflow-y-auto custom-scrollbar flex-grow h-[300px]"
      >
        <div className="space-y-3 font-mono text-sm">
          {logs.map((logEntry) => {
            const sender = roomData.players[logEntry.from];
            const recipient = logEntry.to === BANK_UID ? bank : roomData.players[logEntry.to];

            return (
              <div
                key={logEntry.timestamp}
                className="group relative p-3 rounded-lg bg-black/40 border border-white/5 hover:border-purple-500/30 transition-all hover:bg-white/5"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Transaction Details */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Sender */}
                    <div className="flex items-center gap-2 shrink-0">
                      {sender?.avatarURL ? (
                        <img src={sender.avatarURL} alt="" className="w-6 h-6 rounded-full border border-white/20" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">👤</div>
                      )}
                      <span className="text-gray-300 font-bold truncate max-w-[80px] sm:max-w-[100px]">{sender?.name}</span>
                    </div>

                    {/* Arrow & Amount */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="text-xs text-gray-500 mb-0.5">TRANSFER</div>
                      <div className="flex items-center gap-2 text-cyan-400 font-bold bg-cyan-900/20 px-2 py-0.5 rounded border border-cyan-500/20">
                        <span>➜</span>
                        <span>{formatCurrency(logEntry.amount, currencySymbol, currencyCode)}</span>
                      </div>
                    </div>

                    {/* Recipient */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-gray-300 font-bold truncate max-w-[80px] sm:max-w-[100px] text-right">{recipient?.name}</span>
                      {logEntry.to === BANK_UID ? (
                        bank.avatarURL ? (
                          <img src={bank.avatarURL} alt="" className="w-6 h-6 rounded-full border border-yellow-500/50" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-xs border border-yellow-500/50">🏦</div>
                        )
                      ) : (
                        recipient?.avatarURL ? (
                          <img src={recipient.avatarURL} alt="" className="w-6 h-6 rounded-full border border-white/20" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">👤</div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="text-[10px] text-gray-600 shrink-0 font-mono">
                    {new Date(logEntry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TransactionLog;
