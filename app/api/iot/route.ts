import { NextRequest } from 'next/server';

const cropBases: Record<string, { moisture: number; temp: number; humidity: number }> = {
  wheat:     { moisture: 45, temp: 22, humidity: 55 },
  rice:      { moisture: 70, temp: 28, humidity: 80 },
  sugarcane: { moisture: 60, temp: 30, humidity: 65 },
  cotton:    { moisture: 35, temp: 35, humidity: 45 },
  maize:     { moisture: 50, temp: 26, humidity: 60 },
};

let batteryLevel = 92;

function generateRealisticIoTData(crop: string) {
  const base = cropBases[crop.toLowerCase()] || { moisture: 50, temp: 25, humidity: 60 };

  const soilMoisture = Math.max(8, Math.min(98, Math.round(base.moisture + (Math.random() * 14 - 7))));
  const temperature = Math.round(base.temp + (Math.random() * 6 - 3));
  const humidity = Math.round(base.humidity + (Math.random() * 12 - 6));

  batteryLevel = Math.max(15, batteryLevel - (Math.random() * 0.3));
  const rssi = Math.round(-45 - Math.random() * 35);

  return {
    source: "hardware_iot_device",
    deviceId: "ESP32-SOIL-001",
    macAddress: "A4:CF:12:34:56:78",
    firmwareVersion: "v2.3.1",
    status: "online" as const,
    batteryLevel: Math.round(batteryLevel),
    rssi: rssi,
    signalStrength: rssi > -65 ? "Excellent" : rssi > -75 ? "Good" : "Fair",
    connectedSince: new Date(Date.now() - 1000 * 60 * 47).toISOString(),
    lastHeartbeat: new Date().toISOString(),

    crop: crop.toLowerCase(),
    timestamp: new Date().toISOString(),
    soilMoisture: soilMoisture,
    temperature: temperature,
    humidity: humidity,
    weatherCondition: ['Clear', 'Cloudy', 'Light Rain', 'Humid', 'Partly Cloudy'][Math.floor(Math.random() * 5)],

    recommendation: soilMoisture < 40 
      ? "🚨 Irrigation recommended - Soil is getting dry" 
      : "✅ Soil moisture optimal for this crop",
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const crop = (searchParams.get('crop') || 'wheat').toLowerCase();

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(generateRealisticIoTData(crop))}\n\n`)
      );

      const interval = setInterval(() => {
        const data = generateRealisticIoTData(crop);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      }, 3000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
    },
  });
}