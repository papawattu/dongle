import * as Constants from './phev_constants';
import checksum from './checksum';

// f9 04  00 00 00 fd
// 9f 04  01 00 06 aa

// f9 04 00 01 00 fe
// 9f 04 01 01 06 ab

// f9 04 00 02 00 ff
// 9f 04 01 02 06 ac 

// f6 04 00 aa 00 a4
// 6f 04 01 aa 00 1e

// 6f 04  00 27 00 9a
export default class Handler {
    constructor() {

    }
    handle(command) {
        switch (command.cmd) {
            case Constants.CMD_START: {
                return Uint8Array.from([0x2f, 0x04, 0x01, 0x01, 0x00, 0x35]);
            }
            case Constants.CMD_PING: {
                const response = Uint8Array.from([0x9f, 0x04, 0x01, 0x00, 0x06, 0x00]);
                const num = command.data[3];

                response[3] = num;
                response[5] = checksum(response);
                return response;
            }
            case Constants.CMD_ACTION: {
                console.log('Command ' + command.cmd + 'length ' + command.dataLength + ' action ' + command.data[3] + ' ' + command.data[2]);
        
                const response = action(command.data);
                response[5] = checksum(response);
                return response;
            }
            default: {
                console.log('Unsupported Command ' + command.cmd);
            }
        }
    }
}
function action(data) {
    const response = Uint8Array.from([0x6f, 0x04, 0x01, 0x00, 0x00, 0x00]);
    response[3] = data[3];
    return response;
}