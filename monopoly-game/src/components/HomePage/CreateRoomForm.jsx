import React, { useState } from 'react';

const CreateRoomForm = ({ onCreateRoom, isLoading, clickSound }) => {
    const [roomName, setRoomName] = useState('');
    const [initialBalance, setInitialBalance] = useState('');

    const handleSubmit = () => {
        onCreateRoom(roomName, initialBalance);
        clickSound.play();
    };

    return (
        <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Room
            </h3>
            <input
                type="text"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:bg-white/10 mb-3"
                placeholder="Enter Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
            />
            <input
                type="number"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:bg-white/10 mb-3"
                placeholder="Initial Balance (Default: 1500)"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                min="1"
            />
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/50 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create New Room
            </button>
        </div>
    );
};

export default CreateRoomForm;
