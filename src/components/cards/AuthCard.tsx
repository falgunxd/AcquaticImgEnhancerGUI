// AuthCard.tsx
import { useState } from 'react';
import { Card, TextField, Button, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { setAccessToken } from '../../utils/sessionManager';
import './AuthCard.css';

function AuthCard() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [agreedToTos, setAgreedToTos] = useState(false);
  const [agreedToPp, setAgreedToPp] = useState(false);
  const [isConfirmationStep, setIsConfirmationStep] = useState(false);

  const handleSignUp = async () => {
    if (!agreedToTos || !agreedToPp) {
      alert('You must agree to the terms of service and privacy policy.');
      return;
    }

    const response = await fetch('https://205er4kd0g.execute-api.ap-south-1.amazonaws.com/default/aieSignup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    if (response.ok) {
      setIsConfirmationStep(true);
      alert('Please check your email for the confirmation code.');
    } else {
      alert('Error during signup.');
    }
  };

  const handleSignIn = async () => {
    const response = await fetch('https://205er4kd0g.execute-api.ap-south-1.amazonaws.com/default/aieSignin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setAccessToken(data.accessToken);
      window.location.href = `/user/${data.userId}`; // Redirect to user's profile page
    } else {
      alert('Invalid credentials.');
    }
  };

  const handleConfirmEmail = async () => {
    const response = await fetch('https://205er4kd0g.execute-api.ap-south-1.amazonaws.com/default/aieConfirmEmail', {
      method: 'POST',
      body: JSON.stringify({ email, code: confirmationCode }),
    });

    if (response.ok) {
      alert('Email confirmed successfully. Please sign in.');
      setIsSignUp(false);
    } else {
      alert('Error confirming email.');
    }
  };

  return (
    <Card className="auth-card">
      <Typography variant="h5">{isSignUp ? 'Sign Up' : 'Sign In'}</Typography>
      {isConfirmationStep ? (
        <>
          <TextField
            label="Confirmation Code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleConfirmEmail}>
            Confirm Email
          </Button>
        </>
      ) : (
        <>
          {isSignUp && <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />}
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
          {isSignUp && (
            <>
              <FormControlLabel
                control={<Checkbox checked={agreedToTos} onChange={(e) => setAgreedToTos(e.target.checked)} />}
                label="I agree to the Terms of Service"
              />
              <FormControlLabel
                control={<Checkbox checked={agreedToPp} onChange={(e) => setAgreedToPp(e.target.checked)} />}
                label="I agree to the Privacy Policy"
              />
            </>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={isSignUp ? handleSignUp : handleSignIn}
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </>
      )}
      <Button variant="text" onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
      </Button>
    </Card>
  );
}

export default AuthCard;
