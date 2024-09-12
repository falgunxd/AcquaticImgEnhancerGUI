import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import './App.css';

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

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [outputImages, setOutputImages] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Optional for preview display

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];

      // Optional validation: Check file type and size
      if (!selectedFile.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }

      if (selectedFile.size > 1024 * 1024 * 5) { // 5MB limit
        alert('File size exceeds the limit of 5MB.');
        return;
      }

      // Read the file as a data URL (Base64 encoded) for optional preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string); // Set preview image URL (data URL)
        }
      };
      reader.readAsDataURL(selectedFile);

      // Convert the file to Base64 for sending to the API
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            resolve(event.target.result.toString());
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

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

      // Step 1: Prepare the payload based on input type
      if (file) {
        // If the file is selected, convert it to base64 and send it
        const reader = new FileReader();
        reader.onload = async (e) => {
          if (e.target?.result) {
            const base64String = e.target.result.toString().split(',')[1];
            payload = { img: `data:image/jpeg;base64,${base64String}` };

            s3Response = await fetch("https://205er4kd0g.execute-api.ap-south-1.amazonaws.com/default/imgToS3url", {
              method: "POST",
              body: JSON.stringify(payload),
            });

            processS3Response(s3Response);
          }
        };
        reader.readAsDataURL(file);
      } else if (url) {
        // If a URL is provided, prepare payload
        payload = { url };

        s3Response = await fetch("https://205er4kd0g.execute-api.ap-south-1.amazonaws.com/default/imgToS3url", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        processS3Response(s3Response);
      }
    } catch (error) {
      console.error('Error during processing:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  // Function to handle and process the S3 response
  const processS3Response = async (s3Response: Response) => {
    if (!s3Response.ok) {
      console.error('Error uploading image:', await s3Response.text());
      alert('Error uploading image.');
      return;
    }

    const data = await s3Response.json();
    console.log('Upload response:', data);

    const { bucket, key } = data;

    // Step 2: Process the image using the second API
    const processResponse = await fetch("https://205er4kd0g.execute-api.ap-south-1.amazonaws.com/default/getProcessedAcquaticImages", {
      method: "POST",
      body: JSON.stringify({ bucket, key }),
    });

    if (!processResponse.ok) {
      console.error('Error processing image:', await processResponse.text());
      alert('Error processing image.');
      return;
    }

    const processData = await processResponse.json();
    setOutputImages(processData.images);
  };

  return (
    <div className="card">
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        Upload files
        <VisuallyHiddenInput
          type="file"
          onChange={handleFileChange}
        />
      </Button>
      or
      <TextField
        label="Image URL"
        size="small"
        value={url}
        onChange={handleUrlChange}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUploadAndProcess}
        disabled={processing}
      >
        {processing ? <CircularProgress size={24} /> : 'Process'}
      </Button>

      {outputImages && (
        <div className="output-images">
          {Object.keys(outputImages).map((key) => (
            <div key={key}>
              <img src={outputImages[key]} alt={key} style={{ width: '100px', margin: '10px' }} />
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
