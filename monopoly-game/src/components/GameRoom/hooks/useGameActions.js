import { useState, useEffect } from 'react';
import { updateRoomSettings, performTransfer } from '../services/firebaseService';
import { BANK_UID } from '../constants';
import { useVoiceNotification } from './useVoiceNotification';

import { database, ref, onValue } from '../../../firebase';

export const useGameActions = (roomId, user, roomData, sounds, callbacks = {}) => {
    const [transferError, setTransferError] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationDetails, setAnimationDetails] = useState(null);
    const [playersToAnimate, setPlayersToAnimate] = useState([]);
    const [voiceSettings, setVoiceSettings] = useState(null);
    const { announceMoneySent } = useVoiceNotification();

    // Load user's voice settings
    useEffect(() => {
        if (user) {
            const userRef = ref(database, 'users/' + user.uid);
            const unsubscribe = onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                if (data && data.voiceSettings) {
                    setVoiceSettings(data.voiceSettings);
                }
            });
            return () => unsubscribe();
        }
    }, [user]);

    const handleUpdateInitialBalance = async (newInitialBalance, setNewInitialBalance) => {
        if (user.uid !== BANK_UID) {
            alert("Only the bank can update the initial player balance.");
            return;
        }
        const amount = parseInt(newInitialBalance);
        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid positive amount for the initial balance.");
            return;
        }

        try {
            await updateRoomSettings(roomId, { initialPlayerBalance: amount });
            alert("Initial player balance updated successfully!");
            setNewInitialBalance('');
        } catch (e) {
            console.error("Error updating initial player balance:", e);
            alert("Failed to update initial player balance.");
        }
    };

    const handleUpdateGameSettings = async (settings, resetInputs) => {
        const { newCurrencySymbol, newCurrencyCode, newGameUnit } = settings;

        if (user.uid !== BANK_UID) {
            alert("Only the bank can update the game settings.");
            return;
        }
        if (!newCurrencySymbol.trim() && !newCurrencyCode.trim() && !newGameUnit.trim()) {
            alert("Please enter valid settings.");
            return;
        }

        try {
            const updates = {};
            if (newCurrencySymbol.trim()) updates.currencySymbol = newCurrencySymbol.trim();
            if (newCurrencyCode.trim()) updates.currencyCode = newCurrencyCode.trim();
            if (newGameUnit.trim()) updates.gameUnit = newGameUnit.trim();

            await updateRoomSettings(roomId, updates);
            alert("Game settings updated successfully!");
            resetInputs();
        } catch (e) {
            console.error("Error updating game settings:", e);
            alert("Failed to update game settings.");
        }
    };

    const handleTransfer = async (amount, recipientId, minTransferAmount, playerRefs, bankRef, onSuccess) => {
        setTransferError('');

        if (!user || !roomData || !roomData.players || !roomData.players[user.uid]) {
            setTransferError("You are not a player in this room.");
            return;
        }

        const parsedAmount = parseInt(amount);
        if (isNaN(parsedAmount) || parsedAmount < minTransferAmount) {
            setTransferError(`Please enter a valid amount, at least ${minTransferAmount}.`);
            return;
        }

        const senderPlayer = roomData.players[user.uid];
        if (user.uid !== BANK_UID && senderPlayer.balance < parsedAmount) {
            setTransferError("Insufficient balance.");
            return;
        }

        if (!recipientId) {
            setTransferError("Please select a recipient.");
            return;
        }

        try {
            await performTransfer(roomId, user.uid, recipientId, parsedAmount);

            sounds.transferSound.play();

            // Announce money sent with voice
            const currencySymbol = roomData.currencySymbol || '₫';
            const options = {};
            if (voiceSettings && voiceSettings.sentTemplate) {
                options.template = voiceSettings.sentTemplate;
            }
            options.sender = roomData.players[user.uid]?.name || 'Bạn';
            options.receiver = recipientId === BANK_UID
                ? 'Ngân hàng'
                : (roomData.players[recipientId]?.name || 'Người nhận');

            announceMoneySent(parsedAmount, currencySymbol, options);

            // Trigger character reaction for sent money
            if (callbacks.onTransferSent) {
                callbacks.onTransferSent();
            }

            setPlayersToAnimate([user.uid, recipientId]);

            if (onSuccess) onSuccess();

            // Trigger Animation
            const senderElement = playerRefs.current[user.uid];
            const recipientElement = recipientId === BANK_UID ? bankRef.current : playerRefs.current[recipientId];

            if (senderElement && recipientElement) {
                const senderRect = senderElement.getBoundingClientRect();
                const recipientRect = recipientElement.getBoundingClientRect();

                setAnimationDetails({
                    senderPos: {
                        x: senderRect.left + senderRect.width / 2,
                        y: senderRect.top + senderRect.height / 2,
                    },
                    recipientPos: {
                        x: recipientRect.left + recipientRect.width / 2,
                        y: recipientRect.top + recipientRect.height / 2,
                    },
                    amount: parsedAmount,
                });
                setIsAnimating(true);

                setTimeout(() => {
                    setIsAnimating(false);
                    setAnimationDetails(null);
                }, 2500);
            }
        } catch (e) {
            console.error("Error during transfer:", e);
            setTransferError(e.message || "Failed to complete transfer.");
        }
    };

    return {
        transferError,
        setTransferError,
        isAnimating,
        setIsAnimating,
        animationDetails,
        setAnimationDetails,
        playersToAnimate,
        setPlayersToAnimate,
        handleUpdateInitialBalance,
        handleUpdateGameSettings,
        handleTransfer
    };
};
