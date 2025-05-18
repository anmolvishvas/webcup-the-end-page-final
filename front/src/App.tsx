import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import ViewPage from './pages/ViewPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyPagesPage from './pages/MyPagesPage';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import { EndPageProvider } from './context/EndPageContext';
import { AuthProvider } from './context/AuthContext';
import BackgroundScene from './components/three/BackgroundScene';
import ErrorPage from './components/ErrorPage';

function App() {
  const [showScene, setShowScene] = useState(true);

  return (
    <AuthProvider>
      <EndPageProvider>
        <Router>
          <div className="min-h-screen bg-primary text-white">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage setShowScene={setShowScene} />} />
              <Route path="/login" element={<LoginPage setShowScene={setShowScene} />} />
              <Route path="/register" element={<RegisterPage setShowScene={setShowScene} />} />
              <Route path="/view/:id" element={<ViewPage setShowScene={setShowScene} />} />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreatePage setShowScene={setShowScene} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-pages"
                element={
                  <ProtectedRoute>
                    <MyPagesPage setShowScene={setShowScene} />
                  </ProtectedRoute>
                }
              />
              {/* Catch all route for 404s */}
              <Route path="*" element={<ErrorPage setShowScene={setShowScene} />} />
            </Routes>
            {showScene && <BackgroundScene />}
          </div>
        </Router>
      </EndPageProvider>
    </AuthProvider>
  );
}

export default App;
 