import { useState, useEffect } from 'react';
import { auth, database, ref, push, set, onValue } from '../../../firebase';
import { onDisconnect } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

export const useRoomManagement = (navigate) => {
    const [user, setUser] = useState(null);
    const [rooms, setRooms] = useState({});
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
                navigate('/login');
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

    const createRoom = async (roomName) => {
        if (!user) {
            setError("You must be logged in to create a room.");
            return;
        }
        if (!roomName.trim()) {
            setError("Room name cannot be empty.");
            return;
        }
        setError('');
        setIsLoading(true);
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
            const playerRef = ref(database, `rooms/${newRoomId}/players/${user.uid}`);
            const initialPlayers = {
                [user.uid]: {
                    name: playerName,
                    balance: 1500,
                    position: 0,
                    properties: {},
                    avatarURL: playerAvatarURL
                }
            };

            await set(newRoomRef, {
                name: roomName,
                gameState: 'waiting',
                players: initialPlayers,
                turn: user.uid,
                bank: 100000,
                log: [],
                createdAt: Date.now() // Timestamp for filtering
            });

            onDisconnect(playerRef).remove();
            navigate(`/room/${newRoomId}`);
        } catch (e) {
            console.error("Error creating room: ", e);
            setError("Failed to create room.");
        } finally {
            setIsLoading(false);
        }
    };

    const joinRoom = async (targetRoomId) => {
        if (!user) {
            setError("You must be logged in to join a room.");
            return;
        }
        if (!targetRoomId) {
            setError("Please enter a Room ID or select a room from the list.");
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            const userProfileRef = ref(database, 'users/' + user.uid);
            const userProfileSnapshot = await new Promise((resolve) => {
                onValue(userProfileRef, (snapshot) => resolve(snapshot), { onlyOnce: true });
            });
            const userProfile = userProfileSnapshot.val();
            const playerName = userProfile?.name || user.displayName || user.email;
            const playerAvatarURL = userProfile?.avatarURL || '';

            const roomRef = ref(database, `rooms/${targetRoomId}`);
            onValue(roomRef, async (snapshot) => {
                if (snapshot.exists()) {
                    const roomData = snapshot.val();
                    if (!roomData.players || !roomData.players[user.uid]) {
                        const playerRef = ref(database, `rooms/${targetRoomId}/players/${user.uid}`);
                        await set(playerRef, {
                            name: playerName,
                            balance: 1500,
                            position: 0,
                            properties: {},
                            avatarURL: playerAvatarURL
                        });
                        onDisconnect(playerRef).remove();
                    }
                    navigate(`/room/${targetRoomId}`);
                } else {
                    setError("Room does not exist.");
                    setIsLoading(false);
                }
            }, { onlyOnce: true });
        } catch (e) {
            console.error("Error joining room: ", e);
            setError("Failed to join room.");
            setIsLoading(false);
        }
    };

    return {
        user,
        rooms,
        error,
        setError,
        isLoading,
        createRoom,
        joinRoom
    };
};
