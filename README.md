# Spice Odyssey

Spice Odyssey is an IoT and machine learning system for turmeric adulteration detection with end-to-end traceability.

It combines ESP32 sensor capture, backend inference, QR-enabled supply chain tracking, and Firebase role-based authentication.

## What It Does

- Real-time purity inference from ESP32 sensor inputs
- Multi-output ML prediction: binary class, quality grade, purity percentage
- Hash-chain traceability for tamper-evident supply chain events
- QR-based batch journey tracking for downstream handlers and consumers
- Web dashboard with live updates and model output history

## Architecture

1. Edge Layer
- ESP32 reads BME680 and MQ-series sensors
- Supports WiFi client mode and serial mode

2. Inference Layer
- Flask backend receives sensor payloads on API endpoints
- Loads trained scikit-learn models for prediction
- Pushes updates to dashboard clients via WebSocket

3. Traceability Layer
- SQLite-backed batch, event, handler, and purity-test records
- SHA-256 hash chaining between events for integrity checks

4. Frontend Layer
- Static pages for login, dashboard, admin, and tracking
- Firebase Auth integration and API consumption

## Repository Layout

- [frontend](frontend): dashboard, login, admin, and tracking pages
- [raw_sensor_model](raw_sensor_model): runtime model pipeline, ESP32 firmware, backend server
- [traceability](traceability): traceability API, models, admin/demo utilities
- [train.py](train.py): main model training workflow
- [save_model.py](save_model.py): model and metadata exporter
- [extract_param.py](extract_param.py): ESP32 parameter extraction utility
- [spice_purity_inference.ino](spice_purity_inference.ino): on-device inference firmware

## Local Setup

### 1. Inference Server

```bash
cd raw_sensor_model/server
pip install -r requirements.txt
python app.py
```

Default local URL: http://localhost:5000

### 2. Traceability API (optional standalone run)

```bash
cd traceability
pip install -r requirements.txt
python api.py
```

Default local URL: http://localhost:5001

### 3. Frontend

Open files in [frontend](frontend) or host as static assets in your preferred platform.

## Environment Variables

Recommended variables:

- SECRET_KEY: Flask secret key for sessions and security-sensitive operations
- FIREBASE_CREDENTIALS: Firebase service account JSON as a single-line string

Template: [.env.example](.env.example)

## ESP32 Integration

Main device files:

- WiFi client firmware: [raw_sensor_model/esp32_wifi_client/esp32_wifi_client.ino](raw_sensor_model/esp32_wifi_client/esp32_wifi_client.ino)
- Serial firmware: [raw_sensor_model/esp32_serial/esp32_serial.ino](raw_sensor_model/esp32_serial/esp32_serial.ino)
- Serial bridge: [raw_sensor_model/server/serial_bridge.py](raw_sensor_model/server/serial_bridge.py)

In WiFi mode, update firmware constants before flashing:

```cpp
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* SERVER_URL = "http://YOUR_PC_IP:5000/api/predict";
```

## API Reference

### Inference Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | / | Dashboard page |
| POST | /api/predict | Submit sensor readings and receive predictions |
| GET | /api/health | Service health check |
| GET | /api/history | Recent prediction history |
| GET | /api/model-info | Model metadata |

### Traceability Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/batches | List batches |
| POST | /api/batches | Create batch |
| GET | /api/batches/{id} | Get batch details |
| GET | /api/batches/{id}/journey | Get full journey |
| GET | /api/batches/{id}/qr | Generate batch QR |
| GET | /api/batches/{id}/verify | Verify hash-chain integrity |
| POST | /api/events | Record supply-chain event |
| GET | /api/batches/{id}/events | List batch events |
| POST | /api/purity-tests | Record purity test |
| GET | /api/batches/{id}/purity-tests | List purity tests |
| GET | /api/handlers | List handlers |
| POST | /api/handlers | Register handler |
| GET | /api/handlers/{id} | Get handler details |
| POST | /api/transfer | Transfer batch |
| GET | /api/track/{id} | Public tracking view |

## Test Without ESP32

Curl example:

```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"mq135_ratio": 1.65, "mq3_voltage": 1.28, "gas_resistance_kOhm": 32.5}'
```

Python example:

```python
import requests

response = requests.post(
    "http://localhost:5000/api/predict",
    json={
        "mq135_ratio": 1.65,
        "mq3_voltage": 1.28,
        "gas_resistance_kOhm": 32.5,
    },
)
print(response.json())
```

## Firebase on Render

1. Open Render dashboard and select your backend service.
2. Go to Environment and add FIREBASE_CREDENTIALS.
3. Paste full service account JSON as one line.
4. Save and wait for redeploy.

Expected log signal after deploy:

- Firebase initialized successfully

If initialization fails, re-check JSON formatting and escaping.

## Deployment Notes

- Backend deployment definition: [raw_sensor_model/server/render.yaml](raw_sensor_model/server/render.yaml)
- Frontend deployment config: [vercel.json](vercel.json)
- SQLite traceability database path on Render:
  - /opt/render/project/src/raw_sensor_model/server/traceability.db

Render free tier uses ephemeral storage, so the SQLite database resets on redeploy.

## Data and Model Artifacts

- Canonical training dataset: [spice_data.csv](spice_data.csv)
- Runtime backend models:
  - [raw_sensor_model/binary_classifier_raw.pkl](raw_sensor_model/binary_classifier_raw.pkl)
  - [raw_sensor_model/multiclass_classifier_raw.pkl](raw_sensor_model/multiclass_classifier_raw.pkl)
  - [raw_sensor_model/regression_model_raw.pkl](raw_sensor_model/regression_model_raw.pkl)

Root-level model artifacts are used by root training/testing utilities.

## Troubleshooting

### ESP32 cannot reach server

- Ensure ESP32 and host are on the same network
- Confirm SERVER_URL points to reachable host IP and port
- Check firewall rules for Python/Flask process

### Dashboard does not update

- Check browser console for WebSocket errors
- Verify backend service is running and reachable
- Refresh the dashboard and re-test POST flow

### Model loading issues

- Confirm required model files exist in expected locations
- Start the server from the correct working directory

## Security and Hygiene

- Never commit Firebase service account key files
- Keep local caches and database files out of version control
- Use environment variables for credentials and secrets