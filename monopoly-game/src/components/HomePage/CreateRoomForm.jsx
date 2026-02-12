import React, { useState } from 'react';

const CreateRoomForm = ({ onCreateRoom, isLoading, clickSound }) => {
    const [roomName, setRoomName] = useState('');
    const [initialBalance, setInitialBalance] = useState('');

    const handleSubmit = () => {
        onCreateRoom(roomName, initialBalance);
        clickSound.play();
    };

    return (
        <div className="bg-[#f0f0f0] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-[14px] font-bold text-black mb-6 uppercase flex items-center gap-2">
                <span className="w-4 h-4 bg-[#40ff00] border-2 border-black"></span>
                Create Room
            </h3>

            <div className="space-y-6">
                <div>
                    <label className="block text-[10px] text-black mb-2 font-bold">ROOM NAME:</label>
                    <input
                        type="text"
                        className="w-full p-3 bg-white border-4 border-black text-[12px] text-black focus:bg-[#ffffcc] focus:outline-none shadow-[inset_4px_4px_0px_rgba(0,0,0,0.1)]"
                        placeholder="WORLD_NAME"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-[10px] text-black mb-2 font-bold">START BANK (1500):</label>
                    <input
                        type="number"
                        className="w-full p-3 bg-white border-4 border-black text-[12px] text-black focus:bg-[#ffffcc] focus:outline-none shadow-[inset_4px_4px_0px_rgba(0,0,0,0.1)]"
                        placeholder="1500"
                        value={initialBalance}
                        onChange={(e) => setInitialBalance(e.target.value)}
                        min="1"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full py-4 bg-[#40ff00] border-4 border-black text-black text-[14px] font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50"
                >
                    {isLoading ? "BUILDING..." : "CREATE WORLD"}
                </button>
            </div>
        </div>
    );
};

export default CreateRoomForm;
