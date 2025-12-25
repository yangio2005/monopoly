import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useGameData } from './hooks/useGameData';
import { useGameAudio } from './hooks/useGameAudio';
import { useGameActions } from './hooks/useGameActions';
import { useVoiceNotification } from './hooks/useVoiceNotification';
import { BANK_UID } from './constants';
import { database, ref, onValue } from '../../firebase';

const GameRoomContext = createContext();

export const useGameRoom = () => {
  return useContext(GameRoomContext);
};

export const GameRoomProvider = ({ children }) => {
  const { roomId } = useParams();

  // State for UI controls
  const [transferAmount, setTransferAmount] = useState('');
  const [selectedRecipientId, setSelectedRecipientId] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showBankingModal, setShowBankingModal] = useState(false);
  const [showBankSettingsModal, setShowBankSettingsModal] = useState(false);
  const [showWealthModal, setShowWealthModal] = useState(false);

  // Settings State
  const [newInitialBalance, setNewInitialBalance] = useState('');
  const [newCurrencySymbol, setNewCurrencySymbol] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [newCurrencyCode, setNewCurrencyCode] = useState('');
  const [currencyCode, setCurrencyCode] = useState('');
  const [newGameUnit, setNewGameUnit] = useState('1');
  const [gameUnit, setGameUnit] = useState(1);
  const [minTransferAmount, setMinTransferAmount] = useState(1);

  // Voice Settings State
  const [voiceSettings, setVoiceSettings] = useState(null);

  // Refs
  const playerRefs = useRef({});
  const bankRef = useRef(null);
  const previousBalanceRef = useRef(0);
  const transactionTimeoutRef = useRef(null);
  const isInitialMount = useRef(true);
  const [playersWithEffect, setPlayersWithEffect] = useState([]);
  const [characterTransactionType, setCharacterTransactionType] = useState(null);

  // Custom Hooks
  const { user, roomData, loading, error, bankAvatarURL } = useGameData(roomId);
  const { transferSound, clickSound, moneyReceivedSound } = useGameAudio();
  const { announceMoneyReceived } = useVoiceNotification();
  const {
    transferError,
    setTransferError,
    isAnimating,
    setIsAnimating,
    animationDetails,
    setAnimationDetails,
    playersToAnimate,
    setPlayersToAnimate,
    handleUpdateInitialBalance: updateInitialBalanceAction,
    handleUpdateGameSettings: updateGameSettingsAction,
    handleTransfer: transferAction
  } = useGameActions(roomId, user, roomData, { transferSound }, {
    onTransferSent: () => {
      if (transactionTimeoutRef.current) clearTimeout(transactionTimeoutRef.current);
      setCharacterTransactionType({ type: 'sent', timestamp: Date.now() });
      transactionTimeoutRef.current = setTimeout(() => setCharacterTransactionType(null), 12000);
    }
  });

  // Effects for Room Settings
  useEffect(() => {
    if (roomData) {
      if (roomData.currencySymbol) setCurrencySymbol(roomData.currencySymbol);
      if (roomData.currencyCode) setCurrencyCode(roomData.currencyCode);
      if (roomData.gameUnit) {
        switch (roomData.gameUnit) {
          case 'thousands': setGameUnit(1000); break;
          case 'millions': setGameUnit(1_000_000); break;
          case 'billions': setGameUnit(1_000_000_000); break;
          default: setGameUnit(1);
        }
      }
    }
  }, [roomData]);

  useEffect(() => {
    setMinTransferAmount(gameUnit);
  }, [gameUnit]);

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

  // Effects for Balance Updates & Animations
  useEffect(() => {
    if (user && roomData && roomData.players && roomData.players[user.uid]) {
      const currentBalance = roomData.players[user.uid].balance;

      if (isInitialMount.current) {
        previousBalanceRef.current = currentBalance;
        isInitialMount.current = false;
      } else {
        const previousBalance = previousBalanceRef.current;
        if (currentBalance > previousBalance) {
          const amountReceived = currentBalance - previousBalance;
          const currencySymbol = roomData.currencySymbol || '₫';

          moneyReceivedSound.play();

          // Use custom template if available
          const options = {};
          if (voiceSettings && voiceSettings.receivedTemplate) {
            options.template = voiceSettings.receivedTemplate;
          }
          options.sender = 'Người gửi';
          options.receiver = roomData.players[user.uid]?.name || 'bạn';

          announceMoneyReceived(amountReceived, currencySymbol, options);

          // Trigger character reaction
          if (transactionTimeoutRef.current) clearTimeout(transactionTimeoutRef.current);
          setCharacterTransactionType({ type: 'received', timestamp: Date.now() });
          transactionTimeoutRef.current = setTimeout(() => setCharacterTransactionType(null), 12000);

          setPlayersWithEffect(prev => [...prev, user.uid]);
          setTimeout(() => {
            setPlayersWithEffect(prev => prev.filter(id => id !== user.uid));
          }, 2500);
        }
        previousBalanceRef.current = currentBalance;
      }
    }
  }, [roomData, user, moneyReceivedSound, announceMoneyReceived, voiceSettings]);

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
  }, [playersToAnimate, moneyReceivedSound, setPlayersToAnimate]);

  // Handlers
  const handleUpdateInitialBalance = () => {
    updateInitialBalanceAction(newInitialBalance, setNewInitialBalance);
  };

  const handleUpdateCurrencySettings = () => {
    updateGameSettingsAction(
      { newCurrencySymbol, newCurrencyCode, newGameUnit },
      () => {
        setNewCurrencySymbol('');
        setNewCurrencyCode('');
        setNewGameUnit('');
      }
    );
  };

  const handleTransfer = () => {
    transferAction(
      transferAmount,
      selectedRecipientId,
      minTransferAmount,
      playerRefs,
      bankRef,
      () => {
        setTransferAmount('');
        setShowBankingModal(false);
        setSelectedRecipientId(''); // Clear selection after transfer
      }
    );
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
    showWealthModal,
    setShowWealthModal,
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
    handleUpdateCurrencySettings,
    handleTransfer,
    BANK_UID,
    characterTransactionType,
    setCharacterTransactionType,
  };

  return (
    <GameRoomContext.Provider value={value}>
      {children}
    </GameRoomContext.Provider>
  );
};

