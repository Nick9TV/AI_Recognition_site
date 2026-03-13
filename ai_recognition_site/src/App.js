import React, { useState, useRef } from "react";
import axios from "axios";

function App() {

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [detections, setDetections] = useState([]);

  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const drawBoxes = (data) => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,0,0,img.width,img.height);

    ctx.lineWidth = 3;
    ctx.font = "18px Arial";

    data.forEach(det => {

      const [x1,y1,x2,y2] = det.box;

      ctx.strokeStyle = "red";
      ctx.strokeRect(x1,y1,x2-x1,y2-y1);

      const label = `${det.name} ${det.confidence}%`;

      ctx.fillStyle = "red";
      ctx.fillText(label,x1,y1-5);

    });

  };

  const handleUpload = async () => {

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      "http://localhost:8000/predict",
      formData,
      { headers:{ "Content-Type":"multipart/form-data" }}
    );

    setDetections(res.data.detections);

    setTimeout(() => {
      drawBoxes(res.data.detections);
    },100);

  };

  return (

    <div style={{padding:40}}>

      <h1>Image Recognition</h1>

      <input type="file" onChange={handleFileChange} />

      <button onClick={handleUpload}>Analyze</button>

      {preview && (
        <div style={{position:"relative"}}>

          <img
            ref={imageRef}
            src={preview}
            alt="preview"
            width="600"
            style={{display:"block"}}
          />

          <canvas
            ref={canvasRef}
            style={{
              position:"absolute",
              left:0,
              top:0
            }}
          />

        </div>
      )}

      {detections.length>0 && (

        <div>
          <h3>Detected objects</h3>

          <ul>
            {detections.map((d,i)=>(
              <li key={i}>
                {d.name} ({d.confidence}%)
              </li>
            ))}
          </ul>

        </div>

      )}

    </div>

  );
}

export default App;