import { connectMQTT, getMQTTData } from "@/app/lib/service-mqtt";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectMQTT();
    const data = getMQTTData();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API MQTT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}