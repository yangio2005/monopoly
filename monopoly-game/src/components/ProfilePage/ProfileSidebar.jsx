import React from 'react';

const ProfileSidebar = ({ user, name, avatarURL }) => {
    return (
        <div className="w-full md:w-1/3 flex flex-col items-center text-center">
            <div className="relative mb-6">
                {/* Square Frame with Double Border */}
                <div className="relative p-2 bg-[#1a1a1a] border-[4px] border-[#333] shadow-[8px_8px_0_0_rgba(0,0,0,0.5)]">
                    <div className="w-32 h-32 md:w-40 md:h-40 overflow-hidden bg-black flex items-center justify-center border-[2px] border-[#222]">
                        {avatarURL ? (
                            <img src={avatarURL} alt="Avatar" className="w-full h-full object-cover pixelated" />
                        ) : (
                            <span className="text-6xl grayscale opacity-30">👤</span>
                        )}
                    </div>
                    {/* Status Light */}
                    <div className="absolute top-0 right-0 w-4 h-4 bg-[#40ffcc] border-[2px] border-[#1a1a1a] shadow-[0_0_8px_#40ffcc]"></div>
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black text-[#444] uppercase tracking-widest">IDENT_001</p>
                <h2 className="text-[20px] font-black text-white uppercase italic">{name || 'ANONYMOUS'}</h2>
                <div className="h-[1px] w-12 bg-[#333] mx-auto my-2"></div>
                <p className="text-[10px] font-black text-[#666] uppercase">{user?.email}</p>
            </div>
        </div>
    );
};

export default ProfileSidebar;
