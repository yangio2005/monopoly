import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, database, ref, onValue, set, push, update } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import QRCode from 'react-qr-code';

const BANK_UID = '5VlGAMonohOlDfk4uuQ5mGr4eSZ2'; // Specific UID for the bank

const GameRoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [selectedRecipientId, setSelectedRecipientId] = useState('');
  const [transferError, setTransferError] = useState('');
  const [bankAvatarURL, setBankAvatarURL] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showBankingModal, setShowBankingModal] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  useEffect(() => {
    // No longer need to scroll to bankingRef as it's a modal
    // if (selectedRecipientId && bankingRef.current) {
    //   bankingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // }
  }, [selectedRecipientId]);

  useEffect(() => {
    const bankProfileRef = ref(database, `users/${BANK_UID}/avatarURL`);
    const unsubscribeBankAvatar = onValue(bankProfileRef, (snapshot) => {
      const url = snapshot.val();
      if (url) {
        setBankAvatarURL(url);
      }
    });
    return () => unsubscribeBankAvatar();
  }, []);

    useEffect(() => {
    if (user && roomId) {
      const roomRef = ref(database, `rooms/${roomId}`);

      // Check if user is already in the room, if not, add them
      const checkAndAddPlayer = async () => {
          const snapshot = await new Promise((resolve) => {
            onValue(roomRef, (snap) => resolve(snap), { onlyOnce: true });
          });
          const data = snapshot.val();

          const userProfileRef = ref(database, 'users/' + user.uid);
          const userProfileSnapshot = await new Promise((resolve) => {
            onValue(userProfileRef, (snap) => resolve(snap), { onlyOnce: true });
          });
          const userProfile = userProfileSnapshot.val();
          const playerName = userProfile?.name || user.displayName || user.email;
          const playerAvatarURL = userProfile?.avatarURL || '';

          if (data && (!data.players || !data.players[user.uid])) {
            // Player does not exist, add them
            await set(ref(database, `rooms/${roomId}/players/${user.uid}`), {
              name: playerName,
              balance: 1500,
              position: 0,
              properties: {},
              avatarURL: playerAvatarURL
            });
          } else if (data && data.players && data.players[user.uid]) {
            // Player exists, check if name or avatar needs updating
            const currentPlayerInRoom = data.players[user.uid];
            const updates = {};
            if (currentPlayerInRoom.name !== playerName) {
              updates[`rooms/${roomId}/players/${user.uid}/name`] = playerName;
            }
            if (currentPlayerInRoom.avatarURL !== playerAvatarURL) {
              updates[`rooms/${roomId}/players/${user.uid}/avatarURL`] = playerAvatarURL;
            }

            if (Object.keys(updates).length > 0) {
              await update(ref(database), updates);
            }
          }
        };
      checkAndAddPlayer();

      // Listen for real-time updates to the room data
      const unsubscribeRoom = onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setRoomData(data);
        } else {
          setError("Room not found.");
          setRoomData(null);
        }
        setLoading(false);
      }, (dbError) => {
        console.error("Error fetching room data:", dbError);
        setError("Failed to load room data.");
        setLoading(false);
      });
      return () => unsubscribeRoom();
    }
  }, [user, roomId, navigate]);

  if (loading || !bankAvatarURL) {
    return <div className="container mt-5">Loading room...</div>;
  }

  if (error) {
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  }

  if (!roomData) {
    return <div className="container mt-5">Room data not available.</div>;
  }

  const players = roomData.players ? Object.entries(roomData.players).filter(([uid]) => uid !== BANK_UID) : [];
  const bank = { name: "Bank", balance: roomData.bank || 0, avatarURL: bankAvatarURL };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setTransferError('');

    console.log("Initiating transfer...");
    console.log("Current user:", user);
    console.log("Room data:", roomData);

    if (!user || !roomData || !roomData.players || !roomData.players[user.uid]) {
      setTransferError("You are not a player in this room.");
      console.log("Validation failed: Not a player.");
      return;
    }

    const amount = parseInt(transferAmount);
    console.log("Transfer amount:", amount);
    if (isNaN(amount) || amount <= 0) {
      setTransferError("Please enter a valid positive amount.");
      console.log("Validation failed: Invalid amount.");
      return;
    }

    const senderPlayer = roomData.players[user.uid];
    console.log("Sender player:", senderPlayer);
    if (senderPlayer.balance < amount) {
      setTransferError("Insufficient balance.");
      console.log("Validation failed: Insufficient balance.");
      return;
    }

    console.log("Selected recipient ID:", selectedRecipientId);
    if (!selectedRecipientId) {
      setTransferError("Please select a recipient.");
      console.log("Validation failed: No recipient selected.");
      return;
    }

    try {
      const updates = {};
      const newLogEntry = {
        timestamp: new Date().toISOString(),
        type: "moneyTransfer",
        from: user.uid,
        amount: amount,
      };

      // Deduct from sender
      updates[`rooms/${roomId}/players/${user.uid}/balance`] = senderPlayer.balance - amount;

      if (selectedRecipientId === BANK_UID) {
        // Transfer to Bank
        updates[`rooms/${roomId}/bank`] = roomData.bank + amount;
        newLogEntry.to = BANK_UID;
        newLogEntry.message = `${senderPlayer.name} paid Bank ${amount}`;
      } else {
        // Transfer to another player
        const recipientPlayer = roomData.players[selectedRecipientId];
        if (!recipientPlayer) {
          setTransferError("Recipient not found in room.");
          console.log("Validation failed: Recipient not found.");
          return;
        }
        updates[`rooms/${roomId}/players/${selectedRecipientId}/balance`] = recipientPlayer.balance + amount;
        newLogEntry.to = selectedRecipientId;
        newLogEntry.message = `${senderPlayer.name} paid ${recipientPlayer.name} ${amount}`;
      }

      // Add log entry
      const newLogRef = push(ref(database, `rooms/${roomId}/log`));
      updates[`rooms/${roomId}/log/${newLogRef.key}`] = newLogEntry;

      console.log("Updates object before set:", updates);
      await update(ref(database), updates);
      setTransferAmount('');
      setSelectedRecipientId('');
      setShowBankingModal(false); // Close modal after successful transfer
      alert("Transfer successful!");
    } catch (e) {
      console.error("Error during transfer:", e);
      setTransferError("Failed to complete transfer.");
    }
  };

  return (
    <div className="container mt-2 mt-md-3">
      <h2 className="text-center mb-3 mb-md-4">Game Room: {roomData.name || roomId}
        <button className="btn btn-info btn-sm ms-2 ms-md-3" onClick={() => setShowShareModal(true)}>
          Share Room
        </button>
      </h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {showShareModal && (
        <>
          <div className="modal fade show" id="shareRoomModal" tabIndex="-1" aria-labelledby="shareRoomModalLabel" aria-hidden="true" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="shareRoomModalLabel">Share Game Room</h5>
                  <button type="button" className="btn-close" onClick={() => setShowShareModal(false)} aria-label="Close"></button>
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
                  <button type="button" className="btn btn-secondary" onClick={() => setShowShareModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      <div className="row">
        {/* Left Column: Game Status and Players */}
        <div className="col-lg-6 mb-3 mb-md-4">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">Game Status</div>
            <div className="card-body p-2 p-md-3">
              <button
                className={`btn btn-light text-start p-0 mb-1 mb-md-2 ${selectedRecipientId === BANK_UID ? 'border-warning shadow' : ''}`}
                onClick={() => { setSelectedRecipientId(BANK_UID); setShowBankingModal(true); }}
              >
                <strong>Total Game Money (Bank):</strong> ${bank.balance}
              </button>
              <p className="card-text mb-1 mb-md-2"><strong>Current Turn:</strong> {roomData.players && roomData.players[roomData.turn] ? roomData.players[roomData.turn].name : 'N/A'}</p>
              <hr className="my-2 my-md-3" />
              <h5>Players</h5>
              <div className="d-flex flex-wrap justify-content-around">
                {players.map(([uid, playerData]) => (
                  <button
                    key={uid}
                    className={`text-center m-1 p-1 p-md-2 border rounded btn btn-light ${uid === user.uid ? 'border-success' : ''} ${selectedRecipientId === uid ? 'border-warning shadow' : ''}`}
                    style={{ width: '90px' }}
                    onClick={() => { setSelectedRecipientId(uid); setShowBankingModal(true); }}
                  >
                    {playerData.avatarURL && (
                      <img
                        src={playerData.avatarURL}
                        alt="Avatar"
                        className="rounded-circle mb-1"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                    )}
                    <h6 className="mb-0" style={{ fontSize: '0.8rem' }}>{playerData.name}</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.7rem' }}>${playerData.balance}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Banking and Transaction Log */}
        <div className="col-lg-6 mb-3 mb-md-4">

          {/* Banking Modal */}
          {showBankingModal && (
            <>
              <div className="modal fade show" id="bankingModal" tabIndex="-1" aria-labelledby="bankingModalLabel" aria-hidden="true" style={{ display: 'block' }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header bg-success text-white">
                      <h5 className="modal-title" id="bankingModalLabel">Transfer Money</h5>
                      <button type="button" className="btn-close btn-close-white" onClick={() => setShowBankingModal(false)} aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-2 p-md-3">
                      {transferError && <div className="alert alert-danger py-1 px-2" style={{ fontSize: '0.8rem' }}>{transferError}</div>}
                      <form onSubmit={handleTransfer}>
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
                          <label htmlFor="transferAmountInput" className="form-label" style={{ fontSize: '0.9rem' }}>Amount:</label>
                          <input
                            type="number"
                            id="transferAmountInput"
                            className="form-control form-control-sm"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            min="1"
                            required
                          />
                        </div>
                        <button type="submit" className="btn btn-primary btn-sm">Transfer Money</button>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowBankingModal(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-backdrop fade show"></div>
            </>
          )}

          <div className="card mb-3 mb-md-4">
            <div className="card-header bg-info text-white">Transaction Log</div>
            <div className="card-body p-2 p-md-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <ul className="list-group list-group-flush">
                {roomData.log && Object.values(roomData.log).reverse().map((logEntry) => {
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
                          <strong> ${logEntry.amount} </strong>
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
        </div>
      </div>
    </div>
  );
};

export default GameRoomPage;