import './App.css'
import React, { useState, ChangeEvent, FormEvent } from 'react';

interface UploadResult {
  "Nombre de archivo": string;
  "Real o Deepfake": string;
  "Intervalo de confianza": string;
  error?: string;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
    setResult(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload-audio', {
        method: 'POST',
        body: formData,
      });

      const data: UploadResult = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setResult({ error: 'Failed to analyze the audio.', "Nombre de archivo": "", "Real o Deepfake": "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>Deepfake Audio Detector</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button type="submit" style={{ marginLeft: '1rem' }} disabled={loading}>
          {loading ? 'Analyzing...' : 'Upload'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '1rem' }}>
          {result.error ? (
            <p style={{ color: 'red' }}>{result.error}</p>
          ) : (
            <>
              <p><strong>Filename:</strong> {result["Nombre de archivo"]}</p>
              <p><strong>Result:</strong> {result["Real o Deepfake"]}</p>
              <p><strong>Confidence Interval:</strong> {result["Intervalo de confianza"]}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
