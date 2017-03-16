import net from 'net';
import Bridge from './bridge/bridge.js';

if(process.env.NODE_ENV !== 'test') {
    const bridge = new Bridge({net});
}
