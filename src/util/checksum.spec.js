import chai from 'chai';
import sinon from 'sinon';
import * as log from 'winston';

import checksum from './checksum';

const assert = chai.assert;

const data = new Uint8Array([0xf9,0x04,0x00,0x5f,0x00]);

describe('Checksum', () => {
	beforeEach(() => {
			
    });
	it('Should not be null', () => {
		assert.isNotNull(checksum);
	});
    it('Should return a correct ping checksum', () => {
        const result = checksum(data);
        assert.equal(result,0x5c, 'Should equal 0x5c is ' + result.toString(16));
	});
    it.skip('Should return a correct checksum for lights on', () => {
        const result = checksum(data);
        assert.equal(result,0x05, 'Should equal 0x05 is ' + result.toString(16));
	});
});