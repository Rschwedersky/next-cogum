"use client"
import { Sensor_data } from "@/app/types/items";
import React, { useEffect, useState } from "react";


const LastMqtt = () => {
  const [mqttData, setMqttData] = useState<Sensor_data | undefined>(undefined);

  async function fetchMqttData() {
    try {
      const response = await fetch(`${process.env.API_URL}/api/mqtt`, {
        headers: {
          Authorization: `Bearer `,
        },
      });
  
      if (response.ok) {
        const responseClone = response.clone();
        const mqttDataJson = await responseClone.json();
        return mqttDataJson;
      } else {
        console.error('Error fetching data:', response.statusText);
        return undefined;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return {};
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMqttData();
        if (data) {
          setMqttData(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData()
    const intervalId = setInterval(fetchData, 1000);
    return () => {
    };
  }, []);

    return (
        <ul>
        {Object.entries(mqttData || {}).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
      </ul>
    );
  };
  
  export default LastMqtt;