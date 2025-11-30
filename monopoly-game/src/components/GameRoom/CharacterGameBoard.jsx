import React, { useState, useEffect, useRef } from 'react';
import Character from './Character';
import { useGameRoom } from './GameRoomProvider';

/**
 * CharacterGameBoard - Displays animated characters for each player on a game board
 */
const CharacterGameBoard = () => {
    const { roomData, user, playersWithEffect } = useGameRoom();
    const [characterPositions, setCharacterPositions] = useState({});
    const [transferringCharacters, setTransferringCharacters] = useState(new Set());
    const previousBalances = useRef({});

    // Initialize character positions in a circle
    useEffect(() => {
        if (!roomData?.players) return;

        const players = Object.entries(roomData.players).filter(
            ([id]) => id !== 'BANK'
        );

        const centerX = 400;
        const centerY = 300;
        const radius = 200;

        const positions = {};
        players.forEach(([playerId], index) => {
            const angle = (index / players.length) * 2 * Math.PI;
            positions[playerId] = {
                x: centerX + radius * Math.cos(angle) - 50, // -50 to center the character
                y: centerY + radius * Math.sin(angle) - 50,
            };
        });

        setCharacterPositions(positions);

        // Initialize previous balances
        players.forEach(([playerId, player]) => {
            if (!previousBalances.current[playerId]) {
                previousBalances.current[playerId] = player.balance;
            }
        });
    }, [roomData?.players]);

    // Detect balance changes and trigger transfer animation
    useEffect(() => {
        if (!roomData?.players) return;

        Object.entries(roomData.players).forEach(([playerId, player]) => {
            if (playerId === 'BANK') return;

            const currentBalance = player.balance;
            const previousBalance = previousBalances.current[playerId];

            if (previousBalance !== undefined && currentBalance !== previousBalance) {
                // Balance changed - trigger transfer animation
                setTransferringCharacters(prev => new Set([...prev, playerId]));

                // Auto-complete animation after a delay
                setTimeout(() => {
                    setTransferringCharacters(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(playerId);
                        return newSet;
                    });
                }, 1500); // Duration matches animation time

                // Update previous balance
                previousBalances.current[playerId] = currentBalance;
            }
        });
    }, [roomData?.players]);

    // Also trigger animation for playersWithEffect (money received)
    useEffect(() => {
        playersWithEffect.forEach(playerId => {
            setTransferringCharacters(prev => new Set([...prev, playerId]));

            setTimeout(() => {
                setTransferringCharacters(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(playerId);
                    return newSet;
                });
            }, 1500);
        });
    }, [playersWithEffect]);

    if (!roomData?.players) return null;

    return (
        <div className="relative w-full h-[600px] bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden">
            {/* Game Board Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />

            {/* Board Grid */}
            <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%">
                    <defs>
                        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-4 border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                    <div className="text-xs text-gray-400 font-mono">PLAYERS ONLINE</div>
                    <div className="text-2xl text-white font-bold">
                        {Object.keys(roomData.players).filter(id => id !== 'BANK').length}
                    </div>
                </div>

                <div className="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg border border-white/20">
                    <div className="text-xs text-gray-400 font-mono">ACTIVE TRANSFERS</div>
                    <div className="text-xl text-green-400 font-mono font-bold">
                        {transferringCharacters.size}
                    </div>
                </div>
            </div>

            {/* Characters */}
            {Object.entries(roomData.players)
                .filter(([id]) => id !== 'BANK')
                .map(([playerId, player]) => (
                    characterPositions[playerId] && (
                        <Character
                            key={playerId}
                            playerId={playerId}
                            playerName={player.name}
                            characterId={player.characterId || 'male-1'}
                            position={characterPositions[playerId]}
                            size={100}
                            isTransferring={transferringCharacters.has(playerId)}
                            onTransferComplete={() => {
                                console.log(`${player.name} transfer animation complete`);
                            }}
                        />
                    )
                ))}

            {/* Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <div className="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg border border-white/20">
                    <div className="text-xs text-gray-400 font-mono">PLAYERS ONLINE</div>
                    <div className="text-2xl text-white font-bold">
                        {Object.keys(roomData.players).filter(id => id !== 'BANK').length}
                    </div>
                </div>

                <div className="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg border border-white/20">
                    <div className="text-xs text-gray-400 font-mono">ACTIVE TRANSFERS</div>
                    <div className="text-xl text-green-400 font-mono font-bold">
                        {transferringCharacters.size}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CharacterGameBoard;
