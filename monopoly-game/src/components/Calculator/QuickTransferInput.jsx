import React from 'react';

const QuickTransferInput = ({ value, onValueChange, currencySymbol, currencyCode }) => {
    const handleNumber = (num) => {
        onValueChange(prev => String(prev) + String(num));
    };

    const handleSuffix = (suffix) => {
        let numericVal = parseInt(value) || 0;
        if (suffix === '000') onValueChange(String(numericVal * 1000));
        if (suffix === 'k') onValueChange(String(numericVal * 1000));
        if (suffix === 'M') onValueChange(String(numericVal * 1000000));
    };

    const handleClear = () => {
        onValueChange('');
    };

    const handleBackspace = () => {
        onValueChange(prev => String(prev).slice(0, -1));
    };

    return (
        <div className="flex flex-col gap-4 font-retro w-full">
            {/* Value Display */}
            <div className="relative">
                <input
                    type="text"
                    readOnly
                    value={value}
                    className="w-full bg-[#111] border-[1px] border-[#555] p-4 text-white text-[24px] font-bold text-right focus:outline-none"
                    placeholder="0"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#40ff00] text-[12px] font-bold">
                    {currencyCode || 'VND'}
                </div>
            </div>

            {/* Matrix Keypad */}
            <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                        key={num}
                        onClick={() => handleNumber(num)}
                        className="py-3 bg-[#333] border-[1px] border-[#555] text-white text-[18px] font-bold hover:bg-[#444] active:bg-[#222] transition-colors"
                    >
                        {num}
                    </button>
                ))}
                <button
                    onClick={handleClear}
                    className="py-3 bg-[#ff4d4d]/20 border-[1px] border-[#ff4d4d]/50 text-[#ff4d4d] text-[14px] font-bold hover:bg-[#ff4d4d]/30"
                >
                    CLR
                </button>
                <button
                    onClick={() => handleNumber(0)}
                    className="py-3 bg-[#333] border-[1px] border-[#555] text-white text-[18px] font-bold hover:bg-[#444]"
                >
                    0
                </button>
                <button
                    onClick={handleBackspace}
                    className="py-3 bg-[#333] border-[1px] border-[#555] text-white text-[14px] font-bold hover:bg-[#444]"
                >
                    ⌫
                </button>
            </div>

            {/* Suffix/Quick Actions */}
            <div className="grid grid-cols-3 gap-2 mt-1">
                <button
                    onClick={() => handleSuffix('k')}
                    className="py-3 bg-[#ffcc00] border-[1px] border-black text-black text-[14px] font-bold hover:brightness-110"
                >
                    000 (k)
                </button>
                <button
                    onClick={() => handleSuffix('M')}
                    className="py-3 bg-[#66ccff] border-[1px] border-black text-black text-[14px] font-bold hover:brightness-110"
                >
                    1,000k (M)
                </button>
                <button
                    onClick={() => onValueChange(prev => String(parseInt(prev || 0) + 50000))}
                    className="py-3 bg-white border-[1px] border-black text-black text-[14px] font-bold hover:brightness-110 shadow-inner"
                >
                    +50k
                </button>
            </div>
        </div>
    );
};

export default QuickTransferInput;
