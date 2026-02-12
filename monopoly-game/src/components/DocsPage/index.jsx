import React, { useState } from 'react';

// Scalable docs data structure - easy to add more tutorials
const docsData = [
    {
        id: 'tts-integration',
        category: 'Tutorials',
        title: 'Hướng dẫn tích hợp Thông báo Giọng nói (TTS) vào Game Monopoly',
        subtitle: 'Web App Dashboard',
        youtubeUrl: 'https://youtu.be/Xhee6pSQqK4',
        youtubeEmbedId: 'Xhee6pSQqK4',
        description: 'Chơi Cờ tỷ phú mà không lo nhầm lẫn tiền bạc nữa! 💸 Video này giới thiệu hệ thống quản lý giao dịch Monopoly cực xịn với các tính năng đỉnh cao.',
        features: [
            {
                icon: '🔊',
                title: 'Thông báo bằng giọng nói',
                description: 'Mỗi khi "ting ting" nhận tiền hoặc chuyển tiền.'
            },
            {
                icon: '💬',
                title: 'Tùy chỉnh lời thoại',
                description: 'Cực lầy lội cho từng người chơi.'
            },
            {
                icon: '📊',
                title: 'Bảng log hệ thống',
                description: 'Chi tiết, công bằng cho mọi "tỷ phú".'
            }
        ],
        tags: ['TTS', 'Voice', 'Tutorial', 'Dashboard']
    }
];

// Retro Category Colors
const categoryColors = {
    'Tutorials': 'bg-[#ffcc00] text-black',
    'Features': 'bg-[#40ffcc] text-black',
    'Updates': 'bg-[#ff4d4d] text-white',
    'FAQ': 'bg-[#66ccff] text-black'
};

const DocsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Get unique categories
    const categories = ['All', ...new Set(docsData.map(doc => doc.category))];

    // Filter docs based on category and search
    const filteredDocs = docsData.filter(doc => {
        const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
        const matchesSearch = searchQuery === '' ||
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#050505] text-[#aaa] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-retro">
            <div className="max-w-6xl mx-auto">
                {/* Retro Header Section */}
                <div className="relative mb-12 p-8 bg-[#0a0a0a] border-[4px] border-[#333] shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] overflow-hidden">
                    {/* Background Grid Garnish */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#40ffcc 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                    <div className="relative z-10 text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase italic tracking-tighter mb-4">
                            SYSTEM_<span className="text-[#ffcc00]">DOCS</span>
                        </h1>
                        <p className="text-[#666] text-xs font-black uppercase tracking-widest max-w-2xl mx-auto">
                            MANUAL_GUIDE // CORE_FEATURES // MONOPOLY_RESOURCES
                        </p>
                    </div>

                    {/* Corner Decoration */}
                    <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                        <div className="absolute top-[-24px] right-[-24px] w-12 h-12 bg-[#ffcc00] rotate-45"></div>
                    </div>
                </div>

                {/* Search & Filter Protocol Bar */}
                <div className="mb-10 flex flex-col md:flex-row gap-6 items-center justify-between">
                    {/* Search Field */}
                    <div className="relative w-full md:w-96 group">
                        <input
                            type="text"
                            placeholder="QUERY_DATABASE..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-5 py-4 pl-12 bg-black border-[2px] border-[#222] text-white text-sm font-bold focus:outline-none focus:border-[#40ffcc] focus:bg-[#0d0d0d] transition-all placeholder-[#1a1a1a]"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444] group-focus-within:text-[#40ffcc]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Filter Switches */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 border-[2px] text-[10px] font-black uppercase tracking-widest transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none ${selectedCategory === category
                                        ? 'bg-[#40ffcc] border-[#40ffcc] text-black'
                                        : 'bg-[#1a1a1a] border-[#333] text-[#666] hover:text-white hover:border-[#444]'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Docs Grid */}
                <div className="grid grid-cols-1 gap-12">
                    {filteredDocs.map((doc, index) => (
                        <DocCard key={doc.id} doc={doc} index={index} />
                    ))}
                </div>

                {/* Empty Terminal State */}
                {filteredDocs.length === 0 && (
                    <div className="text-center py-20 bg-[#0a0a0a] border-[2px] border-[#222] border-dashed">
                        <div className="text-4xl grayscale opacity-20 mb-4 animate-bounce">📁</div>
                        <h3 className="text-[14px] font-black text-[#666] uppercase">404_NOT_FOUND</h3>
                        <p className="text-[#333] text-[10px] uppercase mt-2 font-black">QUERY RETURNED NO MATCHING RECORDS</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Retro DocCard component
const DocCard = ({ doc, index }) => {
    return (
        <div className="relative bg-[#0a0a0a] border-[4px] border-[#333] shadow-[12px_12px_0_0_rgba(0,0,0,0.8)] overflow-hidden flex flex-col group">

            {/* Header Strip */}
            <div className={`h-8 flex items-center px-4 justify-between ${categoryColors[doc.category] || 'bg-[#333] text-white'}`}>
                <span className="text-[10px] font-black uppercase tracking-widest">{doc.category}_RESOURCE</span>
                <div className="flex gap-1.5 grayscale opacity-30">
                    <div className="w-2 h-2 rounded-full bg-black"></div>
                    <div className="w-2 h-2 rounded-full bg-black"></div>
                </div>
            </div>

            <div className="p-6 md:p-8 lg:p-10">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Media Terminal */}
                    <div className="lg:w-1/2 space-y-4">
                        <div className="relative p-2 bg-[#1a1a1a] border-[2px] border-[#333] shadow-[6px_6px_0_0_rgba(0,0,0,0.5)] overflow-hidden">
                            <div className="relative aspect-video bg-black overflow-hidden border border-[#222]">
                                <iframe
                                    src={`https://www.youtube.com/embed/${doc.youtubeEmbedId}`}
                                    title={doc.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                                />
                                {/* Scanning Line Effect Overlay */}
                                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20"></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <a
                                href={doc.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-[#ff4d4d] hover:text-white text-[9px] font-black uppercase tracking-tighter group/link"
                            >
                                <span className="p-1 bg-[#ff4d4d]/10 border border-[#ff4d4d]/30 group-hover/link:bg-[#ff4d4d] group-hover/link:text-black transition-all">YT_PORTAL</span>
                                <span>WATCH_ON_YOUTUBE</span>
                            </a>
                            <span className="text-[8px] font-black text-[#333] tracking-[0.3em]">SECURE_FEED</span>
                        </div>
                    </div>

                    {/* Logic & Meta Section */}
                    <div className="lg:w-1/2 flex flex-col space-y-6">
                        <div>
                            <p className="text-[10px] font-black text-[#ffcc00] uppercase mb-1">{doc.subtitle}</p>
                            <h2 className="text-[24px] md:text-[28px] font-black text-white leading-tight uppercase italic mb-4 group-hover:text-[#40ffcc] transition-colors">
                                {doc.title}
                            </h2>
                            <div className="h-[2px] w-20 bg-[#333] mb-6"></div>
                            <p className="text-[#666] text-sm leading-relaxed font-bold">
                                {doc.description}
                            </p>
                        </div>

                        {/* Features List as Terminal Output */}
                        <div className="space-y-3 bg-black/40 p-4 border border-[#222]">
                            {doc.features.map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-4"
                                >
                                    <span className="text-xl shrink-0 opacity-50 grayscale">{feature.icon}</span>
                                    <div className="space-y-0.5">
                                        <h4 className="text-[#aaa] text-[11px] font-black uppercase tracking-wider">{feature.title}</h4>
                                        <p className="text-[#444] text-[10px] font-bold">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* System Tags */}
                        <div className="flex flex-wrap gap-2 pt-4">
                            {doc.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-[#111] text-[#333] text-[8px] font-black uppercase border border-[#222]"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Action Protocol */}
                <div className="mt-10 pt-6 border-t border-[#1a1a1a] flex flex-col sm:flex-row gap-6 items-center justify-between">
                    <p className="text-[9px] font-black text-[#333] uppercase leading-relaxed max-w-sm">
                        [MSG_LOG]: FEEDBACK_REQUESTED // ENGAGE_BY_LEAVING_A_COMMENT_ON_THE_VIDEO_STREAM
                    </p>
                    <a
                        href={doc.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-[#ffcc00] hover:bg-[#ffdd33] text-black font-black text-[12px] uppercase shadow-[4px_4px_0_0_#886600] active:translate-y-1 active:shadow-none transition-all flex items-center gap-3 w-full sm:w-auto justify-center"
                    >
                        <span>CORE_ACCESS_INIT</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Visual Scanline decorative element */}
            <div className="absolute top-0 left-0 right-0 h-[100%] bg-white/5 opacity-5 pointer-events-none animate-pulse"></div>
        </div>
    );
};

export default DocsPage;
