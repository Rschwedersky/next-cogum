declare namespace NodeJS {
    export interface ProcessEnv {
      readonly NEXT_PUBLIC_MQTT_URI: string;
      readonly NEXT_PUBLIC_MQTT_USERNAME: string;
      readonly NEXT_PUBLIC_MQTT_PASSWORD: string;
      readonly NEXT_PUBLIC_MQTT_CLIENTID: string;
      readonly NEXT_PUBLIC_MONGODB_URI: string;
      readonly API_URL: string;
      readonly NEXT_PUBLIC_FIREBASE_CONFIG:string;
    }
  }