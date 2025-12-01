import React from 'react';

const BasicInfo = ({ name, setName, avatarURL, setAvatarURL }) => {
    return (
        <>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Display Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="Enter your name"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Avatar URL</label>
                <input
                    type="text"
                    value={avatarURL}
                    onChange={(e) => setAvatarURL(e.target.value)}
                    className="block w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="https://..."
                />
            </div>
        </>
    );
};

export default BasicInfo;
