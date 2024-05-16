
import  mqtt from "mqtt";
import { Sensor_data } from "./api/mongo-data/route";
import LastMqtt from "@/components/last-mqtt";



export default async function Home() {
  let mqttData: Sensor_data|undefined = undefined;
  
  const mqttDataResponse = await fetch(`${process.env.API_URL}/api/mqtt`, {
      headers: {
          Authorization: `Bearer `,
      },
  });
  if (mqttDataResponse.ok) {
      const responseClone = mqttDataResponse.clone();
      const mqttDataJson = await responseClone.json();
      mqttData = mqttDataJson;
      
  }
  
  return (
    <div>
    {!mqttData ? ( // Check for empty object
      <p>Loading data...</p>
    ) : (
      <>
        {/* Render your content using mqttData */}
        <h2>Received data:</h2>
        <LastMqtt ></LastMqtt>
      </>
    )}
  </div>
  );
}