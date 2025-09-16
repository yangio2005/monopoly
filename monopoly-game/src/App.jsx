import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import ProfilePage from './components/ProfilePage';
import GameRoomPage from './components/GameRoomPage'; // New import

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/room/:roomId" element={<GameRoomPage />} /> {/* New Route */}
      </Routes>
    </Router>
  );
}

export default App;