import React, { useState } from 'react';

const RoomList = ({ rooms, onJoinRoom, isLoading, clickSound }) => {
    const [timeFilter, setTimeFilter] = useState('7days');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRooms = Object.entries(rooms).filter(([, roomData]) => {
        const now = Date.now();
        const daysToMs = timeFilter === '7days' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
        const timeThreshold = now - daysToMs;

        const roomCreationTime = roomData.createdAt || 0;
        const passesTimeFilter = roomCreationTime === 0 || roomCreationTime >= timeThreshold;

        const passesSearchFilter = searchQuery.trim() === '' ||
            (roomData.name && roomData.name.toLowerCase().includes(searchQuery.toLowerCase()));

        return passesTimeFilter || passesSearchFilter;
    });

    const handleJoinRoom = (roomId) => {
        onJoinRoom(roomId);
        clickSound.play();
    };

    return (
        <div className="bg-[#1a1a1a] border-4 border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-[18px] font-bold text-[#ffcc00] mb-8 uppercase flex items-center gap-3">
                <span className="w-6 h-6 bg-[#ffcc00] border-2 border-black animate-pulse"></span>
                Active Channels
            </h3>

            {/* Filter Controls */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        className="flex-1 p-3 bg-black border-4 border-[#333] text-white text-[12px] focus:border-[#ffcc00] focus:outline-none"
                        placeholder="SEARCH_BY_NAME..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={() => setTimeFilter('7days')}
                            className={`px-4 py-2 border-4 text-[10px] font-bold transition-all ${timeFilter === '7days'
                                ? 'bg-[#ffcc00] border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                : 'bg-transparent border-[#333] text-gray-500 hover:border-gray-400'
                                }`}
                        >
                            7D
                        </button>
                        <button
                            onClick={() => setTimeFilter('30days')}
                            className={`px-4 py-2 border-4 text-[10px] font-bold transition-all ${timeFilter === '30days'
                                ? 'bg-[#ffcc00] border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                : 'bg-transparent border-[#333] text-gray-500 hover:border-gray-400'
                                }`}
                        >
                            30D
                        </button>
                    </div>
                </div>
            </div>

            {/* Room List */}
            {filteredRooms.length === 0 ? (
                <div className="text-center py-12 border-4 border-dashed border-[#333]">
                    <p className="text-gray-500 text-[10px]">NO_SERVERS_FOUND</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredRooms.map(([roomId, roomData]) => (
                        <div
                            key={roomId}
                            className="bg-[#222] border-4 border-[#333] p-4 flex items-center justify-between gap-4 hover:border-[#40ff00] group transition-colors"
                        >
                            <div className="flex-1">
                                <h4 className="text-white text-[14px] font-bold uppercase group-hover:text-[#40ff00]">{roomData.name}</h4>
                                <div className="mt-2 flex items-center gap-4 text-[8px] text-gray-500 uppercase">
                                    <span>ID: {roomId.slice(0, 8)}...</span>
                                    <span className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-[#40ff00] rounded-full"></div>
                                        {roomData.players ? Object.keys(roomData.players).length : 0} ON
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleJoinRoom(roomId)}
                                disabled={isLoading}
                                className="px-6 py-2 bg-white border-4 border-black text-black text-[12px] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#40ff00] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50"
                            >
                                ENTER
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RoomList;
