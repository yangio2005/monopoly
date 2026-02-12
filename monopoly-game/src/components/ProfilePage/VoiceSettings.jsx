import React, { useRef, useState } from 'react';

const VariableChip = ({ label, value, icon, onClick }) => (
    <button
        type="button"
        onClick={() => onClick(value)}
        className="group relative px-3 py-1 bg-[#111] border border-[#333] hover:border-[#40ffcc] hover:bg-[#40ffcc]/10 shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] active:translate-y-0.5 active:shadow-none transition-all"
        title={`Chèn ${value}`}
    >
        <div className="flex items-center gap-1.5">
            <span className="text-xs group-hover:scale-110 transition-transform">{icon}</span>
            <span className="text-[9px] font-black uppercase text-[#888] group-hover:text-[#40ffcc]">{label}</span>
        </div>
    </button>
);

const TemplateEditor = ({
    label,
    value,
    onChange,
    placeholder,
    previewData
}) => {
    const textareaRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    const insertVariable = (variable) => {
        const input = textareaRef.current;
        if (!input) return;

        const start = input.selectionStart;
        const end = input.selectionEnd;
        const newValue = value.substring(0, start) + variable + value.substring(end);

        onChange(newValue);

        setTimeout(() => {
            input.focus();
            input.setSelectionRange(start + variable.length, start + variable.length);
        }, 0);
    };

    const getPreview = () => {
        let preview = value;
        Object.entries(previewData).forEach(([key, val]) => {
            preview = preview.replace(new RegExp(`{${key}}`, 'g'), val);
        });
        return preview;
    };

    const variables = [
        { label: 'SỐ TIỀN', value: '{amount}', icon: '💰' },
        { label: 'ĐƠN VỊ', value: '{currency}', icon: '💵' },
        { label: 'GỬI', value: '{sender}', icon: '👤' },
        { label: 'NHẬN', value: '{receiver}', icon: '👥' },
    ];

    return (
        <div className={`p-4 border-[2px] transition-all bg-[#0a0a0a] ${isFocused ? 'border-[#40ffcc] shadow-[0_0_20px_rgba(64,255,204,0.1)]' : 'border-[#222]'}`}>
            <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] font-black text-[#555] uppercase tracking-widest flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isFocused ? 'bg-[#40ffcc] animate-pulse' : 'bg-[#333]'}`}></span>
                    {label}
                </label>
                <div className="text-[8px] font-black text-[#444] uppercase tracking-tighter">DATA_STREAM_0X22</div>
            </div>

            <div className="relative group mb-4">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    rows={2}
                    className="w-full bg-black border border-[#222] p-3 text-sm text-white focus:outline-none focus:border-[#40ffcc]/50 transition-all resize-none font-bold leading-relaxed"
                    placeholder={placeholder}
                />
            </div>

            <div className="flex flex-wrap gap-2 items-center mb-4">
                <span className="text-[8px] font-black text-[#333] uppercase">CONST_VARS:</span>
                {variables.map((v) => (
                    <VariableChip
                        key={v.value}
                        {...v}
                        onClick={insertVariable}
                    />
                ))}
            </div>

            <div className="pt-3 border-t border-[#1a1a1a]">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[8px] font-black text-[#444] uppercase">AUDIO_OUT_PREVIEW:</span>
                </div>
                <div className="p-3 bg-black border border-[#1a1a1a] relative overflow-hidden">
                    <p className="text-xs text-[#40ffcc] italic font-bold">
                        "{getPreview()}"
                    </p>
                    {/* Visual Audio Waveform Garnish */}
                    <div className="absolute bottom-1 right-2 flex gap-0.5 opacity-20">
                        <div className="w-[1px] h-2 bg-[#40ffcc] animate-[h-pulse_0.5s_infinite_ease-in-out]"></div>
                        <div className="w-[1px] h-4 bg-[#40ffcc] animate-[h-pulse_0.7s_infinite_ease-in-out]"></div>
                        <div className="w-[1px] h-3 bg-[#40ffcc] animate-[h-pulse_0.4s_infinite_ease-in-out]"></div>
                        <div className="w-[1px] h-5 bg-[#40ffcc] animate-[h-pulse_0.6s_infinite_ease-in-out]"></div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes h-pulse {
                    0%, 100% { transform: scaleY(0.5); }
                    50% { transform: scaleY(1.5); }
                }
            `}</style>
        </div>
    );
};

const VoiceSettings = ({
    sentTemplate,
    setSentTemplate,
    receivedTemplate,
    setReceivedTemplate,
    testSender,
    setTestSender,
    testReceiver,
    setTestReceiver,
    handleTestSent,
    handleTestReceived
}) => {
    return (
        <div className="space-y-6 pt-6 border-t border-[#222]">
            <div className="flex items-center gap-4 mb-4">
                <h4 className="text-[18px] font-black text-[#40ffcc] uppercase tracking-wider italic">
                    VOICE_ENGINE_MOD
                </h4>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-[#40ffcc]/40 to-transparent"></div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <TemplateEditor
                    label="TX_DISBURSE_PROTO"
                    value={sentTemplate}
                    onChange={setSentTemplate}
                    placeholder="ON_SEND..."
                    previewData={{
                        amount: '50,000',
                        currency: 'VNĐ',
                        sender: 'BẠN',
                        receiver: testReceiver || 'RECIPIENT'
                    }}
                />

                <TemplateEditor
                    label="RX_COLLECT_PROTO"
                    value={receivedTemplate}
                    onChange={setReceivedTemplate}
                    placeholder="ON_RECEIVE..."
                    previewData={{
                        amount: '100,000',
                        currency: 'VNĐ',
                        sender: testSender || 'SENDER',
                        receiver: 'BẠN'
                    }}
                />
            </div>

            <div className="bg-[#111] p-6 border-[2px] border-[#222]">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 bg-[#ff4d4d] animate-pulse"></div>
                    <span className="text-[10px] font-black text-[#888] uppercase tracking-widest">DIAGNOSTIC_TERMINAL</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                        <label className="text-[8px] font-black text-[#444] uppercase ml-1">TEST_SENDER_ID</label>
                        <input
                            type="text"
                            value={testSender}
                            onChange={(e) => setTestSender(e.target.value)}
                            className="block w-full px-3 py-3 bg-black border border-[#222] text-white text-xs font-bold focus:border-[#ff4d4d]/50 transition-all placeholder-[#222]"
                            placeholder="USER_X"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[8px] font-black text-[#444] uppercase ml-1">TEST_RECEIVER_ID</label>
                        <input
                            type="text"
                            value={testReceiver}
                            onChange={(e) => setTestReceiver(e.target.value)}
                            className="block w-full px-3 py-3 bg-black border border-[#222] text-white text-xs font-bold focus:border-[#ff4d4d]/50 transition-all placeholder-[#222]"
                            placeholder="USER_Y"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={handleTestReceived}
                        className="group relative py-3 px-4 bg-[#1a1a1a] border-[2px] border-[#333] hover:border-[#40ffcc] text-[#888] hover:text-[#40ffcc] text-xs font-black uppercase shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none transition-all"
                    >
                        [ EXEC_RX_TEST ]
                    </button>
                    <button
                        type="button"
                        onClick={handleTestSent}
                        className="group relative py-3 px-4 bg-[#1a1a1a] border-[2px] border-[#333] hover:border-[#ff4d4d] text-[#888] hover:text-[#ff4d4d] text-xs font-black uppercase shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none transition-all"
                    >
                        [ EXEC_TX_TEST ]
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoiceSettings;
