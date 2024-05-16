
import  mqtt from "mqtt";
import { Sensor_data } from "./api/mongo-data/route";
import LastMqtt from "@/components/last-mqtt";



export default async function Home() {


  return (
    <div>
    
        <LastMqtt ></LastMqtt>
   
  
  </div>
  );
}