import { database, ref, onValue, set, push, update, runTransaction } from '../../../firebase';
import { BANK_UID } from '../constants';

export const subscribeToRoom = (roomId, callback) => {
    const roomRef = ref(database, `rooms/${roomId}`);
    return onValue(roomRef, (snapshot) => {
        callback(snapshot.val());
    });
};

export const subscribeToBankAvatar = (callback) => {
    const bankProfileRef = ref(database, `users/${BANK_UID}/avatarURL`);
    return onValue(bankProfileRef, (snapshot) => {
        callback(snapshot.val());
    });
};

export const fetchRoomDataOnce = (roomId) => {
    return new Promise((resolve) => {
        onValue(ref(database, `rooms/${roomId}`), (snap) => resolve(snap.val()), { onlyOnce: true });
    });
};

export const fetchUserProfileOnce = (uid) => {
    return new Promise((resolve) => {
        onValue(ref(database, `users/${uid}`), (snap) => resolve(snap.val()), { onlyOnce: true });
    });
};

export const initializePlayerInRoom = async (roomId, user, userProfile, initialBalance) => {
    const playerName = userProfile?.name || user.displayName || user.email;
    const playerAvatarURL = userProfile?.avatarURL || '';

    await set(ref(database, `rooms/${roomId}/players/${user.uid}`), {
        name: playerName,
        balance: initialBalance,
        position: 0,
        properties: {},
        avatarURL: playerAvatarURL
    });
};

export const updatePlayerProfileInRoom = async (roomId, uid, updates) => {
    await update(ref(database), updates);
};

export const updateRoomSettings = async (roomId, updates) => {
    await update(ref(database, `rooms/${roomId}`), updates);
};

export const performTransfer = async (roomId, senderUid, recipientUid, amount) => {
    const roomRef = ref(database, `rooms/${roomId}`);
    const newLogRef = push(ref(database, `rooms/${roomId}/log`));
    const logKey = newLogRef.key;

    const transactionResult = await runTransaction(roomRef, (currentRoomData) => {
        if (!currentRoomData) return; // Data not loaded yet

        const players = currentRoomData.players || {};
        const sender = players[senderUid];

        // Sender validation
        if (!sender && senderUid !== BANK_UID) return; // Abort if sender missing and not Bank

        const senderBalance = sender ? (sender.balance || 0) : 0;

        // Check for sufficient funds (Bank has infinite)
        if (senderUid !== BANK_UID && senderBalance < amount) {
            return; // Abort transaction
        }

        // Recipient validation
        if (recipientUid !== BANK_UID && !players[recipientUid]) {
            return; // Abort if recipient missing
        }

        // 1. Deduct from Sender
        if (senderUid !== BANK_UID) {
            sender.balance = senderBalance - amount;
        }

        // 2. Add to Recipient
        if (recipientUid === BANK_UID) {
            currentRoomData.bank = (currentRoomData.bank || 0) + amount;
        } else {
            const recipient = players[recipientUid];
            recipient.balance = (recipient.balance || 0) + amount;
        }

        // 3. Add Log
        const senderName = senderUid === BANK_UID ? 'Ngân hàng' : (sender.name || 'Unknown');
        const recipientName = recipientUid === BANK_UID ? 'Ngân hàng' : (players[recipientUid]?.name || 'Unknown');

        const newLogEntry = {
            timestamp: new Date().toISOString(),
            type: "moneyTransfer",
            from: senderUid,
            to: recipientUid,
            amount: amount,
            message: `${senderName} chuyển cho ${recipientName} ${amount}`
        };

        if (!currentRoomData.log) currentRoomData.log = {};
        currentRoomData.log[logKey] = newLogEntry;

        return currentRoomData;
    });

    if (!transactionResult.committed) {
        throw new Error("Giao dịch thất bại. Có thể do không đủ số dư hoặc lỗi kết nối.");
    }

    return transactionResult.snapshot.val().log[logKey];
};
