import React from 'react';
import { useGameRoom } from './GameRoomProvider';
import { formatCurrency } from '../../utils/formatters.jsx';

const BankSettingsModal = () => {
  const {
    user,
    roomData,
    newInitialBalance,
    setNewInitialBalance,
    handleUpdateInitialBalance,
    newCurrencySymbol,
    setNewCurrencySymbol,
    newCurrencyCode,
    setNewCurrencyCode,
    handleUpdateCurrencySettings,
    BANK_UID,
    currencySymbol,
    currencyCode,
    newGameUnit,
    setNewGameUnit,
    gameUnit,
    showBankSettingsModal,
    setShowBankSettingsModal,
    clickSound,
  } = useGameRoom();

  if (!showBankSettingsModal || user.uid !== BANK_UID) return null;

  return (
    <>
      <div className="modal fade show" id="bankSettingsModal" tabIndex="-1" aria-labelledby="bankSettingsModalLabel" aria-hidden="false" style={{ display: 'block' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="bankSettingsModalLabel">Bank Settings</h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => { setShowBankSettingsModal(false); clickSound.play(); }} aria-label="Close"></button>
            </div>
            <div className="modal-body p-2 p-md-3">
              <div className="mb-3">
                <label htmlFor="initialBalanceInput" className="form-label">Initial Player Balance:</label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text">{currencySymbol}</span>
                  <input
                    type="number"
                    className="form-control"
                    id="initialBalanceInput"
                    value={newInitialBalance}
                    onChange={(e) => setNewInitialBalance(e.target.value)}
                    placeholder="e.g., 1500"
                  />
                  <button className="btn btn-outline-secondary" type="button" onClick={handleUpdateInitialBalance}>
                    Set
                  </button>
                </div>
                {roomData.initialPlayerBalance && (
                  <small className="text-muted mt-1 d-block">
                    Current: {formatCurrency(roomData.initialPlayerBalance, currencySymbol, currencyCode)}
                  </small>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="currencySymbolInput" className="form-label">Currency Symbol:</label>
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    className="form-control"
                    id="currencySymbolInput"
                    value={newCurrencySymbol}
                    onChange={(e) => setNewCurrencySymbol(e.target.value)}
                    placeholder="e.g., $"
                  />
                </div>
                {roomData.currencySymbol && (
                  <small className="text-muted mt-1 d-block">
                    Current: {roomData.currencySymbol}
                  </small>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="currencyCodeInput" className="form-label">Currency Code:</label>
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    className="form-control"
                    id="currencyCodeInput"
                    value={newCurrencyCode}
                    onChange={(e) => setNewCurrencyCode(e.target.value)}
                    placeholder="e.g., VND"
                  />
                </div>
                {roomData.currencyCode && (
                  <small className="text-muted mt-1 d-block">
                    Current: {roomData.currencyCode}
                  </small>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="gameUnitSelect" className="form-label">Game Unit:</label>
                <div className="input-group input-group-sm">
                  <select
                    id="gameUnitSelect"
                    className="form-select"
                    value={newGameUnit}
                    onChange={(e) => setNewGameUnit(e.target.value)}
                  >
                    <option value="">None</option>
                    <option value="thousands">Thousands (e.g., 1k)</option>
                    <option value="millions">Millions (e.g., 1m)</option>
                    <option value="billions">Billions (e.g., 1b)</option>
                  </select>
                </div>
                {roomData.gameUnit && (
                  <small className="text-muted mt-1 d-block">
                    Current: {roomData.gameUnit}
                  </small>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => { handleUpdateCurrencySettings(); clickSound.play(); }}>Save Settings</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setShowBankSettingsModal(false); clickSound.play(); }}>Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default BankSettingsModal;
