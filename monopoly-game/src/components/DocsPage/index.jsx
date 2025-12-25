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

// Category colors for visual distinction
const categoryColors = {
    'Tutorials': 'from-purple-600 to-blue-600',
    'Features': 'from-cyan-600 to-teal-600',
    'Updates': 'from-orange-600 to-red-600',
    'FAQ': 'from-green-600 to-emerald-600'
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
        <div className="min-h-screen w-full relative overflow-hidden py-8 px-4 pt-24">
            {/* Animated Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 -z-10">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in-down">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mb-4">
                        📚 Documentation
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Hướng dẫn sử dụng và các tính năng của Monopoly Game
                    </p>
                </div>

                {/* Search & Filter Bar */}
                <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Tìm kiếm hướng dẫn..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-5 py-3 pl-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
                        />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Docs Grid */}
                <div className="grid grid-cols-1 gap-8">
                    {filteredDocs.map((doc, index) => (
                        <DocCard key={doc.id} doc={doc} index={index} />
                    ))}
                </div>

                {/* Empty State */}
                {filteredDocs.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl text-gray-400">Không tìm thấy kết quả</h3>
                        <p className="text-gray-500 mt-2">Thử tìm kiếm với từ khóa khác</p>
                    </div>
                )}
            </div>

            {/* Custom Animations */}
            <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fade-in-down { animation: fade-in-down 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out 0.2s both; }
      `}</style>
        </div>
    );
};

// Separate DocCard component for scalability
const DocCard = ({ doc, index }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div
            className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 overflow-hidden shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Category Badge */}
            <div className={`px-4 py-2 bg-gradient-to-r ${categoryColors[doc.category] || 'from-gray-600 to-gray-700'}`}>
                <span className="text-white text-sm font-semibold">{doc.category}</span>
            </div>

            <div className="p-6 md:p-8">
                {/* Title Section */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Video Section */}
                    <div className="lg:w-1/2">
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/50 border border-white/10 shadow-lg">
                            <iframe
                                src={`https://www.youtube.com/embed/${doc.youtubeEmbedId}`}
                                title={doc.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full"
                            />
                        </div>

                        {/* YouTube Link */}
                        <a
                            href={doc.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-xl text-red-400 hover:text-red-300 transition-all text-sm"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            Xem trên YouTube
                        </a>
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-1/2 flex flex-col">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            {doc.title}
                        </h2>
                        {doc.subtitle && (
                            <p className="text-purple-400 font-medium mb-4">{doc.subtitle}</p>
                        )}

                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            {doc.description}
                        </p>

                        {/* Features */}
                        <div className="space-y-4 flex-grow">
                            {doc.features.map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all"
                                >
                                    <span className="text-3xl flex-shrink-0">{feature.icon}</span>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                                        <p className="text-gray-400 text-sm">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/10">
                            {doc.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-medium border border-purple-500/20"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <p className="text-gray-500 text-sm">
                        Anh em thấy tính năng này thế nào? Comment bên dưới video nhé! 💬
                    </p>
                    <a
                        href={doc.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all flex items-center gap-2"
                    >
                        <span>Xem Video Ngay</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default DocsPage;
