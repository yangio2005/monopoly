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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-950">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full relative overflow-hidden py-8 px-4">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-950 animate-gradient-xy"></div>

            {/* Animated Orbs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in-down">
                    <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-2 drop-shadow-2xl">
                        MONOPOLY GAME
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Welcome, <span className="text-purple-400 font-semibold">{user.displayName || user.email}</span>!
                    </p>
                </div>

                {/* Main Card */}
                <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8 mb-6 animate-fade-in-up">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 backdrop-blur-sm animate-shake">
                            <p className="text-red-200 text-sm font-medium flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Create Room Form */}
                    <CreateRoomForm
                        onCreateRoom={createRoom}
                        isLoading={isLoading}
                        clickSound={clickSound}
                    />

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-transparent text-gray-400 font-medium">OR</span>
                        </div>
                    </div>

                    {/* Join Room Form */}
                    <JoinRoomForm
                        onJoinRoom={joinRoom}
                        onNavigateToScan={() => navigate('/scan-qr')}
                        isLoading={isLoading}
                        clickSound={clickSound}
                    />
                </div>

                {/* Available Rooms List */}
                <RoomList
                    rooms={rooms}
                    onJoinRoom={joinRoom}
                    isLoading={isLoading}
                    clickSound={clickSound}
                />
            </div>

            {/* Custom Animations CSS */}
            <style>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-gradient-xy { animation: gradient-xy 15s ease infinite; background-size: 400% 400%; }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animate-fade-in-down { animation: fade-in-down 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out 0.2s both; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
        </div>
    );
};

export default HomePage;
