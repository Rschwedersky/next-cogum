"use client";

import { useEffect, useState, Suspense } from "react";
import StaticChart, { ChartData } from "@/components/static-chart";

// Define type for MQTT data
interface SensorData {
  temperature: number;
  humidity: number;
  humLow: number;
  humHigh: number;
  status: string;
  wifi_signal: number;
  free_heap: number;
  uptime_seconds: number;
  sensor: string;
  time: string;
}

export const dynamic = "force-dynamic";

export default function UserPage() {
  const [mqttData, setMqttData] = useState<SensorData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!process.env.NEXT_PUBLIC_API_URL) {
          throw new Error("NEXT_PUBLIC_API_URL is not defined");
        }
        console.log("Fetching MQTT data from:", `${process.env.NEXT_PUBLIC_API_URL}/api/mqtt`);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mqtt`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch MQTT data: ${response.status}`);
        }
        const json = await response.json();
        console.log("Received MQTT data:", json);
        if (Array.isArray(json) && json.length > 0) {
          setMqttData((prev) => {
            const newData = Array.isArray(json) ? json : [json];
            const uniqueData = [...prev, ...newData].reduce((acc, curr) => {
              if (!acc.some((item: SensorData) => item.time === curr.time)) {
                acc.push(curr);
              }
              return acc;
            }, [] as SensorData[]);
            return uniqueData;
          });
          setChartKey((prev) => prev + 1);
        } else {
          console.log("No new data received, keeping existing mqttData");
        }
      } catch (err: any) {
        console.error("Error fetching MQTT data:", err.message);
        setError(`Failed to load MQTT data: ${err.message}`);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Transform SensorData[] to ChartData
  const chartData: ChartData = {
    labels: mqttData.map(d => {
        if (!d.time) return "Unknown";
        const part = d.time.split(" ")[1];       // "23:30:02"
        if (!part) return "Unknown";
        return part.split(":")[0];               // returns "23"
        }),
    datasets: [
      {
        label: "Humidity",
        data: mqttData.map((d) => String(d.humidity) || "0"),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
      },
    ],
  };

  return (
    <div className="flex flex-col items-center min-h-screen pt-16 sm:pt-20 p-4 sm:p-6 max-w-[95%] sm:max-w-4xl mx-auto bg-gradient-radial from-slate-900 to-slate-800">
      {error && <p className="text-red-500 text-xs sm:text-sm mb-4 text-center">{error}</p>}
      {mqttData.length > 0 ? (
        <div className="w-full h-[250px] sm:h-[400px] bg-slate-800/50 rounded-lg p-2 sm:p-4 pt-14">
          <Suspense fallback={<p className="text-white text-xs sm:text-sm text-center">Loading feed...</p>}>
            <StaticChart key={chartKey} chartData={chartData} />
          </Suspense>
        </div>
      ) : (
        <p className="text-white text-xs sm:text-sm text-center pt-20">No data available</p>
      )}
    </div>
  );
}