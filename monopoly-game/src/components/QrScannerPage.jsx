import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database, ref, set, onValue } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Html5Qrcode } from 'html5-qrcode'; // Import Html5Qrcode

const QrScannerPage = () => {
  const [user, setUser] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [_qrError, setQrError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch cameras after user is authenticated
        Html5Qrcode.getCameras().then(cameras => {
          if (cameras && cameras.length) {
            setAvailableCameras(cameras);
            setSelectedCameraId(cameras[0].id); // Select the first camera by default
          }
        }).catch(err => {
          console.error("Error fetching cameras:", err);
          setQrError("Failed to access camera devices.");
        });
      } else {
        setUser(null);
        navigate('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const joinRoom = async (roomId) => {
      if (!user) {
        setQrError("You must be logged in to join a room.");
        return;
      }
      if (!roomId) {
        setQrError("No Room ID scanned.");
        return;
      }
      setQrError(null);
      try {
        const userProfileRef = ref(database, 'users/' + user.uid);
        const userProfileSnapshot = await new Promise((resolve) => {
          onValue(userProfileRef, (snapshot) => resolve(snapshot), { onlyOnce: true });
        });
        const userProfile = userProfileSnapshot.val();
        const playerName = userProfile?.name || user.displayName || user.email;
        const playerAvatarURL = userProfile?.avatarURL || '';

        const roomRef = ref(database, `rooms/${roomId}`);
        onValue(roomRef, async (snapshot) => {
          if (snapshot.exists()) {
            const roomData = snapshot.val();
            if (!roomData.players || !roomData.players[user.uid]) {
              await set(ref(database, `rooms/${roomId}/players/${user.uid}`), {
                name: playerName,
                balance: 1500,
                position: 0,
                properties: {},
                avatarURL: playerAvatarURL
              });
            }
            navigate(`/room/${roomId}`);
          } else {
            setQrError("Room does not exist.");
          }
        }, { onlyOnce: true });
      } catch (e) {
        console.error("Error joining room: ", e);
        setQrError("Failed to join room.");
      }
    };

    if (!loading && user && selectedCameraId) { // Only initialize scanner if not loading, user is authenticated, and camera is selected
      const scannerId = "qr-code-full-region";
      const html5Qrcode = new Html5Qrcode(scannerId);

      const onScanSuccess = (decodedText, decodedResult) => {
        console.log(`Code matched = ${decodedText}`, decodedResult);
        setScanResult(decodedText);
        joinRoom(decodedText);
        html5Qrcode.stop().catch(err => console.warn("Failed to stop html5Qrcode: ", err));
      };

      const onScanFailure = (_error) => {
        console.warn(`Code scan error = ${_error}`);
        // setQrError("No QR code detected or camera issue.");
      };

      html5Qrcode.start(
        selectedCameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          disableFlip: false,
        },
        onScanSuccess,
        onScanFailure
      ).catch(err => {
        console.error("Error starting QR scanner:", err);
        setQrError("Failed to start QR scanner. Please ensure camera is available and not in use.");
      });

      return () => {
        try {
          html5Qrcode.stop().catch(err => console.warn("Failed to stop html5Qrcode on cleanup: ", err));
        } catch (_error) {
                    console.warn("Failed to clear html5QrcodeScanner: ", _error);
        }
      };
    }
  }, [loading, user, selectedCameraId, navigate]); // Depend on loading, user, and selectedCameraId state

  // handleScan and handleError are now internal to useEffect for html5-qrcode

  if (loading) {
    return <div className="container mt-5">Loading scanner...</div>;
  }

  return (
    <div className="container mt-5 text-center">
      <h2 className="mb-4">Scan QR Code to Join Room</h2>
      {_qrError && <div className="alert alert-warning">{_qrError}</div>}

      {availableCameras.length > 1 && (
        <div className="mb-3">
          <p>Select Camera:</p>
          {availableCameras.map(camera => (
            <button
              key={camera.id}
              className={`btn me-2 mb-2 ${selectedCameraId === camera.id ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedCameraId(camera.id)}
            >
              {camera.label || `Camera ${camera.id}`}
            </button>
          ))}
        </div>
      )}

      <div id="qr-code-full-region" style={{ width: '100%' }}></div>
      {scanResult && <p className="mt-2">Scanned: {scanResult}</p>}
      <button className="btn btn-secondary mt-3" onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};

export default QrScannerPage;