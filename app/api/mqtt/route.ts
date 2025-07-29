import { connectToMQTTBroker } from '@/app/lib/service-mqtt';
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // Prevent static generation

export async function GET(request: NextRequest) {
  let dataMqtt: any = null;

  try {
    const client = connectToMQTTBroker();

    // Wait for connection with a timeout
    const connectPromise = new Promise<void>((resolve, reject) => {
      client.on('connect', () => {
        console.log('Connected to MQTT broker in /api/mqtt');
        resolve();
      });
      client.on('error', (error) => {
        client.end();
        reject(new Error(`MQTT connection failed: ${error.message}`));
      });
    });

    await Promise.race([
      connectPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('MQTT connection timeout')), 5000)),
    ]);

    // Wait for a message with a timeout
    dataMqtt = await new Promise((resolve, reject) => {
      client.on('message', (topic, message) => {
        try {
          const data = JSON.parse(message.toString());
          client.end(); // Close connection after receiving data
          resolve(data);
        } catch (error) {
          client.end();
          reject(new Error(`Failed to parse MQTT message: ${message}`));
        }
      });
      setTimeout(() => {
        client.end();
        resolve(null); // Return null if no message is received
      }, 10000); // 10-second timeout
    });

    if (dataMqtt) {
      return NextResponse.json(dataMqtt);
    }
    return NextResponse.json({ message: "No MQTT data received" }, { status: 200 });
  } catch (error) {
    console.error("MQTT error in /api/mqtt:", error);
    return NextResponse.json({ error: "Failed to retrieve MQTT data" }, { status: 500 });
  }
}