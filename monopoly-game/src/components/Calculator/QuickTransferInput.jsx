import React from 'react';

const QuickTransferInput = ({ value, onValueChange, currencySymbol }) => {
    const quickAmounts = [10, 50, 100, 500, 1000];

    const handleQuickAdd = (amount) => {
        const currentVal = parseInt(value) || 0;
        onValueChange(String(currentVal + amount));
    };

    const handleClear = () => {
        onValueChange('');
    };

    const handleChange = (e) => {
        // Only allow numeric input
        const val = e.target.value.replace(/[^0-9]/g, '');
        onValueChange(val);
    };

    return (
        <div className="space-y-3">
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 font-mono text-xl font-bold">
                    {currencySymbol}
                </span>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-full bg-black/50 border border-cyan-500/30 rounded-xl py-4 pl-10 pr-4 text-right text-3xl font-mono text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all"
                    placeholder="0"
                    value={value}
                    onChange={handleChange}
                />
                {value && (
                    <button
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-400 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {quickAmounts.map((amount) => (
                    <button
                        key={amount}
                        type="button"
                        onClick={() => handleQuickAdd(amount)}
                        className="px-2 py-2 rounded-lg bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all font-mono text-sm font-bold active:scale-95"
                    >
                        +{amount}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickTransferInput;
