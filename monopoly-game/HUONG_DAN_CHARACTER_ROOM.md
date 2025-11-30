# Hướng Dẫn Sử Dụng Character Game Room 🎮

## Tóm Tắt

Đã tạo thành công phiên bản **Character Game Room** - một bản thử nghiệm của Game Room với nhân vật animated dựa trên file Piskel của bạn!

## Các File Đã Tạo

### 1. **CharacterGameRoomPage.jsx** ✅
Path: `src/components/CharacterGameRoomPage.jsx`
- Page chính cho character room mode
- Tích hợp tất cả tính năng của GameRoomPage
- Thêm CharacterGameBoard component

### 2. **Character.jsx** ✅
Path: `src/components/GameRoom/Character.jsx`
- Component hiển thị nhân vật animated
- Hỗ trợ 2-frame animation từ file Piskel
- Có shadow effect, name tag
- Animation bounce effect khi di chuyển

### 3. **CharacterGameBoard.jsx** ✅
Path: `src/components/GameRoom/CharacterGameBoard.jsx`
- Hiển thị tất cả nhân vật của players
- Layout vòng tròn với center point
- Background gradient + grid pattern
- Hiển thị số người chơi và vị trí

### 4. **Route đã được thêm** ✅
Path: `src/App.jsx`
- Route mới: `/character-room/:roomId`
- Component: CharacterGameRoomPage

### 5. **README Documentation** ✅
Path: `CHARACTER_ROOM_README.md`
- Hướng dẫn chi tiết cách sử dụng

## Cách Truy Cập

### URL Format
Để truy cập character room của một room bất kỳ, sử dụng URL:

```
http://localhost:5174/character-room/[ROOM_ID]
```

**Ví dụ**:
- Room thông thường: `http://localhost:5174/room/abc123`
- Character Room: `http://localhost:5174/character-room/abc123`

### Từ Game Room Hiện Tại

Nếu bạn đang ở trong một room (ví dụ `/room/abc123`), chỉ cần thay đổi URL thành:
```
/character-room/abc123
```

Hoặc tạo một button để chuyển đổi (xem phần "Tích Hợp" bên dưới).

## Tính Năng

### ✨ Character System
- **Animated Sprites**: Mỗi player có nhân vật riêng với animation 2 frames
- **Auto Movement**: Nhân vật tự động di chuyển random mỗi 5 giây (demo)
- **Bounce Effect**: Animation bounce khi nhân vật đang moving
- **Name Tags**: Hiển thị tên người chơi bên dưới nhân vật

### 🎨 Game Board
- **Circular Layout**: Nhân vật sắp xếp theo vòng tròn
- **Grid Background**: Pattern grid với gradient đẹp mắt
- **Center Hub**: Vùng trung tâm với icon game
- **Info Panel**: Hiển thị số người chơi và vị trí

### 🎮 Tất Cả Tính Năng Game Room
- Banking & Transfer 💰
- Transaction Log 📜
- Player List 👥
- Wealth Chart 📊
- Share Room 🔗
- Bank Settings ⚙️

## Tích Hợp Nút Chuyển Đổi

### Option 1: Thêm vào GameRoomPage Header

Mở `src/components/GameRoomPage.jsx` và thêm import:

```javascript
import { useNavigate } from 'react-router-dom';
```

Trong component `GameRoomContent`, thêm hook:

```javascript
const GameRoomContent = () => {
  const navigate = useNavigate();
  const { roomId, ... } = useGameRoom();
  // ... rest of code
```

Thêm button vào header (sau nút SHARE):

```javascript
<button
  className="px-4 py-2 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/50 text-pink-400 rounded-lg transition-all hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] backdrop-blur-sm flex items-center gap-2 font-mono text-sm"
  onClick={() => { navigate(`/character-room/${roomId}`); clickSound.play(); }}
>
  <span className="text-base">🎮</span>
  CHARACTER MODE
</button>
```

### Option 2: Thêm vào HomePage Room Cards

Mở `src/components/HomePage/RoomCard.jsx` (hoặc tương tự) và thêm button:

```javascript
<Link to={`/character-room/${room.id}`}>
  <button className="...">
    🎮 Character Mode
  </button>
</Link>
```

## Export Sprite Từ Piskel

File Piskel của bạn: `src/assets/image-20251130-202142.piskel`

### Bước 1: Mở Piskel Editor
1. Truy cập https://www.piskelapp.com/
2. Click "Create Sprite" hoặc "Import"
3. Load file `.piskel` của bạn

### Bước 2: Export Sprite Sheet
1. File menu → Export
2. Chọn "PNG"
3. Chọn "Sprite sheet" tab
4. Layout: **Horizontal** (cho 2 frames)
5. Download file PNG

### Bước 3: Đặt File Vào Project
Lưu file vào: `src/assets/character-sprite.png`

### Bước 4: Update Character Component
Mở `src/components/GameRoom/Character.jsx` và thay thế gradient div:

```javascript
// Thay vì gradient background
<div 
  className="sprite-character"
  style={{
    backgroundImage: 'url(/src/assets/character-sprite.png)',
    backgroundPosition: `${currentFrame * -100}px 0`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto 100%',
    width: '100px',
    height: '100px',
  }}
>
  {/* Name Tag */}
  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
    <div className="px-2 py-1 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm border border-white/20">
      {playerName}
    </div>
  </div>
</div>
```

## Customization

### Thay Đổi Kích Thước Nhân Vật

Trong CharacterGameBoard.jsx:

```javascript
<Character
  playerId={playerId}
  playerName={player.name}
  position={characterPositions[playerId]}
  size={150}  // Tăng từ 100 lên 150
  isMoving={movingCharacters.has(playerId)}
/>
```

### Thay Đổi Animation Speed

Trong Character.jsx:

```javascript
const interval = setInterval(() => {
  setCurrentFrame(prev => (prev + 1) % totalFrames);
}, 80);  // Thay đổi từ 100ms thành 80ms = faster
```

### Thay Đổi Movement Frequency

Trong CharacterGameBoard.jsx:

```javascript
const interval = setInterval(() => {
  // ... movement logic
}, 3000);  // Thay đổi từ 5000ms thành 3000ms = more frequent
```

## Testing

Server đã chạy tại: `http://localhost:5174/`

### Test Steps:
1. Truy cập một room hiện tại: `/room/[roomId]`
2. Thay đổi URL thành: `/character-room/[roomId]`
3. Xem nhân vật của các players hiển thị trên game board
4. Quan sát animation và movement

## Known Issues & Future Improvements

### To Do:
- [ ] Export sprite thật từ Piskel file
- [ ] Thêm nhiều animation states (idle, walking, celebrating)
- [ ] Cho phép người chơi chọn/customize nhân vật
- [ ] Thêm board positions giống Monopoly thật
- [ ] Dice rolling animation
- [ ] Character movement theo board positions thật
- [ ] Click vào nhân vật để interact
- [ ] Sound effects cho character movement

### Current Limitations:
- Hiện đang dùng gradient placeholder thay vì sprite thật
- Movement là random demo, chưa theo game logic
- Chỉ có 1 loại character cho tất cả players

## Troubleshooting

### Nhân vật không hiển thị?
- Check console log có lỗi
- Verify roomData có players
- Check characterPositions state

### Animation không chạy?
- Verify totalFrames = 2 khớp với Piskel
- Check interval timing
- Xem isMoving state có update

### Layout bị lỗi?
- Check responsive breakpoints
- Verify parent container sizes
- Test trên different screen sizes

## Support

Nếu gặp vấn đề:
1. Check browser console cho errors
2. Verify all files đã được tạo đúng
3. Check route đã được add vào App.jsx
4. Test với room có ít nhất 2-3 players

---

**Version**: 1.0.0 - Experimental  
**Created**: 2025-11-30  
**Status**: ✅ Ready for Testing

**Enjoy your Character Game Room! 🎮🎉**
