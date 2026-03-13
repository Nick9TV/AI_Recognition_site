from fastapi import FastAPI, File, UploadFile
from PIL import Image
import io
from ultralytics import YOLO

app = FastAPI()

model = YOLO("yolov8n.pt")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    results = model(image)
    
    detected = []
    for r in results:
        for c in r.boxes.cls:
            detected.append(model.names[int(c)])
    
    return {"objects": list(set(detected))}