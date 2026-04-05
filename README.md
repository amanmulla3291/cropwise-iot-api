# CropWise IoT API

Real-time mock IoT device API simulating an **ESP32 soil moisture sensor** for agricultural crops.

This API pushes live sensor data every 3 seconds using Server-Sent Events (SSE). Designed for seamless integration with Flutter mobile apps.

**Live API Endpoint:**  
`https://cropwise-iot-api-v1.vercel.app/api/iot?crop=rice`

---

## 📄 Documentation

- **Interactive API Documentation** → [openapi.yaml](./openapi.yaml)
- **Full README** (this file)

---

## Key Features

- Realistic IoT device metadata (`deviceId`, `batteryLevel`, `rssi`, `status`)
- Live streaming soil moisture, temperature, humidity & weather
- Green "✅ Connected" badge support in Flutter
- CORS enabled for mobile apps

---

## Quick Test

Open in browser:  
[https://cropwise-iot-api-v1.vercel.app/api/iot?crop=rice](https://cropwise-iot-api-v1.vercel.app/api/iot?crop=rice)

You will see live data updating every 3 seconds.

---

## Flutter Integration

See the updated `CropDetailScreen` that consumes this SSE stream and shows the green "Connected" badge.

---

Made with ❤️ for smart agriculture monitoring.