import { connectToMQTTBroker } from '@/app/lib/service-mqtt';
import mqtt from 'mqtt';
import { NextRequest, NextResponse } from "next/server";

let dataMqtt: any = undefined;
let connected = false; 

const client = connectToMQTTBroker();

client.on('message', (topic, message) => {
  const data = JSON.parse(message.toString()); // Assuming JSON data format
  dataMqtt = data;
  // Store the data in localStorage (see next step)
  //storeDataInLocalStorage(data);
});

export async function GET() {
  try {
    await waitForDataMqtt();
    if (dataMqtt){return NextResponse.json(dataMqtt);}

  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

function waitForDataMqtt() {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (dataMqtt) {
          clearInterval(interval);
          resolve();
        }
      }, 100); // Check every 100 milliseconds, you can adjust this value as needed
    });
  }