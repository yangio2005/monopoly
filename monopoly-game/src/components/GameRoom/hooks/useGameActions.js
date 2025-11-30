import { useState } from 'react';
import { updateRoomSettings, performTransfer } from '../services/firebaseService';
import { BANK_UID } from '../constants';

export const useGameActions = (roomId, user, roomData, sounds) => {
    const [transferError, setTransferError] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationDetails, setAnimationDetails] = useState(null);
    const [playersToAnimate, setPlayersToAnimate] = useState([]);

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
            await performTransfer(roomId, user.uid, recipientId, parsedAmount, roomData);

            sounds.transferSound.play();
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
