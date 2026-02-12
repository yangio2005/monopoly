import React from 'react';

const BasicInfo = ({ name, setName, avatarURL, setAvatarURL }) => {
    const [currentStyle, setCurrentStyle] = React.useState('pixel-art');
    const styles = [
        { id: 'pixel-art', label: 'RETRO_PIXEL' },
        { id: 'adventurer', label: 'QUESTER' },
        { id: 'bottts', label: 'CYBORG' },
        { id: 'lorelei', label: 'AVATAR_V2' },
        { id: 'avataaars', label: 'HUMANOID' },
    ];

    const presetSeeds = ['Loki', 'Sasha', 'Jasper', 'Milo', 'Zane', 'Aria', 'Felix', 'Nala', 'Oliver', 'Luna'];

    const generateRandomAvatar = () => {
        const randomSeed = Math.random().toString(36).substring(7);
        setAvatarURL(`https://api.dicebear.com/7.x/${currentStyle}/svg?seed=${randomSeed}`);
    };

    return (
        <div className="space-y-8">
            {/* Quick Avatar Gallery */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-wrap gap-2">
                        {styles.map((s) => (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => setCurrentStyle(s.id)}
                                className={`px-2 py-1 text-[8px] font-black border transition-all ${currentStyle === s.id ? 'bg-[#40ffcc] text-black border-[#40ffcc]' : 'bg-black text-[#666] border-[#222] hover:border-[#444]'}`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={generateRandomAvatar}
                        className="text-[9px] font-black text-[#40ffcc] hover:underline uppercase tracking-tighter"
                    >
                        [ RUN_RANDOMIZER ]
                    </button>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-3 bg-[#0a0a0a] border-[2px] border-[#222]">
                    {presetSeeds.map((seed) => {
                        const url = `https://api.dicebear.com/7.x/${currentStyle}/svg?seed=${seed}`;
                        const isActive = avatarURL === url;
                        return (
                            <button
                                key={seed}
                                type="button"
                                onClick={() => setAvatarURL(url)}
                                className={`aspect-square border-[2px] transition-all p-0.5 ${isActive ? 'border-[#40ffcc] bg-[#40ffcc]/10 animate-pulse' : 'border-[#222] hover:border-[#444] bg-black'}`}
                            >
                                <img src={url} alt={seed} className="w-full h-full object-contain pixelated" />
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-[10px] font-black text-[#666] uppercase tracking-widest">DISPLAY_NAME_VAL</label>
                <div className="relative group">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full px-4 py-4 bg-black border-[2px] border-[#222] text-white text-[14px] font-bold focus:outline-none focus:border-[#40ffcc] focus:bg-[#0d0d0d] transition-all placeholder-[#222]"
                        placeholder="IDENTIFY AS..."
                    />
                    <div className="absolute top-0 right-4 h-full flex items-center pointer-events-none">
                        <span className="text-[10px] text-[#222] font-black group-focus-within:text-[#40ffcc]/30">STR_DATA</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-[10px] font-black text-[#666] uppercase tracking-widest">AVATAR_ENDPOINT</label>
                <div className="relative group">
                    <input
                        type="text"
                        value={avatarURL}
                        onChange={(e) => setAvatarURL(e.target.value)}
                        className="block w-full px-4 py-4 bg-black border-[2px] border-[#222] text-white text-[14px] font-bold focus:outline-none focus:border-[#40ffcc] focus:bg-[#0d0d0d] transition-all placeholder-[#222]"
                        placeholder="URI://ASSET_01.PNG"
                    />
                    <div className="absolute top-0 right-4 h-full flex items-center pointer-events-none">
                        <span className="text-[10px] text-[#222] font-black group-focus-within:text-[#40ffcc]/30">URL_LINK</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicInfo;
