import React, { useState } from 'react';

const RoomList = ({ rooms, onJoinRoom, isLoading, clickSound }) => {
    const [timeFilter, setTimeFilter] = useState('7days');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter rooms based on time and search query with OR logic
    const filteredRooms = Object.entries(rooms).filter(([roomId, roomData]) => {
        const now = Date.now();
        const daysToMs = timeFilter === '7days' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
        const timeThreshold = now - daysToMs;

        const roomCreationTime = roomData.createdAt || 0;
        const passesTimeFilter = roomCreationTime === 0 || roomCreationTime >= timeThreshold;

        const passesSearchFilter = searchQuery.trim() === '' ||
            (roomData.name && roomData.name.toLowerCase().includes(searchQuery.toLowerCase()));

        // OR logic: pass if either condition is true
        return passesTimeFilter || passesSearchFilter;
    });

    const handleJoinRoom = (roomId) => {
        onJoinRoom(roomId);
        clickSound.play();
    };

    return (
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8 animate-fade-in-up animation-delay-200">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Available Rooms
            </h3>

            {/* Filter Controls */}
            <div className="mb-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:bg-white/10 text-sm"
                        placeholder="Search by room name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={() => setTimeFilter('7days')}
                            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${timeFilter === '7days'
                                    ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-300'
                                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            7 Days
                        </button>
                        <button
                            onClick={() => setTimeFilter('30days')}
                            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${timeFilter === '30days'
                                    ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-300'
                                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            30 Days
                        </button>
                    </div>
                </div>
                <p className="text-xs text-gray-500">
                    Showing rooms from last {timeFilter === '7days' ? '7' : '30'} days OR matching "{searchQuery || 'all names'}"
                </p>
            </div>

            {/* Room List */}
            {filteredRooms.length === 0 ? (
                <div className="text-center py-8">
                    <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-400">No rooms match your filters. Try adjusting them or create a new room!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredRooms.map(([roomId, roomData]) => (
                        <div
                            key={roomId}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 flex items-center justify-between gap-4"
                        >
                            <div className="flex-1">
                                <h4 className="text-white font-semibold text-lg">{roomData.name}</h4>
                                <p className="text-gray-400 text-sm">
                                    ID: <span className="text-purple-400 font-mono">{roomId}</span> •
                                    <span className="ml-2">
                                        <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                        </svg>
                                        {roomData.players ? Object.keys(roomData.players).length : 0} Players
                                    </span>
                                </p>
                            </div>
                            <button
                                onClick={() => handleJoinRoom(roomId)}
                                disabled={isLoading}
                                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap"
                            >
                                Join
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RoomList;
