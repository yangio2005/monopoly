import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database, ref, set, onValue } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QrScannerPage = () => {
  const [user, setUser] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [qrError, setQrError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        navigate('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!loading && user) { // Only initialize scanner if not loading and user is authenticated
      const scannerId = "qr-code-full-region";
      const html5QrcodeScanner = new Html5QrcodeScanner(
        scannerId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
          // Only support camera scan type.
          supportedScanTypes: [/*Html5QrcodeScanType.SCAN_TYPE_CAMERA*/],
          disableFlip: false, // This can be important for mobile
        },
        /* verbose= */ false
      );

      const onScanSuccess = (decodedText, decodedResult) => {
        // handle the scanned code as you like, for example:
        console.log(`Code matched = ${decodedText}`, decodedResult);
        setScanResult(decodedText);
        joinRoom(decodedText);
        html5QrcodeScanner.clear(); // Stop scanning after success
      };

      const onScanFailure = (error) => {
        // handle scan failure, usually better to ignore and keep scanning.
        // for example: console.warn(`Code scan error = ${error}`);
        // setQrError("No QR code detected or camera issue.");
      };

      html5QrcodeScanner.render(onScanSuccess, onScanFailure);

      return () => {
        try {
          html5QrcodeScanner.clear();
        } catch (error) {
          console.warn("Failed to clear html5QrcodeScanner: ", error);
        }
      };
    }
  }, [loading, user, navigate]); // Depend on loading and user state

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

  // handleScan and handleError are now internal to useEffect for html5-qrcode

  if (loading) {
    return <div className="container mt-5">Loading scanner...</div>;
  }

  return (
    <div className="container mt-5 text-center">
      <h2 className="mb-4">Scan QR Code to Join Room</h2>
      {qrError && <div className="alert alert-warning">{qrError}</div>}
      <div id="qr-code-full-region" style={{ width: '100%' }}></div>
      {scanResult && <p className="mt-2">Scanned: {scanResult}</p>}
      <button className="btn btn-secondary mt-3" onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};

export default QrScannerPage;