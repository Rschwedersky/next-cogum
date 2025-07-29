const mqtt = require('mqtt');

// your credentials
const options = {
  username: '@Rshw',
  password: '@Rshw123456789',
};

// connect to your cluster, insert your host name and port
const client = mqtt.connect('wss://daf2ed2d22014cc5821a43f3fdcf44a9.s1.eu.hivemq.cloud:8884/mqtt', options);

// prints a received message
client.on('message', function(topic, message) {
  console.log(String.fromCharCode.apply(null, message)); // need to convert the byte array to string
});

// reassurance that the connection worked
client.on('connect', () => {
  console.log('Connected!');
});

// prints an error message
client.on('error', (error) => {
  console.log('Error:', error);
});

// subscribe and publish to the same topic
client.subscribe('Cogum Sensor Controller');
//client.publish('messages', 'Hello, this message was received!');

/* useMqtt({
  uri: process.env.NEXT_PUBLIC_MQTT_URI || '',
  options: {
    username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
    password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
    clientId: process.env.NEXT_PUBLIC_MQTT_CLIENTID,
    keepalive: 60,
  },
  topicHandlers: incomingMessageHandlers.current,
  onConnectedHandler: handleConnection,
}); */