import React, { useState } from 'react';

const JoinRoomForm = ({ onJoinRoom, onNavigateToScan, isLoading, clickSound }) => {
    const [roomIdInput, setRoomIdInput] = useState('');

    const handleJoin = () => {
        onJoinRoom(roomIdInput);
        clickSound.play();
    };

    const handleScan = () => {
        onNavigateToScan();
        clickSound.play();
    };

    return (
        <div className="bg-[#f0f0f0] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-[14px] font-bold text-black mb-6 uppercase flex items-center gap-2">
                <span className="w-4 h-4 bg-[#00f0ff] border-2 border-black"></span>
                Connect Room
            </h3>

            <div className="space-y-6">
                <div>
                    <label className="block text-[10px] text-black mb-2 font-bold">ROOM ID:</label>
                    <input
                        type="text"
                        className="w-full p-3 bg-white border-4 border-black text-[12px] text-black focus:bg-[#ccffff] focus:outline-none shadow-[inset_4px_4px_0px_rgba(0,0,0,0.1)]"
                        placeholder="ENTER_ID_HERE"
                        value={roomIdInput}
                        onChange={(e) => setRoomIdInput(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={handleJoin}
                        disabled={isLoading}
                        className="w-full py-4 bg-[#00f0ff] border-4 border-black text-black text-[14px] font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50"
                    >
                        {isLoading ? "LINKING..." : "JOIN WORLD"}
                    </button>

                    <button
                        onClick={handleScan}
                        className="w-full py-3 bg-[#ffccff] border-4 border-black text-black text-[10px] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                    >
                        <span>[ ]</span> SCAN QR LINK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JoinRoomForm;
