

import { useState, useRef } from "react";
import type { MqttClient } from "mqtt";
import useMqtt from "@/app/lib/useMqtt";

export default function Home() {
  const [incommingMessages, setIncommingMessages] = useState<any[]>([]);
  const addMessage = (message: any) => {
    setIncommingMessages((incommingMessages) => [
      ...incommingMessages,
      message,
    ]);
  };
  const clearMessages = () => {
    setIncommingMessages(() => []);
  };

  const incommingMessageHandlers = useRef([
    {
      topic: "topic1",
      handler: (msg: string) => {
        addMessage(msg);
      },
    },
  ]);

  const mqttClientRef = useRef<MqttClient | null>(null);
  const setMqttClient = (client: MqttClient) => {
    console.log("clientset",client)
    mqttClientRef.current = client;
  };
  useMqtt({
    uri: 'wss://daf2ed2d22014cc5821a43f3fdcf44a9.s1.eu.hivemq.cloud:8884/mqtt',
    options: {
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
    },
    topicHandlers: incommingMessageHandlers.current,
    onConnectedHandler: (client: MqttClient) => setMqttClient(client),
  });

  const publishMessages = (client: any) => {
    if (!client) {
      console.log("(publishMessages) Cannot publish, mqttClient: ", client);
      return;
    }
    console.log("client",client.conected)
    client.publish("topic1", "1st message from component");
  };

  return (
    <div>
      <h2>Subscribed Topics</h2>
      {incommingMessageHandlers.current.map((i) => (
        <p key={Math.random()}>{i.topic}</p>
      ))}
      <h2>Incomming Messages:</h2>
      {incommingMessages.map((m) => (
        <p key={Math.random()}>{m.payload.toString()}</p>
      ))}
      <button onClick={() => publishMessages(mqttClientRef.current)}>
        Publish Test Messages
      </button>
      <button onClick={() => clearMessages()}>Clear Test Messages</button>
    </div>
  );
}
