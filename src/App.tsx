// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ConvertPage from './components/pages/ConvertPage.tsx';
import DisplayResultsPage from './components/pages/DisplayResultsPage.tsx';
import ProfilePage from './components/pages/ProfilePage.tsx';
import AuthCard from './components/cards/AuthCard.tsx';
import TermsOfServicePage from './components/pages/TermsOfServicePage.tsx';
import PrivacyPolicyPage from './components/pages/PrivacyPolicyPage.tsx';
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
          <Typography variant="h6">Acquatic Image Enhancer</Typography>
          {isAuthenticated() && (
            <Button color="inherit" onClick={handleSignOut}>
              Sign Out
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/convert" element={<ConvertPage />} />
        <Route path="/display-results" element={<DisplayResultsPage />} />
        <Route path="/auth" element={<AuthCard />} />
        <Route
          path="/user/:userID"
          element={isAuthenticated() ? <ProfilePage /> : <Navigate to="/auth" />}
        />
        <Route path="/tos" element={<TermsOfServicePage />} />
        <Route path="/pp" element={<PrivacyPolicyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
