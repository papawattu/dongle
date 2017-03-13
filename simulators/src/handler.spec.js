import chai from 'chai';
import sinon from 'sinon';
import * as log from 'winston';
import Handler from './handler';
import * as Constants from './phev_constants';

const assert = chai.assert;

const sut = new Handler();

describe('Parser', () => {
	beforeEach(() => {
    });
	it('Should not be null', () => {
		assert.isNotNull(sut);
	});
    it('Should handle start command', () => {
		const command = {
            cmd: Constants.CMD_START,
            data: Uint8Array.from([0xf2,0x0a,0x00,0x01,0x02,0x00,0x00,0x00,0x00,0x00,0x00]),
            length: 12,
            dataLength: 10,
            chksum: 0xff,
        };
        const expected = Uint8Array.from([0x2f,0x04,0x01,0x01,0x00,0x35]);

        const result = sut.handle(command);
        assert.deepEqual(result,expected);
	});
    it('Should handle ping command', () => {
		const command = {
            cmd: Constants.CMD_PING,
            data: Uint8Array.from([0xf9,0x04,0x00,0x00,0x00]),
            length: 6,
            dataLength: 8,
            chksum: 0xfd,
        };
        const expected = Uint8Array.from([0x9f,0x04,0x01,0x00,0x06,0xaa]);

        const result = sut.handle(command);
        assert.deepEqual(result,expected);
	});
});