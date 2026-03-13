import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [objects, setObjects] = useState([]);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    // show image preview
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/predict",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setObjects(response.data.objects);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Image Recognition</h1>

      <input type="file" onChange={handleFileChange} />

      <button onClick={handleUpload}>Upload</button>

      {/* Show preview */}
      {preview && (
        <div>
          <h3>Uploaded Image</h3>
          <img src={preview} alt="preview" width="300" />
        </div>
      )}

      {/* Show detected objects */}
      {objects.length > 0 && (
        <div>
          <h3>Detected Objects</h3>
          <ul>
            {objects.map((obj, index) => (
              <li key={index}>{obj}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;