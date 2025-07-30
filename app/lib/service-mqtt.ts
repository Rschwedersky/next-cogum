import mqtt from "mqtt";

const brokerUrl = "wss://daf2ed2d22014cc5821a43f3fdcf44a9.s1.eu.hivemq.cloud:8884/mqtt";
const options = {
  username: "@Rshw",
  password: "@Rshw123456789",
  reconnectPeriod: 5000, // Reconnect after 5 seconds
  connectTimeout: 30000, // 30 seconds timeout
};

let client: mqtt.MqttClient | null = null;
let messageData: any[] = [];

export async function connectMQTT() {
  if (client && client.connected) {
    console.log("MQTT client already connected");
    return client;
  }

  client = mqtt.connect(brokerUrl, options);

  client.on("connect", () => {
    console.log("Connected to MQTT broker");
    client?.subscribe("Cogum Sensor Controller", { qos: 1 }, (err) => {
      if (err) {
        console.error("Failed to subscribe to Cogum Sensor Controller:", err);
        return;
      }
      console.log("Subscribed to Cogum Sensor Controller");
    });
  });

  client.on("message", (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
      messageData = Array.isArray(data) ? data : [data];
      console.log("Received MQTT message:", messageData);
    } catch (err) {
      console.error("Error parsing MQTT message:", err);
    }
  });

  client.on("error", (err) => {
    console.error("MQTT error:", err);
    client?.end();
    client = null;
  });

  client.on("close", () => {
    console.log("MQTT connection closed");
  });

  client.on("reconnect", () => {
    console.log("Attempting to reconnect to MQTT broker");
  });

  return client;
}

export function getMQTTData() {
  return messageData;
}

export function clearMQTTData() {
  messageData = [];
}