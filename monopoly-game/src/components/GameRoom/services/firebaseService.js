import { database, ref, onValue, set, push, update } from '../../../firebase';
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

export const performTransfer = async (roomId, senderUid, recipientUid, amount, roomData) => {
    const updates = {};
    const newLogEntry = {
        timestamp: new Date().toISOString(),
        type: "moneyTransfer",
        from: senderUid,
        amount: amount,
    };

    const senderPlayer = roomData.players[senderUid];
    updates[`rooms/${roomId}/players/${senderUid}/balance`] = senderPlayer.balance - amount;

    if (recipientUid === BANK_UID) {
        updates[`rooms/${roomId}/bank`] = roomData.bank + amount;
        newLogEntry.to = BANK_UID;
        newLogEntry.message = `${senderPlayer.name} paid Bank ${amount}`;
    } else {
        const recipientPlayer = roomData.players[recipientUid];
        if (!recipientPlayer) throw new Error("Recipient not found");

        updates[`rooms/${roomId}/players/${recipientUid}/balance`] = recipientPlayer.balance + amount;
        newLogEntry.to = recipientUid;
        newLogEntry.message = `${senderPlayer.name} paid ${recipientPlayer.name} ${amount}`;
    }

    const newLogRef = push(ref(database, `rooms/${roomId}/log`));
    updates[`rooms/${roomId}/log/${newLogRef.key}`] = newLogEntry;

    await update(ref(database), updates);
    return newLogEntry;
};
