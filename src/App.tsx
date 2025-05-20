// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Trending from './pages/Trending';
import Gaming from './pages/Gaming';
import VideoDetail from './pages/VideoDetail';
import SavedVideos from './pages/SavedVideos';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Premium from './pages/Premium';
import SettingsPage from './pages/Settings';
import FeedbackPage from './pages/Feedback';
import HelpPage from './pages/Help';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="trending" element={<Trending />} />
        <Route path="gaming" element={<Gaming />} />
        <Route path="video/:id" element={<VideoDetail />} />
        <Route path="saved-videos" element={<SavedVideos />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="premium" element={<Premium />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="help" element={<HelpPage />} />
        
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;