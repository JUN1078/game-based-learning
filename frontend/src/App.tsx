import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Player Pages
import PlayerHome from '@pages/player/Home'
import GameIntro from '@pages/player/GameIntro'
import GamePlay from '@pages/player/GamePlay'
import GameEnd from '@pages/player/GameEnd'
import Ranking from '@pages/player/Ranking'
import Profile from '@pages/player/Profile'

// Admin Pages
import AdminLogin from '@pages/admin/Login'
import AdminDashboard from '@pages/admin/Dashboard'
import GameBuilder from '@pages/admin/GameBuilder'
import LevelBuilder from '@pages/admin/LevelBuilder'
import Analytics from '@pages/admin/Analytics'

// Auth
import { useAuthStore } from '@store/authStore'

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Player Routes */}
        <Route path="/" element={<PlayerHome />} />
        <Route path="/game/:gameId/intro" element={<GameIntro />} />
        <Route path="/game/:gameId/play" element={<GamePlay />} />
        <Route path="/game/:gameId/end" element={<GameEnd />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/games/new" element={<ProtectedRoute><GameBuilder /></ProtectedRoute>} />
        <Route path="/admin/games/:gameId/edit" element={<ProtectedRoute><GameBuilder /></ProtectedRoute>} />
        <Route path="/admin/games/:gameId/levels" element={<ProtectedRoute><LevelBuilder /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

// Protected Route for Admin
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuthStore()

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}

export default App
