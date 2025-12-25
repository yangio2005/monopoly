import React from 'react';

const ProfileSidebar = ({ user, name, avatarURL }) => {
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
        </div>
    );
};

export default ProfileSidebar;
