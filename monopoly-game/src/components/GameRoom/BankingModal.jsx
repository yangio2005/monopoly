import React, { useState } from 'react';
import CalculatorInput from '../../components/Calculator/CalculatorInput';
import { useGameRoom } from './GameRoomProvider';

const BankingModal = () => {
  const [displayAmount, setDisplayAmount] = useState('');
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
  } = useGameRoom();

  if (!showBankingModal || !roomData) return null;

  const players = roomData.players ? Object.entries(roomData.players).filter(([uid]) => uid !== BANK_UID) : [];

  return (
    <>
      <div className="modal fade show" id="bankingModal" tabIndex="-1" aria-labelledby="bankingModalLabel" aria-hidden="false" style={{ display: 'block' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title" id="bankingModalLabel">Transfer Money</h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => { setShowBankingModal(false); clickSound.play(); }} aria-label="Close"></button>
            </div>
            <div className="modal-body p-2 p-md-3">
              {transferError && <div className="alert alert-danger py-1 px-2" style={{ fontSize: '0.8rem' }}>{transferError}</div>}
                <div className="mb-2 mb-md-3">
                  <label htmlFor="recipientSelect" className="form-label" style={{ fontSize: '0.9rem' }}>Transfer to:</label>
                  <select
                    id="recipientSelect"
                    className="form-select form-select-sm"
                    value={selectedRecipientId}
                    onChange={(e) => setSelectedRecipientId(e.target.value)}
                    required
                    disabled // Disable dropdown as recipient is selected by click
                  >
                    <option value="">Select Recipient</option>
                    <option value={BANK_UID}>Bank</option>
                    {players.filter(([uid]) => uid !== user.uid).map(([uid, playerData]) => (
                      <option key={uid} value={uid}>{playerData.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-2 mb-md-3">
                  <label htmlFor="transferAmountInput" className="form-label" style={{ fontSize: '0.9rem' }}>Amount ({currencySymbol}):</label>
                  <CalculatorInput
                    value={displayAmount}
                    onValueChange={setDisplayAmount}
                    onCalculatedValue={setTransferAmount}
                  />
                </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-success btn-sm" onClick={() => { handleTransfer(); clickSound.play(); }} disabled={!transferAmount || isNaN(parseFloat(transferAmount)) || parseFloat(transferAmount) <= 0}>Transfer</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setShowBankingModal(false); clickSound.play(); }}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default BankingModal;
