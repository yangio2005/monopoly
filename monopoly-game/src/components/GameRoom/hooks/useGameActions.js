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

    const handleTransfer = async (amount, targetRecipientId, minTransferAmount, playerRefs, bankRef, onSuccess, customSenderId = null) => {
        setTransferError('');

        if (!user || !roomData || !roomData.players) {
            setTransferError("Session error: player data not loaded.");
            return;
        }

        const parsedAmount = parseInt(amount);
        if (isNaN(parsedAmount) || parsedAmount < minTransferAmount) {
            setTransferError(`Please enter a valid amount, at least ${minTransferAmount}.`);
            return;
        }

        // Determine actual sender and recipient
        // If customSenderId is provided, use it (Banker mode or Receive from Bank mode)
        const actualSenderId = customSenderId || user.uid;
        const actualRecipientId = targetRecipientId;

        const senderPlayer = roomData.players[actualSenderId];
        // Only check balance if sender is NOT the bank
        if (actualSenderId !== BANK_UID && senderPlayer && senderPlayer.balance < parsedAmount) {
            setTransferError("Insufficient balance.");
            return;
        }

        try {
            await performTransfer(roomId, actualSenderId, actualRecipientId, parsedAmount);

            sounds.transferSound.play();

            // Announce money sent with voice
            const currencySymbol = roomData.currencySymbol || '₫';
            const options = {};
            if (voiceSettings && voiceSettings.sentTemplate) {
                options.template = voiceSettings.sentTemplate;
            }

            options.sender = actualSenderId === BANK_UID ? 'Ngân hàng' : (roomData.players[actualSenderId]?.name || 'Unknown');
            options.receiver = actualRecipientId === BANK_UID ? 'Ngân hàng' : (roomData.players[actualRecipientId]?.name || 'Unknown');

            announceMoneySent(parsedAmount, currencySymbol, options);

            // Trigger character reaction
            if (callbacks.onTransferSent) {
                callbacks.onTransferSent(parsedAmount, actualRecipientId);
            }

            setPlayersToAnimate([actualSenderId, actualRecipientId]);

            if (onSuccess) onSuccess();

            // Trigger Animation
            const senderElement = playerRefs.current[actualSenderId] || (actualSenderId === BANK_UID ? bankRef.current : null);
            const recipientElement = playerRefs.current[actualRecipientId] || (actualRecipientId === BANK_UID ? bankRef.current : null);

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
