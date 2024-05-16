import { MongoClient, ServerApiVersion } from 'mongodb';
import { auth, firestore } from "@/firebase/server";
import { UserRecord, DecodedIdToken } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";

const uri = process.env.NEXT_PUBLIC_MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version



export type Sensor_data = {
timestamp:string;
metadata:string;
temperature_high:string;
led_on:string;
vent_on:string;
temperature:string;
humidity_low:string;
humidity_high:string;
_id:string;
temperature_low:string;
hum_on:string;
humidity:string;
};



export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
      if (!firestore)
          return new NextResponse("Internal Error", { status: 500 });

      const authToken =
          request.headers.get("authorization")?.split("Bearer ")[1] || null;

      let user: DecodedIdToken | null = null;
      if (auth && authToken)
          try {
              user = await auth.verifyIdToken(authToken);
          } catch (error) {
              // One possible error is the token being expired, return forbidden
              console.log(error);
          }

      const isAdmin = user?.admin;

      // Only admin or user can delete user info
      const valid = isAdmin || user?.uid === params.userId;
      if (!valid) return new NextResponse("Unauthorized", { status: 401 });
      
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
            });
        await client.connect();
        const db = client.db('cogum_house');
        const collection = db.collection('time_series_sensor');

        const data = await collection.find().toArray();
        client.close();
        return NextResponse.json(data);
    } 
    catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
}
}