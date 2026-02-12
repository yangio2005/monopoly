import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Howl } from 'howler';
import { useRoomManagement } from './hooks/useRoomManagement';
import CreateRoomForm from './CreateRoomForm';
import JoinRoomForm from './JoinRoomForm';
import RoomList from './RoomList';

const HomePage = () => {
    const navigate = useNavigate();
    const [clickSound] = useState(new Howl({ src: ['/click.mp3'] }));

    const { user, rooms, error, isLoading, createRoom, joinRoom } = useRoomManagement(navigate);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] font-retro">
                <div className="text-white text-xl animate-pulse">LOADING...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full relative overflow-hidden py-12 px-4 font-retro bg-[#0a0a0a] text-white">
            {/* Retro Grid Background */}
            <div className="absolute inset-0 z-0 opacity-10"
                style={{
                    backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}>
            </div>

            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none z-50 crt-overlay opacity-[0.03]"></div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto pt-20">
                {/* Header */}
                <div className="text-center mb-12 transform -rotate-1">
                    <h1 className="text-4xl md:text-6xl font-black text-[#ffcc00] mb-4 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] tracking-widest animate-flicker">
                        MONOPOLY ZONE
                    </h1>
                    <div className="inline-block bg-[#40ff00] text-black text-[10px] px-4 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase font-bold">
                        PLAYER: {user.displayName || user.email?.split('@')[0]}
                    </div>
                </div>

                {/* Main Dashboard Card */}
                <div className="bg-[#e0e0e0] border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 md:p-10 mb-12 relative overflow-hidden">
                    {/* Card Shine */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-white/30"></div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-8 bg-[#ff3333] border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <p className="text-white text-[10px] leading-relaxed text-center font-bold">
                                SYSTEM ERROR: {error}
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Create Room Section */}
                        <div className="space-y-6">
                            <CreateRoomForm
                                onCreateRoom={createRoom}
                                isLoading={isLoading}
                                clickSound={clickSound}
                            />
                        </div>

                        {/* Join Room Section */}
                        <div className="space-y-6">
                            <JoinRoomForm
                                onJoinRoom={joinRoom}
                                onNavigateToScan={() => navigate('/scan-qr')}
                                isLoading={isLoading}
                                clickSound={clickSound}
                            />
                        </div>
                    </div>
                </div>

                {/* Available Rooms List Section */}
                <div className="mt-16">
                    <RoomList
                        rooms={rooms}
                        onJoinRoom={joinRoom}
                        isLoading={isLoading}
                        clickSound={clickSound}
                    />
                </div>

                {/* Footer Deco */}
                <div className="mt-20 text-center pb-10">
                    <p className="text-[10px] text-gray-500 tracking-[0.2em] animate-pulse">
                        SEARCHING FOR ACTIVE SERVERS...
                    </p>
                </div>
            </div>

            <style jsx>{`
                .crt-overlay {
                    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
                    background-size: 100% 4px, 3px 100%;
                }
                
                @keyframes flicker {
                    0% { opacity: 0.9; }
                    5% { opacity: 1; }
                    10% { opacity: 0.9; }
                    15% { opacity: 1; }
                    80% { opacity: 1; }
                    85% { opacity: 0.8; }
                    90% { opacity: 1; }
                }

                .animate-flicker {
                    animation: flicker 0.1s infinite;
                }
            `}</style>
        </div>
    );
};

export default HomePage;
