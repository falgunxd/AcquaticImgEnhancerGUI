// ConvertPage.tsx
import { styled } from '@mui/material/styles';
import { Button, TextField, CircularProgress, Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ConvertPage.css';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [outputImages, setOutputImages] = useState<any>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];

      if (!selectedFile.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }

      if (selectedFile.size > 1024 * 1024 * 5) {
        alert('File size exceeds the limit of 5MB.');
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleUploadAndProcess = async () => {
    if (!file && !url) {
      alert('Please upload a file or provide a URL');
      return;
    }

    setProcessing(true);

    try {
      let s3Response;
      let payload;

      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          if (e.target?.result) {
            const base64String = e.target.result.toString().split(',')[1];
            payload = { img: `data:image/jpeg;base64,${base64String}` };

            s3Response = await fetch(
              'https://205er4kd0g.execute-api.ap-south-1.amazonaws.com/default/imgToS3url',
              {
                method: 'POST',
                body: JSON.stringify(payload),
              }
            );

            await processS3Response(s3Response);
          }
        };
        reader.readAsDataURL(file);
      } else if (url) {
        payload = { url };

        s3Response = await fetch(
          'https://205er4kd0g.execute-api.ap-south-1.amazonaws.com/default/imgToS3url',
          {
            method: 'POST',
            body: JSON.stringify(payload),
          }
        );

        await processS3Response(s3Response);
      }
    } catch (error: any) {
      console.error('Error during processing:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const processS3Response = async (s3Response: Response) => {
    if (!s3Response.ok) {
      console.error('Error uploading image:', await s3Response.text());
      alert('Error uploading image.');
      return;
    }

    const data = await s3Response.json();
    // console.log('Upload response:', data);

    const { bucket, key } = data;

    const processResponse = await fetch(
      'https://205er4kd0g.execute-api.ap-south-1.amazonaws.com/default/getProcessedAcquaticImages',
      {
        method: 'POST',
        body: JSON.stringify({ bucket, key }),
      }
    );

    if (!processResponse.ok) {
      console.error('Error processing image:', await processResponse.text());
      alert('Error processing image.');
      return;
    }

    const processData = await processResponse.json();
    setOutputImages(processData.images);
    navigate('/display-results', { state: { images: processData.images } });
  };

  return (
    <Box className="convert-page">
      <Typography variant="h5">Upload Image or Enter URL</Typography>
      <Box className="upload-container">
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
          Upload File
          <VisuallyHiddenInput type="file" onChange={handleFileChange} />
        </Button>
        <Typography variant="body1">or</Typography>
        <TextField label="Image URL" size="small" value={url} onChange={handleUrlChange} />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUploadAndProcess}
          disabled={processing}
        >
          {processing ? <CircularProgress size={24} /> : 'Process'}
        </Button>
      </Box>
      {outputImages && (
        <Box className="output-images">
          {Object.keys(outputImages).map((key) => (
            <Box key={key} className="output-item">
              <img src={outputImages[key]} alt={key} className="output-image" />
              <Button
                variant="outlined"
                onClick={() => window.open(outputImages[key], '_blank')}
              >
                View Fullscreen
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = outputImages[key];
                  link.download = `${key}.png`;
                  link.click();
                }}
              >
                Download
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default ConvertPage;
