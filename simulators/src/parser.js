import checksum from './checksum';

const supportedCommands = [0xf2, 0xf6, 0xf9];

export default class Parser {
    constructor(handle) {
        this.buffer = new Uint8Array(0);
        this.handle = handle;
    }
    appendBuffer(buffer1, buffer2) {
        const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        tmp.set(new Uint8Array(buffer1), 0);
        tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
        return tmp;
    }
    allowedCommand(command) {
        return supportedCommands.indexOf(command) > -1;
    }
    findCommand(buffer) {
        const command = {};
        command.cmd = buffer[0];
        if (this.allowedCommand(command.cmd)) {
            command.dataLength = buffer[1];
            command.length = command.dataLength + 2;
            if (command.length > buffer.length) {
                return null;
            } else {
                return command;
            }
        } else {
            console.log('Command not recognised : ' + command.cmd);
            return null;
        }
    }
    nextCommand(buffer, length) {
        return buffer.slice(length, buffer.length);
    }
    process(data) {
        let response = new Uint8Array(0);
        let command = null;

        this.buffer = this.appendBuffer(this.buffer, data);

        command = this.findCommand(this.buffer);

        while (command !== null) {

            command.data = this.buffer.slice(0, command.length - 1);

            command.chksum = this.buffer[command.length - 1];
            if (this.checkSumValid(command)) {
                response = this.appendBuffer(response, this.handle(command));
            } else {
                throw new Error('Checksum error');
            }

            this.buffer = this.nextCommand(this.buffer, command.length);

            if (this.buffer.byteLength < 6) {
                command = null;
            } else {
                command = this.findCommand(this.buffer);
            }
        }
        return response;
    }

    checkSumValid(command) {
        const calcChksum = checksum(command.data);
        return calcChksum === command.chksum;
    }
}