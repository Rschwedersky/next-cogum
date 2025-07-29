export enum ItemAccess {
  PUBLIC = "PUBLIC",
  USER = "USER",
  PRO = "PRO",
  ADMIN = "ADMIN",
}

export type Item = {
  id: string;
  title: string;
  access: ItemAccess;
};

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