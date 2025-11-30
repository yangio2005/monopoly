import React from 'react';

// Character configurations
export const CHARACTERS = [
    { id: 'male-1', name: 'Warrior', sprite: '/src/assets/charactor/male-1.png' },
    { id: 'male-2', name: 'Knight', sprite: '/src/assets/charactor/male-2.png' },
    { id: 'male-3', name: 'Mage', sprite: '/src/assets/charactor/male-3.png' },
    { id: 'male-4', name: 'Rogue', sprite: '/src/assets/charactor/male-4.png' },
    { id: 'male-5', name: 'Archer', sprite: '/src/assets/charactor/male-5.png' },
    { id: 'female-1', name: 'Warrior F', sprite: '/src/assets/charactor/female-1.png' },
    { id: 'female-3', name: 'Mage F', sprite: '/src/assets/charactor/female-3.png' },
];

const CharacterSelector = ({ selectedCharacterId, onSelect }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-purple-400 font-mono uppercase tracking-wider">
                    Game Character
                </label>
                <div className="text-xs text-gray-500 font-mono">
                    Appears in Character Room
                </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                {CHARACTERS.map((character) => (
                    <button
                        key={character.id}
                        type="button"
                        onClick={() => onSelect(character.id)}
                        className={`
              relative aspect-square rounded-xl border-2 transition-all overflow-hidden group
              ${selectedCharacterId === character.id
                                ? 'border-cyan-500 bg-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-105'
                                : 'border-white/10 bg-black/30 hover:border-purple-500/50 hover:bg-purple-500/10'
                            }
            `}
                        title={character.name}
                    >
                        {/* Character Preview */}
                        <div className="absolute inset-0 flex items-center justify-center p-2">
                            <div
                                className="w-full h-full bg-contain bg-center bg-no-repeat"
                                style={{
                                    backgroundImage: `url(${character.sprite})`,
                                    backgroundPosition: '0 0',
                                    backgroundSize: '200% auto',
                                    imageRendering: 'pixelated',
                                }}
                            />
                        </div>

                        {/* Selected Badge */}
                        {selectedCharacterId === character.id && (
                            <div className="absolute top-1 right-1 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}

                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-1">
                            <span className="text-[10px] font-mono text-white truncate px-1">
                                {character.name}
                            </span>
                        </div>

                        {/* Glow effect for selected */}
                        {selectedCharacterId === character.id && (
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl opacity-30 blur animate-pulse" />
                        )}
                    </button>
                ))}
            </div>

            {/* Selected Character Display */}
            {selectedCharacterId && (
                <div className="mt-4 p-4 bg-black/30 border border-white/10 rounded-lg flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-black/50 rounded-lg border border-cyan-500/30 overflow-hidden">
                        <div
                            className="w-full h-full bg-contain bg-center bg-no-repeat"
                            style={{
                                backgroundImage: `url(${CHARACTERS.find(c => c.id === selectedCharacterId)?.sprite})`,
                                backgroundPosition: '0 0',
                                backgroundSize: '200% auto',
                                imageRendering: 'pixelated',
                            }}
                        />
                    </div>
                    <div>
                        <div className="text-sm text-gray-400 font-mono">Selected Character:</div>
                        <div className="text-lg font-bold text-cyan-400 font-mono">
                            {CHARACTERS.find(c => c.id === selectedCharacterId)?.name}
                        </div>
                    </div>
                    <div className="ml-auto">
                        <div className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-400 text-xs font-mono">
                            ✓ ACTIVE
                        </div>
                    </div>
                </div>
            )}

            <p className="text-xs text-gray-500 flex items-start gap-2">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>This character will appear when you join games in Character Room mode.</span>
            </p>
        </div>
    );
};

export default CharacterSelector;
