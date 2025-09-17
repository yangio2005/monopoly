import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database, ref, push, set, onValue } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [roomIdInput, setRoomIdInput] = useState('');
  const [roomName, setRoomName] = useState(''); // New state for room name
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        navigate('/login'); // Redirect to login if not authenticated
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const createRoom = async () => {
    if (!user) {
      setError("You must be logged in to create a room.");
      return;
    }
    if (!roomName.trim()) {
      setError("Room name cannot be empty.");
      return;
    }
    setError('');
    try {
      const userProfileRef = ref(database, 'users/' + user.uid);
      const userProfileSnapshot = await new Promise((resolve) => {
        onValue(userProfileRef, (snapshot) => resolve(snapshot), { onlyOnce: true });
      });
      const userProfile = userProfileSnapshot.val();
      const playerName = userProfile?.name || user.displayName || user.email;
      const playerAvatarURL = userProfile?.avatarURL || '';

      const newRoomRef = push(ref(database, 'rooms'));
      const newRoomId = newRoomRef.key;
      const initialPlayers = {
        [user.uid]: {
          name: playerName,
          balance: 1500,
          position: 0,
          properties: {},
          avatarURL: playerAvatarURL
        }
      };
      console.log("Creating room with user.uid:", user.uid, "and initial players:", initialPlayers);
      await set(newRoomRef, {
        name: roomName,
        gameState: 'waiting',
        players: initialPlayers,
        turn: user.uid,
        bank: 100000,
        log: []
      });
      navigate(`/room/${newRoomId}`);
    } catch (e) {
      console.error("Error creating room: ", e);
      setError("Failed to create room.");
    }
  };

  const joinRoom = async () => {
    if (!user) {
      setError("You must be logged in to join a room.");
      return;
    }
    if (!roomIdInput) {
      setError("Please enter a Room ID.");
      return;
    }
    setError('');
    try {
      const userProfileRef = ref(database, 'users/' + user.uid);
      const userProfileSnapshot = await new Promise((resolve) => {
        onValue(userProfileRef, (snapshot) => resolve(snapshot), { onlyOnce: true });
      });
      const userProfile = userProfileSnapshot.val();
      const playerName = userProfile?.name || user.displayName || user.email;
      const playerAvatarURL = userProfile?.avatarURL || ''; // Get avatarURL

      const roomRef = ref(database, `rooms/${roomIdInput}`);
      onValue(roomRef, async (snapshot) => {
        if (snapshot.exists()) {
          const roomData = snapshot.val();
          if (!roomData.players || !roomData.players[user.uid]) {
            // Add player to the room if not already there
            await set(ref(database, `rooms/${roomIdInput}/players/${user.uid}`), {
              name: playerName,
              balance: 1500,
              position: 0,
              properties: {},
              avatarURL: playerAvatarURL // Include avatarURL
            });
          }
          navigate(`/room/${roomIdInput}`);
        } else {
          setError("Room does not exist.");
        }
      }, { onlyOnce: true });
    } catch (e) {
      console.error("Error joining room: ", e);
      setError("Failed to join room.");
    }
  };

  if (!user) {
    return <div className="container mt-5">Loading...</div>; // Or a loading spinner
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">Welcome to Monopoly Game</div>
            <div className="card-body">
              <h5 className="card-title">Home Page</h5>
              <p className="card-text">Hello, {user.displayName || user.email}!</p>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Enter Room Name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  required
                />
                <button className="btn btn-success w-100" onClick={createRoom}>Create New Room</button>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Enter Room ID to Join"
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value)}
                />
                <button className="btn btn-primary w-100" onClick={joinRoom}>Join Room</button>
              </div>

              <div className="mb-3">
                <button className="btn btn-info w-100" onClick={() => navigate('/scan-qr')}>
                  Scan QR Code to Join
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;