# Character Game Room - Experimental Feature 🎮

## Giới thiệu

Character Game Room là một phiên bản thử nghiệm của Game Room với nhân vật animated dựa trên sprite từ file Piskel.

## Các tính năng

### ✨ Tính năng mới
- **Animated Characters**: Mỗi người chơi có một nhân vật animated riêng
- **Character Movement**: Nhân vật di chuyển và có animation khi active
- **Game Board**: Bảng game 2D với nhân vật được sắp xếp theo vòng tròn
- **Real-time Position Tracking**: Theo dõi vị trí nhân vật theo thời gian thực

### 🎨 Components đã tạo

1. **Character.jsx**
   - Component hiển thị nhân vật animated
   - Hỗ trợ 2-frame animation từ Piskel
   - Có shadow effect và name tag

2. **CharacterGameBoard.jsx**
   - Hiển thị tất cả nhân vật trên game board
   - Sắp xếp nhân vật theo vòng tròn
   - Background gradient với grid pattern
   - Hiển thị thông tin vị trí và số người chơi

3. **CharacterGameRoomPage.jsx**
   - Page chính cho character room
   - Giữ nguyên tất cả tính năng của GameRoomPage
   - Thêm CharacterGameBoard ở phía trên

## Cách sử dụng

### Truy cập Character Room

Để truy cập phiên bản character của một room, thay đổi URL từ:
```
/room/[roomId]
```
thành:
```
/character-room/[roomId]
```

**Ví dụ:**
- Room thông thường: `http://localhost:5173/room/abc123`
- Character Room: `http://localhost:5173/character-room/abc123`

### Tích hợp vào HomePage

Bạn có thể thêm nút để chuyển sang character mode trong HomePage hoặc GameRoomPage:

```jsx
// Trong component RoomCard hoặc GameRoomPage
<Link to={`/character-room/${roomId}`}>
  <button>🎮 Character Mode</button>
</Link>
```

## File Piskel

File sprite gốc: `src/assets/image-20251130-202142.piskel`
- Kích thước: 100x100 pixels
- Số frames: 2
- FPS: 12

### Export Sprite từ Piskel

Để sử dụng sprite thật từ Piskel:

1. Mở file `.piskel` với [Piskel Editor](https://www.piskelapp.com/)
2. Export as Sprite Sheet:
   - File > Export > PNG
   - Chọn "Sprite sheet"
   - Layout: Horizontal
   - Download file

3. Đặt file sprite sheet vào `src/assets/` (ví dụ: `character-sprite.png`)

4. Update Component `Character.jsx`:
```jsx
// Replace gradient div with sprite sheet
<div 
  className="sprite-character"
  style={{
    backgroundImage: 'url(/src/assets/character-sprite.png)',
    backgroundPosition: `${currentFrame * -100}px 0`,
    width: '100px',
    height: '100px'
  }}
/>
```

## Tùy chỉnh

### Thay đổi kích thước nhân vật
```jsx
<Character size={150} /> // Tăng kích thước lên 150px
```

### Thay đổi animation speed
Trong `Character.jsx`, sửa interval:
```jsx
const interval = setInterval(() => {
  setCurrentFrame(prev => (prev + 1) % totalFrames);
}, 100); // Thay đổi số này (ms)
```

### Thêm nhiều frames
Nếu Piskel có nhiều hơn 2 frames:
```jsx
const totalFrames = 4; // Thay đổi theo số frame của bạn
```

## Roadmap

- [ ] Export sprite thật từ Piskel file
- [ ] Thêm nhiều animation states (idle, walking, celebrating)
- [ ] Cho phép người chơi tùy chỉnh nhân vật
- [ ] Thêm board positions (như Monopoly thật)
- [ ] Dice rolling animation
- [ ] Character movement theo board positions

## Ghi chú kỹ thuật

- Component sử dụng React hooks (useState, useEffect)
- Tương thích với GameRoomProvider hiện tại
- Không thay đổi logic backend
- Dùng Tailwind CSS cho styling
- Animation được xử lý bằng CSS và JavaScript

## Bug Reports & Feedback

Nếu gặp lỗi hoặc có ý tưởng cải thiện, hãy ghi chú lại để phát triển thêm!

---

**Created**: November 30, 2025  
**Version**: 1.0.0 - Experimental
