// ProfilePage.tsx
import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { getAccessToken } from '../../utils/sessionManager';
import './ProfilePage.css';

function ProfilePage() {
//   const { userID } = useParams();
  const [name, setName] = useState('');
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    // Fetch user data including previously processed images
    const fetchUserLinks = async () => {
      const accessToken = getAccessToken();
      const response = await fetch('https://205er4kd0g.execute-api.ap-south-1.amazonaws.com/default/aieRetrieveUserLinks', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ accessToken }),
      });

      if (response.ok) {
        const data = await response.json();
        const pcaFusedImages = data.items.map((item: any) => item.pcaFused.S);
        setImages(pcaFusedImages);
      } else {
        alert('Error fetching user data.');
      }
    };

    fetchUserLinks();
  }, []);

  const handleNameChange = async () => {
    const accessToken = getAccessToken();
    const response = await fetch('https://205er4kd0g.execute-api.ap-south-1.amazonaws.com/default/aieUserChangeName', {
      method: 'POST',
      body: JSON.stringify({ accessToken, name }),
    });

    if (response.ok) {
      alert('Name updated successfully.');
    } else {
      alert('Error updating name.');
    }
  };

  return (
    <Box className="profile-page">
      <Typography variant="h4">User Profile</Typography>
      <TextField
        label="Update Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleNameChange}>
        Update Name
      </Button>
      <Grid container spacing={2}>
        {images.map((url, index) => (
          <Grid item xs={4} key={index}>
            <img src={url} alt={`PCA Image ${index}`} className="profile-image" />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ProfilePage;
