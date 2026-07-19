"""
MURA Ensemble Inference
========================
Runs the 17-model grand ensemble via ONNX Runtime.
If ONNX models are not yet exported, a clearly-labeled simulation mode
provides deterministic responses while documenting the expected contract.

To export models (one-time setup):
    cd deployment_ortho/mura_
    python export_to_onnx.py
    # then copy onnx_models/ → backend/onnx_models/
"""

import glob
import hashlib
import os

import numpy as np
from PIL import Image

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
IMG_SIZE = 600
TOTAL_MODELS = 17
ONNX_DIR = os.path.join(os.path.dirname(__file__), "onnx_models")


# ---------------------------------------------------------------------------
# Softmax (NumPy)
# ---------------------------------------------------------------------------
def _softmax(x: np.ndarray) -> np.ndarray:
    e = np.exp(x - np.max(x, axis=1, keepdims=True))
    return e / e.sum(axis=1, keepdims=True)


# ---------------------------------------------------------------------------
# Preprocessing (matches PyTorch training pipeline)
# ---------------------------------------------------------------------------
def preprocess(image_path: str) -> np.ndarray:
    """Resize, normalise, and convert an image to a (1, 3, H, W) tensor."""
    image = Image.open(image_path).convert("RGB")
    image = image.resize((IMG_SIZE, IMG_SIZE), resample=Image.BILINEAR)
    arr = np.array(image, dtype=np.float32) / 255.0
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
    arr = (arr - mean) / std
    arr = np.transpose(arr, (2, 0, 1))  # HWC → CHW
    return np.expand_dims(arr, axis=0)  # (1, 3, H, W)


# ---------------------------------------------------------------------------
# Real ensemble (ONNX Runtime)
# ---------------------------------------------------------------------------
def _load_onnx_sessions():
    """Load all .onnx files from ONNX_DIR, returning list of (session, input_name)."""
    if not os.path.isdir(ONNX_DIR):
        return []

    import onnxruntime as ort

    sessions = []
    for path in sorted(glob.glob(os.path.join(ONNX_DIR, "*.onnx"))):
        # skip quantized duplicates unless we specifically want them
        if "_quantized" in os.path.basename(path):
            continue
        try:
            sess = ort.InferenceSession(path, providers=["CPUExecutionProvider"])
            input_name = sess.get_inputs()[0].name
            sessions.append((sess, input_name))
        except Exception:
            continue
    return sessions


def predict_real(image_path: str) -> dict:
    """Run the 17-model ONNX ensemble and return the standard verdict."""
    sessions = _load_onnx_sessions()
    if not sessions:
        raise RuntimeError(
            "No ONNX models found in backend/onnx_models/. "
            "Run `python export_to_onnx.py` in deployment_ortho/mura_/ first, "
            "then copy the .onnx files into backend/onnx_models/."
        )

    tensor = preprocess(image_path)
    probs = []
    for sess, input_name in sessions:
        outputs = sess.run(None, {input_name: tensor})[0]
        prob_abnormal = float(_softmax(outputs)[0, 1])
        probs.append(prob_abnormal)

    avg = sum(probs) / len(probs)
    is_abnormal = avg > 0.5
    confidence = avg if is_abnormal else 1.0 - avg
    votes = sum(1 for p in probs if p > 0.5)

    return {
        "file": os.path.basename(image_path),
        "prediction": "ABNORMAL" if is_abnormal else "NORMAL",
        "probability": round(avg, 4),
        "confidence": round(min(confidence, 0.999), 4),
        "votes_abnormal": votes,
        "total_models": len(sessions),
        "engine": "onnx",
    }


# ---------------------------------------------------------------------------
# Simulation fallback (clearly labeled)
# ---------------------------------------------------------------------------
def predict_simulated(file_path: str) -> dict:
    """
    Deterministic simulation for environments where ONNX models are not
    yet exported.  Uses a stable hash of file-name + size so the same image
    always returns the same result.  The 'engine' field is set to 'simulation'
    so consumers can distinguish real from simulated results.
    """
    content = f"{os.path.basename(file_path)}:{os.path.getsize(file_path)}"
    seed = int(hashlib.md5(content.encode()).hexdigest(), 16)
    is_abnormal = (seed % 100) < 55
    probability = 0.62 + (seed % 34) / 100.0
    confidence = probability if is_abnormal else 1.0 - (1.0 - probability) * 0.4
    votes = (
        min(TOTAL_MODELS, round(TOTAL_MODELS * probability))
        if is_abnormal
        else max(0, round(TOTAL_MODELS * (1 - probability)))
    )

    return {
        "file": os.path.basename(file_path),
        "prediction": "ABNORMAL" if is_abnormal else "NORMAL",
        "probability": round(probability, 4),
        "confidence": round(min(confidence, 0.999), 4),
        "votes_abnormal": votes,
        "total_models": TOTAL_MODELS,
        "engine": "simulation",
    }


def predict(file_path: str) -> dict:
    """Auto-select real ONNX inference or documented simulation fallback."""
    if _load_onnx_sessions():
        return predict_real(file_path)
    return predict_simulated(file_path)
