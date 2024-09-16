// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/pages/LandingPage';
import ConvertPage from './components/pages/ConvertPage';
import DisplayResultsPage from './components/pages/DisplayResultsPage';
import ProfilePage from './components/pages/ProfilePage';
import AuthCard from './components/cards/AuthCard';
import TermsOfServicePage from './components/pages/TermsOfServicePage';
import PrivacyPolicyPage from './components/pages/PrivacyPolicyPage';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { isAuthenticated, removeAccessToken } from './utils/sessionManager';
import './App.css';

function App() {
  const handleSignOut = () => {
    removeAccessToken();
    window.location.href = '/auth'; // Redirect to auth page on signout
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Acquatic Image Enhancer
          </Typography>
          {isAuthenticated() && (
            <Button color="inherit" onClick={handleSignOut}>
              Sign Out
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Other Pages */}
        <Route path="/convert" element={<ConvertPage />} />
        <Route path="/display-results" element={<DisplayResultsPage />} />
        <Route path="/auth" element={<AuthCard />} />
        <Route
          path="/user/:userID"
          element={isAuthenticated() ? <ProfilePage /> : <Navigate to="/auth" />}
        />
        <Route path="/tos" element={<TermsOfServicePage />} />
        <Route path="/pp" element={<PrivacyPolicyPage />} />

        {/* Redirect any unknown paths to the landing page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
