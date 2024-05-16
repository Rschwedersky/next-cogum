
import { cookies } from "next/headers";
import { auth } from "@/firebase/server";
import { DecodedIdToken } from "firebase-admin/auth";
import { Sensor_data } from "../api/mongo-data/route";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';
import StaticChart, { ChartData } from "@/components/static-chart";
import { Suspense } from "react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  );
  
  

export default async function ChartsPage() {
    const cookieStore = cookies();
    const authToken = cookieStore.get("firebaseIdToken")?.value;

    if (!authToken || !auth) {
        return <h1 className="text-white text-xl mb-10">Restricted page</h1>;
        // return redirect("/");
    }

    let user: DecodedIdToken | null = null;
    try {
        user = await auth.verifyIdToken(authToken);
    } catch (error) {
        // One possible error is the token being expired, return forbidden
        console.log(error);
    }

    if (!user) {
        return <h1 className="text-white text-xl mb-10">Restricted page</h1>;
        // return redirect("/");
    }

    let userInfo = null;
    const userInfoResponse = await fetch(
        `${process.env.API_URL}/api/users/${user.uid}`,
        {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        }
    );
    if (userInfoResponse.ok) {
        userInfo = await userInfoResponse.json();
    }

    const isPro = user.admin;
    if (!isPro) {
        return <h1 className="text-white text-xl mb-10">Restricted page</h1>;
    }

    /* let items: Item[] = [];
    const response = await fetch(`${process.env.API_URL}/api/items`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
    if (response.ok) {
        const itemsJson = await response.json();
        if (itemsJson && itemsJson.length > 0) items = itemsJson;
    } */


    
    let mongo: Sensor_data[] = [];
    const mongoResponse = await fetch(`${process.env.API_URL}/api/mongo-data`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
    if (mongoResponse.ok) {
        const responseClone = mongoResponse.clone();
        const mongoJson = await responseClone.json();
        if (mongoJson && mongoJson.length > 0) mongo = mongoJson;
    }
    
    function formatDateToMonthDayHour(timestamp: string | number | Date) {
        const date = new Date(timestamp);
        const month = date.toLocaleString("en-US", { month: "short" }).toLowerCase(); // Get month as short string (jun)
        const day = date.getDate().toString().padStart(2, "0"); // Pad day with zeros
        const hour = date.getHours();
      
        return `${month}/${day}-${hour}h`;
      }
      
    function getMinimumHumidity(sensorData: Sensor_data[]):  string {
    // Check if there's any data
    if (!sensorData.length) {
        return "0" // Or throw an error if no data is acceptable
    }
    // Convert humidity values to numbers (assuming they are strings)
    const humidities = sensorData.map(data => parseFloat(data.humidity));
    // Find minimum and maximum humidity
    const minHumidity = Math.min(...humidities).toString();
    return minHumidity;
    }
    
    
    const humidityData: ChartData = {
    labels: mongo.map(row => formatDateToMonthDayHour(row.timestamp)), // Extract keys (axis labels)
    datasets: [
        {
        label: 'Humidy', // Customize label
        data: mongo.map(row => row.humidity ), // Extract values (data points)
        backgroundColor: 'rgba(0, 128, 255, 0.2)', // Optional: Set background color
        borderColor: 'rgba(0, 128, 255, 0.5)', // Optional: Set border color
        pointBackgroundColor: 'rgba(0, 128, 255, 0.0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        tension: 1,
        fill: true,
        /* tension: 0.5, */
        },
        {
        label: 'Light', // Customize label
        fill: true,
        data: mongo.map(row => {
            // Format led_on value
            const ledOnValue = row.led_on == "1" ? "100" : getMinimumHumidity(mongo); // Assuming getMinimumHumidity returns the min humidity
            return ledOnValue;
            }), // Extract values (data points)
        backgroundColor: 'rgba(255, 215, 0, 0.3)', // Optional: Set background color
        borderColor: 'rgba(255, 215, 0, 0)', // Optional: Set border color
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        tension: 1
        },
       /*  {
        label: 'Vento', // Customize label
        fill: true,
        data: mongo.map(row => {
            // Format led_on value
            const ledOnValue = row.vent_on == "1" ? "100" : getMinimumHumidity(mongo); // Assuming getMinimumHumidity returns the min humidity
            return ledOnValue;
            }), // Extract values (data points)
        backgroundColor: 'rgba(255, 102, 0, 1)', // Optional: Set background color
        borderColor: 'rgba(255, 215, 0, 0)', // Optional: Set border color
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        tension: 1
        }, */
    ],
    };

    const lightData: ChartData = {
        labels: mongo.map(row => formatDateToMonthDayHour(row.timestamp)), // Extract keys (axis labels)
        datasets: [
            {
            label: 'Light', // Customize label
            fill: true,
            data: mongo.map(row => row.led_on), // Extract values (data points)
            backgroundColor: 'rgba(255, 215, 0, 0.5)', // Optional: Set background color
            borderColor: 'rgba(255, 215, 0, 1)', // Optional: Set border color
            pointBackgroundColor: 'rgba(0, 0, 0, 0)',
            pointBorderColor: 'rgba(0, 0, 0, 0)',
            tension: 1
            },
        ],
        };

        //<div className="pb-4">
            //<StaticChart  chartData={lightData} /* width={600} height={300} */ />
       //</div>
    
    return (
        
        <div className="items-center w-4/6 h-full">
            <h1 className="text-white text-xl mb-10">Charts Page</h1>
            <div className="pb-10">
            
      <>
        <Suspense fallback={<p>Loading feed...</p>}>
        <StaticChart  chartData={humidityData} /* width={600} height={300} */ />
        </Suspense>
      </>
   
            
            </div>   
        </div>
    );
};
