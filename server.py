import os
import io
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf

# ============================================================
# FLASK APP SETUP WITH CORS ENABLED
# ============================================================
app = Flask(__name__)
# Enable CORS for all routes and origins (including http://localhost:5173)
CORS(app, resources={r"/*": {"origins": "*"}})

# ============================================================
# LOAD TRAINED BRAIN TUMOR CNN MODEL
# ============================================================
MODEL_PATH = "brain_tumor_cnn.keras"
IMG_SIZE = (160, 160)

# Class mappings matching main.py
CLASSES = [
    "glioma",
    "meningioma",
    "notumor",
    "pituitary"
]

print(f"Loading trained CNN model from '{MODEL_PATH}'...")
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print(">>> Model successfully loaded into memory!")
except Exception as e:
    print(f"Error loading model from {MODEL_PATH}: {e}")
    model = None


# ============================================================
# HEALTH CHECK ENDPOINTS
# ============================================================
@app.route("/", methods=["GET"])
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "online",
        "service": "Brain Tumor Detection AI API",
        "model_loaded": model is not None,
        "classes": CLASSES,
        "cors_enabled": True
    }), 200


# ============================================================
# PREDICTION ENDPOINT (POST /predict)
# ============================================================
@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({
            "error": "Model failed to load on server start. Please verify brain_tumor_cnn.keras exists."
        }), 500

    # 1. Validate image presence in multipart/form-data
    if "image" not in request.files:
        return jsonify({
            "error": "No 'image' field provided in request FormData."
        }), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({
            "error": "No file selected."
        }), 400

    try:
        # 2. Read and preprocess image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image = image.resize(IMG_SIZE)

        # Convert to numpy array and normalize pixel values [0, 1]
        img_array = np.array(image, dtype=np.float32) / 255.0
        img_array = np.expand_dims(img_array, axis=0) # shape: (1, 160, 160, 3)

        # 3. Model inference
        predictions = model.predict(img_array, verbose=0)
        probabilities = predictions[0]

        pred_index = int(np.argmax(probabilities))
        pred_class = CLASSES[pred_index]
        confidence = float(probabilities[pred_index])

        # 4. Map to binary prediction format + subtype
        if pred_class == "notumor":
            prediction_label = "No Tumor"
            subtype = None
        else:
            prediction_label = "Tumor"
            subtype = pred_class.capitalize()

        # Build response matching frontend expectations
        response_data = {
            "prediction": prediction_label,
            "confidence": round(confidence, 4),
            "subtype": subtype,
            "raw_class": pred_class,
            "all_probabilities": {
                c: round(float(probabilities[i]), 4) for i, c in enumerate(CLASSES)
            }
        }

        print(f"Prediction: {prediction_label} ({subtype or 'Healthy'}) - Confidence: {round(confidence * 100, 2)}%")
        return jsonify(response_data), 200

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({
            "error": f"Failed to process image: {str(e)}"
        }), 500


# ============================================================
# RUN FLASK SERVER ON PORT 5000
# ============================================================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print("=" * 60)
    print(f"Starting Brain Tumor Detection Backend API on http://localhost:{port}")
    print("CORS enabled for all origins")
    print("=" * 60)
    app.run(host="0.0.0.0", port=port, debug=False)
