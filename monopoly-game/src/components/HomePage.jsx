import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database, ref, push, set, onValue } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [roomIdInput, setRoomIdInput] = useState('');
  const [roomName, setRoomName] = useState(''); // New state for room name
  const [error, setError] = useState('');
  const [rooms, setRooms] = useState({}); // State to store available rooms
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

  useEffect(() => {
    const roomsRef = ref(database, 'rooms');
    onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      setRooms(data || {});
    });
  }, []);

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

  const joinRoom = async (roomIdToJoin) => {
    const targetRoomId = roomIdToJoin || roomIdInput;
    if (!user) {
      setError("You must be logged in to join a room.");
      return;
    }
    if (!targetRoomId) {
      setError("Please enter a Room ID or select a room from the list.");
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

      const roomRef = ref(database, `rooms/${targetRoomId}`);
      onValue(roomRef, async (snapshot) => {
        if (snapshot.exists()) {
          const roomData = snapshot.val();
          if (!roomData.players || !roomData.players[user.uid]) {
            // Add player to the room if not already there
            await set(ref(database, `rooms/${targetRoomId}/players/${user.uid}`), {
              name: playerName,
              balance: 1500,
              position: 0,
              properties: {},
              avatarURL: playerAvatarURL // Include avatarURL
            });
          }
          navigate(`/room/${targetRoomId}`);
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
                <button className="btn btn-primary w-100" onClick={() => joinRoom(roomIdInput)}>Join Room</button>
              </div>

              <div className="mb-3">
                <button className="btn btn-info w-100" onClick={() => navigate('/scan-qr')}>
                  Scan QR Code to Join
                </button>
              </div>

              <hr />

              <h5 className="card-title mt-4">Available Rooms</h5>
              {Object.keys(rooms).length === 0 ? (
                <p>No rooms available. Create one!</p>
              ) : (
                <ul className="list-group">
                  {Object.entries(rooms).map(([roomId, roomData]) => (
                    <li key={roomId} className="list-group-item d-flex justify-content-between align-items-center">
                      {roomData.name} (ID: {roomId})
                      <button className="btn btn-sm btn-primary" onClick={() => joinRoom(roomId)}>Join</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;