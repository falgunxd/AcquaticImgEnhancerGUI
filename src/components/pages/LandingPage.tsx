import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <Container className="landing-container">
        <Typography variant="h2" className="landing-title">
          Dive Deeper, Capture Brighter
        </Typography>
        <Typography variant="h6" className="landing-subtitle">
          Explore the wonders beneath the surface like never before. Enhance your underwater photos with our state-of-the-art AI image processor. Whether you're a seasoned diver or just starting your underwater journey, bring your photos to life with vivid colors and unmatched clarity.
        </Typography>
        <div className="landing-buttons">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/convert')}
            className="landing-button"
          >
            Convert Images
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/auth')}
            className="landing-button"
          >
            Sign Up / Sign In
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default LandingPage;
