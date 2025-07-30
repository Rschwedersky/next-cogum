import mqtt from "mqtt";

const brokerUrl = "wss://daf2ed2d22014cc5821a43f3fdcf44a9.s1.eu.hivemq.cloud:8884/mqtt";
const options = {
  username: "@Rshw",
  password: "@Rshw123456789",
  clientId: `next-cogum-${Math.random().toString(16).slice(3)}`, // Unique client ID
  reconnectPeriod: 5000,
  connectTimeout: 30000,
  keepalive: 60,
  clean: false,
};

// Singleton for MQTT client and data
const mqttService = (() => {
  let client: mqtt.MqttClient | null = null;
  let messageData: any[] = [];
  let isConnecting = false;

  return {
    async connect() {
      if (client && client.connected) {
        console.log("MQTT client already connected");
        return client;
      }

      if (isConnecting) {
        console.log("MQTT connection in progress, waiting...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return client;
      }

      isConnecting = true;
      console.log("Attempting to connect to MQTT broker:", brokerUrl);
      client = mqtt.connect(brokerUrl, options);

      client.on("connect", () => {
        console.log("Connected to MQTT broker");
        isConnecting = false;
        const subscribeWithRetry = (attempt: number = 1, maxAttempts: number = 3) => {
          client?.subscribe("sensors/sht40", { qos: 1 }, (err) => {
            if (err) {
              console.error(`Failed to subscribe to Cogum Sensor Controller (attempt ${attempt}):`, err.message);
              if (attempt < maxAttempts) {
                console.log(`Retrying subscription in 5s (attempt ${attempt + 1})`);
                setTimeout(() => subscribeWithRetry(attempt + 1, maxAttempts), 5000);
              } else {
                console.error("Max subscription attempts reached");
              }
              return;
            }
            console.log("Subscribed to Cogum Sensor Controller");
          });
        };
        subscribeWithRetry();
      });

      client.on("message", (topic, message) => {
        try {
          //console.log("Raw MQTT message received on topic:", topic, "Message:", message.toString());
          const data = JSON.parse(message.toString());
          //console.log("Parsed MQTT data:", data);
          messageData = [...messageData, ...(Array.isArray(data) ? data : [data])];
          //console.log("Updated messageData:", messageData);
        } catch (err) {
          console.error("Error parsing MQTT message:", err);
        }
      });

      client.on("error", (err) => {
        console.error("MQTT error:", err.message);
        isConnecting = false;
        client?.end();
        client = null;
      });

      client.on("close", () => {
        console.log("MQTT connection closed");
        isConnecting = false;
      });

      client.on("reconnect", () => {
        console.log("Attempting to reconnect to MQTT broker");
      });

      return client;
    },
    getData() {
      console.log("Returning messageData:", messageData);
      return messageData;
    },
    clearData() {
      console.log("Clearing messageData");
      messageData = [];
    },
  };
})();

export const connectMQTT = mqttService.connect;
export const getMQTTData = mqttService.getData;
export const clearMQTTData = mqttService.clearData;