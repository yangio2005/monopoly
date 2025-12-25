import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import ProfilePage from './components/ProfilePage';
import GameRoomPage from './components/GameRoomPage';
import QrScannerPage from './components/QrScannerPage';
import PixelMapPage from './components/PixelMapPage';
import MartialArtsPerformance from './components/MartialArts/MartialArtsPerformance';
import CharacterShowcase from './components/CharacterShowcase/CharacterShowcase';
import DocsPage from './components/DocsPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/room/:roomId" element={<GameRoomPage />} />
        <Route path="/pixel-map" element={<PixelMapPage />} />
        <Route path="/scan-qr" element={<QrScannerPage />} />
        <Route path="/performance" element={<MartialArtsPerformance />} />
        <Route path="/showcase" element={<CharacterShowcase />} />
        <Route path="/docs" element={<DocsPage />} />
      </Routes>
    </Router>
  );
}

export default App;