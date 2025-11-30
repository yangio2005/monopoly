import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database, ref, set, onValue } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Html5Qrcode } from 'html5-qrcode';

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-cyan-400 font-mono">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <div>INITIALIZING SCANNER...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#0a0a0f] to-[#0a0a0f] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="relative bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.1)] overflow-hidden">

          {/* Header Decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-900/50 to-purple-900/50 p-6 border-b border-white/10">
            <div className="flex items-center justify-center gap-3">
              <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-wider">
                QR SCANNER ACCESS
              </h2>
            </div>
            <p className="text-center text-cyan-400/60 text-sm mt-2 font-mono">SCAN TO JOIN GAME ROOM</p>
          </div>

          <div className="p-6 sm:p-8">
            {_qrError && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {_qrError}
              </div>
            )}

            {availableCameras.length > 1 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-cyan-400 font-mono uppercase tracking-wider mb-3">
                  SELECT CAMERA DEVICE
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableCameras.map(camera => (
                    <button
                      key={camera.id}
                      className={`
                        px-4 py-2 rounded-lg border transition-all font-mono text-sm font-medium
                        ${selectedCameraId === camera.id
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                          : 'bg-black/30 border-white/10 text-gray-400 hover:border-cyan-500/50 hover:text-cyan-400'
                        }
                      `}
                      onClick={() => setSelectedCameraId(camera.id)}
                    >
                      {camera.label || `Camera ${camera.id}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Scanner Container */}
            <div className="relative rounded-xl overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.2)] bg-black">
              <div id="qr-code-full-region" className="w-full"></div>

              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400"></div>
            </div>

            {scanResult && (
              <div className="mt-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg text-green-400 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="font-bold">SCAN SUCCESSFUL</span>
                </div>
                <p className="font-mono text-sm">Room ID: {scanResult}</p>
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <button
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold shadow-lg transition-all border border-white/10 flex items-center gap-2 font-mono text-sm"
                onClick={() => navigate('/')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                BACK TO HOME
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrScannerPage;