import mqtt, { MqttClient } from 'mqtt';

export function connectToMQTTBroker(): MqttClient {
  const uri = process.env.MQTT_URI || 'wss://daf2ed2d22014cc5821a43f3fdcf44a9.s1.eu.hivemq.cloud:8884/mqtt';
  const options = {
    clientId: process.env.MQTT_CLIENTID || 'next_cogum',
    username: process.env.MQTT_USERNAME || '@Rshw',
    password: process.env.MQTT_PASSWORD || '@Rshw123456789',
    protocol: 'wss' as 'wss', // Use WebSocket for HiveMQ Cloud
    port: 8884,
  };

  if (!uri || !options.username || !options.password) {
    throw new Error('MQTT configuration missing: URI, username, or password not set');
  }

  const client = mqtt.connect(uri, options);

  client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe('Cogum Sensor Controller', (err) => {
      if (err) {
        console.error('Failed to subscribe to Cogum Sensor Controller:', err);
        client.end();
      }
    });
  });

  return client;
}