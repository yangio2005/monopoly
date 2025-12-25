import React, { useRef, useState } from 'react';

const VariableChip = ({ label, value, icon, onClick }) => (
    <button
        type="button"
        onClick={() => onClick(value)}
        className="group flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 rounded-full transition-all duration-200 text-xs font-medium text-gray-300 hover:text-cyan-300"
        title={`Chèn ${value}`}
    >
        <span>{icon}</span>
        <span>{label}</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500 ml-0.5">+</span>
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

        // Restore focus and cursor position
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
        { label: 'Số tiền', value: '{amount}', icon: '💰' },
        { label: 'Đơn vị', value: '{currency}', icon: '💵' },
        { label: 'Người gửi', value: '{sender}', icon: '👤' },
        { label: 'Người nhận', value: '{receiver}', icon: '👥' },
    ];

    return (
        <div className={`space-y-3 p-4 rounded-xl border transition-all duration-300 ${isFocused ? 'bg-white/5 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-black/20 border-white/10'}`}>
            <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-200 flex items-center gap-2">
                    {label}
                </label>
                <div className="text-xs text-cyan-400/80 font-mono bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20">
                    Preview
                </div>
            </div>

            <div className="relative group">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    rows={2}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none font-mono leading-relaxed"
                    placeholder={placeholder}
                />
                <div className="absolute bottom-2 right-2 flex gap-1">
                    {/* Optional: Add quick actions here if needed */}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-gray-500 mr-1">Chèn nhanh:</span>
                {variables.map((v) => (
                    <VariableChip
                        key={v.value}
                        {...v}
                        onClick={insertVariable}
                    />
                ))}
            </div>

            <div className="mt-2 pt-3 border-t border-white/5">
                <p className="text-xs text-gray-400 mb-1">Xem trước:</p>
                <p className="text-sm text-cyan-100 italic bg-cyan-500/10 p-2 rounded border border-cyan-500/20">
                    "{getPreview()}"
                </p>
            </div>
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
        <div className="space-y-6 p-6 bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                </div>
                <div>
                    <h4 className="text-xl font-bold text-white tracking-tight">Cấu hình Giọng nói</h4>
                    <p className="text-sm text-gray-400">Tùy chỉnh thông báo âm thanh khi giao dịch</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <TemplateEditor
                    label="🔔 Khi GỬI tiền"
                    value={sentTemplate}
                    onChange={setSentTemplate}
                    placeholder="Ví dụ: Đã chuyển {amount} {currency}..."
                    previewData={{
                        amount: '50,000',
                        currency: 'VNĐ',
                        sender: 'Bạn',
                        receiver: testReceiver || 'Người nhận'
                    }}
                />

                <TemplateEditor
                    label="📥 Khi NHẬN tiền"
                    value={receivedTemplate}
                    onChange={setReceivedTemplate}
                    placeholder="Ví dụ: {sender} đã chuyển {amount}..."
                    previewData={{
                        amount: '100,000',
                        currency: 'VNĐ',
                        sender: testSender || 'Người gửi',
                        receiver: 'Bạn'
                    }}
                />
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h5 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    Khu vực Test & Debug
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1.5">
                        <label className="text-xs text-gray-500 ml-1">Tên người gửi giả lập</label>
                        <input
                            type="text"
                            value={testSender}
                            onChange={(e) => setTestSender(e.target.value)}
                            className="block w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                            placeholder="Nhập tên..."
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs text-gray-500 ml-1">Tên người nhận giả lập</label>
                        <input
                            type="text"
                            value={testReceiver}
                            onChange={(e) => setTestReceiver(e.target.value)}
                            className="block w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                            placeholder="Nhập tên..."
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={handleTestReceived}
                        className="group relative overflow-hidden py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.01] active:scale-[0.98]"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
                        <span className="relative flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Test Nhận Tiền
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={handleTestSent}
                        className="group relative overflow-hidden py-2.5 px-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-orange-500/20 transition-all transform hover:scale-[1.01] active:scale-[0.98]"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
                        <span className="relative flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                            Test Gửi Tiền
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoiceSettings;
