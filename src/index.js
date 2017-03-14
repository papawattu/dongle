import App from './bridge/app.js';

const app = new App({outgoingHost: process.env.OUTGOING_HOST,
    outgoingPort: process.env.OUTGOING_PORT,
    incomingPort: process.env.INCOMING_PORT
});