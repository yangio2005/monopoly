import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase';
import { subscribeToRoom, subscribeToBankAvatar, fetchRoomDataOnce, fetchUserProfileOnce, initializePlayerInRoom, updatePlayerProfileInRoom } from '../services/firebaseService';

export const useGameData = (roomId) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [roomData, setRoomData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bankAvatarURL, setBankAvatarURL] = useState('');

    // Auth State
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

    // Bank Avatar
    useEffect(() => {
        const unsubscribe = subscribeToBankAvatar((url) => {
            if (url) setBankAvatarURL(url);
        });
        return () => unsubscribe();
    }, []);

    // Room Data & Player Init
    useEffect(() => {
        if (user && roomId) {
            const initPlayer = async () => {
                try {
                    const data = await fetchRoomDataOnce(roomId);
                    const userProfile = await fetchUserProfileOnce(user.uid);
                    const playerName = userProfile?.name || user.displayName || user.email;
                    const playerAvatarURL = userProfile?.avatarURL || '';

                    if (data && (!data.players || !data.players[user.uid])) {
                        const initialPlayerBalance = data.initialPlayerBalance || 1500;
                        await initializePlayerInRoom(roomId, user, userProfile, initialPlayerBalance);
                    } else if (data && data.players && data.players[user.uid]) {
                        const currentPlayerInRoom = data.players[user.uid];
                        const updates = {};
                        if (currentPlayerInRoom.name !== playerName) {
                            updates[`rooms/${roomId}/players/${user.uid}/name`] = playerName;
                        }
                        if (currentPlayerInRoom.avatarURL !== playerAvatarURL) {
                            updates[`rooms/${roomId}/players/${user.uid}/avatarURL`] = playerAvatarURL;
                        }
                        if (Object.keys(updates).length > 0) {
                            await updatePlayerProfileInRoom(roomId, user.uid, updates);
                        }
                    }
                } catch (err) {
                    console.error("Error initializing player:", err);
                }
            };

            initPlayer();

            const unsubscribe = subscribeToRoom(roomId, (data) => {
                if (data) {
                    setRoomData(data);
                } else {
                    setError("Room not found.");
                    setRoomData(null);
                }
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [user, roomId]);

    return {
        user,
        roomData,
        loading,
        error,
        bankAvatarURL
    };
};
