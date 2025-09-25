import React from 'react';
import QRCode from 'react-qr-code';
import { useGameRoom } from './GameRoomProvider';

const ShareRoomModal = () => {
  const { roomId, showShareModal, setShowShareModal, clickSound } = useGameRoom();

  if (!showShareModal) return null;

  return (
    <>
      <div className="modal fade show" id="shareRoomModal" tabIndex="-1" aria-labelledby="shareRoomModalLabel" aria-hidden="false" style={{ display: 'block' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="shareRoomModalLabel">Share Game Room</h5>
              <button type="button" className="btn-close" onClick={() => { setShowShareModal(false); clickSound.play(); }} aria-label="Close"></button>
            </div>
            <div className="modal-body text-center">
              <p className="card-text">Share this code with your friends to invite them to the game:</p>
              <h3 className="mb-2 mb-md-3">{roomId}</h3>
              {roomId && (
                <div className="d-flex justify-content-center">
                  <QRCode value={roomId} size={100} level="H" />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => { setShowShareModal(false); clickSound.play(); }}>Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default ShareRoomModal;
