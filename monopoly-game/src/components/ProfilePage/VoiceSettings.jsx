import React from 'react';

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
        <div className="space-y-4 p-6 bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border border-purple-500/30 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <h4 className="text-lg font-bold text-cyan-400 font-mono">VOICE NOTIFICATION</h4>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                    Thông báo khi GỬI tiền
                    <span className="text-xs text-gray-500 ml-2">(Dùng: {'{amount}'}, {'{currency}'}, {'{sender}'}, {'{receiver}'})</span>
                </label>
                <input
                    type="text"
                    value={sentTemplate}
                    onChange={(e) => setSentTemplate(e.target.value)}
                    className="block w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
                    placeholder="Đã chuyển {amount} {currency}"
                />
                <p className="text-xs text-gray-500">Ví dụ: "thần tài tặng {'{amount}'} {'{currency}'} cho {'{receiver}'}"</p>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                    Thông báo khi NHẬN tiền
                    <span className="text-xs text-gray-500 ml-2">(Dùng: {'{amount}'}, {'{currency}'}, {'{sender}'}, {'{receiver}'})</span>
                </label>
                <input
                    type="text"
                    value={receivedTemplate}
                    onChange={(e) => setReceivedTemplate(e.target.value)}
                    className="block w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
                    placeholder="Đã nhận {amount} {currency}"
                />
                <p className="text-xs text-gray-500">Ví dụ: "{'{sender}'} đã chuyển {'{amount}'} {'{currency}'} cho bạn"</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Tên người gửi (test)</label>
                    <input
                        type="text"
                        value={testSender}
                        onChange={(e) => setTestSender(e.target.value)}
                        className="block w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                        placeholder="Người gửi"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Tên người nhận (test)</label>
                    <input
                        type="text"
                        value={testReceiver}
                        onChange={(e) => setTestReceiver(e.target.value)}
                        className="block w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                        placeholder="Người nhận"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                    type="button"
                    onClick={handleTestReceived}
                    className="py-3 px-4 bg-gradient-to-r from-green-600/80 to-emerald-600/80 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-green-500/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    TEST NHẬN TIỀN
                </button>
                <button
                    type="button"
                    onClick={handleTestSent}
                    className="py-3 px-4 bg-gradient-to-r from-orange-600/80 to-red-600/80 hover:from-orange-500 hover:to-red-500 text-white font-bold rounded-lg shadow-lg shadow-orange-500/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    TEST GỬI TIỀN
                </button>
            </div>

            <div className="mt-4 p-3 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
                <p className="text-xs text-cyan-300 flex items-start gap-2">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        Giọng nói sẽ được phát khi bạn chuyển hoặc nhận tiền trong game.
                        Số tiền test: Nhận 100,000₫, Gửi 50,000₫
                    </span>
                </p>
            </div>
        </div>
    );
};

export default VoiceSettings;
