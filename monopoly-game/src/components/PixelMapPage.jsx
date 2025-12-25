import React, { useEffect, useRef, useState } from 'react';

const TILE_SIZE = 32;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 15;

const ASSETS = {
    grass: '/game_assets/Tiles/Grass_Middle.png',
    water: '/game_assets/Tiles/Water_Middle.png',
    waterTile: '/game_assets/Tiles/Water_Tile.png',
    path: '/game_assets/Tiles/Path_Middle.png',
    tree: '/game_assets/Outdoor_decoration/Oak_Tree.png',
    house: '/game_assets/Outdoor_decoration/House_1_Wood_Base_Blue.png',
    chest: '/game_assets/Outdoor_decoration/Chest.png',
    // Animation assets
    pinkMonsterThrow: '/assets/1 Pink_Monster/Pink_Monster_Throw_4.png',
    // Crop items (3 types for variety)
    carrot: '/assets/Sunnyside_World_ASSET_PACK_V2.1/Sunnyside_World_ASSET_PACK_V2.1/Sunnyside_World_Assets/Elements/Crops/carrot_05.png',
    pumpkin: '/assets/Sunnyside_World_ASSET_PACK_V2.1/Sunnyside_World_ASSET_PACK_V2.1/Sunnyside_World_Assets/Elements/Crops/pumpkin_05.png',
    potato: '/assets/Sunnyside_World_ASSET_PACK_V2.1/Sunnyside_World_ASSET_PACK_V2.1/Sunnyside_World_Assets/Elements/Crops/potato_05.png',
    wheat: '/assets/Sunnyside_World_ASSET_PACK_V2.1/Sunnyside_World_ASSET_PACK_V2.1/Sunnyside_World_Assets/Elements/Crops/wheat_05.png',
    beetroot: '/assets/Sunnyside_World_ASSET_PACK_V2.1/Sunnyside_World_ASSET_PACK_V2.1/Sunnyside_World_Assets/Elements/Crops/beetroot_05.png',
    cabbage: '/assets/Sunnyside_World_ASSET_PACK_V2.1/Sunnyside_World_ASSET_PACK_V2.1/Sunnyside_World_Assets/Elements/Crops/cabbage_05.png',
};

const PixelMapPage = () => {
    const canvasRef = useRef(null);
    const [images, setImages] = useState({});
    const [loading, setLoading] = useState(true);
    const [isPortrait, setIsPortrait] = useState(false);

    // Player positions (4 corners)
    const [players, setPlayers] = useState([
        { id: 1, name: 'Player 1', x: 2, y: 2, balance: 1000, color: '#22d3ee' },
        { id: 2, name: 'Player 2', x: 17, y: 2, balance: 1500, color: '#a855f7' },
        { id: 3, name: 'Player 3', x: 2, y: 12, balance: 800, color: '#f59e0b' },
        { id: 4, name: 'Player 4', x: 17, y: 12, balance: 1200, color: '#ec4899' }
    ]);

    // Animation state
    const [animationState, setAnimationState] = useState({
        isAnimating: false,
        characterPos: { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 },
        targetPlayer: null,
        items: [], // Each item has {x, y, type, progress}
        frame: 0,
        progress: 0
    });

    // Transfer UI state
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [transferAmount, setTransferAmount] = useState('');
    const [showTransferModal, setShowTransferModal] = useState(false);

    // Sound effect
    const coinSound = useRef(null);

    // Check orientation
    useEffect(() => {
        const checkOrientation = () => {
            // Check if it's mobile (width < 768px) and portrait (height > width)
            setIsPortrait(window.innerHeight > window.innerWidth && window.innerWidth < 768);
        };

        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        return () => window.removeEventListener('resize', checkOrientation);
    }, []);

    // Load images
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages = {};
            const promises = Object.entries(ASSETS).map(([key, src]) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = () => {
                        loadedImages[key] = img;
                        resolve();
                    };
                    img.onerror = (e) => {
                        console.error(`Failed to load image: ${src}`, e);
                        // Resolve anyway to avoid blocking everything, but might show blank
                        resolve();
                    };
                });
            });

            await Promise.all(promises);
            setImages(loadedImages);
            setLoading(false);
        };

        loadImages();
    }, []);

    // Animation loop with requestAnimationFrame
    useEffect(() => {
        if (loading || !canvasRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        let animationFrameId;
        const FPS = 10; // Spritesheet animation speed
        const ANIMATION_SPEED = 0.02; // Movement speed

        const draw = () => {
            // Clear canvas
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            // Draw Map
            for (let y = 0; y < MAP_HEIGHT; y++) {
                for (let x = 0; x < MAP_WIDTH; x++) {
                    let tileType = 'grass';
                    if (y === 5 && x > 2 && x < 18) tileType = 'path';
                    if (x === 10 && y > 5) tileType = 'path';
                    if (y > 10 && x < 5) tileType = 'waterTile';

                    const img = images[tileType];
                    if (img) {
                        ctx.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    }
                }
            }

            // Draw Entities
            const entities = [
                { type: 'house', x: 10, y: 2, width: 3, height: 3 },
                { type: 'tree', x: 2, y: 2, width: 2, height: 2 },
                { type: 'tree', x: 17, y: 2, width: 2, height: 2 },
                { type: 'tree', x: 15, y: 8, width: 2, height: 2 },
                { type: 'chest', x: 12, y: 8, width: 1, height: 1 },
            ];

            entities.forEach(ent => {
                const img = images[ent.type];
                if (img) {
                    ctx.drawImage(
                        img,
                        ent.x * TILE_SIZE,
                        ent.y * TILE_SIZE,
                        ent.width * TILE_SIZE,
                        ent.height * TILE_SIZE
                    );
                }
            });

            // Draw Players
            players.forEach(player => {
                const px = player.x * TILE_SIZE;
                const py = player.y * TILE_SIZE;

                // Player circle
                ctx.fillStyle = player.color;
                ctx.beginPath();
                ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 16, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Player name
                ctx.fillStyle = '#fff';
                ctx.font = '10px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(player.name, px + TILE_SIZE / 2, py - 8);

                // Balance
                ctx.fillStyle = player.color;
                ctx.fillText(`$${player.balance}`, px + TILE_SIZE / 2, py + TILE_SIZE + 16);
            });

            // Draw Animation
            if (animationState.isAnimating && animationState.targetPlayer) {
                const target = players.find(p => p.id === animationState.targetPlayer);
                if (target) {
                    const centerX = (MAP_WIDTH / 2) * TILE_SIZE;
                    const centerY = (MAP_HEIGHT / 2) * TILE_SIZE;
                    const targetX = target.x * TILE_SIZE;
                    const targetY = target.y * TILE_SIZE;

                    // Spritesheet animation frame (4 frames for throw)
                    const frameIndex = Math.floor(animationState.frame) % 4;
                    const spritesheet = images.pinkMonsterThrow;

                    if (spritesheet) {
                        // Character stays at center (throwing animation)
                        const charX = centerX;
                        const charY = centerY;

                        // Determine throw direction (left or right)
                        const throwingRight = targetX > centerX;

                        ctx.save();
                        ctx.translate(charX, charY);

                        // Flip sprite if throwing left
                        if (!throwingRight) {
                            ctx.scale(-1, 1);
                        }

                        // Draw character from spritesheet
                        ctx.drawImage(
                            spritesheet,
                            frameIndex * 32, 0, // Source x, y
                            32, 32, // Source width, height
                            -16, -16, // Dest x, y (centered)
                            32, 32 // Dest width, height
                        );

                        ctx.restore();
                    }

                    // Draw crop items with arc trajectory
                    animationState.items.forEach(item => {
                        const itemImg = images[item.type];
                        if (itemImg) {
                            // Linear interpolation for x
                            const itemX = centerX + (targetX - centerX) * item.progress + item.offsetX;

                            // Arc trajectory for y (parabolic curve)
                            const linearY = centerY + (targetY - centerY) * item.progress;
                            const arcHeight = 60; // Maximum arc height
                            const arcOffset = Math.sin(item.progress * Math.PI) * arcHeight;
                            const itemY = linearY - arcOffset + item.offsetY;

                            // Rotate item slightly based on trajectory
                            const rotation = (item.progress - 0.5) * 0.5;

                            ctx.save();
                            ctx.translate(itemX, itemY);
                            ctx.rotate(rotation);
                            ctx.drawImage(itemImg, -8, -8, 16, 16);
                            ctx.restore();
                        }
                    });
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        animationFrameId = requestAnimationFrame(draw);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [loading, images, players, animationState]);

    // Animation progression
    useEffect(() => {
        if (!animationState.isAnimating) return;

        const interval = setInterval(() => {
            setAnimationState(prev => {
                // Update frame for spritesheet
                const newFrame = prev.frame + 0.5; // Slower frame rate

                // Update progress
                const newProgress = Math.min(prev.progress + 0.02, 1);

                // Update item progress (items follow with slight delay)
                const newItems = prev.items.map((item) => ({
                    ...item,
                    progress: Math.min(item.progress + 0.015, 1)
                }));

                // Check if animation complete
                if (newProgress >= 1) {
                    // Play sound
                    if (coinSound.current) {
                        coinSound.current.currentTime = 0;
                        coinSound.current.play().catch(e => console.log('Sound play failed:', e));
                    }

                    // Update player balance
                    setPlayers(prevPlayers => prevPlayers.map(p => {
                        if (p.id === prev.targetPlayer) {
                            return { ...p, balance: p.balance + parseInt(transferAmount || 0) };
                        }
                        return p;
                    }));

                    // Reset animation
                    setTimeout(() => {
                        setAnimationState({
                            isAnimating: false,
                            characterPos: { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 },
                            targetPlayer: null,
                            items: [],
                            frame: 0,
                            progress: 0
                        });
                    }, 500);

                    return prev;
                }

                return {
                    ...prev,
                    frame: newFrame,
                    progress: newProgress,
                    items: newItems
                };
            });
        }, 50); // ~20 FPS for smooth animation

        return () => clearInterval(interval);
    }, [animationState.isAnimating, transferAmount]);

    // Initialize sound
    useEffect(() => {
        coinSound.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGJ0vLTgjMGHm7A7+OZSA0PVqzn77BdGAc+ltryxnMpBiuByO/ejkAKEmS16+mjUxELTKXh8rlpIQQ2jdXyz4M2Bx9xxvDim0YOElisKezx8IU9');
    }, []);

    // Handle transfer button
    const handleTransfer = () => {
        if (!selectedPlayer || !transferAmount || isNaN(transferAmount)) {
            return;
        }

        const amount = parseInt(transferAmount);
        if (amount <= 0) return;

        // Random crop types
        const cropTypes = ['carrot', 'pumpkin', 'potato'];
        const items = [];
        for (let i = 0; i < 3; i++) {
            items.push({
                type: cropTypes[Math.floor(Math.random() * cropTypes.length)],
                progress: 0,
                offsetX: (Math.random() - 0.5) * 20,
                offsetY: (Math.random() - 0.5) * 20
            });
        }

        setAnimationState({
            isAnimating: true,
            characterPos: { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 },
            targetPlayer: selectedPlayer,
            items: items,
            frame: 0,
            progress: 0
        });

        setShowTransferModal(false);
    };

    return (
        <div className={`min-h-screen bg-[#0f0f1a] transition-all duration-300 ${isPortrait
            ? 'fixed inset-0 w-[100vh] h-[100vw] rotate-90 origin-top-left translate-x-[100vw] z-50 overflow-hidden flex flex-col items-center justify-center'
            : 'pt-20 px-4 flex flex-col items-center'
            }`}>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8">
                Pixel World
            </h1>

            <div className="relative p-4 rounded-xl bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-500/30 shadow-2xl shadow-purple-500/20 backdrop-blur-sm">
                {loading ? (
                    <div className="flex items-center justify-center w-[640px] h-[480px] text-purple-300">
                        Loading Assets...
                    </div>
                ) : (
                    <canvas
                        ref={canvasRef}
                        width={MAP_WIDTH * TILE_SIZE}
                        height={MAP_HEIGHT * TILE_SIZE}
                        className="rounded-lg shadow-inner bg-[#2a2a3e] image-pixelated"
                        style={{ imageRendering: 'pixelated' }}
                    />
                )}

                <div className="absolute top-4 right-4 flex gap-2">
                    <div className="px-3 py-1 rounded-full bg-black/50 text-xs text-white border border-white/10 backdrop-blur-md">
                        Map: {MAP_WIDTH}x{MAP_HEIGHT}
                    </div>
                </div>
            </div>

            {/* Transfer Button */}
            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => setShowTransferModal(true)}
                    disabled={animationState.isAnimating}
                    className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm flex items-center gap-2"
                >
                    <span className="text-xl">💸</span>
                    TRANSFER MONEY
                </button>
            </div>

            {/* Transfer Modal */}
            {showTransferModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowTransferModal(false)}
                    ></div>

                    <div className="relative w-full max-w-md bg-gray-900/90 rounded-2xl border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.2)] overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-gradient-to-r from-cyan-900/50 to-purple-900/50 p-4 border-b border-white/10 flex items-center justify-between">
                            <h5 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                                <span className="text-2xl">💰</span> TRANSFER CREDITS
                            </h5>
                            <button
                                type="button"
                                className="text-gray-400 hover:text-white transition-colors"
                                onClick={() => setShowTransferModal(false)}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-mono text-cyan-400">SELECT PLAYER</label>
                                <select
                                    className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white appearance-none focus:outline-none focus:border-cyan-500 transition-colors"
                                    value={selectedPlayer || ''}
                                    onChange={(e) => setSelectedPlayer(Number(e.target.value))}
                                >
                                    <option value="">Choose recipient...</option>
                                    {players.map(player => (
                                        <option key={player.id} value={player.id}>
                                            {player.name} (Balance: ${player.balance})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-mono text-cyan-400">AMOUNT</label>
                                <input
                                    type="number"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    value={transferAmount}
                                    onChange={(e) => setTransferAmount(e.target.value)}
                                    placeholder="Enter amount..."
                                    min="1"
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-black/20 border-t border-white/10 flex justify-end gap-3">
                            <button
                                type="button"
                                className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all font-mono text-sm"
                                onClick={() => setShowTransferModal(false)}
                            >
                                CANCEL
                            </button>
                            <button
                                type="button"
                                className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
                                onClick={handleTransfer}
                                disabled={!selectedPlayer || !transferAmount || isNaN(transferAmount) || parseFloat(transferAmount) <= 0}
                            >
                                SEND TRANSFER
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 max-w-2xl text-center text-gray-400">
                <p>A simple pixel art world using the provided assets.</p>
                <p className="text-sm mt-2 opacity-60">Assets: Cute Fantasy Free</p>
                <p className="text-xs mt-4 opacity-40">Click "Transfer Money" to send funds and watch the Pink Monster deliver crops!</p>
            </div>
        </div>
    );
};

export default PixelMapPage;
