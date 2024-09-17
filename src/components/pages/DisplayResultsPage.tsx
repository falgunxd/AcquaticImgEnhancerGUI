// DisplayResultsPage.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid } from '@mui/material';
import { isAuthenticated, getAccessToken } from '../../utils/sessionManager.ts';
import './DisplayResultsPage.css';

function DisplayResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const images = location.state?.images || {};

  const handleSave = async () => {
    // Implement save functionality, e.g., check if user is authenticated
    // if not authenticated, redirect to /auth
    // else call save API
    // console.log(images);
    if (isAuthenticated()) {
      const accessToken = getAccessToken();
      // console.log(accessToken);
      const response = await fetch('https://205er4kd0g.execute-api.ap-south-1.amazonaws.com/default/aieStoreLinks', {
        method: 'POST',
        body: JSON.stringify({ 
          accessToken, 
          original: images.original, 
          redComponent: images.redComponent, 
          greenComponent: images.greenComponent, 
          blueComponent: images.blueComponent, 
          rbCompensated:images.rbCompensated, 
          whiteBalanced: images.whiteBalanced,
          sharpened: images.sharpened,
          contrastEnhanced: images.contrastEnhanced,
          averageFused: images.averageFused,
          pcaFused: images.pcaFused,
          histogram: images.histogram 
        }),
      });

      if (response.ok) {
        alert('Images saved in your profile.');
      } else {
        alert('Error saving images.');
      }
    }
    else {
      navigate("/auth", { state: { images } });
    }
  };

  const handleDiscard = () => {
    navigate('/convert'); // Redirect back to ConvertPage
  };

  return (
    <Box className="display-results-page">
      <Typography variant="h4">Processed Images</Typography>
      <Grid container spacing={2}>
        {Object.entries(images).map(([key, url]) => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <img src={url as string} alt={key} className="result-image" />
            <Typography variant="body2">{key}</Typography>
          </Grid>
        ))}
      </Grid>
      <Box className="action-buttons">
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outlined" onClick={handleDiscard}>
          Discard
        </Button>
      </Box>
    </Box>
  );
}

export default DisplayResultsPage;
