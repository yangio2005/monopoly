import React from 'react';
import { useGameRoom } from './GameRoomProvider';
import { formatCurrency } from '../../utils/formatters.jsx';

const TransactionLog = () => {
  const { roomData, BANK_UID, bankAvatarURL, currencySymbol, currencyCode } = useGameRoom();

  if (!roomData || !roomData.log) return null;

  const bank = { name: "Bank", balance: roomData.bank || 0, avatarURL: bankAvatarURL };

  return (
    <div className="card mb-3 mb-md-4">
      <div className="card-header bg-info text-white">Transaction Log</div>
      <div className="card-body p-2 p-md-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
        <ul className="list-group list-group-flush">
          {Object.values(roomData.log).reverse().map((logEntry) => {
            const sender = roomData.players[logEntry.from];
            const recipient = logEntry.to === BANK_UID ? bank : roomData.players[logEntry.to];

            return (
              <li key={logEntry.timestamp} className="list-group-item d-flex align-items-center justify-content-between py-1 px-0" style={{ fontSize: '0.8rem' }}>
                <div className="d-flex align-items-center">
                  {/* Sender Info */}
                  <div className="d-flex flex-column align-items-center mx-1">
                    {sender?.avatarURL && <img src={sender.avatarURL} alt="Avatar" className="rounded-circle" style={{ width: '20px', height: '20px', objectFit: 'cover' }} />}
                    <small>{sender?.name}</small>
                  </div>

                  {/* Arrow and Amount */}
                  <span className="mx-1 d-flex align-items-center">
                    <i className="bi bi-arrow-right me-1"></i>
                    <strong> {formatCurrency(logEntry.amount, currencySymbol, currencyCode)} </strong>
                  </span>

                  {/* Recipient Info */}
                  <div className="d-flex flex-column align-items-center mx-1">
                    {logEntry.to === BANK_UID ? (
                      bank.avatarURL && <img src={bank.avatarURL} alt="Bank" className="rounded-circle" style={{ width: '20px', height: '20px', objectFit: 'cover' }} />
                    ) : (
                      recipient?.avatarURL && <img src={recipient.avatarURL} alt="Avatar" className="rounded-circle" style={{ width: '20px', height: '20px', objectFit: 'cover' }} />
                    )}
                    <small>{recipient?.name}</small>
                  </div>
                </div>
                <small className="text-muted">({new Date(logEntry.timestamp).toLocaleTimeString()})</small>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TransactionLog;
