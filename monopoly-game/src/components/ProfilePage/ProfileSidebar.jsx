import React from 'react';

const ProfileSidebar = ({ user, name, avatarURL, selectedCharacter }) => {
    return (
        <div className="w-full md:w-1/3 flex flex-col items-center text-center">
            <div className="relative group mb-4">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-500 blur"></div>
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-white/20 bg-black">
                    {avatarURL ? (
                        <img src={avatarURL} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-4xl">👤</div>
                    )}
                </div>
            </div>
            <h2 className="text-2xl font-bold text-white">{name || 'Anonymous'}</h2>
            <p className="text-sm text-gray-400 font-mono mb-6">{user?.email}</p>

            {/* Character Preview Box (Restricted Height) */}
            <div className="w-full bg-black/40 rounded-xl border border-white/10 p-4 flex flex-col items-center">
                <div className="text-xs text-gray-500 font-mono mb-2 uppercase tracking-wider">Selected Character</div>

                {/* Viewport with max height constraint */}
                <div className="h-[230px] w-full flex items-center justify-center">
                    {/* Sprite Mask - Shows only the first frame */}
                    <div className="relative w-[200px] h-[200px] overflow-hidden">
                        <img
                            src={selectedCharacter.sprite}
                            alt={selectedCharacter.name}
                            className="absolute max-w-none w-[200%] top-0 left-0"
                            style={{ imageRendering: 'pixelated' }}
                        />
                    </div>
                </div>

                <div className="mt-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-400 text-xs font-bold font-mono">
                    {selectedCharacter.name}
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;
