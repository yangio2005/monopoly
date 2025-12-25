export const MONSTERS = [
    {
        id: 'pink',
        name: 'Pink',
        path: '/assets/1 Pink_Monster/Pink_Monster',
        color: '#ff6b9d'
    },
    {
        id: 'owlet',
        name: 'Owlet',
        path: '/assets/2 Owlet_Monster/Owlet_Monster',
        color: '#ffb347'
    },
    {
        id: 'dude',
        name: 'Dude',
        path: '/assets/3 Dude_Monster/Dude_Monster',
        color: '#98d8c8'
    }
];

export const REACTIONS = {
    received: {
        messages: [
            "💰 Wow! Giàu to rồi!",
            "🎉 Tuyệt vời ông mặt trời!",
            "✨ Ting ting! Nghe sướng tai!",
            "💸 Tiền về! Tiền về!",
            "🤑 Đại gia đây rồi!",
            "🚀 To the moon!",
            "💎 Kim cương quan điểm!",
            "😎 Quá đã pepsi ơi!",
            "🧧 Lì xì sớm à?",
            "🏦 Mở ngân hàng được rồi!",
            "🥞 Bánh mì kẹp thịt!",
            "🍕 Pizza party tối nay!",
            "🥤 Trà sữa full topping!",
            "🏝️ Đi du lịch thôi!",
            "🚗 Mua xe mới nào!"
        ]
    },
    sent: {
        messages: [
            "😢 Huhu... Bay màu!",
            "😭 Ôi con sông quê...",
            "💔 Đau lòng quá đi!",
            "😰 Mất tiền rồi mẹ ơi!",
            "💸 Tiền đi không trở lại...",
            "📉 Đáy xã hội là đây...",
            "🥀 Lòng đau như cắt...",
            "🌧️ Trời mưa trong tim...",
            "🍜 Lại ăn mì tôm rồi...",
            "🌵 Nghèo rớt mồng tơi!",
            "👻 Hồn lỡ sa vào đôi mắt em...",
            "🕸️ Ví rỗng tuếch!",
            "🌚 Tắt đèn tối om...",
            "🏳️ Xin đầu hàng số phận!",
            "🚑 Gọi cấp cứu gấp!"
        ]
    }
};

export const CELEBRATION_SEQUENCE = [
    { name: 'Jump', frames: 8, duration: 800 },
    { name: 'Attack1', frames: 4, duration: 600 },
    { name: 'Attack2', frames: 6, duration: 800 },
    { name: 'Throw', frames: 4, duration: 600 },
    { name: 'Jump', frames: 8, duration: 800 },
    { name: 'Idle', frames: 4, duration: 1400 }
];

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
