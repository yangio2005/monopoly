import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { Howl } from 'howler';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, database, ref, onValue, set, push, update } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const GameRoomContext = createContext();

export const useGameRoom = () => {
  return useContext(GameRoomContext);
};

const BANK_UID = '5VlGAMonohOlDfk4uuQ5mGr4eSZ2'; // Specific UID for the bank

export const GameRoomProvider = ({ children }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [selectedRecipientId, setSelectedRecipientId] = useState('');
  const [transferError, setTransferError] = useState('');
  const [bankAvatarURL, setBankAvatarURL] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showBankingModal, setShowBankingModal] = useState(false);
  const [showBankSettingsModal, setShowBankSettingsModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDetails, setAnimationDetails] = useState(null);
  const [transferSound] = useState(new Howl({ src: ['/coin.mp3'] }));
  const [clickSound] = useState(new Howl({ src: ['/click.mp3'] }));
  const [moneyReceivedSound] = useState(new Howl({
    src: ['/money_received.mp3'],
    onload: () => console.log('money_received.mp3 loaded successfully!'),
    onloaderror: (id, err) => console.error('Error loading money_received.mp3:', id, err),
    onplayerror: (id, err) => console.error('Error playing money_received.mp3:', id, err),
  }));
  const playerRefs = useRef({});
  const bankRef = useRef(null);
  const previousBalanceRef = useRef(0);
  const isInitialMount = useRef(true);
  const [playersWithEffect, setPlayersWithEffect] = useState([]);
  const [playersToAnimate, setPlayersToAnimate] = useState([]);
  const [newInitialBalance, setNewInitialBalance] = useState('');
  const [newCurrencySymbol, setNewCurrencySymbol] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [newCurrencyCode, setNewCurrencyCode] = useState('');
  const [currencyCode, setCurrencyCode] = useState('');
  const [newGameUnit, setNewGameUnit] = useState('1'); // Default to thousands
  const [gameUnit, setGameUnit] = useState(1); // 1 for thousands, 1000 for millions, etc.
  const [minTransferAmount, setMinTransferAmount] = useState(1); // Derived from gameUnit

  const handleUpdateInitialBalance = async () => {
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
      await update(ref(database, `rooms/${roomId}`), { initialPlayerBalance: amount });
      alert("Initial player balance updated successfully!");
      setNewInitialBalance('');
    } catch (e) {
      console.error("Error updating initial player balance:", e);
      alert("Failed to update initial player balance.");
    }
  };

  useEffect(() => {
    setMinTransferAmount(gameUnit);
  }, [gameUnit]);

  const handleUpdateGameSettings = async () => {
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
      if (newCurrencySymbol.trim()) {
        updates.currencySymbol = newCurrencySymbol.trim();
      }
      if (newCurrencyCode.trim()) {
        updates.currencyCode = newCurrencyCode.trim();
      }
      if (newGameUnit.trim()) {
        updates.gameUnit = newGameUnit.trim();
      }
      await update(ref(database, `rooms/${roomId}`), updates);
      alert("Game settings updated successfully!");
      setNewCurrencySymbol('');
      setNewCurrencyCode('');
      setNewGameUnit('');
    } catch (e) {
      console.error("Error updating game settings:", e);
      alert("Failed to update game settings.");
    }
  };


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

  useEffect(() => {
    const bankProfileRef = ref(database, `users/${BANK_UID}/avatarURL`);
    const unsubscribeBankAvatar = onValue(bankProfileRef, (snapshot) => {
      const url = snapshot.val();
      if (url) {
        setBankAvatarURL(url);
      }
    });
    return () => unsubscribeBankAvatar();
  }, []);

  useEffect(() => {
    if (user && roomData && roomData.players && roomData.players[user.uid]) {
      const currentBalance = roomData.players[user.uid].balance;

      if (isInitialMount.current) {
        previousBalanceRef.current = currentBalance;
        isInitialMount.current = false;
      } else {
        const previousBalance = previousBalanceRef.current;
        if (currentBalance > previousBalance) {
          moneyReceivedSound.play();
          setPlayersWithEffect(prev => [...prev, user.uid]);
          setTimeout(() => {
            setPlayersWithEffect(prev => prev.filter(id => id !== user.uid));
          }, 2500);
        }
        previousBalanceRef.current = currentBalance;
      }
    }
  }, [roomData, user, moneyReceivedSound]);

  useEffect(() => {
    if (playersToAnimate.length > 0) {
      playersToAnimate.forEach(playerId => {
        moneyReceivedSound.play();
        setPlayersWithEffect(prev => [...prev, playerId]);
        setTimeout(() => {
          setPlayersWithEffect(prev => prev.filter(id => id !== playerId));
        }, 2500);
      });
      setPlayersToAnimate([]);
    }
  }, [playersToAnimate, moneyReceivedSound]);

  useEffect(() => {
    if (user && roomId) {
      const roomRef = ref(database, `rooms/${roomId}`);

      const checkAndAddPlayer = async () => {
          const snapshot = await new Promise((resolve) => {
            onValue(roomRef, (snap) => resolve(snap), { onlyOnce: true });
          });
          const data = snapshot.val();

          const userProfileRef = ref(database, 'users/' + user.uid);
          const userProfileSnapshot = await new Promise((resolve) => {
            onValue(userProfileRef, (snap) => resolve(snap), { onlyOnce: true });
          });
          const userProfile = userProfileSnapshot.val();
          const playerName = userProfile?.name || user.displayName || user.email;
          const playerAvatarURL = userProfile?.avatarURL || '';

          if (data && (!data.players || !data.players[user.uid])) {
            const initialPlayerBalance = data.initialPlayerBalance || 1500;
            await set(ref(database, `rooms/${roomId}/players/${user.uid}`), {
              name: playerName,
              balance: initialPlayerBalance,
              position: 0,
              properties: {},
              avatarURL: playerAvatarURL
            });
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
              await update(ref(database), updates);
            }
          }
        };
      checkAndAddPlayer();

      const unsubscribeRoom = onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setRoomData(data);
          if (data.currencySymbol) {
            setCurrencySymbol(data.currencySymbol);
          }
          if (data.currencyCode) {
            setCurrencyCode(data.currencyCode);
          }
          if (data.gameUnit) {
            switch (data.gameUnit) {
              case 'thousands':
                setGameUnit(1000);
                break;
              case 'millions':
                setGameUnit(1_000_000);
                break;
              case 'billions':
                setGameUnit(1_000_000_000);
                break;
              default:
                setGameUnit(1); // Default to 1 for no specific unit
            }
          }
        } else {
          setError("Room not found.");
          setRoomData(null);
        }
        setLoading(false);
      }, (dbError) => {
        console.error("Error fetching room data:", dbError);
        setError("Failed to load room data.");
        setLoading(false);
      });
      return () => {
        unsubscribeRoom();
      };
    }
  }, [user, roomId, navigate]);

  const handleTransfer = async () => {
    setTransferError('');

    if (!user || !roomData || !roomData.players || !roomData.players[user.uid]) {
      setTransferError("You are not a player in this room.");
      return;
    }

    const amount = parseInt(transferAmount);
    if (isNaN(amount) || amount < minTransferAmount) {
      setTransferError(`Please enter a valid amount, at least ${minTransferAmount}.`);
      return;
    }

    const senderPlayer = roomData.players[user.uid];
    if (user.uid !== BANK_UID && senderPlayer.balance < amount) {
      setTransferError("Insufficient balance.");
      return;
    }

    if (!selectedRecipientId) {
      setTransferError("Please select a recipient.");
      return;
    }

    try {
      const updates = {};
      const newLogEntry = {
        timestamp: new Date().toISOString(),
        type: "moneyTransfer",
        from: user.uid,
        amount: amount,
      };

      updates[`rooms/${roomId}/players/${user.uid}/balance`] = senderPlayer.balance - amount;

      if (selectedRecipientId === BANK_UID) {
        updates[`rooms/${roomId}/bank`] = roomData.bank + amount;
        newLogEntry.to = BANK_UID;
        newLogEntry.message = `${senderPlayer.name} paid Bank ${amount}`;
      } else {
        const recipientPlayer = roomData.players[selectedRecipientId];
        if (!recipientPlayer) {
          setTransferError("Recipient not found in room.");
          return;
        }
        updates[`rooms/${roomId}/players/${selectedRecipientId}/balance`] = recipientPlayer.balance + amount;
        newLogEntry.to = selectedRecipientId;
        newLogEntry.message = `${senderPlayer.name} paid ${recipientPlayer.name} ${amount}`;
      }

      const newLogRef = push(ref(database, `rooms/${roomId}/log`));
      updates[`rooms/${roomId}/log/${newLogRef.key}`] = newLogEntry;

      await update(ref(database), updates);
      transferSound.play();
      setPlayersToAnimate([user.uid, selectedRecipientId]);
      setTransferAmount('');
      setShowBankingModal(false);

      const senderElement = playerRefs.current[user.uid];
      const recipientElement = selectedRecipientId === BANK_UID ? bankRef.current : playerRefs.current[selectedRecipientId];

      if (senderElement && recipientElement) {
        const senderRect = senderElement.getBoundingClientRect();
        const recipientRect = recipientElement.getBoundingClientRect();

        const senderPos = {
          x: senderRect.left + senderRect.width / 2,
          y: senderRect.top + senderRect.height / 2,
        };
        const recipientPos = {
          x: recipientRect.left + recipientRect.width / 2,
          y: recipientRect.top + recipientRect.height / 2,
        };

        setAnimationDetails({
          senderPos,
          recipientPos,
          amount: amount,
        });
        setIsAnimating(true);

        setTimeout(() => {
          setIsAnimating(false);
          setAnimationDetails(null);
          setSelectedRecipientId('');
        }, 2500);
      } else {
        setSelectedRecipientId('');
      }

    } catch (e) {
      console.error("Error during transfer:", e);
      setTransferError("Failed to complete transfer.");
    }
  };

  const value = {
    roomId,
    user,
    roomData,
    loading,
    error,
    transferAmount,
    setTransferAmount,
    selectedRecipientId,
    setSelectedRecipientId,
    transferError,
    setTransferError,
    bankAvatarURL,
    showShareModal,
    setShowShareModal,
    showBankingModal,
    setShowBankingModal,
    showBankSettingsModal,
    setShowBankSettingsModal,
    isAnimating,
    setIsAnimating,
    animationDetails,
    setAnimationDetails,
    transferSound,
    clickSound,
    moneyReceivedSound,
    playerRefs,
    bankRef,
    playersWithEffect,
    setPlayersWithEffect,
    playersToAnimate,
    setPlayersToAnimate,
    newInitialBalance,
    setNewInitialBalance,
    newCurrencySymbol,
    setNewCurrencySymbol,
    newCurrencyCode,
    setNewCurrencyCode,
    newGameUnit,
    setNewGameUnit,
    gameUnit,
    minTransferAmount,
    currencyCode,
    currencySymbol,
    handleUpdateInitialBalance,
    handleUpdateGameSettings,
    handleTransfer,
    BANK_UID,
  };

  return (
    <GameRoomContext.Provider value={value}>
      {children}
    </GameRoomContext.Provider>
  );
};
