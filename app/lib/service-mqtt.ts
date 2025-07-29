import mqtt, { MqttClient } from 'mqtt';

let client: MqttClient | null = null;

export function connectToMQTTBroker(): MqttClient {
  if (!client) {
    client = mqtt.connect({
      host: process.env.NEXT_PUBLIC_MQTT_URI,
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD
    });

    client!.on('connect', () => {
      console.log('Connected to MQTT broker');
      client!.subscribe('Cogum Sensor Controller');
    });
  }
  return client;
}