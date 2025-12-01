import React, { useState, useEffect } from 'react';
import SpriteAnimator from './SpriteAnimator';

const CHARACTERS = [
    {
        id: 'pink',
        name: 'Pink Monster',
        basePath: '/assets/1 Pink_Monster/Pink_Monster',
        color: '#ff69b4'
    },
    {
        id: 'owlet',
        name: 'Owlet Monster',
        basePath: '/assets/2 Owlet_Monster/Owlet_Monster',
        color: '#a855f7'
    },
    {
        id: 'dude',
        name: 'Dude Monster',
        basePath: '/assets/3 Dude_Monster/Dude_Monster',
        color: '#22d3ee'
    }
];

const ACTIONS = {
    IDLE: { name: 'Idle', frames: 4 },
    RUN: { name: 'Run', frames: 6 },
    ATTACK1: { name: 'Attack1', frames: 4 },
    ATTACK2: { name: 'Attack2', frames: 6 },
    JUMP: { name: 'Jump', frames: 8 },
    HURT: { name: 'Hurt', frames: 4 },
    DEATH: { name: 'Death', frames: 8 },
    PUSH: { name: 'Push', frames: 6 },
    WALK: { name: 'Walk', frames: 6 },
    THROW: { name: 'Throw', frames: 4 },
    CLIMB: { name: 'Climb', frames: 4 },
    WALK_ATTACK: { name: 'Walk+Attack', frames: 6 },
};

const SCENES = [
    {
        name: "Focus",
        duration: 2000,
        actions: { pink: 'IDLE', owlet: 'IDLE', dude: 'IDLE' }
    },
    {
        name: "Warm Up",
        duration: 2000,
        actions: { pink: 'PUSH', owlet: 'WALK', dude: 'RUN' }
    },
    {
        name: "Synchronized Strike",
        duration: 1500,
        actions: { pink: 'ATTACK1', owlet: 'ATTACK1', dude: 'ATTACK1' }
    },
    {
        name: "Chaos",
        duration: 2000,
        actions: { pink: 'ATTACK2', owlet: 'JUMP', dude: 'THROW' }
    },
    {
        name: "Counter Attack",
        duration: 1500,
        actions: { pink: 'HURT', owlet: 'ATTACK2', dude: 'ATTACK2' }
    },
    {
        name: "Recovery",
        duration: 1500,
        actions: { pink: 'JUMP', owlet: 'RUN', dude: 'RUN' }
    },
    {
        name: "Grand Finale",
        duration: 3000,
        actions: { pink: 'WALK_ATTACK', owlet: 'WALK_ATTACK', dude: 'WALK_ATTACK' }
    }
];

const MartialArtsPerformance = () => {
    const [sceneIndex, setSceneIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        if (!isPlaying) return;

        const currentScene = SCENES[sceneIndex];
        const timer = setTimeout(() => {
            setSceneIndex((prev) => (prev + 1) % SCENES.length);
        }, currentScene.duration);

        return () => clearTimeout(timer);
    }, [sceneIndex, isPlaying]);

    const currentScene = SCENES[sceneIndex];

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center relative overflow-hidden font-mono">
            {/* Stage Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black opacity-80"></div>

            {/* Floor */}
            <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent opacity-50"></div>

            {/* Spotlight */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

            {/* UI Overlay */}
            <div className="absolute top-10 z-10 text-center">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 mb-2 animate-pulse">
                    MONSTER MARTIAL ARTS
                </h1>
                <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white/80 text-sm">
                    ACT: {currentScene.name.toUpperCase()}
                </div>
            </div>

            {/* Stage */}
            <div className="relative z-0 flex items-end justify-center gap-16 pb-20 scale-125">
                {CHARACTERS.map((char) => {
                    const actionKey = currentScene.actions[char.id];
                    const action = ACTIONS[actionKey];
                    const src = `${char.basePath}_${action.name}_${action.frames}.png`;

                    return (
                        <div key={char.id} className="flex flex-col items-center gap-4 transition-all duration-500">
                            {/* Character Container */}
                            <div className="relative group">
                                {/* Shadow */}
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/60 blur-md rounded-[100%]"></div>

                                {/* Sprite */}
                                <SpriteAnimator
                                    src={src}
                                    frameCount={action.frames}
                                    fps={10}
                                    scale={6}
                                    className="drop-shadow-2xl filter brightness-110 contrast-125"
                                />

                                {/* Name Tag */}
                                <div
                                    className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-bold px-2 py-1 rounded bg-black/80 text-white border border-white/10"
                                    style={{ color: char.color }}
                                >
                                    {char.name}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Controls */}
            <div className="absolute bottom-10 z-10 flex gap-4">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur text-white transition-all active:scale-95"
                >
                    {isPlaying ? 'PAUSE' : 'RESUME'}
                </button>
                <button
                    onClick={() => setSceneIndex((prev) => (prev + 1) % SCENES.length)}
                    className="px-6 py-2 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 backdrop-blur text-cyan-300 transition-all active:scale-95"
                >
                    NEXT MOVE ⏭
                </button>
            </div>
        </div>
    );
};

export default MartialArtsPerformance;
